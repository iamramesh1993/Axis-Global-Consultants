import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

export function Breadcrumbs({
  items,
}: {
  items: { name: string; path: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="text-fg-subtle flex flex-wrap items-center gap-1 text-xs">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-1">
              {isLast ? (
                <span aria-current="page" className="text-fg-muted">
                  {item.name}
                </span>
              ) : (
                <>
                  <Link
                    href={item.path}
                    className="hover:text-accent transition-colors"
                  >
                    {item.name}
                  </Link>
                  <ChevronRight className="h-3 w-3" aria-hidden="true" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function PageHero({
  eyebrow,
  title,
  lead,
  breadcrumbs,
  meta,
  children,
  className,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  breadcrumbs?: { name: string; path: string }[];
  /** Small dated/sourced line under the lead. */
  meta?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn("bg-grain relative isolate overflow-hidden", className)}
    >
      <div
        aria-hidden="true"
        className="bg-grid absolute inset-0 -z-10 [mask-image:radial-gradient(120%_70%_at_30%_0%,black,transparent_70%)] opacity-50"
      />
      <div
        aria-hidden="true"
        className="bg-accent/8 absolute -top-44 left-[15%] -z-10 h-[26rem] w-[26rem] rounded-full blur-[110px]"
      />

      <div className="container-page pt-10 pb-14 md:pt-14 md:pb-20">
        {breadcrumbs && (
          <Reveal>
            <Breadcrumbs items={breadcrumbs} />
          </Reveal>
        )}

        {eyebrow && (
          <Reveal delay={0.04}>
            <p className="text-eyebrow text-accent mt-8 font-sans uppercase">
              {eyebrow}
            </p>
          </Reveal>
        )}

        <Reveal delay={0.08}>
          <h1
            className={cn("text-display max-w-4xl", eyebrow ? "mt-4" : "mt-8")}
          >
            {title}
          </h1>
        </Reveal>

        {lead && (
          <Reveal delay={0.12}>
            <p className="text-lead text-fg-muted mt-6 max-w-2xl">{lead}</p>
          </Reveal>
        )}

        {meta && (
          <Reveal delay={0.16}>
            <div className="mt-7">{meta}</div>
          </Reveal>
        )}

        {children && <Reveal delay={0.2}>{children}</Reveal>}
      </div>
    </section>
  );
}
