import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import * as fallback from "@/content/data";
import type { Profile } from "@/content/types";
import { publicClient } from "./supabase";
import { toDemo, toRate, toReel, toTestimonial, type DemoRow, type RateCardNotes, type RateRow, type ReelRow, type TestimonialRow } from "./db";

// The public pages only read content through these functions.
// They come from Loveline's Supabase project and are cached until she saves
// something in the Studio (which refreshes the "content" tag). If Supabase
// isn't set up yet, or can't be reached, the site falls back to content/data.ts.

export const CONTENT_TAG = "content";

async function load<T>(read: () => Promise<T | null>, backup: T): Promise<T> {
  try {
    return (await read()) ?? backup;
  } catch (e) {
    console.error("[content] Supabase read failed, using built-in content:", e);
    return backup;
  }
}

async function setting<T>(key: string): Promise<T | null> {
  const db = publicClient();
  if (!db) return null;
  const { data, error } = await db.from("site_settings").select("value").eq("key", key).maybeSingle();
  if (error) throw error;
  return (data?.value as T) ?? null;
}

async function list<T>(table: string): Promise<T[] | null> {
  const db = publicClient();
  if (!db) return null;
  const { data, error } = await db.from(table).select("*").order("sort").order("created_at");
  if (error) throw error;
  return data as T[];
}

export async function getProfile(): Promise<Profile> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("days");
  const p = await load(() => setting<Partial<Profile>>("profile"), fallback.profile);
  return { ...fallback.profile, ...p };
}

export async function getDemoReels() {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("days");
  return load(async () => (await list<DemoRow>("demo_reels"))?.filter((r) => r.published).map(toDemo) ?? null, fallback.demoReels);
}

export async function getVideoReels() {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("days");
  return load(async () => (await list<ReelRow>("video_reels"))?.filter((r) => r.published).map(toReel) ?? null, fallback.videoReels);
}

export async function getRateCard() {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("days");
  const notes = await load(() => setting<RateCardNotes>("rate_card"), null);
  const rates = await load(async () => (await list<RateRow>("rates"))?.map(toRate) ?? null, fallback.rateCard.rates);
  const { rates: _unused, ...fallbackNotes } = fallback.rateCard;
  void _unused;
  return { ...fallbackNotes, ...notes, rates };
}

export async function getTestimonials() {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("days");
  return load(
    async () => (await list<TestimonialRow>("testimonials"))?.filter((r) => r.published).map(toTestimonial) ?? null,
    fallback.testimonials,
  );
}
