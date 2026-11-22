"use client";

import { useRef, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { MediaSource } from "@/content/types";
import { MEDIA_BUCKET } from "@/lib/supabase";
import { Button, Input, slugify } from "./ui";

/** Supabase's free plan caps a single upload at 50 MB. */
export const MAX_UPLOAD_MB = 50;

const PUBLIC_MARK = `/storage/v1/object/public/${MEDIA_BUCKET}/`;

export async function uploadFile(db: SupabaseClient, folder: string, file: File | Blob, name: string) {
  const ext = name.includes(".") ? name.split(".").pop() : "bin";
  const path = `${folder}/${Date.now()}-${slugify(name.replace(/\.[^.]+$/, ""))}.${ext}`;
  const { error } = await db.storage.from(MEDIA_BUCKET).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) throw error;
  return db.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}

/** Paths of files in our bucket that a value points to. */
export function mediaPaths(value: unknown): string[] {
  const out: string[] = [];
  const walk = (v: unknown) => {
    if (typeof v === "string") {
      const i = v.indexOf(PUBLIC_MARK);
      if (i >= 0) out.push(decodeURIComponent(v.slice(i + PUBLIC_MARK.length)));
    } else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
  };
  walk(value);
  return out;
}

/** Remove uploaded files that a row no longer uses. */
export async function removeUnused(db: SupabaseClient, before: unknown, after: unknown) {
  const keep = new Set(mediaPaths(after));
  const gone = mediaPaths(before).filter((p) => !keep.has(p));
  if (gone.length) await db.storage.from(MEDIA_BUCKET).remove(gone);
}

export function fmtDuration(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "";
  const s = Math.round(seconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/** Reads how long an audio or video file is. */
export function readDuration(file: File, kind: "audio" | "video"): Promise<number> {
  return new Promise((resolve) => {
    const el = document.createElement(kind);
    el.preload = "metadata";
    el.onloadedmetadata = () => {
      resolve(el.duration);
      URL.revokeObjectURL(el.src);
    };
    el.onerror = () => resolve(0);
    el.src = URL.createObjectURL(file);
  });
}

/** Grabs a frame from a video to use as its poster. */
export function captureFrame(file: File, at = 1): Promise<{ blob: Blob; portrait: boolean } | null> {
  return new Promise((resolve) => {
    const v = document.createElement("video");
    v.muted = true;
    v.playsInline = true;
    v.preload = "auto";
    v.src = URL.createObjectURL(file);
    v.onloadedmetadata = () => {
      v.currentTime = Math.min(at, Math.max(0, v.duration / 3));
    };
    v.onseeked = () => {
      const c = document.createElement("canvas");
      const scale = Math.min(1, 1280 / Math.max(v.videoWidth, v.videoHeight));
      c.width = Math.round(v.videoWidth * scale);
      c.height = Math.round(v.videoHeight * scale);
      c.getContext("2d")?.drawImage(v, 0, 0, c.width, c.height);
      c.toBlob(
        (blob) => {
          URL.revokeObjectURL(v.src);
          resolve(blob ? { blob, portrait: v.videoHeight > v.videoWidth } : null);
        },
        "image/jpeg",
        0.85,
      );
    };
    v.onerror = () => resolve(null);
  });
}

/** Pulls the file id out of a Google Drive or YouTube link. */
export function parseLink(link: string): MediaSource | null {
  const s = link.trim();
  const drive = s.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=)([\w-]{10,})/);
  if (drive) return { kind: "drive", id: drive[1] };
  const yt = s.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return { kind: "youtube", id: yt[1] };
  if (/^https?:\/\/.+\.(mp3|wav|m4a|ogg|mp4|webm|mov)(\?.*)?$/i.test(s)) return { kind: "file", url: s };
  return null;
}

function describe(src: MediaSource) {
  switch (src.kind) {
    case "file":
      return src.url.includes(PUBLIC_MARK) ? "Uploaded file" : "File link";
    case "drive":
      return "Google Drive file";
    case "youtube":
      return "YouTube video";
    default:
      return "Nothing yet";
  }
}

function Preview({ source, kind }: { source: MediaSource; kind: "audio" | "video" }) {
  if (source.kind === "file")
    return kind === "audio" ? (
      <audio src={source.url} controls preload="none" className="w-full" />
    ) : (
      <video src={source.url} controls preload="metadata" className="max-h-72 w-full rounded-sm bg-night" />
    );
  if (source.kind === "drive")
    return (
      <a href={`https://drive.google.com/file/d/${source.id}/view`} target="_blank" rel="noreferrer" className="text-sm text-pink underline">
        Open in Google Drive ↗
      </a>
    );
  if (source.kind === "youtube")
    return (
      <a href={`https://youtu.be/${source.id}`} target="_blank" rel="noreferrer" className="text-sm text-pink underline">
        Open on YouTube ↗
      </a>
    );
  return null;
}

