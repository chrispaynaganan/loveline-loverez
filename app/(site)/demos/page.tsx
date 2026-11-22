import type { Metadata } from "next";
import Link from "next/link";
import { getDemoReels } from "@/lib/content";
import { PageHeader } from "@/components/sections/PageHeader";
import { Reveal } from "@/components/scrap/Reveal";
import { DemoCard } from "@/components/media/DemoCard";
import { Headphones, MusicNote } from "@/components/scrap/Doodles";
import { TornPaper } from "@/components/scrap/TornPaper";

export const metadata: Metadata = {
  title: "Demo reels",
  description: "Listen to Loveline's voice-over demo reels: commercial, narration, character and e-learning.",
};

export default async function DemosPage() {
  const demos = await getDemoReels();
  return (
    <>
      <PageHeader
        kicker="pop in a tape,"
        title="Demo reels"
        lead="Grab your headphones. Each tape is a short mix of real reads in one style, so you can hear how I'd sound on your project in under a minute."
        doodle={
          <div className="flex items-end gap-4 text-ink">
            <Headphones className="size-32 -rotate-12" delay={0.6} />
            <MusicNote className="size-16 rotate-12 text-pink" delay={1} />
          </div>
        }
      />
      <Reveal className="mx-auto mt-20 max-w-7xl px-5 sm:px-8">
        <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {demos.map((d, i) => (
            <DemoCard key={d.slug} demo={d} index={i} />
          ))}
        </div>
        <div className="settle mx-auto mt-20 max-w-xl rotate-1">
          <TornPaper seed="demos-custom" tone="sage" innerClassName="px-8 py-6 text-center">
            <p className="font-note text-3xl leading-tight">Need a style that isn&apos;t here?</p>
            <p className="mt-2 text-sm">
              Send me a few lines of your script and I&apos;ll record a short custom read.{" "}
              <Link href="/contact" className="font-bold underline underline-offset-4 hover:text-pink">
                Ask for a sample
              </Link>
            </p>
          </TornPaper>
        </div>
      </Reveal>
    </>
  );
}
