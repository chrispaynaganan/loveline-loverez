/** A long ink line drawn by hand, for dividing sections. */
export function HandRule({ className = "", flourish = false }: { className?: string; flourish?: boolean }) {
  return (
    <svg viewBox="0 0 1200 24" preserveAspectRatio="none" className={`h-4 w-full ${className}`} aria-hidden>
      <path
        d={
          flourish
            ? "M2 14 C 200 10, 420 16, 640 12 S 980 10, 1120 13 C 1150 14, 1170 4, 1186 10 C 1196 14, 1186 20, 1176 16"
            : "M2 12 C 180 9, 380 15, 600 11 S 1000 10, 1198 13"
        }
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
