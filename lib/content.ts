import { demoReels, profile, rateCard, testimonials, videoReels } from "@/content/data";

// The pages only ever read content through these functions.
// When Loveline's Supabase project is ready, swap each body for a Supabase query
// and nothing else on the site has to change.

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;

export async function getProfile() {
  return profile;
}

export async function getDemoReels() {
  return [...demoReels].sort(byOrder);
}

export async function getVideoReels() {
  return [...videoReels].sort(byOrder);
}

export async function getRateCard() {
  return { ...rateCard, rates: [...rateCard.rates].sort(byOrder) };
}

export async function getTestimonials() {
  return testimonials;
}
