"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useStudio } from "./StudioContext";
import { removeUnused } from "./media";
import { Button, Empty } from "./ui";

type Row = { id: string; sort: number; published?: boolean };

const isNew = (id: string) => id.startsWith("new-");

/**
 * Lists the rows of one table as cards. Each card opens into a form;
 * Loveline can add, edit, reorder, hide and delete. Saving refreshes the site.
 */
export function ListEditor<R extends Row>({
  table,
  title,
  subtitle,
  blank,
  form,
  prepare,
  addLabel,
  empty,
  validate,
}: {
  table: string;
  title: (r: R) => string;
  subtitle?: (r: R) => ReactNode;
  blank: () => Omit<R, "id" | "sort">;
  form: (draft: R, set: (patch: Partial<R>) => void) => ReactNode;
  /** Last touches before saving, e.g. making a slug. */
  prepare?: (draft: R, all: R[]) => R;
  /** Return a message to stop the save. */
  validate?: (draft: R) => string | null;
  addLabel: string;
  empty: string;
}) {
  const { db, notify, publish } = useStudio();
  const [rows, setRows] = useState<R[] | null>(null);
  const [drafts, setDrafts] = useState<Record<string, R>>({});
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await db.from(table).select("*").order("sort").order("created_at");
    if (error) notify(`Couldn't load: ${error.message}`, "error");
    setRows((data as R[]) ?? []);
  }, [db, table, notify]);

  useEffect(() => {
    void load();
  }, [load]);

  const open = (r: R) => setDrafts((d) => ({ ...d, [r.id]: structuredClone(r) }));
  const close = (id: string) =>
    setDrafts((d) => {
      const { [id]: _, ...rest } = d;
      void _;
      return rest;
    });

  function add() {
    const id = `new-${Date.now()}`;
    const sort = (rows?.reduce((m, r) => Math.max(m, r.sort), 0) ?? 0) + 1;
    const row = { ...blank(), id, sort } as R;
    setRows((r) => [...(r ?? []), row]);
    setDrafts((d) => ({ ...d, [id]: row }));
    setTimeout(() => document.getElementById(`row-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
  }

  async function save(id: string) {
    let draft = drafts[id];
    const problem = validate?.(draft);
    if (problem) return notify(problem, "error");
    if (prepare) draft = prepare(draft, rows ?? []);
    setBusy(id);
    const { id: _id, ...fields } = draft;
    void _id;
    const before = rows?.find((r) => r.id === id);
    const row = fields as Record<string, unknown>;
    const res = isNew(id)
      ? await db.from(table).insert(row).select().single()
      : await db.from(table).update(row).eq("id", id).select().single();
    setBusy(null);
    if (res.error) return notify(`Not saved: ${res.error.message}`, "error");
    const saved = res.data as R;
    if (!isNew(id)) await removeUnused(db, before, saved);
    setRows((rs) => rs?.map((r) => (r.id === id ? saved : r)) ?? null);
    close(id);
    await publish();
  }

  async function remove(r: R) {
    if (isNew(r.id)) {
      setRows((rs) => rs?.filter((x) => x.id !== r.id) ?? null);
      return close(r.id);
    }
    if (!window.confirm(`Delete “${title(r) || "this item"}”? This can't be undone.`)) return;
    setBusy(r.id);
    const { error } = await db.from(table).delete().eq("id", r.id);
    setBusy(null);
    if (error) return notify(`Not deleted: ${error.message}`, "error");
    await removeUnused(db, r, null);
    setRows((rs) => rs?.filter((x) => x.id !== r.id) ?? null);
    close(r.id);
    await publish();
  }

  async function move(index: number, dir: -1 | 1) {
    if (!rows) return;
    const a = rows[index];
    const b = rows[index + dir];
    if (!a || !b || isNew(a.id) || isNew(b.id)) return;
    // give every row a clean position so equal numbers can't get stuck
    const reordered = [...rows];
    reordered[index] = b;
    reordered[index + dir] = a;
    const withSort = reordered.map((r, i) => ({ ...r, sort: i + 1 }));
    setRows(withSort);
    setBusy(a.id);
    const results = await Promise.all(
      withSort.filter((r) => !isNew(r.id) && rows.find((x) => x.id === r.id)?.sort !== r.sort).map((r) => db.from(table).update({ sort: r.sort }).eq("id", r.id)),
    );
    setBusy(null);
    const failed = results.find((r) => r.error);
    if (failed?.error) {
      notify(`Order not saved: ${failed.error.message}`, "error");
      return load();
    }
    await publish();
  }

  async function togglePublished(r: R) {
    setBusy(r.id);
    const { error } = await db.from(table).update({ published: !r.published }).eq("id", r.id);
    setBusy(null);
    if (error) return notify(error.message, "error");
    setRows((rs) => rs?.map((x) => (x.id === r.id ? { ...x, published: !r.published } : x)) ?? null);
    await publish();
  }

  if (!rows) return <p className="font-hand text-2xl text-chalk/60">loading…</p>;

  return (
    <div>
      <div className="mb-5 flex justify-end">
        <Button tone="pink" onClick={add}>
          + {addLabel}
        </Button>
      </div>
      {rows.length === 0 && <Empty>{empty}</Empty>}
      <ol className="space-y-4">
        {rows.map((r, i) => {
          const draft = drafts[r.id];
          const dirty = draft && JSON.stringify(draft) !== JSON.stringify(r);
          const hidden = r.published === false;
          return (
            <li
              key={r.id}
              id={`row-${r.id}`}
              className={`paper-ink rounded-sm bg-paper text-ink shadow-lg transition paper-grain ${hidden ? "opacity-70" : ""}`}
            >
              <div className="flex items-center gap-3 p-4">
                <div className="flex shrink-0 flex-col">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0 || !!busy || isNew(r.id)}
                    className="rounded px-1.5 text-pencil hover:bg-butter hover:text-ink disabled:opacity-25"
                    aria-label={`Move ${title(r)} up`}
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === rows.length - 1 || !!busy || isNew(r.id)}
                    className="rounded px-1.5 text-pencil hover:bg-butter hover:text-ink disabled:opacity-25"
                    aria-label={`Move ${title(r)} down`}
                  >
                    ▼
                  </button>
                </div>
                <button type="button" onClick={() => (draft ? close(r.id) : open(r))} className="min-w-0 flex-1 text-left">
                  <span className="block truncate font-hand text-2xl leading-tight">
                    {title(draft ?? r) || <span className="text-pencil">Untitled</span>}
                  </span>
                  {subtitle && <span className="mt-0.5 block truncate text-sm text-ink-soft">{subtitle(draft ?? r)}</span>}
                </button>
                <div className="flex shrink-0 items-center gap-2">
                  {isNew(r.id) && <span className="rounded-full bg-butter px-2 py-0.5 text-xs font-semibold">Not saved yet</span>}
                  {hidden && <span className="rounded-full bg-ink/10 px-2 py-0.5 text-xs font-semibold">Hidden</span>}
                  {r.published !== undefined && !isNew(r.id) && !draft && (
                    <span className="hidden sm:block">
                      <Button tone="ghost" busy={busy === r.id} onClick={() => togglePublished(r)}>
                        {hidden ? "Show" : "Hide"}
                      </Button>
                    </span>
                  )}
                  <Button tone={draft ? "ghost" : "ink"} onClick={() => (draft ? close(r.id) : open(r))}>
                    {draft ? "Close" : "Edit"}
                  </Button>
                </div>
              </div>
              {draft && (
                <div className="border-t border-ink/10 p-4 sm:p-6">
                  <div className="space-y-5">
                    {form(draft, (patch) => setDrafts((d) => ({ ...d, [r.id]: { ...d[r.id], ...patch } })))}
                  </div>
                  <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-ink/10 pt-4">
                    <Button tone="pink" busy={busy === r.id} disabled={!dirty && !isNew(r.id)} onClick={() => save(r.id)}>
                      {isNew(r.id) ? "Add to site" : "Save changes"}
                    </Button>
                    <Button tone="ghost" onClick={() => (isNew(r.id) ? remove(r) : close(r.id))}>
                      Cancel
                    </Button>
                    {r.published !== undefined && !isNew(r.id) && (
                      <span className="sm:hidden">
                        <Button tone="ghost" busy={busy === r.id} onClick={() => togglePublished(r)}>
                          {hidden ? "Show on site" : "Hide from site"}
                        </Button>
                      </span>
                    )}
                    {!isNew(r.id) && (
                      <Button tone="danger" className="ml-auto" busy={busy === r.id} onClick={() => remove(r)}>
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
