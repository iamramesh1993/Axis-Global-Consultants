import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";

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
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  tone?: "page" | "panel" | "brand";
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-24 py-16 md:py-20",
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
          "hover:border-line-strong transition-[border-color,transform,box-shadow] duration-200 [transition-timing-function:var(--ease-out-soft)] hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]",
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
