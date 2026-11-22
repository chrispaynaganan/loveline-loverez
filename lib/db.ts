// Row shapes in Supabase, and how they map to what the site renders.
import type { DemoReel, MediaSource, Profile, Rate, RateCard, Testimonial, VideoReel } from "@/content/types";

export type DemoRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  blurb: string;
  duration: string | null;
  source: MediaSource;
  is_new: boolean;
  featured: boolean;
  paper: DemoReel["paper"];
  sort: number;
  published: boolean;
};

export type ReelRow = {
  id: string;
  slug: string;
  title: string;
  client: string;
  label: string;
  blurb: string;
  duration: string | null;
  poster: string;
  orientation: VideoReel["orientation"];
  source: MediaSource;
  sort: number;
  published: boolean;
};

export type RateRow = {
  id: string;
  grp: string;
  service: string;
  unit: string;
  price_php: number | null;
  price_usd: number | null;
  note: string | null;
  sort: number;
};

export type TestimonialRow = {
  id: string;
  quote: string;
  highlights: string[];
  role: string;
  company: string;
  sort: number;
  published: boolean;
};

export type InquiryRow = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  project_type: string | null;
  script_length: string | null;
  deadline: string | null;
  message: string;
  status: "new" | "replied" | "archived";
};

export type RateCardNotes = Omit<RateCard, "rates">;
export type { Profile };

export const toDemo = (r: DemoRow): DemoReel => ({
  slug: r.slug,
  title: r.title,
  category: r.category,
  blurb: r.blurb,
  duration: r.duration ?? undefined,
  source: r.source ?? { kind: "none" },
  isNew: r.is_new,
  featured: r.featured,
  paper: r.paper,
  order: r.sort,
});

export const toReel = (r: ReelRow): VideoReel => ({
  slug: r.slug,
  title: r.title,
  client: r.client,
  label: r.label,
  blurb: r.blurb,
  duration: r.duration ?? undefined,
  poster: r.poster,
  orientation: r.orientation,
  source: r.source ?? { kind: "none" },
  order: r.sort,
});

export const toRate = (r: RateRow): Rate => ({
  id: r.id,
  group: r.grp,
  service: r.service,
  unit: r.unit,
  pricePhp: r.price_php === null ? null : Number(r.price_php),
  priceUsd: r.price_usd === null ? null : Number(r.price_usd),
  note: r.note ?? undefined,
  order: r.sort,
});

export const toTestimonial = (r: TestimonialRow): Testimonial => ({
  id: r.id,
  quote: r.quote,
  highlights: r.highlights ?? [],
  role: r.role,
  company: r.company,
});
