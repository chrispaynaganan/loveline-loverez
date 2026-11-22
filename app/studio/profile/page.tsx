"use client";

import { ImageField } from "@/components/studio/media";
import { ObjectListField } from "@/components/studio/ObjectListField";
import { SettingsEditor } from "@/components/studio/SettingsEditor";
import { useStudio } from "@/components/studio/StudioContext";
import { Field, Input, PageTitle, Textarea } from "@/components/studio/ui";
import { profile as fallback } from "@/content/data";
import type { Profile } from "@/content/types";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 border-t border-ink/10 pt-6 first:border-t-0 first:pt-0">
      <h2 className="font-hand text-2xl">{title}</h2>
      {children}
    </section>
  );
}

export default function ProfileStudio() {
  const { db } = useStudio();
  return (
    <div className="max-w-4xl">
      <PageTitle kicker="the words about you" title="About & profile" />
      <SettingsEditor<Profile> settingKey="profile" fallback={fallback}>
        {(p, set) => (
          <>
            <Section title="Home page">
              <Field label="Headline" hint="The big handwritten line. The last two words get underlined.">
                <Input value={p.tagline} onChange={(e) => set({ tagline: e.target.value })} />
              </Field>
              <Field label="Intro">
                <Textarea rows={3} value={p.intro} onChange={(e) => set({ intro: e.target.value })} />
              </Field>
              <ObjectListField
                label="Numbers"
                hint="The three numbers on the green note under your photo"
                items={p.stats}
                fields={[
                  { key: "value", label: "Number", placeholder: "500+" },
                  { key: "label", label: "Label", placeholder: "projects completed" },
                ]}
                onChange={(stats) => set({ stats })}
                newItem={() => ({ value: "", label: "" })}
                addLabel="Add a number"
              />
              <ObjectListField
                label="Today checklist"
                items={p.today}
                fields={[
                  { key: "text", label: "Task" },
                  { key: "done", label: "Ticked", type: "toggle" },
                ]}
                onChange={(today) => set({ today })}
                newItem={() => ({ text: "", done: false })}
                addLabel="Add a task"
              />
            </Section>

            <Section title="Photo">
              <ImageField db={db} folder="profile" label="Your photo" value={p.portrait} onChange={(portrait) => set({ portrait })} />
              <Field label="Caption under the photo">
                <Input value={p.portraitCaption} onChange={(e) => set({ portraitCaption: e.target.value })} />
              </Field>
            </Section>

            <Section title="About page letter">
              <ObjectListField
                label="Paragraphs"
                items={p.about.map((text) => ({ text }))}
                fields={[{ key: "text", label: "Paragraph", type: "textarea", wide: true }]}
                onChange={(items) => set({ about: items.map((i) => i.text) })}
                newItem={() => ({ text: "" })}
                addLabel="Add a paragraph"
              />
            </Section>

            <Section title="What you voice">
              <ObjectListField
                label="Services"
                items={p.services}
                fields={[
                  { key: "title", label: "Service", placeholder: "Commercial voice-over" },
                  { key: "body", label: "One line about it", type: "textarea", wide: true },
                ]}
                onChange={(services) => set({ services })}
                newItem={() => ({ title: "", body: "" })}
                addLabel="Add a service"
              />
            </Section>

            <Section title="Contact & links">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Email on the site">
                  <Input type="email" value={p.email} onChange={(e) => set({ email: e.target.value })} />
                </Field>
                <Field label="Based in">
                  <Input value={p.location} onChange={(e) => set({ location: e.target.value })} />
                </Field>
              </div>
              <ObjectListField
                label="Social links"
                items={p.socials}
                fields={[
                  { key: "label", label: "Name", placeholder: "TikTok" },
                  { key: "url", label: "Link", placeholder: "https://…" },
                ]}
                onChange={(socials) => set({ socials })}
                newItem={() => ({ label: "", url: "" })}
                addLabel="Add a link"
              />
            </Section>

            <Section title="Names">
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Full name">
                  <Input value={p.name} onChange={(e) => set({ name: e.target.value })} />
                </Field>
                <Field label="Stage name">
                  <Input value={p.stageName} onChange={(e) => set({ stageName: e.target.value })} />
                </Field>
                <Field label="Brand">
                  <Input value={p.brand} onChange={(e) => set({ brand: e.target.value })} />
                </Field>
              </div>
            </Section>
          </>
        )}
      </SettingsEditor>
    </div>
  );
}
