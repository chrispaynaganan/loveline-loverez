"use server";

import { updateTag } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { CONTENT_TAG } from "@/lib/content";

/**
 * Called by the Studio after Loveline saves. Checks that the caller really is
 * an editor, then tells the public site to show the new content.
 */
export async function refreshSite(accessToken: string): Promise<{ ok: boolean; error?: string }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return { ok: false, error: "Supabase isn't set up." };

  const db = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
  const { data, error } = await db.rpc("is_editor");
  if (error || data !== true) return { ok: false, error: "Not allowed." };

  updateTag(CONTENT_TAG);
  return { ok: true };
}
