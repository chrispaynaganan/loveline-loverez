"use client";

import { ListEditor } from "@/components/studio/ListEditor";
import { MediaField, fmtDuration, readDuration } from "@/components/studio/media";
import { useStudio } from "@/components/studio/StudioContext";
import { Field, Input, PageTitle, Select, Textarea, Toggle, slugify } from "@/components/studio/ui";
import type { DemoRow } from "@/lib/db";

const papers: { value: DemoRow["paper"]; label: string; swatch: string }[] = [
  { value: "cream", label: "Cream", swatch: "bg-cream" },
  { value: "kraft", label: "Kraft brown", swatch: "bg-kraft" },
  { value: "blush", label: "Blush pink", swatch: "bg-blush" },
  { value: "butter", label: "Butter yellow", swatch: "bg-butter" },
  { value: "sage", label: "Sage green", swatch: "bg-sage" },
];

export default function DemosStudio() {
  const { db } = useStudio();
  return (
    <div className="max-w-4xl">
      <PageTitle kicker="the cassette tapes" title="Demo reels" />
      <p className="mb-6 max-w-2xl text-sm leading-relaxed text-chalk/70">
        Each demo shows on your site as a cassette tape with a play button. Upload an MP3 and the length fills in by itself. Turn on
        &ldquo;Show on home page&rdquo; for the four you want people to hear first.
      </p>
      <ListEditor<DemoRow>
        table="demo_reels"
        addLabel="Add a demo"
        empty="No demos yet. Add your first one!"
        title={(r) => r.title}
        subtitle={(r) =>
          [r.category, r.source.kind === "none" ? "no audio yet" : r.duration || "audio added", r.featured ? "on home page" : null]
            .filter(Boolean)
            .join(" · ")
        }
        blank={() => ({
          slug: "",
          title: "",
          category: "",
          blurb: "",
          duration: null,
          source: { kind: "none" },
          is_new: true,
          featured: true,
          paper: "cream",
          published: true,
        })}
        validate={(d) => (!d.title.trim() ? "Give the demo a title first." : null)}
        prepare={(d, all) => {
          if (d.slug) return d;
          let slug = slugify(d.title);
          while (all.some((r) => r.slug === slug)) slug = `${slugify(d.title)}-${Math.random().toString(36).slice(2, 5)}`;
          return { ...d, slug };
        }}
        form={(d, set) => (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Title">
                <Input value={d.title} onChange={(e) => set({ title: e.target.value })} placeholder="Commercial demo" />
              </Field>
              <Field label="Label on the tape" hint="Short, like Commercial or Narration">
                <Input value={d.category} onChange={(e) => set({ category: e.target.value })} placeholder="Commercial" />
              </Field>
            </div>
            <Field label="Short description">
              <Textarea value={d.blurb} onChange={(e) => set({ blurb: e.target.value })} placeholder="Bright, friendly reads for TV, radio and social ads." />
            </Field>
            <MediaField
              db={db}
              kind="audio"
              folder="demos"
              value={d.source}
              onChange={(source) => set({ source })}
              onUploaded={async (file) => set({ duration: fmtDuration(await readDuration(file, "audio")) || d.duration })}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Length" hint="Fills in when you upload. Shown for Drive links.">
                <Input value={d.duration ?? ""} onChange={(e) => set({ duration: e.target.value || null })} placeholder="1:05" />
              </Field>
              <Field label="Paper colour">
                <div className="flex items-center gap-2">
                  <span className={`size-9 shrink-0 rounded-sm ring-1 ring-ink/20 ${papers.find((p) => p.value === d.paper)?.swatch}`} aria-hidden />
                  <Select value={d.paper} onChange={(e) => set({ paper: e.target.value as DemoRow["paper"] })}>
                    {papers.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </Select>
                </div>
              </Field>
            </div>
            <div className="flex flex-wrap gap-6">
              <Toggle checked={d.featured} onChange={(featured) => set({ featured })} label="Show on home page" />
              <Toggle checked={d.is_new} onChange={(is_new) => set({ is_new })} label="Pink “New” tag" />
              <Toggle checked={d.published} onChange={(published) => set({ published })} label="Visible on site" />
            </div>
          </>
        )}
      />
    </div>
  );
}
