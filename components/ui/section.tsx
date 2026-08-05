import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";

export function Section({
  children,
  className,
  id,
  tone = "dark",
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  tone?: "dark" | "raised" | "paper";
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-20 py-16 md:py-24",
        tone === "raised" && "bg-ink-raised/40",
        tone === "paper" && "bg-paper text-paper-fg",
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
  tone = "dark",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "paper";
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
        <p
          className={cn(
            "text-eyebrow font-sans uppercase",
            tone === "paper" ? "text-paper-muted" : "text-accent",
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2 className={cn("text-heading", eyebrow && "mt-4")}>{title}</h2>
      {lead && (
        <p
          className={cn(
            "text-lead mt-5",
            tone === "paper" ? "text-paper-muted" : "text-fg-muted",
          )}
        >
          {lead}
        </p>
      )}
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
        "rounded-card border-line bg-ink-raised/60 border p-6",
        interactive &&
          "hover:border-accent/40 hover:bg-ink-raised transition-[border-color,transform,background-color] duration-300 [transition-timing-function:var(--ease-out-soft)] hover:-translate-y-1",
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
      className={cn("text-eyebrow text-accent font-sans uppercase", className)}
    >
      {children}
    </p>
  );
}
