const colors = {
  tan: "bg-kraft/60",
  cream: "bg-cream/80",
  pink: "bg-pink-soft/75 washi-dots",
  blush: "bg-blush/75 washi-stripes",
  sage: "bg-sage/80 washi-stripes",
  butter: "bg-butter/75",
  plaid: "bg-cream/85 washi-grid",
  black: "bg-night/85",
} as const;

export type TapeColor = keyof typeof colors;

// zig-zag torn ends on both sides of the strip
const ends =
  "polygon(0% 8%, 3% 0%, 97% 0%, 100% 12%, 97% 26%, 100% 40%, 97% 55%, 100% 70%, 97% 85%, 100% 100%, 3% 100%, 0% 88%, 3% 74%, 0% 60%, 3% 46%, 0% 32%, 3% 18%)";

/** A strip of washi tape. Position and rotate it with className. */
export function Tape({ color = "tan", className = "" }: { color?: TapeColor; className?: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute z-10 block h-7 w-24 shadow-sm backdrop-blur-xs ${colors[color]} ${className}`}
      style={{ clipPath: ends }}
    />
  );
}
