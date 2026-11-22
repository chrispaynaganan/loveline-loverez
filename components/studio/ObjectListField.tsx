"use client";

import { Input, Textarea, Toggle } from "./ui";

type Sub<T> = { key: keyof T & string; label: string; type?: "text" | "textarea" | "toggle"; placeholder?: string; wide?: boolean };

/** A small repeating group, like stats (number + label) or social links. */
export function ObjectListField<T extends Record<string, unknown>>({
  label,
  hint,
  items,
  fields,
  onChange,
  newItem,
  addLabel = "Add",
}: {
  label: string;
  hint?: string;
  items: T[];
  fields: Sub<T>[];
  onChange: (items: T[]) => void;
  newItem: () => T;
  addLabel?: string;
}) {
  const set = (i: number, patch: Partial<T>) => onChange(items.map((it, j) => (j === i ? { ...it, ...patch } : it)));
  const move = (i: number, d: -1 | 1) => {
    const next = [...items];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    onChange(next);
  };
  return (
    <fieldset>
      <legend className="mb-1.5 block text-xs font-semibold tracking-wider text-ink-soft uppercase">{label}</legend>
      {hint && <p className="mb-2 text-xs text-pencil">{hint}</p>}
      <ul className="space-y-3">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2 rounded-md border border-ink/10 bg-white/40 p-3">
            <div className="grid flex-1 gap-2 sm:grid-cols-2">
              {fields.map((f) => {
                const v = it[f.key];
                const aria = `${label} ${i + 1}: ${f.label}`;
                if (f.type === "toggle")
                  return (
                    <div key={f.key} className="flex items-center">
                      <Toggle checked={Boolean(v)} onChange={(b) => set(i, { [f.key]: b } as Partial<T>)} label={f.label} />
                    </div>
                  );
                if (f.type === "textarea")
                  return (
                    <Textarea
                      key={f.key}
                      rows={2}
                      value={String(v ?? "")}
                      placeholder={f.placeholder ?? f.label}
                      aria-label={aria}
                      className={f.wide ? "sm:col-span-2" : ""}
                      onChange={(e) => set(i, { [f.key]: e.target.value } as Partial<T>)}
                    />
                  );
                return (
                  <Input
                    key={f.key}
                    value={String(v ?? "")}
                    placeholder={f.placeholder ?? f.label}
                    aria-label={aria}
                    className={f.wide ? "sm:col-span-2" : ""}
                    onChange={(e) => set(i, { [f.key]: e.target.value } as Partial<T>)}
                  />
                );
              })}
            </div>
            <div className="flex shrink-0 flex-col text-pencil">
              <button type="button" disabled={i === 0} onClick={() => move(i, -1)} className="rounded px-1.5 hover:bg-butter disabled:opacity-25" aria-label={`Move ${label} ${i + 1} up`}>
                ▲
              </button>
              <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} className="rounded px-1.5 hover:bg-blush" aria-label={`Remove ${label} ${i + 1}`}>
                ✕
              </button>
              <button type="button" disabled={i === items.length - 1} onClick={() => move(i, 1)} className="rounded px-1.5 hover:bg-butter disabled:opacity-25" aria-label={`Move ${label} ${i + 1} down`}>
                ▼
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button type="button" onClick={() => onChange([...items, newItem()])} className="mt-2 text-sm font-semibold text-pink hover:underline">
        + {addLabel}
      </button>
    </fieldset>
  );
}
