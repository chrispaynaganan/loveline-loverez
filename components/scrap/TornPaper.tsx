import type { CSSProperties, ElementType, ReactNode } from "react";
import { seeded } from "@/lib/seeded";

type Edge = "top" | "right" | "bottom" | "left";

/**
 * Builds a jagged clip-path. Depth is in px so the tear looks the same
 * on a small card and on a wide banner.
 */
function tornPolygon(seed: string, edges: Edge[], depth: number, minDepth = 0) {
  const rand = seeded(seed);
  const has = (e: Edge) => edges.includes(e);
  const steps = 42;
  // a slow wave plus fine teeth, like real torn fibres
  const offset = (i: number, phase: number) => {
    const wave = (Math.sin(i * 0.35 + phase) + 1) / 2;
    const teeth = rand();
    return (minDepth + (wave * 0.45 + teeth * 0.55) * (depth - minDepth)).toFixed(1);
  };
  const pts: string[] = [];
  const p1 = rand() * 6;
  const p2 = rand() * 6;
  const p3 = rand() * 6;
  const p4 = rand() * 6;

  if (has("top")) for (let i = 0; i <= steps; i++) pts.push(`${((i / steps) * 100).toFixed(2)}% ${offset(i, p1)}px`);
  else pts.push("0% 0%", "100% 0%");

  if (has("right")) for (let i = 0; i <= steps; i++) pts.push(`calc(100% - ${offset(i, p2)}px) ${((i / steps) * 100).toFixed(2)}%`);
  else pts.push("100% 0%", "100% 100%");

  if (has("bottom")) for (let i = steps; i >= 0; i--) pts.push(`${((i / steps) * 100).toFixed(2)}% calc(100% - ${offset(i, p3)}px)`);
  else pts.push("100% 100%", "0% 100%");

  if (has("left")) for (let i = steps; i >= 0; i--) pts.push(`${offset(i, p4)}px ${((i / steps) * 100).toFixed(2)}%`);
  else pts.push("0% 100%", "0% 0%");

  return `polygon(${pts.join(",")})`;
}

const tones = {
  kraft: "bg-kraft kraft-fibres",
  cream: "bg-cream paper-grain",
  paper: "bg-paper paper-grain",
  blush: "bg-blush paper-grain",
  butter: "bg-butter paper-grain",
  sage: "bg-sage paper-grain",
  sky: "bg-sky paper-grain",
  pink: "bg-pink-soft paper-grain",
  lined: "lined-paper",
  grid: "grid-paper",
  night: "bg-night desk-grain",
} as const;

export type PaperTone = keyof typeof tones;

export function TornPaper({
  seed,
  tone = "paper",
  edges = ["top", "right", "bottom", "left"],
  depth = 7,
  fibre = true,
  className = "",
  innerClassName = "",
  as: Tag = "div",
  children,
  style,
}: {
  seed: string;
  tone?: PaperTone;
  edges?: Edge[];
  depth?: number;
  /** A lighter rim peeking out of the tear, like real paper fibres. */
  fibre?: boolean;
  className?: string;
  innerClassName?: string;
  as?: ElementType;
  children?: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <Tag className={`relative drop-shadow-md ${className}`} style={style}>
      {fibre && tone !== "lined" && tone !== "grid" && (
        <div
          aria-hidden
          className="absolute inset-0 bg-paper"
          style={{ clipPath: tornPolygon(`${seed}-f`, edges, depth * 0.7) }}
        />
      )}
      <div
        className={`relative h-full ${tones[tone]} ${tone === "night" ? "" : "paper-ink text-ink"} ${innerClassName}`}
        style={{ clipPath: tornPolygon(seed, edges, depth + (fibre ? 3 : 0), fibre ? 2 : 0) }}
      >
        {children}
      </div>
    </Tag>
  );
}
