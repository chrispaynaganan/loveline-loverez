"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useStudio } from "./StudioContext";
import { removeUnused } from "./media";
import { Button, Panel } from "./ui";

/** Edits one of the single-value settings (the profile, the rate card's notes). */
export function SettingsEditor<T extends object>({
  settingKey,
  fallback,
  children,
  saveLabel = "Save changes",
}: {
  settingKey: string;
  fallback: T;
  children: (value: T, set: (patch: Partial<T>) => void) => ReactNode;
  saveLabel?: string;
}) {
  const { db, notify, publish } = useStudio();
  const [saved, setSaved] = useState<T | null>(null);
  const [draft, setDraft] = useState<T | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    db.from("site_settings")
      .select("value")
      .eq("key", settingKey)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) notify(`Couldn't load: ${error.message}`, "error");
        const v = { ...fallback, ...((data?.value as T) ?? {}) };
        setSaved(v);
        setDraft(structuredClone(v));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, settingKey]);

  if (!draft || !saved) return <p className="font-hand text-2xl text-chalk/60">loading…</p>;
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);

  async function save() {
    if (!draft) return;
    setBusy(true);
    const { error } = await db.from("site_settings").upsert({ key: settingKey, value: draft, updated_at: new Date().toISOString() });
    setBusy(false);
    if (error) return notify(`Not saved: ${error.message}`, "error");
    await removeUnused(db, saved, draft);
    setSaved(structuredClone(draft));
    await publish();
  }

  return (
    <Panel>
      <div className="space-y-6">{children(draft, (patch) => setDraft((d) => (d ? { ...d, ...patch } : d)))}</div>
      <div className="sticky bottom-0 -mx-5 mt-8 -mb-5 flex flex-wrap items-center gap-3 border-t border-ink/10 bg-paper px-5 py-4 sm:-mx-6 sm:-mb-6 sm:px-6">
        <Button tone="pink" busy={busy} disabled={!dirty} onClick={save}>
          {saveLabel}
        </Button>
        {dirty && (
          <Button tone="ghost" onClick={() => setDraft(structuredClone(saved))}>
            Undo changes
          </Button>
        )}
        <span className="text-xs text-pencil">{dirty ? "You have unsaved changes" : "Everything's saved"}</span>
      </div>
    </Panel>
  );
}
