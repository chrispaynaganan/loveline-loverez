# Boses Filipina — Loveline Loverez, voice-over artist

Scrapbook-style portfolio for Loveline: audio demo reels, video reels, rate card, about and booking.
Next.js 16 (App Router) + Tailwind CSS v4, deployable on Vercel as is.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Pages

| Route      | What's on it                                                      |
| ---------- | ----------------------------------------------------------------- |
| `/`        | Hero, featured demo tapes, services, film strip of reels, booking note, rate card preview, testimonials |
| `/demos`   | Every audio demo as a cassette card with its own player           |
| `/reels`   | Video reels in film frames; landscape spots and portrait shorts   |
| `/rates`   | Full voice rate card, what's included, the small print            |
| `/about`   | Letter from Loveline, services, testimonials, socials             |
| `/contact` | Booking form (saves to the Studio's Bookings inbox)               |
| `/studio`  | Loveline's content dashboard (see below)                          |

## Editing content: the Studio

Loveline edits everything at **`/studio`** (sign in with email and password):

| Studio page      | What it changes                                                         |
| ---------------- | ----------------------------------------------------------------------- |
| Demo reels       | Cassette demos: upload an MP3 (length fills in), or paste a Drive link  |
| Video reels      | Ads and short reels: upload a video (shape, length and cover fill in), or paste a Drive / YouTube link |
| Rate card        | Services and prices (empty price = "quote on request"), includes, small print |
| About & profile  | Headline, intro, photo, numbers, checklist, About letter, services, links |
| Kind words       | Testimonials                                                            |
| Bookings         | Inquiries from the Contact page: reply, mark replied, archive           |

New bookings are saved to the Studio and emailed to Loveline through Resend (`lib/email.ts`, from `bookings@lovelineloverez.com`; replying answers the client). If the email fails, the booking is still saved.

Saving refreshes the public site straight away. Uploads go to Supabase Storage (50 MB per file on the free plan).

### How it fits together

- `lib/content.ts` reads Supabase with `"use cache"` + `cacheTag("content")`; the Studio's
  `refreshSite` server action (`app/studio/actions.ts`) checks the editor and calls `updateTag("content")`.
- If Supabase isn't configured or can't be reached, the site falls back to `content/data.ts`.
- Security lives in Supabase (row level security): anyone can read published content and send a booking;
  only emails in the `editors` table can change content, upload files or read bookings.
- `vercel.json` runs `/api/keep-alive` daily so the free Supabase project isn't paused for inactivity.

### Setting up Supabase (once)

1. **SQL Editor:** run `supabase/0001_cms.sql`, then `supabase/0002_seed.sql` (both are safe to re-run).
   Projects set up with the earlier `0001_cms.sql` also need `supabase/0003_grants.sql` once.
   The seed is generated from `content/data.ts` with `npm run seed`.
2. **Editors:** the seed allows `lovelinesvo@gmail.com` and `mark.payns@gmail.com`. To change:
   `insert into editors (email) values ('new@email.com');` / `delete from editors where email = '...';`
3. **Authentication → Users → Add user** for each editor (tick *Auto confirm*).
4. **Authentication → Sign In / Providers → Email:** turn off *Allow new users to sign up*.
5. **Authentication → URL Configuration:** Site URL `https://www.lovelineloverez.com`; redirect URLs
   `https://www.lovelineloverez.com/studio` and `http://localhost:3000/studio` (for password resets).
6. Copy `.env.example` to `.env.local` and fill in the URL, publishable key and `RESEND_API_KEY`; add the same
   to Vercel → Settings → Environment Variables, then redeploy.
7. **Resend:** verify `lovelineloverez.com` in Loveline's Resend account (Domains) by adding its DNS records in GoDaddy.

## Scrapbook kit (`components/scrap/`)

`TornPaper` (torn edges, any paper colour, lined or graph paper), `Tape`, `Polaroid`, `Label`,
`HandHeading`, `HandRule`, `Reveal` (starts the animations on scroll) and `Doodles`
(arrows, flower, sparkle, mic, headphones, waves, heart, stamp, smiley sticker).
Doodles draw themselves in when their section scrolls into view, and stay still for
people who prefer reduced motion.

