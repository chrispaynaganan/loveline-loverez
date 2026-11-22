// Shapes of everything Loveline will edit from her CMS dashboard later.
// Each type maps to one Supabase table (see supabase/schema.sql).

/** Where a piece of audio or video lives. */
export type MediaSource =
  | { kind: "file"; url: string } // an uploaded file (Supabase Storage, or /public for now)
  | { kind: "drive"; id: string } // a Google Drive file, played in Drive's own player
  | { kind: "youtube"; id: string }
  | { kind: "none" }; // not uploaded yet

export type DemoReel = {
  slug: string;
  title: string;
  category: string; // e.g. "Commercial", "Narration"
  blurb: string;
  duration?: string; // "1:02"
  source: MediaSource;
  isNew?: boolean;
  featured?: boolean;
  /** Paper colour of the card in the scrapbook. */
  paper: "kraft" | "blush" | "butter" | "sage" | "cream";
  order: number;
};

export type VideoReel = {
  slug: string;
  title: string; // "Surf Fabcon"
  client: string;
  label: string; // "Digital VO ad"
  blurb: string;
  duration?: string;
  poster: string;
  /** Portrait reels (TikTok, Reels, Shorts) or landscape spots. */
  orientation: "portrait" | "landscape";
  source: MediaSource;
  order: number;
};

export type Rate = {
  id: string;
  group: string; // "Commercial", "Narration"
  service: string; // "Online / social media ad"
  unit: string; // "per spot, up to 30s"
  /** Leave as null to show "quote on request". */
  pricePhp: number | null;
  priceUsd: number | null;
  note?: string;
  order: number;
};

export type RateCard = {
  title: string;
  updated: string; // shown as "updated Nov 2026"
  includes: string[];
  terms: string[];
  rates: Rate[];
};

export type Testimonial = {
  id: string;
  quote: string;
  highlights: string[];
  role: string;
  company: string;
};

export type Profile = {
  name: string;
  stageName: string;
  brand: string;
  tagline: string;
  intro: string;
  about: string[];
  location: string;
  email: string;
  portrait: string;
  portraitCaption: string;
  stats: { value: string; label: string }[];
  services: { title: string; body: string }[];
  socials: { label: string; url: string }[];
  today: { text: string; done: boolean }[];
};
