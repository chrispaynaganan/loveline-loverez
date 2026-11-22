import type { Metadata } from "next";
import Link from "next/link";
import { getRateCard } from "@/lib/content";
import { PageHeader } from "@/components/sections/PageHeader";
import { Reveal } from "@/components/scrap/Reveal";
import { RateList } from "@/components/sections/RateList";
import { TornPaper } from "@/components/scrap/TornPaper";
import { Tape } from "@/components/scrap/Tape";
import { Label } from "@/components/scrap/Label";
import { ArrowLoop, Stamp } from "@/components/scrap/Doodles";

export const metadata: Metadata = {
  title: "Voice rate card",
  description: "Loveline's voice-over rates for commercials, narration, e-learning, character work and IVR.",
};

export default async function RatesPage() {
  const card = await getRateCard();
  return (
    <>
      <PageHeader
        kicker="no surprises,"
        title="Rate card"
        tone="butter"
        lead="Clear starting rates for the most common jobs. Every project is a little different, so send me your script and I'll confirm a final quote before we record."
        doodle={<Stamp text="Boses Filipina" sub="rates" className="size-36 rotate-12 text-pink" />}
      />
      <Reveal className="mx-auto mt-20 grid max-w-7xl items-start gap-14 px-5 sm:px-8 lg:grid-cols-12">
        <div className="settle relative lg:col-span-7" style={{ "--settle-rot": "-2deg" } as React.CSSProperties}>
          <Tape color="pink" className="-top-3 left-10 -rotate-6" />
          <Tape color="pink" className="-top-3 right-10 rotate-6" />
          <div className="grid-paper p-7 shadow-xl sm:p-12">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="font-hand text-4xl">{card.title}</h2>
              <span className="font-type text-xs text-pencil">updated {card.updated}</span>
            </div>
            <div className="mt-8">
              <RateList rates={card.rates} />
            </div>
          </div>
        </div>

        <div className="space-y-14 lg:col-span-5 lg:pt-10">
          <div className="settle relative rotate-2" style={{ "--settle-delay": "0.1s" } as React.CSSProperties}>
            <Label className="absolute -top-3 left-6 z-10 -rotate-3">Every booking includes</Label>
            <TornPaper seed="rates-includes" tone="lined" innerClassName="pt-8 pr-6 pb-6 pl-14">
              <ul>
                {card.includes.map((i) => (
                  <li key={i} className="font-note text-2xl leading-8">
                    ✓ {i}
                  </li>
                ))}
              </ul>
            </TornPaper>
          </div>
          <div className="settle relative -rotate-1" style={{ "--settle-delay": "0.2s" } as React.CSSProperties}>
            <Tape color="tan" className="-top-3 right-8 rotate-3" />
            <TornPaper seed="rates-terms" tone="paper" innerClassName="p-7">
              <h3 className="font-type text-xs font-bold tracking-widest uppercase">The small print</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-soft">
                {card.terms.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </TornPaper>
          </div>
          <div className="relative flex items-center gap-4 pl-4">
            <ArrowLoop className="h-24 w-20 -rotate-45 text-ink" delay={0.8} />
            <Link
              href="/contact"
              className="rotate-1 bg-pink px-5 py-3 font-type text-sm font-bold tracking-widest text-night uppercase shadow-md hover:-rotate-1 hover:bg-chalk"
            >
              Request a quote
            </Link>
          </div>
        </div>
      </Reveal>
    </>
  );
}
