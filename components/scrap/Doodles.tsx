import type { CSSProperties, ReactNode } from "react";

// Hand-drawn doodles in ink. They inherit the text colour, and the strokes
// draw themselves in when their section scrolls into view.

type DoodleProps = { className?: string; delay?: number; title?: string };

function Svg({
  viewBox,
  className = "",
  delay,
  title,
  strokeWidth = 2.2,
  stretch,
  children,
}: DoodleProps & { viewBox: string; strokeWidth?: number; stretch?: boolean; children: ReactNode }) {
  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio={stretch ? "none" : undefined}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={delay !== undefined ? ({ "--draw-delay": `${delay}s` } as CSSProperties) : undefined}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {children}
    </svg>
  );
}

const P = (props: { d: string; w?: number }) => (
  <path d={props.d} pathLength={1} className="ink-draw" strokeWidth={props.w} />
);

/** Loopy arrow, like the ones you draw in the margin. */
export function ArrowLoop(props: DoodleProps) {
  return (
    <Svg viewBox="0 0 120 130" {...props}>
      <P d="M8 16 C 48 4, 96 18, 92 54 C 89 80, 56 86, 53 66 C 50 47, 82 44, 93 70 C 101 89, 99 103, 96 118" />
      <P d="M84 107 L96 120 L106 105" />
    </Svg>
  );
}

/** Long swoop to the right. */
export function ArrowSwoop(props: DoodleProps) {
  return (
    <Svg viewBox="0 0 170 70" {...props}>
      <P d="M6 50 C 34 18, 92 6, 158 32" />
      <P d="M142 18 L159 33 L140 42" />
    </Svg>
  );
}

/** Wobbly arrow pointing down. */
export function ArrowDown(props: DoodleProps) {
  return (
    <Svg viewBox="0 0 44 100" {...props}>
      <P d="M22 4 C 15 28, 29 52, 20 88" />
      <P d="M8 75 L20 90 L33 77" />
    </Svg>
  );
}

/** Short straight-ish arrow for buttons and links. */
export function ArrowRight(props: DoodleProps) {
  return (
    <Svg viewBox="0 0 48 20" strokeWidth={2} {...props}>
      <P d="M3 11 C 15 9, 30 10, 43 10" />
      <P d="M35 3 L44 10 L35 17" />
    </Svg>
  );
}

/** Arrow curling up and back to the left. */
export function ArrowCurlBack(props: DoodleProps) {
  return (
    <Svg viewBox="0 0 120 90" {...props}>
      <P d="M112 82 C 110 40, 80 14, 40 22 C 26 25, 16 32, 10 42" />
      <P d="M6 25 L10 44 L28 40" />
    </Svg>
  );
}

/** Underline squiggle. */
export function Squiggle(props: DoodleProps) {
  return (
    <Svg viewBox="0 0 220 18" strokeWidth={3} stretch {...props}>
      <P d="M3 11 C 22 3, 34 15, 55 8 S 88 3, 110 9 S 148 15, 170 7 S 205 6, 217 9" />
    </Svg>
  );
}

/** Double underline, slightly uneven. */
export function Underline(props: DoodleProps) {
  return (
    <Svg viewBox="0 0 220 16" strokeWidth={2.4} stretch {...props}>
      <P d="M4 5 C 60 3, 140 4, 216 6" />
      <P d="M14 12 C 70 10, 150 11, 206 12" />
    </Svg>
  );
}

/** Loose circle you'd scribble around a word. */
export function ScribbleCircle(props: DoodleProps) {
  return (
    <Svg viewBox="0 0 200 90" strokeWidth={2} stretch {...props}>
      <P d="M120 8 C 60 2, 10 18, 8 44 C 6 72, 70 86, 120 82 C 168 78, 196 60, 192 38 C 188 14, 140 4, 92 10 C 70 13, 52 18, 40 26" />
    </Svg>
  );
}

