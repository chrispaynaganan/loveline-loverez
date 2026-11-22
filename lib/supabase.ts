import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** True once the Supabase settings are in .env.local / Vercel. */
export const supabaseConfigured = Boolean(url && key);

/** Read-only client for the public site. Never signs in. */
export function publicClient(): SupabaseClient | null {
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

let browser: SupabaseClient | null = null;

/** Signed-in client for the Studio, kept in the browser. */
export function studioClient(): SupabaseClient {
  if (!url || !key) throw new Error("Supabase isn't set up yet: add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.");
  browser ??= createClient(url, key, { auth: { persistSession: true, storageKey: "boses-studio" } });
  return browser;
}

export const MEDIA_BUCKET = "media";
