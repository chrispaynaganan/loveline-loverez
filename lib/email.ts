import "server-only";

// Booking alerts through Loveline's Resend account.
// Needs RESEND_API_KEY. BOOKINGS_EMAIL and BOOKINGS_FROM are optional.

export type Booking = {
  name: string;
  email: string;
  project_type: string | null;
  script_length: string | null;
  deadline: string | null;
  message: string;
};

const day = (iso: string | null) =>
  iso ? new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : null;

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function html(b: Booking) {
  const row = (label: string, value: string | null) =>
    `<tr><td style="padding:6px 12px 6px 0;color:#8d8379;font:12px/1.4 Arial,sans-serif;text-transform:uppercase;letter-spacing:.08em;vertical-align:top">${label}</td><td style="padding:6px 0;font:15px/1.4 Arial,sans-serif;color:#26211e">${value ? esc(value) : "—"}</td></tr>`;
  return `<!doctype html><html><body style="margin:0;background:#1c1917;padding:24px">
<div style="max-width:560px;margin:0 auto;background:#faf6ee;padding:28px;border-radius:4px">
  <p style="margin:0;color:#ef5f97;font:16px Georgia,serif;font-style:italic">New booking from your site</p>
  <h1 style="margin:4px 0 16px;font:bold 26px/1.2 Georgia,serif;color:#26211e">${esc(b.name)}</h1>
  <table style="border-collapse:collapse;margin-bottom:16px">
    ${row("Email", b.email)}${row("Project", b.project_type)}${row("Script length", b.script_length)}${row("Deadline", day(b.deadline))}
  </table>
  <div style="background:#fff;border-left:3px solid #ef5f97;padding:14px 16px;font:15px/1.6 Arial,sans-serif;color:#26211e;white-space:pre-wrap">${esc(b.message)}</div>
  <p style="margin:20px 0 0;font:13px/1.5 Arial,sans-serif;color:#5a514b">Hit <b>Reply</b> to answer ${esc(b.name.split(" ")[0])} directly. It's also in your Studio under Bookings.</p>
</div></body></html>`;
}

function text(b: Booking) {
  return [
    `New booking from ${b.name}`,
    `Email: ${b.email}`,
    `Project: ${b.project_type ?? "-"}`,
    `Script length: ${b.script_length ?? "-"}`,
    `Deadline: ${day(b.deadline) ?? "-"}`,
    "",
    b.message,
    "",
    "Reply to this email to answer them directly. It's also in your Studio under Bookings.",
  ].join("\n");
}

/** Emails Loveline about a new booking. Returns an error message instead of throwing. */
export async function sendBookingAlert(b: Booking): Promise<string | null> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return "RESEND_API_KEY is not set";
  const res = await fetch(process.env.RESEND_API_URL ?? "https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.BOOKINGS_FROM ?? "Boses Filipina <bookings@lovelineloverez.com>",
      to: (process.env.BOOKINGS_EMAIL ?? "lovelinesvo@gmail.com").split(",").map((s) => s.trim()),
      reply_to: b.email,
      subject: `New booking: ${b.project_type ?? "voice-over"} from ${b.name}`,
      html: html(b),
      text: text(b),
    }),
  });
  if (res.ok) return null;
  return `Resend ${res.status}: ${await res.text()}`;
}