/**
 * Pick the audio or video for a demo or reel: upload a file, or paste a
 * Google Drive / YouTube link.
 */
export function MediaField({
  db,
  kind,
  folder,
  value,
  onChange,
  onUploaded,
}: {
  db: SupabaseClient;
  kind: "audio" | "video";
  folder: string;
  value: MediaSource;
  onChange: (v: MediaSource) => void;
  /** Called with the file after it uploads, e.g. to fill in its length. */
  onUploaded?: (file: File) => void | Promise<void>;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [link, setLink] = useState("");

  async function pick(file: File | undefined) {
    if (!file) return;
    setError("");
    if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
      setError(`That file is ${(file.size / 1024 / 1024).toFixed(0)} MB. The limit is ${MAX_UPLOAD_MB} MB, so export a smaller ${kind === "audio" ? "MP3" : "MP4"} or paste a Google Drive link instead.`);
      return;
    }
    setBusy(true);
    try {
      const url = await uploadFile(db, folder, file, file.name);
      onChange({ kind: "file", url });
      await onUploaded?.(file);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    }
    setBusy(false);
    if (input.current) input.current.value = "";
  }

  return (
    <div className="rounded-md border border-ink/15 bg-white/50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold tracking-wider text-ink-soft uppercase">
          {kind === "audio" ? "Audio" : "Video"} · <span className="normal-case">{describe(value)}</span>
        </p>
        {value.kind !== "none" && (
          <button type="button" onClick={() => onChange({ kind: "none" })} className="text-xs text-pencil underline hover:text-pink">
            Remove
          </button>
        )}
      </div>
      <div className="mt-3">
        <Preview source={value} kind={kind} />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <input
          ref={input}
          type="file"
          accept={kind === "audio" ? "audio/*" : "video/*"}
          className="sr-only"
          onChange={(e) => pick(e.target.files?.[0])}
        />
        <Button tone="ink" busy={busy} onClick={() => input.current?.click()}>
          {busy ? "Uploading…" : value.kind === "file" ? `Replace ${kind}` : `Upload ${kind === "audio" ? "an MP3" : "a video"}`}
        </Button>
        <span className="text-xs text-pencil">or</span>
        <div className="flex min-w-60 flex-1 gap-2">
          <Input value={link} onChange={(e) => setLink(e.target.value)} placeholder="Paste a Google Drive or YouTube link" aria-label="Media link" />
          <Button
            tone="ghost"
            disabled={!link.trim()}
            onClick={() => {
              const src = parseLink(link);
              if (!src) return setError("That link isn't a Google Drive or YouTube link I recognise.");
              setError("");
              onChange(src);
              setLink("");
            }}
          >
            Use link
          </Button>
        </div>
      </div>
      {value.kind === "drive" && (
        <p className="mt-2 text-xs text-pencil">Make sure the Drive file is shared as &ldquo;Anyone with the link&rdquo;, or visitors can&apos;t play it.</p>
      )}
      <p className="mt-2 text-xs text-pencil">Up to {MAX_UPLOAD_MB} MB per file.</p>
      {error && <p className="mt-2 text-sm text-pink">{error}</p>}
    </div>
  );
}

/** Upload or change a picture (poster, portrait). */
export function ImageField({
  db,
  folder,
  label,
  value,
  onChange,
  extra,
}: {
  db: SupabaseClient;
  folder: string;
  label: string;
  value: string;
  onChange: (url: string) => void;
  extra?: React.ReactNode;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <div>
      <span className="mb-1.5 block text-xs font-semibold tracking-wider text-ink-soft uppercase">{label}</span>
      <div className="flex flex-wrap items-start gap-4">
        <div className="grid h-28 w-40 shrink-0 place-items-center overflow-hidden rounded-sm bg-night/10 ring-1 ring-ink/10">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="size-full object-cover" />
          ) : (
            <span className="text-xs text-pencil">No picture</span>
          )}
        </div>
        <div className="space-y-2">
          <input
            ref={input}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              setBusy(true);
              setError("");
              try {
                onChange(await uploadFile(db, folder, f, f.name));
              } catch (err) {
                setError(err instanceof Error ? err.message : "Upload failed.");
              }
              setBusy(false);
              e.target.value = "";
            }}
          />
          <Button tone="ghost" busy={busy} onClick={() => input.current?.click()}>
            {value ? "Change picture" : "Upload picture"}
          </Button>
          {extra}
          {error && <p className="text-sm text-pink">{error}</p>}
        </div>
      </div>
    </div>
  );
}
