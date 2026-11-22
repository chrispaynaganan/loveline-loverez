import type { ReactNode } from "react";
import { Squiggle } from "./Doodles";

/** Section heading in handwriting with an inked squiggle under the key word. */
export function HandHeading({
  kicker,
  children,
  className = "",
  as: Tag = "h2",
}: {
  kicker?: ReactNode;
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <div className={className}>
      {kicker && <p className="font-note text-2xl text-pink">{kicker}</p>}
      <Tag className="relative inline-block font-hand text-4xl leading-tight text-ink sm:text-5xl">
        {children}
        <Squiggle className="absolute -bottom-3 left-0 w-full text-ink/80" delay={0.3} />
      </Tag>
    </div>
  );
}
