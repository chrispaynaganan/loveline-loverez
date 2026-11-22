import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getProfile } from "@/lib/content";
import { PageHeader } from "@/components/sections/PageHeader";
import { Reveal } from "@/components/scrap/Reveal";
import { TornPaper } from "@/components/scrap/TornPaper";
import { Tape } from "@/components/scrap/Tape";
import { ContactForm } from "@/components/sections/ContactForm";
import { ArrowCurlBack, Mic, SmileySticker } from "@/components/scrap/Doodles";

export const metadata: Metadata = {
  title: "Book a session",
  description: "Tell Loveline about your project and get a quote for your voice-over.",
};

export default async function ContactPage() {
  const p = await getProfile();
  const services = p.services.map((s) => s.title);
  return (
    <>
      <PageHeader
        kicker="let's make something,"
        title="Book a session"
        tone="pink"
        lead="Send me the details and I'll get back to you with a quote, a timeline and, if you like, a quick sample read of your script."
        doodle={<Mic className="h-44 w-24 rotate-12 text-ink" delay={0.5} />}
      />
      <Reveal className="mx-auto mt-20 grid max-w-7xl items-start gap-14 px-5 sm:px-8 lg:grid-cols-12">
        <div className="settle relative lg:col-span-8" style={{ "--settle-rot": "-2deg" } as React.CSSProperties}>
          <Tape color="sage" className="-top-3 left-12 -rotate-3" />
          <Tape color="sage" className="-top-3 right-12 rotate-3" />
          <TornPaper seed="contact-form" tone="paper" innerClassName="p-8 sm:p-12">
            <Suspense fallback={null}>
              <ContactForm email={p.email} services={services} />
            </Suspense>
          </TornPaper>
        </div>
        <aside className="relative space-y-12 lg:col-span-4 lg:pt-8">
          <div className="settle relative rotate-2" style={{ "--settle-delay": "0.15s" } as React.CSSProperties}>
            <SmileySticker className="absolute -top-8 -right-4 z-10 size-16 rotate-12" />
            <div className="bg-butter p-6 shadow-lg paper-grain">
              <p className="font-note text-2xl leading-tight">Rather just email?</p>
              <Link href={`mailto:${p.email}`} className="mt-1 block font-type text-sm font-bold break-all underline underline-offset-4 hover:text-pink">
                {p.email}
              </Link>
            </div>
          </div>
          <div className="settle -rotate-1" style={{ "--settle-delay": "0.25s" } as React.CSSProperties}>
            <TornPaper seed="contact-socials" tone="lined" innerClassName="py-5 pr-6 pl-14">
              <p className="font-hand text-2xl leading-8">Also on:</p>
              <ul>
                {p.socials.map((s) => (
                  <li key={s.label} className="font-note text-2xl leading-8">
                    <Link href={s.url} target="_blank" rel="noreferrer" className="hover:text-pink">
                      → {s.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </TornPaper>
          </div>
          <ArrowCurlBack className="hidden h-24 w-32 text-ink lg:block" delay={0.9} />
        </aside>
      </Reveal>
    </>
  );
}
