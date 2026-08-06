import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * The mark: a white "A" on a blue rounded square, with a flight trail sweeping
 * up through it and a plane leaving the peak.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-hidden="true"
      className={cn("h-9 w-9 shrink-0", className)}
    >
      <rect width="48" height="48" rx="12" fill="var(--brand)" />

      {/* The A */}
      <path
        d="M24 10.5 35.5 38h-5.2l-2.3-5.9h-8l-2.3 5.9H12.5L24 10.5Zm0 10.4-2.6 6.7h5.2L24 20.9Z"
        fill="#ffffff"
      />

      {/* Flight trail sweeping across the base of the A */}
      <path
        d="M9.5 36.5c7.5.6 15.5-3.2 21-8.6 2.5-2.4 4.4-5 5.8-7.4"
        stroke="#ffffff"
        strokeWidth="2.6"
        strokeLinecap="round"
        fill="none"
        opacity="0.95"
      />

      {/* Plane leaving the trail */}
      <path
        d="M35.2 15.6 39.6 14l-1.3 4.3-2.4 1.1-1.4-1.3.7-2.5Z"
        fill="#ffffff"
      />
    </svg>
  );
}

export function Logo({
  className,
  showWordmark = true,
  showTagline = true,
}: {
  className?: string;
  showWordmark?: boolean;
  showTagline?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label="Axis Global Consultants — home"
      className={cn(
        "group inline-flex items-center gap-3 transition-opacity hover:opacity-90",
        className,
      )}
    >
      <LogoMark />
      {showWordmark && (
        /*
         * The full legal name, stacked. On one line "Axis Global Consultants"
         * runs ~200px, which collides with the seven-item desktop nav at the lg
         * breakpoint; two lines keep it inside the 72px header at every width.
         */
        <span className="flex flex-col leading-none">
          <span className="text-[1.0625rem] leading-none font-extrabold tracking-[-0.025em]">
            Axis <span className="text-brand">Global</span>
          </span>
          <span className="text-ink mt-1 text-[0.625rem] leading-none font-bold tracking-[0.14em] uppercase">
            Consultants
          </span>
          {showTagline && (
            <span className="text-ink-subtle mt-1.5 text-[0.5625rem] leading-none font-medium tracking-[0.1em] uppercase">
              Your Global Education Partner
            </span>
          )}
        </span>
      )}
    </Link>
  );
}
