import type { Testimonial } from "@/content/types";
import { TornPaper, type PaperTone } from "@/components/scrap/TornPaper";
import { Tape, type TapeColor } from "@/components/scrap/Tape";

export function TestimonialNote({
  t,
  tone = "paper",
  tape = "tan",
  className = "",
  index = 0,
}: {
  t: Testimonial;
  tone?: PaperTone;
  tape?: TapeColor;
  className?: string;
  index?: number;
}) {
  return (
    <figure className={`settle relative ${className}`} style={{ "--settle-delay": `${index * 0.12}s` } as React.CSSProperties}>
      <Tape color={tape} className="-top-3 left-8 -rotate-6" />
      <TornPaper seed={`t-${t.id}`} tone={tone} innerClassName={tone === "lined" ? "py-6 pr-6 pl-14" : "p-6 sm:p-8"}>
        <span aria-hidden className="block font-hand text-6xl leading-none text-pink">“</span>
        <blockquote className="-mt-4 font-note text-2xl leading-8 text-ink">{t.quote}</blockquote>
        {t.highlights.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {t.highlights.map((h) => (
              <li key={h} className="bg-butter/80 px-2 py-0.5 font-type text-xs">
                ✓ {h}
              </li>
            ))}
          </ul>
        )}
        <figcaption className="mt-4 font-type text-xs leading-relaxed text-ink-soft">
          — {t.role}
          <br />
          {t.company}
        </figcaption>
      </TornPaper>
    </figure>
  );
}
