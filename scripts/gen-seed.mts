// Writes supabase/0002_seed.sql from content/data.ts. Run: npm run seed
import { writeFileSync } from "node:fs";
import { demoReels, profile, rateCard, testimonials, videoReels } from "../content/data.ts";

const q = (v: unknown) => (v === null || v === undefined ? "null" : `'${String(v).replace(/'/g, "''")}'`);
const j = (v: unknown) => `${q(JSON.stringify(v))}::jsonb`;
const arr = (v: string[]) => `array[${v.map(q).join(",")}]::text[]`;

const { rates, ...cardNotes } = rateCard;

const sql = `-- Starting content for the CMS: everything currently on the site.
-- Run after 0001_cms.sql. Safe to run again; it never overwrites edits.

insert into public.editors (email) values
  ('lovelinesvo@gmail.com'),
  ('mark.payns@gmail.com')
on conflict do nothing;

insert into public.site_settings (key, value) values
  ('profile', ${j(profile)}),
  ('rate_card', ${j(cardNotes)})
on conflict (key) do nothing;

insert into public.demo_reels (slug, title, category, blurb, duration, source, is_new, featured, paper, sort) values
${demoReels.map((d) => `  (${[q(d.slug), q(d.title), q(d.category), q(d.blurb), q(d.duration), j(d.source), d.isNew ? "true" : "false", d.featured ? "true" : "false", q(d.paper), d.order].join(", ")})`).join(",\n")}
on conflict (slug) do nothing;

insert into public.video_reels (slug, title, client, label, blurb, duration, poster, orientation, source, sort) values
${videoReels.map((r) => `  (${[q(r.slug), q(r.title), q(r.client), q(r.label), q(r.blurb), q(r.duration), q(r.poster), q(r.orientation), j(r.source), r.order].join(", ")})`).join(",\n")}
on conflict (slug) do nothing;

insert into public.rates (grp, service, unit, price_php, price_usd, note, sort)
select * from (values
${rates.map((r) => `  (${[q(r.group), q(r.service), q(r.unit), r.pricePhp ?? "null::numeric", r.priceUsd ?? "null::numeric", q(r.note), r.order].join(", ")})`).join(",\n")}
) as v
where not exists (select 1 from public.rates);

insert into public.testimonials (quote, highlights, role, company, sort)
select * from (values
${testimonials.map((t, i) => `  (${[q(t.quote), arr(t.highlights), q(t.role), q(t.company), i + 1].join(", ")})`).join(",\n")}
) as v
where not exists (select 1 from public.testimonials);
`;

writeFileSync(new URL("../supabase/0002_seed.sql", import.meta.url), sql);
console.log("wrote supabase/0002_seed.sql");