/** Line-drawn flowers, like the one in the margin of a journal. */
export function Flower(props: DoodleProps) {
  return (
    <Svg viewBox="0 0 90 200" strokeWidth={1.8} {...props}>
      <P d="M40 58 C 38 100, 44 140, 40 196" />
      <P d="M41 120 C 52 108, 64 96, 66 78" />
      <P d="M40 150 C 26 140, 16 132, 10 120 C 22 120, 34 130, 40 150" />
      <P d="M42 170 C 56 160, 66 156, 76 156 C 70 168, 58 172, 42 170" />
      <P d="M40 40 C 30 22, 34 10, 40 8 C 46 10, 50 22, 40 40 C 52 26, 64 24, 68 30 C 66 38, 54 42, 40 40 C 54 46, 60 56, 56 62 C 48 64, 42 54, 40 40 C 38 56, 30 64, 22 62 C 18 54, 26 46, 40 40 C 26 42, 14 38, 12 30 C 16 24, 28 26, 40 40" />
      <circle cx="40" cy="40" r="4" pathLength={1} className="ink-draw" />
      <P d="M66 78 C 58 70, 60 60, 66 58 C 72 60, 74 70, 66 78 C 74 70, 84 70, 86 76 C 82 82, 74 82, 66 78 C 72 86, 70 94, 64 94 C 60 90, 62 82, 66 78 C 58 84, 50 82, 48 76 C 52 70, 60 72, 66 78" />
    </Svg>
  );
}

/** Four-point sparkle. */
export function Sparkle(props: DoodleProps) {
  return (
    <Svg viewBox="0 0 60 60" strokeWidth={2} {...props}>
      <P d="M30 4 C 31 20, 34 27, 56 30 C 34 33, 31 40, 30 56 C 29 40, 26 33, 4 30 C 26 27, 29 20, 30 4" />
    </Svg>
  );
}

/** Asterisk star, like the one in the top corner of a page. */
export function Asterisk(props: DoodleProps) {
  return (
    <Svg viewBox="0 0 50 50" strokeWidth={2} {...props}>
      <P d="M25 4 L26 46" />
      <P d="M6 16 L44 34" />
      <P d="M44 14 L7 35" />
    </Svg>
  );
}

export function Heart(props: DoodleProps) {
  return (
    <Svg viewBox="0 0 50 46" strokeWidth={2} {...props}>
      <P d="M25 42 C 10 30, 3 22, 4 13 C 5 5, 15 2, 21 8 C 23 10, 24 12, 25 15 C 26 11, 29 5, 36 4 C 44 3, 48 10, 46 17 C 44 26, 34 34, 25 42" />
    </Svg>
  );
}

/** Studio microphone, drawn by hand. */
export function Mic(props: DoodleProps) {
  return (
    <Svg viewBox="0 0 80 150" strokeWidth={2} {...props}>
      <P d="M26 14 C 26 6, 54 6, 54 14 L 54 58 C 54 68, 26 68, 26 58 Z" />
      <P d="M28 24 L52 24 M27 34 L53 34 M27 44 L53 44 M28 54 L52 54" />
      <P d="M18 42 C 18 72, 62 72, 62 42" />
      <P d="M40 72 L40 120" />
      <P d="M22 140 C 30 128, 50 128, 58 140" />
      <P d="M40 120 L40 134" />
    </Svg>
  );
}

/** Sound waves coming off something. */
export function Waves(props: DoodleProps) {
  return (
    <Svg viewBox="0 0 60 80" strokeWidth={2.2} {...props}>
      <P d="M8 26 C 16 34, 16 46, 8 54" />
      <P d="M22 16 C 36 30, 36 50, 22 64" />
      <P d="M38 6 C 58 26, 58 54, 38 74" />
    </Svg>
  );
}

