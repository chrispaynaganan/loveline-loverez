import type { Metadata } from "next";
import Link from "next/link";
import { getProfile, getTestimonials } from "@/lib/content";
import { PageHeader } from "@/components/sections/PageHeader";
import { Reveal } from "@/components/scrap/Reveal";
import { Polaroid } from "@/components/scrap/Polaroid";
import { TornPaper } from "@/components/scrap/TornPaper";
import { Tape } from "@/components/scrap/Tape";
import { TestimonialNote } from "@/components/sections/TestimonialNote";
import { ArrowSwoop, Flower, Heart, Sparkle } from "@/components/scrap/Doodles";

export const metadata: Metadata = {
  title: "About",
  description: "Meet Loveline Loverez, the voice behind Boses Filipina.",
};

export default async function AboutPage() {
  const [p, words] = await Promise.all([getProfile(), getTestimonials()]);
  return (
    <>
      <PageHeader kicker="nice to meet you," title={`I'm ${p.name.split(" ")[0]}`} tone="sage" doodle={<Flower className="h-56 w-24 text-ink" delay={0.4} />} />

      <Reveal className="mx-auto mt-20 grid max-w-7xl items-start gap-16 px-5 sm:px-8 lg:grid-cols-12">
        <div className="relative mx-auto w-full max-w-sm lg:col-span-4">
          <div className="settle" style={{ "--settle-rot": "-6deg" } as React.CSSProperties}>
            <Polaroid src={p.portrait} alt={`${p.name} in her studio`} caption={p.portraitCaption} tape="pink" className="-rotate-3" />
          </div>
          <Sparkle className="absolute -top-6 -right-4 size-12 text-pink" delay={0.8} />
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {p.stats.map((s, i) => (
              <div key={s.label} className={`bg-paper px-4 py-3 text-center shadow-md ${i % 2 ? "rotate-2" : "-rotate-2"}`}>
                <span className="block font-hand text-3xl leading-none">{s.value}</span>
                <span className="font-type text-xs">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="settle relative lg:col-span-8" style={{ "--settle-delay": "0.1s" } as React.CSSProperties}>
          <Tape color="plaid" className="-top-3 left-12 -rotate-3" />
          <TornPaper seed="about-letter" tone="lined" edges={["top", "right", "bottom"]} innerClassName="py-10 pr-8 pl-16 sm:pr-14">
            <p className="font-note text-3xl leading-8">Dear listener,</p>
            <div className="mt-8 space-y-8">
              {p.about.map((para) => (
                <p key={para} className="text-base leading-8">
                  {para}
                </p>
              ))}
            </div>
            <p className="mt-8 font-note text-3xl leading-8">
              With love, {p.name.split(" ")[0]} <Heart className="inline size-7 text-pink" delay={1.2} />
            </p>
          </TornPaper>
        </div>
      </Reveal>

      <Reveal className="mx-auto mt-28 max-w-7xl px-5 sm:px-8">
        <h2 className="font-hand text-4xl sm:text-5xl">What I voice</h2>
        <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {p.services.map((s, i) => (
            <div key={s.title} className="settle" style={{ "--settle-delay": `${i * 0.08}s` } as React.CSSProperties}>
              <TornPaper
                seed={`svc-${i}`}
                tone={(["blush", "butter", "sky", "kraft"] as const)[i % 4]}
                className={i % 2 ? "rotate-1" : "-rotate-1"}
                innerClassName="p-6"
              >
                <h3 className="font-hand text-2xl leading-tight">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed">{s.body}</p>
              </TornPaper>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal className="mx-auto mt-28 grid max-w-7xl gap-10 px-5 sm:px-8 md:grid-cols-2">
        {words.map((t, i) => (
          <TestimonialNote key={t.id} t={t} index={i} tone={i ? "paper" : "cream"} tape={i ? "sage" : "pink"} className={i ? "rotate-1 md:mt-12" : "-rotate-1"} />
        ))}
      </Reveal>

      <Reveal className="mx-auto mt-20 flex max-w-7xl flex-wrap items-center justify-center gap-6 px-5 sm:px-8">
        <p className="font-note text-3xl">find me on</p>
        <ArrowSwoop className="h-10 w-20 text-ink" delay={0.4} />
        <ul className="flex flex-wrap gap-3">
          {p.socials.map((s, i) => (
            <li key={s.label}>
              <Link
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className={`inline-block bg-paper px-4 py-2 font-type text-sm font-bold shadow-md transition hover:bg-pink hover:text-paper ${i % 2 ? "rotate-2" : "-rotate-2"}`}
              >
                {s.label}
              </Link>
            </li>
          ))}
        </ul>
      </Reveal>
    </>
  );
}
