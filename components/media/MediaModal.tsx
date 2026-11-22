"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { MediaSource } from "@/content/types";
import { TornPaper } from "@/components/scrap/TornPaper";
import { Tape } from "@/components/scrap/Tape";

type Media = { title: string; subtitle?: string; source: MediaSource; orientation?: "portrait" | "landscape" };

const Ctx = createContext<(m: Media) => void>(() => {});

export const useMedia = () => useContext(Ctx);

function Player({ media }: { media: Media }) {
  const { source } = media;
  const portrait = media.orientation === "portrait";
  const frame = portrait ? "aspect-9/16 h-full max-h-full" : "aspect-video w-full";
  if (source.kind === "drive")
    return (
      <iframe
        title={media.title}
        src={`https://drive.google.com/file/d/${source.id}/preview`}
        allow="autoplay; fullscreen"
        allowFullScreen
        className={`${frame} bg-ink`}
      />
    );
  if (source.kind === "youtube")
    return (
      <iframe
        title={media.title}
        src={`https://www.youtube-nocookie.com/embed/${source.id}?autoplay=1&rel=0`}
        allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
        className={`${frame} bg-ink`}
      />
    );
  if (source.kind === "file")
    return <video src={source.url} controls autoPlay playsInline className={`${frame} bg-ink`} />;
  return null;
}

export function MediaProvider({ children }: { children: ReactNode }) {
  const [media, setMedia] = useState<Media | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  const open = useCallback((m: Media) => {
    window.dispatchEvent(new CustomEvent("boses:play", { detail: "modal" }));
    setMedia(m);
  }, []);

  useEffect(() => {
    if (media) dialog.current?.showModal();
  }, [media]);

  return (
    <Ctx.Provider value={open}>
      {children}
      <dialog
        ref={dialog}
        onClose={() => setMedia(null)}
        onClick={(e) => e.target === dialog.current && dialog.current?.close()}
        className="m-auto w-full max-w-4xl overflow-visible bg-transparent p-4 backdrop:bg-night/80 backdrop:backdrop-blur-sm"
        aria-label={media?.title}
      >
        {media && (
          <div className="animate-pop">
            <TornPaper seed="modal" tone="paper" innerClassName="p-5 sm:p-7">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <p className="font-note text-xl text-pink">{media.subtitle ?? "now playing"}</p>
                  <h2 className="font-hand text-3xl leading-tight">{media.title}</h2>
                </div>
                <button
                  type="button"
                  onClick={() => dialog.current?.close()}
                  className="shrink-0 rounded-full border-2 border-ink px-3 py-1 font-hand text-lg hover:bg-butter"
                >
                  close ✕
                </button>
              </div>
              <div
                className={`flex justify-center bg-ink p-2 shadow-inner ${
                  media.orientation === "portrait" ? "h-dvh max-h-128" : ""
                }`}
              >
                <Player media={media} />
              </div>
              <p className="mt-3 text-center font-type text-xs text-pencil">Press Esc or tap outside to close</p>
            </TornPaper>
            <Tape color="pink" className="-top-1 left-10 -rotate-6" />
            <Tape color="sage" className="-top-1 right-10 rotate-6" />
          </div>
        )}
      </dialog>
    </Ctx.Provider>
  );
}
