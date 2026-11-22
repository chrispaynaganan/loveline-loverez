"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { HandRule } from "@/components/scrap/HandRule";
import { Squiggle } from "@/components/scrap/Doodles";
import { TornPaper } from "@/components/scrap/TornPaper";
import { Logo } from "./Logo";

export const links = [
  { href: "/demos", label: "Demos" },
  { href: "/reels", label: "Reels" },
  { href: "/rates", label: "Rate card" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Nav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [path]);

  return (
    <header className="relative z-40 mx-auto w-full max-w-7xl px-5 pt-5 sm:px-8">
      <div className="flex items-center justify-between gap-6">
        <Logo />
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {links.map((l) => {
              const active = path === l.href;
              return (
                <li key={l.href} className="relative">
                  <Link
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    className="font-hand text-xl text-ink transition hover:text-pink"
                  >
                    {l.label}
                  </Link>
                  {active && <Squiggle className="absolute -bottom-2 left-0 w-full text-pink" delay={0} />}
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            className="hidden -rotate-2 bg-ink px-4 py-2 font-type text-sm font-bold tracking-wider text-paper uppercase shadow-md transition hover:rotate-0 hover:bg-pink sm:inline-block"
          >
            Book a session
          </Link>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="grid size-11 place-items-center md:hidden"
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <svg viewBox="0 0 32 32" className="size-8" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
              {open ? (
                <path d="M7 7 C 14 13, 19 19, 25 25 M25 7 C 19 14, 13 19, 7 25" />
              ) : (
                <path d="M5 9 C 12 8, 20 10, 27 9 M5 16 C 13 17, 19 15, 27 16 M5 23 C 12 22, 20 24, 27 23" />
              )}
            </svg>
          </button>
        </div>
      </div>
      <HandRule className="mt-3 text-ink/70" />

      {open && (
        <div id="mobile-menu" className="absolute inset-x-4 top-full z-50 mt-1 animate-pop md:hidden">
          <TornPaper seed="menu" tone="lined" innerClassName="py-4 pr-6 pl-14">
            <ul className="flex flex-col">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="block py-0.5 font-hand text-3xl leading-10 hover:text-pink">
                    {path === l.href ? "→ " : ""}
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/contact" className="mt-2 inline-block bg-ink px-4 py-2 font-type text-sm font-bold tracking-wider text-paper uppercase">
                  Book a session
                </Link>
              </li>
            </ul>
          </TornPaper>
        </div>
      )}
    </header>
  );
}
