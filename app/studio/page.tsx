"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useStudio } from "@/components/studio/StudioContext";
import { PageTitle } from "@/components/studio/ui";
import type { InquiryRow } from "@/lib/db";

const cards = [
  { href: "/studio/demos", table: "demo_reels", label: "Demo reels", note: "Upload your MP3 demos", tone: "bg-blush" },
  { href: "/studio/reels", table: "video_reels", label: "Video reels", note: "Ads, spots and short reels", tone: "bg-sky" },
  { href: "/studio/rates", table: "rates", label: "Rate card", note: "Prices and the small print", tone: "bg-butter" },
  { href: "/studio/kind-words", table: "testimonials", label: "Kind words", note: "What clients say", tone: "bg-sage" },
];

export default function Overview() {
  const { db } = useStudio();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [inbox, setInbox] = useState<InquiryRow[] | null>(null);

  useEffect(() => {
    for (const c of cards)
      db.from(c.table)
        .select("id", { count: "exact", head: true })
        .then(({ count }) => setCounts((s) => ({ ...s, [c.table]: count ?? 0 })));
    db.from("inquiries")
      .select("*")
      .eq("status", "new")
      .order("created_at", { ascending: false })
      .limit(5)
      .then(({ data }) => setInbox((data as InquiryRow[]) ?? []));
  }, [db]);

  return (
    <div className="max-w-5xl">
      <PageTitle kicker="Kumusta!" title="Your studio" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c, i) => (
          <Link
            key={c.href}
            href={c.href}
            className={`paper-ink block p-5 text-ink shadow-lg transition paper-grain hover:-translate-y-1 hover:rotate-0 ${c.tone} ${i % 2 ? "rotate-1" : "-rotate-1"}`}
          >
            <span className="block font-hand text-5xl leading-none">{counts[c.table] ?? "–"}</span>
            <span className="mt-2 block font-hand text-2xl">{c.label}</span>
            <span className="block text-sm text-ink-soft">{c.note}</span>
          </Link>
        ))}
      </div>

      <section className="mt-12">
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 className="font-hand text-3xl text-chalk">New bookings</h2>
          <Link href="/studio/inquiries" className="text-sm text-pink hover:underline">
            See all →
          </Link>
        </div>
        {inbox === null ? (
          <p className="text-chalk/60">loading…</p>
        ) : inbox.length === 0 ? (
          <p className="rounded-sm border border-dashed border-chalk/25 p-6 text-sm text-chalk/60">
            No new bookings. When someone fills in the form on your Contact page, it shows up here.
          </p>
        ) : (
          <ul className="space-y-3">
            {inbox.map((q) => (
              <li key={q.id}>
                <Link href="/studio/inquiries" className="paper-ink block bg-paper p-4 text-ink shadow-md paper-grain hover:bg-cream">
                  <span className="font-semibold">{q.name}</span> <span className="text-ink-soft">· {q.project_type ?? "New project"}</span>
                  <span className="mt-1 block truncate text-sm text-ink-soft">{q.message}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-12 grid gap-5 sm:grid-cols-2">
        <Link href="/studio/profile" className="paper-ink block bg-paper p-5 text-ink shadow-md paper-grain hover:bg-cream">
          <span className="font-hand text-2xl">About &amp; profile →</span>
          <span className="block text-sm text-ink-soft">Your intro, photo, stats, services and social links</span>
        </Link>
        <Link href="/" target="_blank" className="block rounded-sm border border-chalk/20 p-5 text-chalk hover:bg-chalk/5">
          <span className="font-hand text-2xl">View your site ↗</span>
          <span className="block text-sm text-chalk/60">Changes show up as soon as you save</span>
        </Link>
      </section>
    </div>
  );
}
