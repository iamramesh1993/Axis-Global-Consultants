import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";

/**
 * The one vertical rhythm for the whole site.
 *
 * 64px mobile / 80px desktop, so the gap between two adjacent sections is
 * 128/160px. Deliberately not the 96px desktop value first sketched: at 96 the
 * boundary gap becomes 192px, and measurement showed the page already had more
 * air than it needed.
 *
 * Every top-level section must go through here. Passing padding via `className`
 * is what let the rhythm drift before — /guides/[slug] had `pt-0 md:pt-0` applied
 * mid-page, producing an 80px gap where every other boundary was 160px.
 */
const SPACING = {
  /** The default. Use this unless one of the cases below genuinely applies. */
  default: "py-16 md:py-20",
  /**
   * First section after a PageHero. PageHero already supplies bottom padding,
   * so a full top pad here would double it.
   */
  flushTop: "pb-16 md:pb-20",
} as const;

/**
 * Section shell. `tone` drives the alternating white / #F8FAFC rhythm — pages
 * should alternate rather than stack two of the same tone, which is what makes
 * the whitespace read as structure instead of emptiness.
 */
export function Section({
  children,
  className,
  id,
  tone = "page",
  spacing = "default",
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  tone?: "page" | "panel" | "brand";
  spacing?: keyof typeof SPACING;
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-24",
        SPACING[spacing],
        tone === "page" && "bg-page",
        tone === "panel" && "bg-panel",
        tone === "brand" && "bg-brand text-on-brand",
        className,
      )}
    >
      <div className="container-page">{children}</div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  lead,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <p className="text-eyebrow text-brand font-semibold uppercase">
          {eyebrow}
        </p>
      )}
      <h2 className={cn("text-heading", eyebrow && "mt-4")}>{title}</h2>
      {lead && <p className="text-lead text-ink-muted mt-5">{lead}</p>}
    </Reveal>
  );
}

export function Card({
  children,
  className,
  interactive = false,
}: {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-card border-line bg-card border p-7 shadow-[var(--shadow-soft)]",
        interactive &&
          "hover:border-brand transition-[border-color,transform,box-shadow] duration-200 [transition-timing-function:var(--ease-out-soft)] hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-eyebrow text-brand font-semibold uppercase",
        className,
      )}
    >
      {children}
    </p>
  );
}
