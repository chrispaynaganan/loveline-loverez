import type { ReactNode } from "react";

/** Little label-maker / stamp tags like "NEW" or "MUSIC". */
export function Label({
  children,
  tone = "ink",
  className = "",
}: {
  children: ReactNode;
  tone?: "ink" | "pink" | "paper";
  className?: string;
}) {
  const tones = {
    ink: "bg-ink text-paper",
    pink: "bg-pink text-paper",
    paper: "bg-paper text-ink ring-1 ring-ink/20",
  };
  return (
    <span
      className={`paper-ink inline-block px-2 py-0.5 font-type text-xs font-bold tracking-widest uppercase shadow-sm ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
