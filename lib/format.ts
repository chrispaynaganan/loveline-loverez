import type { Rate } from "@/content/types";

const php = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 });
const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

/** "₱2,500 · $45", or null when the rate is quoted per project. */
export function formatRate(rate: Rate) {
  const parts = [
    rate.pricePhp != null ? php.format(rate.pricePhp) : null,
    rate.priceUsd != null ? usd.format(rate.priceUsd) : null,
  ].filter(Boolean);
  return parts.length ? parts.join(" · ") : null;
}
