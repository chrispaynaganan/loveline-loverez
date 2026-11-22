"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Tape } from "@/components/scrap/Tape";

/** Yellow sticky note that starts a booking with the visitor's email. */
export function ProjectNote() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  return (
    <div className="paper-ink relative rotate-2 bg-butter text-ink p-6 pt-8 shadow-lg paper-grain">
      <Tape color="plaid" className="-top-3 -left-4 w-16 -rotate-12" />
      <svg viewBox="0 0 24 60" className="absolute -top-6 right-6 h-14 w-6 text-ink-soft" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M8 44 V12 a4 4 0 0 1 8 0 V50 a6 6 0 0 1 -12 0 V18" strokeLinecap="round" />
      </svg>
      <h2 className="font-hand text-3xl leading-tight">Got a script?</h2>
      <p className="mt-2 text-sm leading-relaxed">
        Tell me about your project and I&apos;ll reply with a quote and a quick sample read.
      </p>
      <form
        className="mt-4 space-y-2"
        onSubmit={(e) => {
          e.preventDefault();
          router.push(`/contact${email ? `?email=${encodeURIComponent(email)}` : ""}`);
        }}
      >
        <label htmlFor="note-email" className="sr-only">
          Your email
        </label>
        <input
          id="note-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          className="w-full border-b-2 border-ink bg-transparent px-1 py-1 font-type text-sm placeholder:text-ink-soft focus:outline-none"
        />
        <button type="submit" className="bg-ink px-4 py-2 font-type text-xs font-bold tracking-widest text-paper uppercase hover:bg-pink">
          Start a booking
        </button>
      </form>
      <span aria-hidden className="absolute right-0 bottom-0 size-8 bg-linear-to-tl from-kraft/50 to-transparent" />
    </div>
  );
}
