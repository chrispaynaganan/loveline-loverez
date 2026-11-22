import Link from "next/link";
import { getDemoReels, getProfile, getRateCard, getTestimonials, getVideoReels } from "@/lib/content";
import { Reveal } from "@/components/scrap/Reveal";
import { TornPaper } from "@/components/scrap/TornPaper";
import { Tape } from "@/components/scrap/Tape";
import { Polaroid } from "@/components/scrap/Polaroid";
import { HandHeading } from "@/components/scrap/HandHeading";
import { HandRule } from "@/components/scrap/HandRule";
import { Label } from "@/components/scrap/Label";
import {
  ArrowCurlBack,
  ArrowDown,
  ArrowLoop,
  ArrowRight,
  ArrowSwoop,
  Asterisk,
  Flower,
  Heart,
  InkSplat,
  Mic,
  ScribbleCircle,
  SmileySticker,
  Sparkle,
  Stamp,
  Underline,
  Waves,
} from "@/components/scrap/Doodles";
import { DemoCard } from "@/components/media/DemoCard";
import { FilmStrip } from "@/components/media/Reels";
import { RateList } from "@/components/sections/RateList";
import { TestimonialNote } from "@/components/sections/TestimonialNote";
import { ProjectNote } from "@/components/sections/ProjectNote";

function MoreLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-2 font-type text-sm font-bold tracking-widest uppercase">
      <span className="border-b-2 border-ink pb-0.5 group-hover:border-pink group-hover:text-pink">{children}</span>
      <ArrowRight className="w-8 transition group-hover:translate-x-1 group-hover:text-pink" />
    </Link>
  );
}

