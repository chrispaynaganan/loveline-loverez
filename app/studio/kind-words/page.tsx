"use client";

import { ListEditor } from "@/components/studio/ListEditor";
import { Field, Input, LinesField, PageTitle, Textarea, Toggle } from "@/components/studio/ui";
import type { TestimonialRow } from "@/lib/db";

export default function KindWordsStudio() {
  return (
    <div className="max-w-4xl">
      <PageTitle kicker="testimonials" title="Kind words" />
      <p className="mb-6 max-w-2xl text-sm leading-relaxed text-chalk/70">
        The first two show on your home page. All of them show on your About page.
      </p>
      <ListEditor<TestimonialRow>
        table="testimonials"
        addLabel="Add kind words"
        empty="No testimonials yet."
        title={(r) => r.company || r.role || "New testimonial"}
        subtitle={(r) => r.quote}
        blank={() => ({ quote: "", highlights: [], role: "", company: "", published: true })}
        validate={(d) => (!d.quote.trim() ? "Add the quote first." : null)}
        form={(d, set) => (
          <>
            <Field label="What they said">
              <Textarea rows={5} value={d.quote} onChange={(e) => set({ quote: e.target.value })} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Their role" hint="Names are optional; a role works too">
                <Input value={d.role} onChange={(e) => set({ role: e.target.value })} placeholder="Creative Director" />
              </Field>
              <Field label="Company or kind of company">
                <Input value={d.company} onChange={(e) => set({ company: e.target.value })} placeholder="International media agency" />
              </Field>
            </div>
            <LinesField
              label="Highlights"
              hint="Short ticks shown under the quote, like High-quality audio"
              value={d.highlights}
              onChange={(highlights) => set({ highlights })}
            />
            <Toggle checked={d.published} onChange={(published) => set({ published })} label="Visible on site" />
          </>
        )}
      />
    </div>
  );
}
