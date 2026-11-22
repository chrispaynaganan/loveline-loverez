import type { ReactNode } from "react";
import { Reveal } from "@/components/scrap/Reveal";
import { TornPaper, type PaperTone } from "@/components/scrap/TornPaper";
import { Tape } from "@/components/scrap/Tape";
import { Underline } from "@/components/scrap/Doodles";

/** Title of an inner page, written on a torn strip of paper. */
export function PageHeader({
  kicker,
  title,
  lead,
  tone = "kraft",
  doodle,
}: {
  kicker: string;
  title: string;
  lead?: ReactNode;
  tone?: PaperTone;
  doodle?: ReactNode;
}) {
  return (
    <Reveal className="relative mx-auto max-w-7xl px-5 pt-12 sm:px-8">
      <div className="settle relative max-w-3xl -rotate-1" style={{ "--settle-rot": "-3deg" } as React.CSSProperties}>
        <Tape color="cream" className="-top-3 left-10 -rotate-3" />
        <TornPaper seed={`header-${title}`} tone={tone} edges={["right", "bottom"]} depth={9} innerClassName="px-8 pt-10 pb-10 sm:px-12">
          <p className="font-note text-3xl text-ink">{kicker}</p>
          <h1 className="relative mt-1 inline-block font-hand text-5xl leading-none sm:text-7xl">
            {title}
            <Underline className="absolute -bottom-3 left-0 w-full text-ink" delay={0.4} />
          </h1>
          {lead && <div className="mt-8 max-w-xl text-sm leading-relaxed sm:text-base">{lead}</div>}
        </TornPaper>
      </div>
      {doodle && <div className="pointer-events-none absolute top-10 right-8 hidden md:block">{doodle}</div>}
    </Reveal>
  );
}
