"use client";

import { useCallback, useEffect, useState } from "react";
import { useStudio } from "@/components/studio/StudioContext";
import { Button, Empty, PageTitle } from "@/components/studio/ui";
import type { InquiryRow } from "@/lib/db";

const tabs: { id: InquiryRow["status"]; label: string }[] = [
  { id: "new", label: "New" },
  { id: "replied", label: "Replied" },
  { id: "archived", label: "Archived" },
];

const when = (iso: string) =>
  new Date(iso).toLocaleString("en-PH", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Manila" });

export default function InquiriesStudio() {
  const { db, notify } = useStudio();
  const [tab, setTab] = useState<InquiryRow["status"]>("new");
  const [rows, setRows] = useState<InquiryRow[] | null>(null);
  const [counts, setCounts] = useState<Record<string, number>>({});

  const apply = useCallback((all: InquiryRow[]) => {
    setRows(all);
    setCounts(Object.fromEntries(tabs.map((t) => [t.id, all.filter((r) => r.status === t.id).length])));
  }, []);

  const fetchAll = useCallback(async () => {
    const { data, error } = await db.from("inquiries").select("*").order("created_at", { ascending: false });
    if (error) notify(`Couldn't load bookings: ${error.message}`, "error");
    return (data as InquiryRow[]) ?? [];
  }, [db, notify]);

  const load = useCallback(async () => apply(await fetchAll()), [apply, fetchAll]);

  useEffect(() => {
    let live = true;
    fetchAll().then((all) => live && apply(all));
    return () => {
      live = false;
    };
  }, [fetchAll, apply]);

  async function setStatus(r: InquiryRow, status: InquiryRow["status"]) {
    const { error } = await db.from("inquiries").update({ status }).eq("id", r.id);
    if (error) return notify(error.message, "error");
    await load();
  }

  async function remove(r: InquiryRow) {
    if (!window.confirm(`Delete the booking from ${r.name}? This can't be undone.`)) return;
    const { error } = await db.from("inquiries").delete().eq("id", r.id);
    if (error) return notify(error.message, "error");
    await load();
  }

  const shown = rows?.filter((r) => r.status === tab) ?? [];

  return (
    <div className="max-w-4xl">
      <PageTitle kicker="from your contact page" title="Bookings" />
      <div role="tablist" className="mb-6 flex gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full px-4 py-1.5 text-sm transition ${tab === t.id ? "bg-pink font-semibold text-night" : "bg-chalk/10 text-chalk hover:bg-chalk/20"}`}
          >
            {t.label} {counts[t.id] ? `(${counts[t.id]})` : ""}
          </button>
        ))}
      </div>
      {rows === null ? (
        <p className="font-hand text-2xl text-chalk/60">loading…</p>
      ) : shown.length === 0 ? (
        <Empty>{tab === "new" ? "No new bookings right now." : `Nothing in ${tab}.`}</Empty>
      ) : (
        <ul className="space-y-4">
          {shown.map((r) => {
            const subject = encodeURIComponent(`Re: your ${r.project_type ?? "voice-over"} project`);
            const body = encodeURIComponent(`Hi ${r.name.split(" ")[0]},\n\nThank you for reaching out!\n\n\n---\nYou wrote:\n${r.message}`);
            return (
              <li key={r.id} className="paper-ink rounded-sm bg-paper p-5 text-ink shadow-lg paper-grain sm:p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="font-hand text-3xl leading-tight">{r.name}</h2>
                  <span className="text-xs text-pencil">{when(r.created_at)}</span>
                </div>
                <a href={`mailto:${r.email}`} className="text-sm text-pink underline underline-offset-2">
                  {r.email}
                </a>
                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                  {[
                    ["Project", r.project_type],
                    ["Script length", r.script_length],
                    ["Deadline", r.deadline ? new Date(`${r.deadline}T00:00`).toLocaleDateString("en-PH", { dateStyle: "medium" }) : null],
                  ].map(([k, v]) => (
                    <div key={k} className="rounded-md bg-cream px-3 py-2">
                      <dt className="text-xs font-semibold tracking-wider text-ink-soft uppercase">{k}</dt>
                      <dd>{v || "—"}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-4 text-sm leading-relaxed whitespace-pre-wrap">{r.message}</p>
                <div className="mt-5 flex flex-wrap gap-2 border-t border-ink/10 pt-4">
                  <a
                    href={`mailto:${r.email}?subject=${subject}&body=${body}`}
                    onClick={() => r.status === "new" && setStatus(r, "replied")}
                    className="inline-flex items-center rounded-md bg-pink px-4 py-2 text-sm font-semibold text-night hover:bg-ink hover:text-paper"
                  >
                    Reply by email
                  </a>
                  {r.status !== "replied" && (
                    <Button tone="ghost" onClick={() => setStatus(r, "replied")}>
                      Mark replied
                    </Button>
                  )}
                  {r.status !== "archived" ? (
                    <Button tone="ghost" onClick={() => setStatus(r, "archived")}>
                      Archive
                    </Button>
                  ) : (
                    <Button tone="ghost" onClick={() => setStatus(r, "new")}>
                      Move back to new
                    </Button>
                  )}
                  <Button tone="danger" className="ml-auto" onClick={() => remove(r)}>
                    Delete
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