export default async function Home() {
  const [p, demos, reels, card, words] = await Promise.all([
    getProfile(),
    getDemoReels(),
    getVideoReels(),
    getRateCard(),
    getTestimonials(),
  ]);
  const featured = demos.filter((d) => d.featured).slice(0, 4);

  return (
    <>
      {/* ---------- Hero ---------- */}
      <Reveal className="relative mx-auto max-w-7xl px-5 pt-10 sm:px-8 lg:pt-14">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-6">
          {/* kraft card */}
          <div className="relative lg:col-span-5 lg:pt-6">
            <Flower className="absolute top-24 -left-24 hidden h-64 w-28 text-ink xl:block" delay={0.1} />
            <div className="settle relative -rotate-1" style={{ "--settle-rot": "-4deg" } as React.CSSProperties}>
              <Tape color="cream" className="-top-3 left-1/3 h-8 w-36 -rotate-2" />
              <SmileySticker className="absolute -top-8 -right-4 z-20 size-20 rotate-12 drop-shadow-md motion-safe:animate-bob sm:-right-8 sm:size-24" />
              <TornPaper seed="hero-kraft" tone="kraft" depth={9} innerClassName="px-7 pt-12 pb-10 sm:px-10 sm:pt-14">
                <p className="font-note text-3xl text-ink">Kumusta! I&apos;m {p.name.split(" ")[0]},</p>
                <h1 className="mt-1 font-hand text-5xl leading-none text-ink sm:text-6xl xl:text-7xl">
                  your voice for{" "}
                  <span className="relative inline-block">
                    every story.
                    <Underline className="absolute -bottom-3 left-0 w-full text-ink" delay={0.6} />
                  </span>
                </h1>
                <p className="mt-8 max-w-md text-sm leading-relaxed text-ink sm:text-base">{p.intro}</p>
                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                  <Link
                    href="/demos"
                    className="inline-flex items-center gap-3 bg-ink px-5 py-3 font-type text-sm font-bold tracking-widest text-paper uppercase shadow-md transition hover:-rotate-1 hover:bg-pink"
                  >
                    Hear my demos
                    <ArrowRight className="w-7 text-paper" delay={0.9} />
                  </Link>
                  <Link
                    href="/rates"
                    className="border-b-2 border-ink pb-0.5 font-type text-sm font-bold tracking-widest uppercase hover:border-pink hover:text-pink"
                  >
                    See my rates
                  </Link>
                </div>
              </TornPaper>
            </div>
          </div>

          {/* polaroid + stats */}
          <div className="relative mx-auto w-full max-w-sm lg:col-span-4 lg:max-w-none">
            <div className="settle" style={{ "--settle-rot": "6deg", "--settle-delay": "0.1s" } as React.CSSProperties}>
              <Polaroid
                src={p.portrait}
                alt={`${p.name} at the microphone in her studio, wearing headphones`}
                caption={
                  <>
                    {p.portraitCaption} <Sparkle className="inline size-5 text-pink" />
                  </>
                }
                tape="plaid"
                priority
                className="rotate-2"
              />
            </div>
            <Waves className="absolute top-16 -right-10 hidden h-20 w-14 text-pink lg:block" delay={0.8} />
            <div
              className="settle relative -mt-3 ml-auto w-11/12 -rotate-2 sm:w-4/5"
              style={{ "--settle-delay": "0.3s" } as React.CSSProperties}
            >
              <Tape color="pink" className="-top-2 -right-5 w-16 rotate-12" />
              <TornPaper seed="hero-stats" tone="sage" innerClassName="px-6 py-5">
                <ul className="flex justify-between gap-3 text-center">
                  {p.stats.map((s) => (
                    <li key={s.label}>
                      <span className="block font-hand text-3xl leading-none">{s.value}</span>
                      <span className="mt-1 block font-type text-xs leading-tight">{s.label}</span>
                    </li>
                  ))}
                </ul>
              </TornPaper>
            </div>
          </div>

          {/* today checklist */}
          <div className="relative mx-auto w-full max-w-xs lg:col-span-3 lg:mt-16">
            <Asterisk className="absolute -top-14 left-4 size-10 text-ink" delay={1} />
            <div className="settle rotate-3" style={{ "--settle-rot": "8deg", "--settle-delay": "0.2s" } as React.CSSProperties}>
              <Tape color="sage" className="-top-3 right-6 rotate-6" />
              <TornPaper seed="hero-today" tone="lined" edges={["top", "right", "bottom"]} innerClassName="pt-6 pr-6 pb-8 pl-14">
                <p className="font-hand text-3xl leading-8 underline decoration-2 underline-offset-4">Today:</p>
                <ul className="mt-2">
                  {p.today.map((t, i) => (
                    <li key={t.text} className="flex items-center gap-3 font-note text-3xl leading-8">
                      <svg viewBox="0 0 24 24" className="size-5 shrink-0 text-ink" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                        <path d="M3 4 C 9 3, 15 4, 21 3 C 21 9, 20 15, 21 21 C 15 20, 9 21, 3 21 C 4 15, 3 9, 3 4" />
                        {t.done && <path d="M6 12 L11 17 L22 3" pathLength={1} className="ink-draw" style={{ "--draw-delay": `${0.8 + i * 0.25}s` } as React.CSSProperties} />}
                      </svg>
                      <span className={t.done ? "" : "text-ink-soft"}>{t.text}</span>
                      <span className="sr-only">{t.done ? "(done)" : "(next)"}</span>
                    </li>
                  ))}
                </ul>
                <Heart className="mt-2 ml-auto size-8 text-pink" delay={1.8} />
              </TornPaper>
            </div>
            <div className="relative hidden lg:block">
              <ArrowCurlBack className="absolute top-2 -left-24 h-24 w-32 text-ink" delay={1.6} />
              <InkSplat className="absolute top-20 -left-28 size-8 text-ink" />
            </div>
          </div>
        </div>
      </Reveal>

      {/* ---------- Demo reels ---------- */}
      <Reveal className="relative mx-auto mt-16 max-w-7xl px-5 sm:px-8">
        <HandRule className="mb-10 text-ink/60" flourish />
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div className="relative">
            <HandHeading kicker="press play">Fresh from the booth</HandHeading>
            <ArrowDown className="absolute top-2 -right-14 hidden h-20 w-8 text-pink sm:block" delay={0.7} />
          </div>
          <MoreLink href="/demos">All demos</MoreLink>
        </div>
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((d, i) => (
            <DemoCard key={d.slug} demo={d} index={i} />
          ))}
        </div>
      </Reveal>

      {/* ---------- Services, reels, booking ---------- */}
      <Reveal className="relative mx-auto mt-28 max-w-7xl px-5 sm:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="settle relative lg:col-span-5" style={{ "--settle-rot": "-3deg" } as React.CSSProperties}>
            <TornPaper seed="services" tone="pink" depth={10} innerClassName="px-8 py-10 sm:px-10">
              <h2 className="font-hand text-4xl leading-tight">
                Good stories are meant to be{" "}
                <span className="relative inline-block">
                  heard.
                  <span aria-hidden className="absolute -inset-x-3 -inset-y-3">
                    <ScribbleCircle className="size-full text-ink" delay={0.6} />
                  </span>
                </span>
              </h2>
              <ul className="mt-6 space-y-4">
                {p.services.map((s) => (
                  <li key={s.title}>
                    <h3 className="font-type text-sm font-bold tracking-wide uppercase">✿ {s.title}</h3>
                    <p className="text-sm leading-relaxed text-ink">{s.body}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <MoreLink href="/contact">Book a session</MoreLink>
              </div>
            </TornPaper>
            <Mic className="absolute -right-6 -bottom-10 hidden h-36 w-20 rotate-12 text-ink sm:block" delay={0.4} />
          </div>

          <div className="relative mx-auto w-full max-w-sm lg:col-span-4 lg:mt-8">
            <div className="mb-4 flex items-end gap-2">
              <p className="-rotate-3 font-note text-3xl leading-none">my work on screen</p>
              <ArrowSwoop className="h-10 w-24 rotate-12 text-ink" delay={0.5} />
            </div>
            <div className="settle -rotate-1" style={{ "--settle-rot": "-6deg", "--settle-delay": "0.1s" } as React.CSSProperties}>
              <Tape color="tan" className="-top-3 left-1/2 -translate-x-1/2 rotate-3" />
              <FilmStrip reels={reels} />
            </div>
            <div className="mt-5 text-center">
              <MoreLink href="/reels">All video reels</MoreLink>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xs lg:col-span-3 lg:mt-20">
            <div className="settle" style={{ "--settle-rot": "8deg", "--settle-delay": "0.2s" } as React.CSSProperties}>
              <ProjectNote />
            </div>
            <ArrowLoop className="absolute -bottom-36 left-0 hidden h-32 w-28 -rotate-12 text-ink lg:block" delay={1} />
          </div>
        </div>
      </Reveal>

      {/* ---------- Rate card + kind words ---------- */}
      <Reveal className="relative mx-auto mt-32 max-w-7xl px-5 sm:px-8">
        <div className="grid items-start gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="relative lg:col-span-5">
            <div className="settle relative rotate-1" style={{ "--settle-rot": "-4deg" } as React.CSSProperties}>
              <Tape color="blush" className="-top-3 left-8 -rotate-6" />
              <Tape color="blush" className="-top-3 right-8 rotate-6" />
              <div className="grid-paper p-7 shadow-lg sm:p-9">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Label tone="pink">{card.title}</Label>
                    <h2 className="mt-3 font-hand text-4xl leading-none">What it costs</h2>
                    <p className="mt-2 font-type text-xs text-pencil">updated {card.updated}</p>
                  </div>
                  <Stamp text="Boses Filipina" sub="PH" className="size-20 shrink-0 rotate-12 text-pink" />
                </div>
                <HandRule className="my-5 text-ink/50" />
                <RateList rates={card.rates.slice(0, 4)} grouped={false} />
                <div className="mt-8">
                  <MoreLink href="/rates">Full rate card</MoreLink>
                </div>
              </div>
            </div>
          </div>

          <div className="relative lg:col-span-7">
            <HandHeading kicker="kind words" className="mb-10">
              From the people I&apos;ve voiced for
            </HandHeading>
            <div className="grid gap-10 md:grid-cols-2">
              {words[0] && (
                <TestimonialNote t={words[0]} tone="lined" tape="pink" className="-rotate-1" />
              )}
              {words[1] && (
                <TestimonialNote t={words[1]} tone="butter" tape="plaid" index={1} className="rotate-2 md:mt-16" />
              )}
            </div>
          </div>
        </div>
      </Reveal>
    </>
  );
}
