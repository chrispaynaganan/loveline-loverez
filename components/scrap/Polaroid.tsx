import Image from "next/image";
import type { ReactNode } from "react";
import { Tape, type TapeColor } from "./Tape";

/** A taped instant photo with a handwritten caption. */
export function Polaroid({
  src,
  alt,
  caption,
  tape = "tan",
  className = "",
  imageClassName = "aspect-4/5",
  priority,
  sizes = "(min-width: 1024px) 28rem, 80vw",
  children,
}: {
  src: string;
  alt: string;
  caption?: ReactNode;
  tape?: TapeColor | null;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
  children?: ReactNode;
}) {
  return (
    <figure className={`relative bg-paper p-3 pb-2 shadow-lg ring-1 ring-ink/5 ${className}`}>
      {tape && <Tape color={tape} className="-top-3 left-1/2 -translate-x-1/2 -rotate-3" />}
      <div className={`relative overflow-hidden bg-ink/10 ${imageClassName}`}>
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover sepia-15 saturate-90" />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-linear-to-br from-butter/10 via-transparent to-ink/10" />
        {children}
      </div>
      {caption && (
        <figcaption className="px-1 pt-2 text-center font-note text-2xl leading-tight text-ink-soft">{caption}</figcaption>
      )}
    </figure>
  );
}
