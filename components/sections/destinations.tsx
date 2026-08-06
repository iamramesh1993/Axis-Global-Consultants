import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CalendarDays, Wallet } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { FLAGS } from "@/components/site/flags";
import { getAllCountries } from "@/lib/content";

/**
 * Alt text names the landmark, not the country — a screen reader user gets
 * nothing from "image of UK" but does from knowing it's Big Ben.
 */
const PHOTO_ALT: Record<string, string> = {
  uk: "Big Ben and the Palace of Westminster, London",
  canada: "The CN Tower above the Toronto skyline at dusk",
  australia: "Sydney Opera House lit up at night",
  uzbekistan: "The Registan complex in Samarkand, Uzbekistan",
};

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
          const Flag = FLAGS[country.slug];

          return (
            <Reveal key={country.slug} delay={i * 0.07} className="h-full">
              <Link
                href={`/study/${country.slug}`}
                className="group rounded-card border-line bg-card hover:border-brand flex h-full flex-col overflow-hidden border shadow-[var(--shadow-soft)] transition-[border-color,transform,box-shadow] duration-200 [transition-timing-function:var(--ease-out-soft)] hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
              >
                {/* Photo */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={`/destinations/${country.slug}.webp`}
                    alt={PHOTO_ALT[country.slug] ?? fm.title}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 [transition-timing-function:var(--ease-out-soft)] group-hover:scale-[1.06]"
                    priority={i < 2}
                  />
                  {/* Keeps the flag badge legible over a bright sky */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/10"
                  />
                  {/* Blue wash on hover */}
                  <div
                    aria-hidden="true"
                    className="bg-brand/0 group-hover:bg-brand/15 absolute inset-0 transition-colors duration-200"
                  />
                  {Flag && (
                    <span className="rounded-control bg-card/95 absolute top-3 left-3 grid h-9 w-9 place-items-center shadow-[0_2px_8px_rgb(15_23_42_/_0.18)] backdrop-blur-sm">
                      <Flag className="h-4 w-[1.375rem]" />
                    </span>
                  )}
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="group-hover:text-brand text-xl font-extrabold tracking-[-0.02em] transition-colors duration-200">
                      {fm.code}
                    </h3>
                    <span
                      aria-hidden="true"
                      className="border-line text-brand group-hover:border-brand group-hover:bg-brand group-hover:text-on-brand grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-colors duration-200"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>

                  <p className="text-ink-muted mt-3 flex-1 text-[0.9375rem] leading-relaxed">
                    {fm.hook}
                  </p>

                  {/*
                    Fixed row heights so every card's "Tuition" sits on one
                    baseline and every "Intakes" on another. Without this the dl
                    height varies with how many lines the intake list wraps to
                    (Canada takes three, Uzbekistan one), the flex-grow above
                    absorbs the difference, and the labels end up 40px apart.

                    Heights are the worst case at the narrowest card width
                    (lg, four columns): label 16px + 2px gap + N x 20px line.
                  */}
                  <dl className="border-line mt-6 space-y-4 border-t pt-5 text-sm">
                    <div className="flex min-h-[3.625rem] items-start gap-3">
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
                    <div className="flex min-h-[4.875rem] items-start gap-3">
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
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
