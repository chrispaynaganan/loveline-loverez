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
| `/contact` | Booking form (opens the visitor's email app for now)              |

## Editing content (before the CMS)

All content lives in **`content/data.ts`**. Pages only read it through `lib/content.ts`.

- **Add an audio demo:** put the `.mp3` in `public/audio/`, then set its
  `source: { kind: "file", url: "/audio/commercial.mp3" }`.
  A Google Drive file also works: `source: { kind: "drive", id: "FILE_ID" }` (opens in a pop-up).
- **Add a video reel:** add an entry to `videoReels` with a poster image in `public/images/`.
  Use `orientation: "portrait"` for TikTok / Reels / Shorts — they get their own "Short reels" row.
- **Rates:** fill in `pricePhp` / `priceUsd`. Leaving them `null` shows "quote on request".

## Scrapbook kit (`components/scrap/`)

`TornPaper` (torn edges, any paper colour, lined or graph paper), `Tape`, `Polaroid`, `Label`,
`HandHeading`, `HandRule`, `Reveal` (starts the animations on scroll) and `Doodles`
(arrows, flower, sparkle, mic, headphones, waves, heart, stamp, smiley sticker).
Doodles draw themselves in when their section scrolls into view, and stay still for
people who prefer reduced motion.

## Next: CMS with Supabase

The site is ready for it: each type in `content/types.ts` becomes a table, and each function
in `lib/content.ts` becomes a Supabase query. Planned for the dashboard:
demo reels (upload audio), video reels (upload video + poster), rate card, profile/about,
testimonials, and booking inquiries from the contact form.
