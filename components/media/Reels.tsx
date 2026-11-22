"use client";

import Image from "next/image";
import type { VideoReel } from "@/content/types";
import { Label } from "@/components/scrap/Label";
import { Tape } from "@/components/scrap/Tape";
import { useMedia } from "./MediaModal";

const Sprockets = ({ count = 12 }: { count?: number }) => (
  <div className="flex flex-col justify-between py-2" aria-hidden>
    {Array.from({ length: count }, (_, i) => (
      <span key={i} className="block h-2 w-3 rounded-xs bg-chalk/85" />
    ))}
  </div>
);

function PlayBadge() {
  return (
    <span className="paper-ink grid size-14 place-items-center rounded-full bg-paper/90 text-ink shadow-lg transition group-hover:scale-110 group-hover:bg-pink group-hover:text-paper">
      <svg viewBox="0 0 20 20" className="ml-1 size-5" aria-hidden>
        <path d="M5 3 L17 10 L5 17 Z" fill="currentColor" />
      </svg>
    </span>
  );
}

/** A vertical strip of film, one frame per reel, numbered like a contact sheet. */
export function FilmStrip({ reels, startNumber = 12 }: { reels: VideoReel[]; startNumber?: number }) {
  const open = useMedia();
  return (
    <div className="relative flex gap-2 bg-night px-2 py-3 shadow-xl ring-1 ring-chalk/10">
      <Sprockets count={reels.length * 5} />
      <ol className="flex flex-1 flex-col gap-3">
        {reels.map((r, i) => (
          <li key={r.slug} className="relative">
            <button
              type="button"
              onClick={() => open({ title: r.title, subtitle: r.label, source: r.source, orientation: r.orientation })}
              className="group relative block aspect-video w-full overflow-hidden bg-night"
              aria-label={`Watch ${r.title}, ${r.label}`}
            >
              <Image src={r.poster} alt="" fill sizes="20rem" className="object-cover grayscale-30 transition group-hover:grayscale-0" />
              <span className="absolute inset-0 grid place-items-center bg-night/20 opacity-0 transition group-hover:opacity-100">
                <PlayBadge />
              </span>
            </button>
            <span className="absolute top-1 left-1 bg-night/80 px-1 font-type text-xs text-butter">{startNumber + i}</span>
          </li>
        ))}
      </ol>
      <Sprockets count={reels.length * 5} />
    </div>
  );
}

/** Full-size reel card for the reels page. */
export function ReelCard({ reel, index }: { reel: VideoReel; index: number }) {
  const open = useMedia();
  const portrait = reel.orientation === "portrait";
  const rot = ["rotate-1", "-rotate-1", "rotate-2", "-rotate-2"][index % 4];
  return (
    <article
      className={`settle relative ${rot} transition-transform duration-300 hover:rotate-0`}
      style={{ "--settle-delay": `${index * 0.08}s` } as React.CSSProperties}
    >
      <Tape color={index % 2 ? "sage" : "pink"} className="-top-3 left-6 -rotate-6" />
      <div className="flex gap-2 bg-night px-2 py-3 shadow-xl ring-1 ring-chalk/10">
        <Sprockets count={portrait ? 14 : 8} />
        <button
          type="button"
          onClick={() => open({ title: reel.title, subtitle: reel.label, source: reel.source, orientation: reel.orientation })}
          className={`group relative flex-1 overflow-hidden bg-night ${portrait ? "aspect-9/16" : "aspect-video"}`}
          aria-label={`Watch ${reel.title}, ${reel.label}`}
        >
          <Image src={reel.poster} alt="" fill sizes="(min-width: 1024px) 30rem, 90vw" className="object-cover" />
          <span className="absolute inset-0 grid place-items-center bg-night/10 transition group-hover:bg-night/30">
            <PlayBadge />
          </span>
          {reel.duration && (
            <span className="absolute top-2 right-2 bg-night/80 px-1.5 font-type text-xs text-chalk">{reel.duration}</span>
          )}
        </button>
        <Sprockets count={portrait ? 14 : 8} />
      </div>
      <div className="paper-ink relative -mt-2 ml-6 w-11/12 bg-paper text-ink px-4 pt-3 pb-4 shadow-md paper-grain">
        <Label className="absolute -top-3 right-4 -rotate-3">{reel.label}</Label>
        <h3 className="font-hand text-2xl">{reel.title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-ink-soft">{reel.blurb}</p>
      </div>
    </article>
  );
}
