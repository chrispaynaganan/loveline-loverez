import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`group flex items-center gap-2 ${className}`} aria-label="Boses Filipina, home">
      <svg viewBox="0 0 40 56" className="h-10 w-7 text-pink transition group-hover:-rotate-6" aria-hidden>
        <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
          <rect x="10" y="3" width="20" height="32" rx="10" />
          <path d="M12 15 H28 M12 23 H28" />
          <path d="M4 24 C4 44, 36 44, 36 24" />
          <path d="M20 41 V52" />
        </g>
      </svg>
      <span className="leading-none">
        <span className="block font-hand text-2xl text-ink">Boses Filipina</span>
        <span className="block font-type text-xs tracking-widest text-ink-soft uppercase">Loveline VO</span>
      </span>
    </Link>
  );
}
