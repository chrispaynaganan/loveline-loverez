"use client";

import { ListEditor } from "@/components/studio/ListEditor";
import { ImageField, MediaField, captureFrame, fmtDuration, readDuration, uploadFile } from "@/components/studio/media";
import { useStudio } from "@/components/studio/StudioContext";
import { Field, Input, PageTitle, Select, Textarea, Toggle, slugify } from "@/components/studio/ui";
import type { ReelRow } from "@/lib/db";

export default function ReelsStudio() {
  const { db, notify } = useStudio();
  return (
    <div className="max-w-4xl">
      <PageTitle kicker="the film strip" title="Video reels" />
      <p className="mb-6 max-w-2xl text-sm leading-relaxed text-chalk/70">
        Ads, spots and short reels. Upload a video (up to 50 MB) and the length, shape and cover picture fill in by themselves. For
        longer videos, paste a Google Drive or YouTube link instead. Upright videos (TikTok, Reels, Shorts) get their own row on the
        site.
      </p>
      <ListEditor<ReelRow>
        table="video_reels"
        addLabel="Add a reel"
        empty="No reels yet."
        title={(r) => r.title}
        subtitle={(r) => [r.label, r.orientation === "portrait" ? "upright" : "wide", r.duration].filter(Boolean).join(" · ")}
        blank={() => ({
          slug: "",
          title: "",
          client: "",
          label: "Digital VO ad",
          blurb: "",
          duration: null,
          poster: "",
          orientation: "landscape",
          source: { kind: "none" },
          published: true,
        })}
        validate={(d) => (!d.title.trim() ? "Give the reel a title first." : !d.poster ? "Add a cover picture so the reel shows on the film strip." : null)}
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
                <Input value={d.title} onChange={(e) => set({ title: e.target.value })} placeholder="Surf Fabcon" />
              </Field>
              <Field label="Client">
                <Input value={d.client} onChange={(e) => set({ client: e.target.value })} placeholder="Surf Philippines" />
              </Field>
              <Field label="Tag" hint="Shown on a small label, like TV / digital ad">
                <Input value={d.label} onChange={(e) => set({ label: e.target.value })} />
              </Field>
              <Field label="Shape">
                <Select value={d.orientation} onChange={(e) => set({ orientation: e.target.value as ReelRow["orientation"] })}>
                  <option value="landscape">Wide (TV, YouTube)</option>
                  <option value="portrait">Upright (TikTok, Reels, Shorts)</option>
                </Select>
              </Field>
            </div>
            <Field label="Short description">
              <Textarea value={d.blurb} onChange={(e) => set({ blurb: e.target.value })} />
            </Field>
            <MediaField
              db={db}
              kind="video"
              folder="reels"
              value={d.source}
              onChange={(source) => set({ source })}
              onUploaded={async (file) => {
                const seconds = await readDuration(file, "video");
                const frame = await captureFrame(file);
                const patch: Partial<ReelRow> = { duration: fmtDuration(seconds) || d.duration };
                if (frame) {
                  patch.orientation = frame.portrait ? "portrait" : "landscape";
                  if (!d.poster) {
                    try {
                      patch.poster = await uploadFile(db, "posters", frame.blob, `${d.title || "reel"}-cover.jpg`);
                    } catch {
                      notify("Couldn't make a cover picture. Upload one below.", "error");
                    }
                  }
                }
                set(patch);
              }}
            />
            <ImageField db={db} folder="posters" label="Cover picture" value={d.poster} onChange={(poster) => set({ poster })} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Length">
                <Input value={d.duration ?? ""} onChange={(e) => set({ duration: e.target.value || null })} placeholder="0:30" />
              </Field>
              <div className="flex items-end pb-2">
                <Toggle checked={d.published} onChange={(published) => set({ published })} label="Visible on site" />
              </div>
            </div>
          </>
        )}
      />
    </div>
  );
}
