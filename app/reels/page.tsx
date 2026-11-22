import type { Metadata } from "next";
import { getVideoReels } from "@/lib/content";
import { PageHeader } from "@/components/sections/PageHeader";
import { Reveal } from "@/components/scrap/Reveal";
import { ReelCard } from "@/components/media/Reels";
import { Sparkle, Waves } from "@/components/scrap/Doodles";

export const metadata: Metadata = {
  title: "Video reels",
  description: "Watch commercials and digital ads voiced by Loveline Loverez.",
};

export default async function ReelsPage() {
  const reels = await getVideoReels();
  const portrait = reels.filter((r) => r.orientation === "portrait");
  const landscape = reels.filter((r) => r.orientation === "landscape");
  return (
    <>
      <PageHeader
        kicker="lights, camera,"
        title="Video reels"
        tone="blush"
        lead="Ads and spots where you can see my voice at work, synced to the picture. Tap any frame to watch."
        doodle={
          <div className="flex items-start gap-2 text-ink">
            <Waves className="h-28 w-20" delay={0.6} />
            <Sparkle className="size-12 text-pink" delay={1} />
          </div>
        }
      />
      <Reveal className="mx-auto mt-20 max-w-7xl px-5 sm:px-8">
        {landscape.length > 0 && (
          <div className="grid gap-x-12 gap-y-16 md:grid-cols-2">
            {landscape.map((r, i) => (
              <ReelCard key={r.slug} reel={r} index={i} />
            ))}
          </div>
        )}
        {portrait.length > 0 && (
          <>
            <h2 className="mt-24 mb-10 font-hand text-4xl">Short reels</h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-14 md:grid-cols-3 lg:grid-cols-4">
              {portrait.map((r, i) => (
                <ReelCard key={r.slug} reel={r} index={i} />
              ))}
            </div>
          </>
        )}
      </Reveal>
    </>
  );
}
