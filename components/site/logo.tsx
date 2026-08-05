import Link from "next/link";
import { cn } from "@/lib/utils";

/** The mark: two axes and a trajectory rising off them. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      role="img"
      aria-hidden="true"
      className={cn("h-8 w-8 shrink-0", className)}
    >
      <rect width="32" height="32" rx="9" fill="var(--accent)" />
      <g
        stroke="var(--on-accent)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        {/* the axes */}
        <path d="M8 7v17h17" />
        {/* the trajectory */}
        <path d="M12.5 19.5 17 14l3.5 3.5L25 11" />
      </g>
    </svg>
  );
}

export function Logo({
  className,
  showWordmark = true,
}: {
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label="Axis Global Consultants — home"
      className={cn(
        "group inline-flex items-center gap-2.5 transition-opacity hover:opacity-90",
        className,
      )}
    >
      <LogoMark />
      {showWordmark && (
        <span className="font-display text-[1.0625rem] leading-none font-bold tracking-[-0.03em]">
          Axis<span className="text-fg-subtle"> Global</span>
        </span>
      )}
    </Link>
  );
}
