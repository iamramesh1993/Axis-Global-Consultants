"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Stagger in seconds. */
  delay?: number;
  /** Travel distance in px. */
  y?: number;
  as?: "div" | "section" | "li" | "span";
};

/**
 * Fade-up-on-scroll, built to fail visible.
 *
 * The hidden state lives in CSS behind `[data-js="on"]`, which an inline script
 * in the document head sets before first paint. So:
 *
 *   - No JS, JS still downloading, or a hydration error → content is visible.
 *     This matters: most of our traffic is Instagram/Facebook ads on Pakistani
 *     mobile networks, and previously the whole hero sat at opacity:0 until
 *     React hydrated.
 *   - prefers-reduced-motion → the transition is neutralised globally in
 *     globals.css, and we skip observing entirely.
 *
 * IntersectionObserver just adds a class, so this costs no animation library.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 16,
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Respect the user's motion preference — show immediately, never observe.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    // Already on screen at mount (above the fold): reveal without waiting.
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={cn("reveal", visible && "reveal-in", className)}
      style={
        {
          "--reveal-delay": `${delay}s`,
          "--reveal-y": `${y}px`,
        } as React.CSSProperties
      }
    >
      {children}
    </Tag>
  );
}
