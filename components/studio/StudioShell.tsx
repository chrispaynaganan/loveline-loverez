"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { studioClient, supabaseConfigured } from "@/lib/supabase";
import { StudioProvider } from "./StudioContext";
import { Button, Field, Input } from "./ui";

const nav = [
  { href: "/studio", label: "Overview", icon: "M4 11 L12 4 L20 11 V20 H14 V14 H10 V20 H4 Z" },
  { href: "/studio/demos", label: "Demo reels", icon: "M4 7 H20 V17 H4 Z M8 13 a1.5 1.5 0 1 0 0.01 0 M16 13 a1.5 1.5 0 1 0 0.01 0 M10 17 L11 15 H13 L14 17" },
  { href: "/studio/reels", label: "Video reels", icon: "M4 6 H16 V18 H4 Z M16 10 L21 7 V17 L16 14" },
  { href: "/studio/rates", label: "Rate card", icon: "M6 3 H18 V21 L15 19 L12 21 L9 19 L6 21 Z M9 8 H15 M9 12 H15 M9 16 H13" },
  { href: "/studio/profile", label: "About & profile", icon: "M12 12 a4 4 0 1 0 0.01 0 M4 21 C5 16, 19 16, 20 21" },
  { href: "/studio/kind-words", label: "Kind words", icon: "M5 6 H19 V16 H10 L6 20 V16 H5 Z" },
  { href: "/studio/inquiries", label: "Bookings", icon: "M3 6 H21 V18 H3 Z M3 6 L12 13 L21 6" },
];

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" className="size-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={d} />
    </svg>
  );
}

function Card({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-dvh place-items-center p-5 font-ui">
      <div className="paper-ink w-full max-w-sm -rotate-1 bg-paper p-8 text-ink shadow-2xl paper-grain">{children}</div>
    </div>
  );
}

