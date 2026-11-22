"use client";

import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

export function PageTitle({ kicker, title, children }: { kicker?: string; title: string; children?: ReactNode }) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {kicker && <p className="font-note text-2xl text-pink">{kicker}</p>}
        <h1 className="font-hand text-4xl leading-tight text-chalk sm:text-5xl">{title}</h1>
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </header>
  );
}

/** A sheet of paper to hold a form. */
export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`paper-ink rounded-sm bg-paper p-5 text-ink shadow-lg paper-grain sm:p-6 ${className}`}>{children}</section>;
}

export function Field({ label, hint, children, className = "" }: { label: string; hint?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-semibold tracking-wider text-ink-soft uppercase">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-pencil">{hint}</span>}
    </label>
  );
}

const control =
  "w-full rounded-md border border-ink/20 bg-white/80 px-3 py-2 text-base text-ink shadow-inner placeholder:text-pencil focus:border-pink focus:outline-none sm:text-sm";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${control} ${props.className ?? ""}`} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea rows={3} {...props} className={`${control} resize-y leading-relaxed ${props.className ?? ""}`} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${control} cursor-pointer ${props.className ?? ""}`} />;
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2.5 text-sm select-none">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? "bg-pink" : "bg-ink/25"}`}
      >
        <span className={`absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition ${checked ? "translate-x-5" : ""}`} />
      </button>
      {label}
    </label>
  );
}

type Tone = "ink" | "pink" | "ghost" | "danger";
const tones: Record<Tone, string> = {
  ink: "bg-ink text-paper hover:bg-pink hover:text-night",
  pink: "bg-pink text-night hover:bg-chalk",
  ghost: "border border-current bg-transparent hover:bg-ink/10",
  danger: "border border-pink text-pink hover:bg-pink hover:text-night",
};

export function Button({
  tone = "ink",
  busy,
  children,
  className = "",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: Tone; busy?: boolean }) {
  return (
    <button
      type="button"
      {...rest}
      disabled={busy || rest.disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold whitespace-nowrap transition disabled:cursor-not-allowed disabled:opacity-50 ${tones[tone]} ${className}`}
    >
      {busy && <span className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />}
      {children}
    </button>
  );
}

/** Edits a list of short lines, one per row. */
export function LinesField({ label, value, onChange, placeholder, hint }: { label: string; value: string[]; onChange: (v: string[]) => void; placeholder?: string; hint?: string }) {
  return (
    <div>
      <span className="mb-1.5 block text-xs font-semibold tracking-wider text-ink-soft uppercase">{label}</span>
      <ul className="space-y-2">
        {value.map((line, i) => (
          <li key={i} className="flex gap-2">
            <Input
              value={line}
              placeholder={placeholder}
              onChange={(e) => onChange(value.map((l, j) => (j === i ? e.target.value : l)))}
              aria-label={`${label} ${i + 1}`}
            />
            <button
              type="button"
              onClick={() => onChange(value.filter((_, j) => j !== i))}
              className="shrink-0 rounded-md px-2 text-pencil hover:bg-blush hover:text-ink"
              aria-label={`Remove ${label.toLowerCase()} ${i + 1}`}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
      <button type="button" onClick={() => onChange([...value, ""])} className="mt-2 text-sm font-semibold text-pink hover:underline">
        + Add line
      </button>
      {hint && <span className="mt-1 block text-xs text-pencil">{hint}</span>}
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="rounded-sm border border-dashed border-chalk/25 p-8 text-center text-sm text-chalk/60">{children}</p>;
}

export function slugify(s: string) {
  return (
    s
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "item"
  );
}
