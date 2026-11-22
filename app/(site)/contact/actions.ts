"use server";

import { publicClient } from "@/lib/supabase";
import { sendBookingAlert, type Booking } from "@/lib/email";

const clip = (v: FormDataEntryValue | null, max: number) => String(v ?? "").trim().slice(0, max);

/**
 * Saves a booking to the Studio inbox, then emails Loveline.
 * If saving fails, the form falls back to opening the visitor's email app.
 */
export async function submitBooking(form: FormData): Promise<{ ok: boolean; error?: string }> {
  // bots fill in every field, including the hidden one
  if (clip(form.get("website"), 200)) return { ok: true };

  const booking: Booking = {
    name: clip(form.get("name"), 200),
    email: clip(form.get("email"), 320),
    project_type: clip(form.get("type"), 200) || null,
    script_length: clip(form.get("length"), 200) || null,
    deadline: /^\d{4}-\d{2}-\d{2}$/.test(clip(form.get("deadline"), 10)) ? clip(form.get("deadline"), 10) : null,
    message: clip(form.get("message"), 5000),
  };
  if (!booking.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(booking.email) || !booking.message)
    return { ok: false, error: "Please fill in your name, a valid email and a message." };

  const db = publicClient();
  if (!db) return { ok: false, error: "not configured" };
  const { error } = await db.from("inquiries").insert(booking);
  if (error) {
    console.error("[booking] not saved:", error.message);
    return { ok: false, error: "not saved" };
  }

  const mailError = await sendBookingAlert(booking).catch((e: unknown) => String(e));
  if (mailError) console.error("[booking] saved, but the email alert failed:", mailError);
  return { ok: true };
}
