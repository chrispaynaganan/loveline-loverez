"use client";

import { ListEditor } from "@/components/studio/ListEditor";
import { SettingsEditor } from "@/components/studio/SettingsEditor";
import { Field, Input, LinesField, PageTitle } from "@/components/studio/ui";
import { rateCard } from "@/content/data";
import type { RateCardNotes, RateRow } from "@/lib/db";
import { formatRate } from "@/lib/format";
import { toRate } from "@/lib/db";

const { rates: _rates, ...notesFallback } = rateCard;
void _rates;

const money = (v: string) => {
  const n = Number(v.replace(/[^\d.]/g, ""));
  return v.trim() === "" || !Number.isFinite(n) ? null : n;
};

export default function RatesStudio() {
  return (
    <div className="max-w-4xl space-y-12">
      <div>
        <PageTitle kicker="what it costs" title="Rate card" />
        <p className="mb-6 max-w-2xl text-sm leading-relaxed text-chalk/70">
          Leave a price empty to show &ldquo;quote on request&rdquo;. You can fill in pesos, dollars or both. Services are grouped by
          their group name, in the order below.
        </p>
        <ListEditor<RateRow>
          table="rates"
          addLabel="Add a service"
          empty="No services yet."
          title={(r) => r.service}
          subtitle={(r) => `${r.grp} · ${r.unit} · ${formatRate(toRate(r)) ?? "quote on request"}`}
          blank={() => ({ grp: "Commercial", service: "", unit: "", price_php: null, price_usd: null, note: null })}
          validate={(d) => (!d.service.trim() ? "Name the service first." : null)}
          form={(d, set) => (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Service">
                  <Input value={d.service} onChange={(e) => set({ service: e.target.value })} placeholder="Online / social media ad" />
                </Field>
                <Field label="Group" hint="Commercial, Narration, Character, Other…">
                  <Input value={d.grp} onChange={(e) => set({ grp: e.target.value })} list="rate-groups" />
                </Field>
                <Field label="Price unit">
                  <Input value={d.unit} onChange={(e) => set({ unit: e.target.value })} placeholder="per spot, up to 60s" />
                </Field>
                <Field label="Note (optional)">
                  <Input value={d.note ?? ""} onChange={(e) => set({ note: e.target.value || null })} placeholder="usage quoted separately" />
                </Field>
                <Field label="Price in pesos (₱)">
                  <Input inputMode="decimal" value={d.price_php ?? ""} onChange={(e) => set({ price_php: money(e.target.value) })} placeholder="leave empty for quote" />
                </Field>
                <Field label="Price in dollars ($)">
                  <Input inputMode="decimal" value={d.price_usd ?? ""} onChange={(e) => set({ price_usd: money(e.target.value) })} placeholder="leave empty for quote" />
                </Field>
              </div>
              <datalist id="rate-groups">
                {["Commercial", "Narration", "Character", "E-learning", "Other"].map((g) => (
                  <option key={g} value={g} />
                ))}
              </datalist>
            </>
          )}
        />
      </div>

      <div>
        <h2 className="mb-4 font-hand text-3xl text-chalk">Notes on the rate card</h2>
        <SettingsEditor<RateCardNotes> settingKey="rate_card" fallback={notesFallback}>
          {(v, set) => (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Title">
                  <Input value={v.title} onChange={(e) => set({ title: e.target.value })} />
                </Field>
                <Field label="Last updated" hint="Shown as “updated …”">
                  <Input value={v.updated} onChange={(e) => set({ updated: e.target.value })} placeholder="November 2026" />
                </Field>
              </div>
              <LinesField label="Every booking includes" value={v.includes} onChange={(includes) => set({ includes })} />
              <LinesField label="The small print" value={v.terms} onChange={(terms) => set({ terms })} />
            </>
          )}
        </SettingsEditor>
      </div>
    </div>
  );
}
