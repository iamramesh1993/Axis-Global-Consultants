import Link from "next/link";
import { ArrowRight, CalendarDays, Wallet } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { getAllCountries } from "@/lib/content";

export function Destinations() {
  const countries = getAllCountries();

  return (
    <Section id="destinations" tone="panel">
      <SectionHeader
        eyebrow="Destinations"
        title={
          <>
            Study in your <span className="text-brand">dream destination</span>
          </>
        }
        lead="Each page carries the real numbers, the current rules, and the part that commonly goes wrong — checked against government sources, with the date we checked."
        align="center"
      />

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {countries.map((country, i) => {
          const { frontmatter: fm } = country;
          return (
            <Reveal key={country.slug} delay={i * 0.07}>
              <Link
                href={`/study/${country.slug}`}
                className="group rounded-card border-line bg-card hover:border-line-strong flex h-full flex-col border p-7 shadow-[var(--shadow-soft)] transition-[border-color,transform,box-shadow] duration-200 [transition-timing-function:var(--ease-out-soft)] hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-xl font-extrabold tracking-[-0.02em]">
                    {fm.code}
                  </h3>
                  <span
                    aria-hidden="true"
                    className="border-line text-brand group-hover:border-brand group-hover:bg-brand group-hover:text-on-brand grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-colors duration-200"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>

                <p className="text-ink-muted mt-4 flex-1 text-[0.9375rem] leading-relaxed">
                  {fm.hook}
                </p>

                <dl className="border-line mt-6 space-y-4 border-t pt-6 text-sm">
                  <div className="flex items-start gap-3">
                    <Wallet
                      className="text-brand mt-0.5 h-[1.125rem] w-[1.125rem] shrink-0"
                      aria-hidden="true"
                    />
                    <div>
                      <dt className="text-ink-subtle text-xs">Tuition</dt>
                      <dd className="mt-0.5 font-semibold">
                        {fm.tuitionRange}
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CalendarDays
                      className="text-brand mt-0.5 h-[1.125rem] w-[1.125rem] shrink-0"
                      aria-hidden="true"
                    />
                    <div>
                      <dt className="text-ink-subtle text-xs">Intakes</dt>
                      <dd className="mt-0.5 font-semibold">
                        {fm.intakes.map((intake) => intake.name).join(" · ")}
                      </dd>
                    </div>
                  </div>
                </dl>

                <span className="text-brand mt-6 inline-flex items-center gap-1.5 text-sm font-semibold">
                  What you need
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