function SignIn({ onRecovery }: { onRecovery: boolean }) {
  const db = studioClient();
  const [mode, setMode] = useState<"in" | "forgot" | "sent" | "new">(onRecovery ? "new" : "in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function go(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    if (mode === "in") {
      const { error } = await db.auth.signInWithPassword({ email, password });
      if (error) setError(error.message === "Invalid login credentials" ? "That email and password don't match." : error.message);
    } else if (mode === "forgot") {
      const { error } = await db.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/studio` });
      if (error) setError(error.message);
      else setMode("sent");
    } else if (mode === "new") {
      const { error } = await db.auth.updateUser({ password });
      if (error) setError(error.message);
      else window.location.replace("/studio");
    }
    setBusy(false);
  }

  return (
    <Card>
      <p className="font-note text-2xl text-pink">Boses Filipina</p>
      <h1 className="font-hand text-4xl leading-tight">
        {mode === "new" ? "Pick a new password" : mode === "in" ? "Studio sign in" : "Reset your password"}
      </h1>
      {mode === "sent" ? (
        <p className="mt-4 text-sm leading-relaxed">Check your email for a link to set a new password. It opens back here.</p>
      ) : (
        <form onSubmit={go} className="mt-6 space-y-4">
          {mode !== "new" && (
            <Field label="Email">
              <Input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Field>
          )}
          {mode !== "forgot" && (
            <Field label={mode === "new" ? "New password" : "Password"}>
              <Input
                type="password"
                required
                minLength={mode === "new" ? 8 : undefined}
                autoComplete={mode === "new" ? "new-password" : "current-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>
          )}
          {error && <p className="text-sm text-pink">{error}</p>}
          <Button type="submit" busy={busy} className="w-full">
            {mode === "in" ? "Sign in" : mode === "forgot" ? "Email me a reset link" : "Save password"}
          </Button>
        </form>
      )}
      {mode !== "new" && (
        <button
          type="button"
          onClick={() => {
            setMode(mode === "in" ? "forgot" : "in");
            setError("");
          }}
          className="mt-4 text-sm text-ink-soft underline underline-offset-4 hover:text-pink"
        >
          {mode === "in" ? "Forgot your password?" : "Back to sign in"}
        </button>
      )}
    </Card>
  );
}

export function StudioShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [editor, setEditor] = useState<boolean | undefined>(undefined);
  const [recovery, setRecovery] = useState(false);
  const [menuOn, setMenuOn] = useState<string | null>(null);
  const menu = menuOn === path;

  useEffect(() => {
    if (!supabaseConfigured) return;
    const db = studioClient();
    db.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = db.auth.onAuthStateChange((event, s) => {
      if (event === "PASSWORD_RECOVERY") setRecovery(true);
      setSession(s);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    studioClient()
      .rpc("is_editor")
      .then(({ data }) => setEditor(data === true));
  }, [session]);


  if (!supabaseConfigured)
    return (
      <Card>
        <h1 className="font-hand text-3xl">Studio isn&apos;t connected yet</h1>
        <p className="mt-3 text-sm leading-relaxed">
          Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> to the site&apos;s
          environment settings, then reload.
        </p>
      </Card>
    );

  if (session === undefined) return <div className="grid min-h-dvh place-items-center font-hand text-2xl text-chalk">opening the studio…</div>;
  if (!session || recovery) return <SignIn key={recovery ? "recovery" : "sign-in"} onRecovery={recovery} />;
  if (editor === false)
    return (
      <Card>
        <h1 className="font-hand text-3xl">This account can&apos;t edit</h1>
        <p className="mt-3 text-sm leading-relaxed">
          You&apos;re signed in as {session.user.email}, which isn&apos;t on the Studio&apos;s editor list.
        </p>
        <Button className="mt-6" onClick={() => studioClient().auth.signOut()}>
          Sign out
        </Button>
      </Card>
    );

  const navList = (
    <ul className="space-y-1">
      {nav.map((n) => {
        const active = n.href === "/studio" ? path === "/studio" : path.startsWith(n.href);
        return (
          <li key={n.href}>
            <Link
              href={n.href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                active ? "bg-pink font-semibold text-night" : "text-chalk/80 hover:bg-chalk/10 hover:text-chalk"
              }`}
            >
              <Icon d={n.icon} />
              {n.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <StudioProvider db={studioClient()} session={session}>
      <div className="min-h-dvh font-ui text-chalk lg:flex">
        <aside className="sticky top-0 z-30 border-b border-chalk/10 bg-night lg:h-dvh lg:w-64 lg:shrink-0 lg:overflow-y-auto lg:border-r lg:border-b-0">
          <div className="flex items-center justify-between px-5 py-4 lg:block lg:px-6 lg:py-7">
            <Link href="/studio" className="block leading-none">
              <span className="block font-hand text-2xl text-chalk">Boses Filipina</span>
              <span className="mt-1 block text-xs tracking-widest text-pink uppercase">Studio</span>
            </Link>
            <button
              type="button"
              onClick={() => setMenuOn(menu ? null : path)}
              aria-expanded={menu}
              className="rounded-lg border border-chalk/20 px-3 py-1.5 text-sm lg:hidden"
            >
              {menu ? "Close" : "Menu"}
            </button>
          </div>
          <nav aria-label="Studio" className={`${menu ? "block" : "hidden"} px-3 pb-4 lg:block lg:px-4`}>
            {navList}
            <div className="mt-6 space-y-1 border-t border-chalk/10 pt-4">
              <Link href="/" target="_blank" className="block rounded-lg px-3 py-2 text-sm text-chalk/70 hover:bg-chalk/10 hover:text-chalk">
                View the site ↗
              </Link>
              <button
                type="button"
                onClick={() => studioClient().auth.signOut()}
                className="block w-full rounded-lg px-3 py-2 text-left text-sm text-chalk/70 hover:bg-chalk/10 hover:text-chalk"
              >
                Sign out
              </button>
              <p className="truncate px-3 pt-2 text-xs text-chalk/40">{session.user.email}</p>
            </div>
          </nav>
        </aside>
        <main className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:px-12 lg:py-12">{editor ? children : null}</main>
      </div>
    </StudioProvider>
  );
}
