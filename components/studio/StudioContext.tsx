"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import type { Session, SupabaseClient } from "@supabase/supabase-js";
import { refreshSite } from "@/app/studio/actions";

type Toast = { id: number; text: string; tone: "ok" | "error" };

type Studio = {
  db: SupabaseClient;
  session: Session;
  /** Show a short message in the corner. */
  notify: (text: string, tone?: Toast["tone"]) => void;
  /** Tell the public site to show the latest content. */
  publish: () => Promise<void>;
};

const Ctx = createContext<Studio | null>(null);

export function useStudio() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStudio must be used inside the Studio");
  return s;
}

export function StudioProvider({ db, session, children }: { db: SupabaseClient; session: Session; children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const next = useRef(0);

  const notify = useCallback((text: string, tone: Toast["tone"] = "ok") => {
    const id = ++next.current;
    setToasts((t) => [...t, { id, text, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), tone === "error" ? 7000 : 3500);
  }, []);

  const publish = useCallback(async () => {
    const { data } = await db.auth.getSession();
    const token = data.session?.access_token;
    if (!token) return notify("Your sign-in expired. Please sign in again.", "error");
    const res = await refreshSite(token);
    if (res.ok) notify("Saved. Your site is updated.");
    else notify(`Saved, but the site didn't refresh: ${res.error ?? "unknown error"}`, "error");
  }, [db, notify]);

  return (
    <Ctx value={{ db, session, notify, publish }}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed right-4 bottom-4 z-50 flex flex-col items-end gap-2">
        {toasts.map((t) => (
          <p
            key={t.id}
            className={`paper-ink max-w-sm animate-pop px-4 py-3 font-ui text-sm shadow-xl ${
              t.tone === "error" ? "bg-blush text-ink" : "bg-butter text-ink"
            } -rotate-1`}
          >
            {t.text}
          </p>
        ))}
      </div>
    </Ctx>
  );
}
