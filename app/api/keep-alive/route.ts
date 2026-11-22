import { connection } from "next/server";
import { publicClient } from "@/lib/supabase";

// Vercel calls this once a day (see vercel.json) so Supabase's free plan
// doesn't pause the project for being too quiet.
export async function GET(request: Request) {
  await connection();
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  const db = publicClient();
  if (!db) return Response.json({ ok: false, reason: "Supabase not configured" });
  const { error } = await db.from("site_settings").select("key").limit(1);
  return Response.json({ ok: !error, at: new Date().toISOString(), error: error?.message });
}
