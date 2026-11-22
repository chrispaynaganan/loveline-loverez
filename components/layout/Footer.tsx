import Link from "next/link";
import { getProfile } from "@/lib/content";
import { TornPaper } from "@/components/scrap/TornPaper";
import { Tape } from "@/components/scrap/Tape";
import { Heart, SmileySticker } from "@/components/scrap/Doodles";
import { Polaroid } from "@/components/scrap/Polaroid";
import { Logo } from "./Logo";

export async function Footer() {
  const p = await getProfile();

  const cols = [
    {
      title: "Listen",
      items: [
        { label: "Demo reels", href: "/demos" },
        { label: "Video reels", href: "/reels" },
      ],
    },
    {
      title: "Info",
      items: [
        { label: "About me", href: "/about" },
        { label: "Rate card", href: "/rates" },
        { label: "Book a session", href: "/contact" },
      ],
    },
    {
      title: "Connect",
      items: [
        { label: p.email, href: `mailto:${p.email}` },
        ...p.socials.map((s) => ({ label: s.label, href: s.url })),
      ],
    },
  ];

  return (
    <footer className="relative mt-24 overflow-hidden">
      <TornPaper seed="footer" tone="cream" edges={["top"]} depth={10} innerClassName="pt-14 pb-10">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <SmileySticker className="mb-3 size-16 -rotate-6" />
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">
              Voice-over from the {p.location}, for brands and stories everywhere.
            </p>
            <p className="mt-4 font-type text-xs text-pencil">
              © 2026 {p.brand}. All rights reserved.
            </p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-6">
            {cols.map((c, ci) => (
              <div key={c.title} className={ci === cols.length - 1 ? "col-span-2 sm:col-span-1" : ""}>
                <h2 className="mb-3 inline-block border-b-2 border-ink font-type text-xs font-bold tracking-widest uppercase">
                  {c.title}
                </h2>
                <ul className="space-y-1.5">
                  {c.items.map((i) => {
                    const external = i.href.startsWith("http");
                    return (
                      <li key={i.href}>
                        <Link
                          href={i.href}
                          {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                          className="text-sm break-words text-ink-soft underline-offset-4 hover:text-pink hover:underline"
                        >
                          {i.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          <div className="relative hidden h-56 lg:col-span-3 lg:block">
            <Polaroid
              src={p.portrait}
              alt=""
              tape={null}
              className="absolute top-0 left-0 w-40 rotate-6"
              imageClassName="aspect-square"
              sizes="10rem"
            />
            <div className="absolute right-0 bottom-0 w-44 -rotate-3">
              <Tape color="black" className="-top-3 -right-4 w-16 rotate-45" />
              <TornPaper seed="footer-note" tone="paper" innerClassName="p-4">
                <p className="font-note text-2xl leading-tight">
                  Every story deserves a voice that feels like home.
                </p>
                <Heart className="mt-1 size-6 text-pink" />
              </TornPaper>
            </div>
          </div>
        </div>
      </TornPaper>
    </footer>
  );
}
