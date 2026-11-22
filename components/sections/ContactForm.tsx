"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { submitBooking } from "@/app/(site)/contact/actions";

const field =
  "w-full border-b-2 border-ink/60 bg-transparent px-1 pt-1 pb-0.5 font-note text-2xl leading-8 placeholder:text-pencil focus:border-pink focus:outline-none";
const label = "block font-type text-xs font-bold tracking-widest uppercase";

/**
 * Booking form. Saves the inquiry to Loveline's Studio inbox. If Supabase isn't
 * set up (or can't be reached), it opens the visitor's email app instead.
 */
export function ContactForm({ email, services }: { email: string; services: string[] }) {
  const params = useSearchParams();
  const [state, setState] = useState<"idle" | "sending" | "sent" | "mailed">("idle");

  async function submit(form: HTMLFormElement) {
    const f = new FormData(form);
    const get = (k: string) => String(f.get(k) ?? "").trim();
    const inquiry = {
      name: get("name"),
      email: get("email"),
      project_type: get("type") || null,
      script_length: get("length") || null,
      deadline: get("deadline") || null,
      message: get("message"),
    };
    setState("sending");
    const res = await submitBooking(f).catch(() => ({ ok: false as const }));
    if (res.ok) {
      setState("sent");
      form.reset();
      return;
    }
    const subject = `Voice-over booking: ${inquiry.project_type || "new project"}${inquiry.name ? ` from ${inquiry.name}` : ""}`;
    const body = [
      `Name: ${inquiry.name}`,
      `Email: ${inquiry.email}`,
      `Project type: ${inquiry.project_type ?? "-"}`,
      `Script length: ${inquiry.script_length ?? "-"}`,
      `Deadline: ${inquiry.deadline ?? "-"}`,
      "",
      inquiry.message,
    ].join("\n");
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setState("mailed");
  }

  if (state === "sent")
    return (
      <div role="status" className="py-10 text-center">
        <p className="font-hand text-5xl leading-tight">Got it, salamat!</p>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed">
          Your project details are with me. I&apos;ll reply to your email with a quote and timeline, usually within a day or two.
        </p>
        <button type="button" onClick={() => setState("idle")} className="mt-6 border-b-2 border-ink font-type text-xs font-bold tracking-widest uppercase hover:border-pink hover:text-pink">
          Send another
        </button>
      </div>
    );

  return (
    <form
      className="space-y-7"
      onSubmit={(e) => {
        e.preventDefault();
        void submit(e.currentTarget);
      }}
    >
      {/* left empty by people, filled in by spam bots */}
      <div aria-hidden className="hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
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
          disabled={state === "sending"}
          className="-rotate-1 disabled:opacity-60 bg-ink px-6 py-3 font-type text-sm font-bold tracking-widest text-paper uppercase shadow-md transition hover:rotate-0 hover:bg-pink"
        >
          {state === "sending" ? "Sending…" : "Send it over"}
        </button>
        {state === "mailed" && (
          <p role="status" className="font-note text-2xl text-pink">
            Your email app should open now. If it doesn&apos;t, write to {email}.
          </p>
        )}
      </div>
    </form>
  );
}
