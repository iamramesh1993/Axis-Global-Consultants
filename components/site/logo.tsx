import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * The supplied brand artwork, used as-is rather than redrawn.
 *
 * Two assets, both cropped from the master file in `public/newlogo.png`:
 *   - `logo-lockup` — mark + "Axis Global" + "CONSULTANTS", aspect 3.66:1
 *   - `logo-mark`   — the blue tile alone, square
 *
 * The artwork has a white background, not transparency, so it is only placed on
 * white surfaces (header, footer, admin bar, login card). Putting it on the grey
 * panel tone would show a visible box.
 */

const LOCKUP_ASPECT = 3.659;

/** The blue tile on its own — for tight spaces where the wordmark won't fit. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <Image
      src="/brand/logo-mark.webp"
      alt=""
      width={44}
      height={44}
      className={cn("h-9 w-9 shrink-0 rounded-[9px]", className)}
      priority
    />
  );
}

export function Logo({
  className,
  /** Rendered height in px. The width follows the artwork's aspect ratio. */
  height = 42,
  markOnly = false,
}: {
  className?: string;
  height?: number;
  markOnly?: boolean;
}) {
  if (markOnly) {
    return (
      <Link
        href="/"
        aria-label="Axis Global Consultants — home"
        className={cn(
          "inline-flex shrink-0 transition-opacity hover:opacity-90",
          className,
        )}
      >
        <LogoMark />
      </Link>
    );
  }

  return (
    <Link
      href="/"
      aria-label="Axis Global Consultants — home"
      className={cn(
        "inline-flex shrink-0 items-center transition-opacity hover:opacity-90",
        className,
      )}
    >
      <Image
        src="/brand/logo-lockup.webp"
        alt="Axis Global Consultants"
        width={Math.round(height * LOCKUP_ASPECT)}
        height={height}
        style={{ height, width: "auto" }}
        priority
      />
    </Link>
  );
}
