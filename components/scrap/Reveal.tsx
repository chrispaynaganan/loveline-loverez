"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

/** Marks itself with data-inview once scrolled into view, which starts the ink and paper animations inside. */
export function Reveal({
  as: Tag = "section",
  className = "",
  children,
  id,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} id={id} className={className} data-inview={seen ? "" : undefined}>
      {children}
    </Tag>
  );
}
