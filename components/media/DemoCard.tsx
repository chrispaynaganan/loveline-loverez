"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { DemoReel } from "@/content/types";
import { seeded } from "@/lib/seeded";
import { TornPaper } from "@/components/scrap/TornPaper";
import { Tape, type TapeColor } from "@/components/scrap/Tape";
import { Label } from "@/components/scrap/Label";
import { useMedia } from "./MediaModal";

const fmt = (s: number) => (Number.isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}` : "0:00");

const tapeFor: Record<DemoReel["paper"], TapeColor> = {
  cream: "plaid",
  kraft: "cream",
  blush: "pink",
  butter: "sage",
  sage: "butter",
};

const labelBg: Record<DemoReel["paper"], string> = {
  cream: "bg-blush",
  kraft: "bg-butter",
  blush: "bg-sky",
  butter: "bg-pink-soft",
  sage: "bg-cream",
};

/** Cassette tape drawn in SVG; the reels spin while it plays. */
function Cassette({ label, playing, labelClass }: { label: string; playing: boolean; labelClass: string }) {
  const spin = playing ? "motion-safe:animate-spin-slow" : "";
  return (
    <div className="relative mx-auto aspect-8/5 w-full max-w-72 rounded-lg bg-ink p-2 shadow-md">
      <div className={`relative h-full rounded-md ${labelClass} paper-grain p-2`}>
        <div className="flex items-baseline justify-between border-b border-ink/30 pb-1">
          <span className="font-type text-xs font-bold tracking-widest">SIDE A</span>
          <span className="font-type text-xs">C-60</span>
        </div>
        <p className="truncate pt-1 text-center font-hand text-2xl leading-tight">{label}</p>
        <div className="absolute inset-x-6 bottom-2 flex h-1/2 items-center justify-between rounded-full bg-ink px-3">
          {[0, 1].map((i) => (
            <svg key={i} viewBox="0 0 40 40" className={`size-1/3 max-h-10 text-paper ${spin}`} aria-hidden>
              <circle cx="20" cy="20" r="17" fill="currentColor" />
              <circle cx="20" cy="20" r="7" className="fill-ink" />
              {[0, 60, 120, 180, 240, 300].map((a) => (
                <rect key={a} x="19" y="9" width="2" height="5" className="fill-ink" transform={`rotate(${a} 20 20)`} />
              ))}
            </svg>
          ))}
          <div className="absolute inset-x-1/3 top-1/2 h-1/3 -translate-y-1/2 rounded-sm bg-kraft-dark/70" />
        </div>
      </div>
    </div>
  );
}

export function DemoCard({ demo, index }: { demo: DemoReel; index: number }) {
  const open = useMedia();
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const bars = useMemo(() => {
    const r = seeded(demo.slug);
    return Array.from({ length: 40 }, (_, i) => 20 + Math.round((Math.sin(i / 3) * 0.3 + 0.5 + r() * 0.45) * 60));
  }, [demo.slug]);

  const available = demo.source.kind !== "none";
  const isFile = demo.source.kind === "file";
  const progress = duration ? time / duration : 0;

  // only one demo plays at a time
  useEffect(() => {
    const stop = (e: Event) => {
      if ((e as CustomEvent).detail !== demo.slug) audio.current?.pause();
    };
    window.addEventListener("boses:play", stop);
    return () => window.removeEventListener("boses:play", stop);
  }, [demo.slug]);

  const toggle = () => {
    if (!available) return;
    if (!isFile) {
      open({ title: demo.title, subtitle: demo.category, source: demo.source });
      return;
    }
    const el = audio.current;
    if (!el) return;
    if (el.paused) {
      window.dispatchEvent(new CustomEvent("boses:play", { detail: demo.slug }));
      void el.play();
    } else el.pause();
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = audio.current;
    if (!el || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    el.currentTime = ((e.clientX - rect.left) / rect.width) * duration;
  };

  const rot = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2"][index % 4];

  return (
    <article
      className={`settle group relative ${rot} transition-transform duration-300 hover:rotate-0 hover:-translate-y-1`}
      style={{ "--settle-delay": `${index * 0.08}s` } as React.CSSProperties}
    >
      <Tape color={tapeFor[demo.paper]} className="-top-3 left-1/2 -translate-x-1/2 rotate-2" />
      {demo.isNew && <Label tone="pink" className="absolute -top-2 right-3 z-20 rotate-6">New</Label>}
      <TornPaper seed={`demo-${demo.slug}`} tone={demo.paper} innerClassName="px-5 pt-7 pb-6">
        <div className="relative">
          <Cassette label={demo.category} playing={playing} labelClass={labelBg[demo.paper]} />
          {!available && (
            <Label tone="ink" className="absolute -bottom-3 left-1/2 -translate-x-1/2 -rotate-3 whitespace-nowrap">
              Recording soon
            </Label>
          )}
        </div>
        <h3 className="mt-4 font-hand text-2xl leading-tight">{demo.title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-ink-soft">{demo.blurb}</p>

        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={toggle}
            disabled={!available}
            aria-label={playing ? `Pause ${demo.title}` : `Play ${demo.title}`}
            className="grid size-11 shrink-0 place-items-center rounded-full border-2 border-ink bg-paper shadow-sm transition hover:bg-pink hover:text-paper disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-paper disabled:hover:text-ink"
          >
            {playing ? (
              <svg viewBox="0 0 20 20" className="size-4" aria-hidden>
                <rect x="4" y="3" width="4" height="14" rx="1" fill="currentColor" />
                <rect x="12" y="3" width="4" height="14" rx="1" fill="currentColor" />
              </svg>
            ) : (
              <svg viewBox="0 0 20 20" className="ml-0.5 size-4" aria-hidden>
                <path d="M5 3 L17 10 L5 17 Z" fill="currentColor" strokeLinejoin="round" />
              </svg>
            )}
          </button>
          <div
            className={`flex h-10 flex-1 items-center gap-px ${isFile && duration ? "cursor-pointer" : ""}`}
            onClick={seek}
            aria-hidden
          >
            {bars.map((h, i) => (
              <span
                key={i}
                className={`flex-1 rounded-full transition-colors ${i / bars.length < progress ? "bg-pink" : "bg-ink/35"}`}
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <span className="w-10 shrink-0 text-right font-type text-xs text-ink-soft tabular-nums">
            {isFile ? fmt(playing || time ? time : duration) : (demo.duration ?? "")}
          </span>
        </div>
      </TornPaper>
      {isFile && demo.source.kind === "file" && (
        <audio
          ref={audio}
          src={demo.source.url}
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => {
            setPlaying(false);
            setTime(0);
          }}
          onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        />
      )}
    </article>
  );
}
