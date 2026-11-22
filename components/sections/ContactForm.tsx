"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

const field =
  "w-full border-b-2 border-ink/60 bg-transparent px-1 pt-1 pb-0.5 font-note text-2xl leading-8 placeholder:text-pencil focus:border-pink focus:outline-none";
const label = "block font-type text-xs font-bold tracking-widest uppercase";

/**
 * Booking form. For now it opens the visitor's email app with everything filled in.
 * Once Supabase is set up, it will save inquiries to Loveline's dashboard instead.
 */
export function ContactForm({ email, services }: { email: string; services: string[] }) {
  const params = useSearchParams();
  const [sent, setSent] = useState(false);

  return (
    <form
      className="space-y-7"
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        const get = (k: string) => String(f.get(k) ?? "").trim();
        const subject = `Voice-over booking: ${get("type") || "new project"}${get("name") ? ` from ${get("name")}` : ""}`;
        const body = [
          `Name: ${get("name")}`,
          `Email: ${get("email")}`,
          `Project type: ${get("type")}`,
          `Script length: ${get("length") || "-"}`,
          `Deadline: ${get("deadline") || "-"}`,
          "",
          get("message"),
        ].join("\n");
        window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        setSent(true);
      }}
    >
      <div className="grid gap-7 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={label}>Your name</label>
          <input id="name" name="name" required autoComplete="name" className={field} placeholder="Juan dela Cruz" />
        </div>
        <div>
          <label htmlFor="email" className={label}>Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            defaultValue={params.get("email") ?? ""}
            className={field}
            placeholder="you@studio.com"
          />
        </div>
      </div>
      <div>
        <label htmlFor="type" className={label}>What are we recording?</label>
        <select id="type" name="type" className={`${field} cursor-pointer`} defaultValue={services[0]}>
          {services.map((s) => (
            <option key={s}>{s}</option>
          ))}
          <option>Something else</option>
        </select>
      </div>
      <div className="grid gap-7 sm:grid-cols-2">
        <div>
          <label htmlFor="length" className={label}>Script length</label>
          <input id="length" name="length" className={field} placeholder="e.g. 30s or 120 words" />
        </div>
        <div>
          <label htmlFor="deadline" className={label}>Deadline</label>
          <input id="deadline" name="deadline" type="date" className={field} />
        </div>
      </div>
      <div>
        <label htmlFor="message" className={label}>Tell me about it</label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className={`${field} resize-y`}
          placeholder="Brand, tone, where it'll be used, and a link to the script if you have one."
        />
      </div>
      <div className="flex flex-wrap items-center gap-5">
        <button
          type="submit"
          className="-rotate-1 bg-ink px-6 py-3 font-type text-sm font-bold tracking-widest text-paper uppercase shadow-md transition hover:rotate-0 hover:bg-pink"
        >
          Send it over
        </button>
        {sent && (
          <p role="status" className="font-note text-2xl text-pink">
            Your email app should open now. If it doesn&apos;t, write to {email}.
          </p>
        )}
      </div>
    </form>
  );
}
