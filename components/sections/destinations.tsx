import Link from "next/link";
import { ArrowUpRight, CalendarDays, Wallet } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { getAllCountries } from "@/lib/content";

export function Destinations() {
  const countries = getAllCountries();

  return (
    <Section id="destinations">
      <SectionHeader
        eyebrow="Destinations"
        title="Four destinations. Different answers for different students."
        lead="Each page carries the real numbers, the current rules, and the part that commonly goes wrong — checked against government sources, with the date we checked."
      />

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {countries.map((country, i) => {
          const { frontmatter: fm } = country;
          return (
            <Reveal key={country.slug} delay={i * 0.07}>
              <Link
                href={`/study/${country.slug}`}
                className="group rounded-card border-line bg-ink-raised/60 hover:border-accent/40 hover:bg-ink-raised flex h-full flex-col border p-6 transition-[border-color,transform,background-color] duration-300 [transition-timing-function:var(--ease-out-soft)] hover:-translate-y-1"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-xl font-semibold tracking-tight">
                    {fm.code}
                  </h3>
                  <ArrowUpRight
                    className="text-fg-subtle group-hover:text-accent h-5 w-5 shrink-0 transition-colors"
                    aria-hidden="true"
                  />
                </div>

                <p className="text-fg-muted mt-3 text-sm leading-relaxed">
                  {fm.hook}
                </p>

                <dl className="border-line mt-6 space-y-3 border-t pt-5 text-xs">
                  <div className="flex items-start gap-2.5">
                    <Wallet
                      className="text-accent/70 mt-0.5 h-4 w-4 shrink-0"
                      aria-hidden="true"
                    />
                    <div>
                      <dt className="text-fg-subtle">Tuition</dt>
                      <dd className="text-fg mt-0.5 font-medium">
                        {fm.tuitionRange}
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CalendarDays
                      className="text-accent/70 mt-0.5 h-4 w-4 shrink-0"
                      aria-hidden="true"
                    />
                    <div>
                      <dt className="text-fg-subtle">Intakes</dt>
                      <dd className="text-fg mt-0.5 font-medium">
                        {fm.intakes.map((intake) => intake.name).join(" · ")}
                      </dd>
                    </div>
                  </div>
                </dl>

                <span className="text-accent mt-6 text-sm font-medium">
                  What you need →
                </span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