export function Headphones(props: DoodleProps) {
  return (
    <Svg viewBox="0 0 100 90" strokeWidth={2.2} {...props}>
      <P d="M14 62 C 8 26, 30 8, 50 8 C 72 8, 94 26, 86 62" />
      <P d="M10 56 C 10 50, 24 50, 24 56 L 24 80 C 24 86, 10 86, 10 80 Z" />
      <P d="M76 56 C 76 50, 90 50, 90 56 L 90 80 C 90 86, 76 86, 76 80 Z" />
    </Svg>
  );
}

/** A little film/cassette scribble used beside headings. */
export function MusicNote(props: DoodleProps) {
  return (
    <Svg viewBox="0 0 60 70" strokeWidth={2.2} {...props}>
      <P d="M22 56 L22 12 L52 6 L52 48" />
      <P d="M22 20 L52 14" />
      <P d="M10 58 C 10 50, 24 50, 22 58 C 20 64, 10 64, 10 58" />
      <P d="M40 50 C 40 42, 54 42, 52 50 C 50 56, 40 56, 40 50" />
    </Svg>
  );
}

/** Splash of ink at the end of an arrow. */
export function InkSplat({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 60" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M38 14c6-2 12 2 13 8 4-3 10-2 11 3 1 4-3 7-7 8 5 2 7 7 4 11-3 4-9 3-12 0-1 5-6 8-11 6-5-2-6-7-3-11-5 1-10-2-10-7 0-5 5-7 9-6-2-6 1-11 6-12z"
      />
      <circle cx="68" cy="14" r="2.5" fill="currentColor" />
      <circle cx="14" cy="46" r="2" fill="currentColor" />
      <circle cx="72" cy="46" r="1.5" fill="currentColor" />
      <circle cx="22" cy="10" r="1.5" fill="currentColor" />
    </svg>
  );
}

/** Pink smiley sticker wearing headphones. */
export function SmileySticker({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={`paper-ink ${className}`} aria-hidden>
      <circle cx="50" cy="52" r="40" className="fill-pink-soft" />
      <circle cx="50" cy="52" r="40" fill="none" stroke="white" strokeWidth="4" />
      <path d="M16 46 C 16 18, 84 18, 84 46" fill="none" className="stroke-ink" strokeWidth="3" strokeLinecap="round" />
      <rect x="9" y="42" width="12" height="20" rx="5" className="fill-ink" />
      <rect x="79" y="42" width="12" height="20" rx="5" className="fill-ink" />
      <path d="M38 46 C 38 42, 41 42, 41 46" fill="none" className="stroke-ink" strokeWidth="3" strokeLinecap="round" />
      <path d="M59 46 C 59 42, 62 42, 62 46" fill="none" className="stroke-ink" strokeWidth="3" strokeLinecap="round" />
      <path d="M36 60 C 42 70, 58 70, 64 60" fill="none" className="stroke-ink" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/** Round rubber stamp. */
export function Stamp({ text, sub, className = "" }: { text: string; sub?: string; className?: string }) {
  const id = `stamp-${text.replace(/\W/g, "")}`;
  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-label={sub ? `${text}, ${sub}` : text}>
      <defs>
        <path id={id} d="M60 60 m-42 0 a42 42 0 1 1 84 0 a42 42 0 1 1 -84 0" />
      </defs>
      <g fill="none" stroke="currentColor" opacity="0.85">
        <circle cx="60" cy="60" r="56" strokeWidth="3" />
        <circle cx="60" cy="60" r="34" strokeWidth="1.5" />
      </g>
      <text fill="currentColor" className="font-type" fontSize="11" letterSpacing="3" opacity="0.85">
        <textPath href={`#${id}`}>{text.toUpperCase()} • {text.toUpperCase()} •</textPath>
      </text>
      {sub && (
        <text x="60" y="66" textAnchor="middle" fill="currentColor" className="font-hand" fontSize="18" opacity="0.9">
          {sub}
        </text>
      )}
    </svg>
  );
}
