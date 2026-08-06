import { ArrowRight, Check, PlayCircle } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { FileStatusCard } from "@/components/sections/file-status-card";
import { HeroBackdrop } from "@/components/sections/hero-backdrop";

export function Hero() {
  return (
    <section className="bg-page relative isolate overflow-hidden">
      <HeroBackdrop />

      <div className="container-page relative grid items-center gap-12 pt-6 pb-14 md:pt-8 md:pb-18 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pt-10 lg:pb-20">
        {/* Copy */}
        <div>
          <Reveal>
            <span className="border-line bg-card text-ink-muted inline-flex items-center gap-2.5 rounded-full border px-4 py-2 text-xs font-semibold tracking-[0.04em] uppercase shadow-[0_1px_2px_rgb(15_23_42_/_0.04)]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="bg-brand absolute inline-flex h-full w-full animate-ping rounded-full opacity-70" />
                <span className="bg-brand relative inline-flex h-1.5 w-1.5 rounded-full" />
              </span>
              Now advising for
              <span className="text-brand">Jan &amp; Sep 2027 intakes</span>
            </span>
          </Reveal>

          <Reveal delay={0.06}>
            <h1 className="text-display-xl mt-7">
              Know exactly
              <br />
              where you{" "}
              <span className="brand-underline whitespace-nowrap">stand.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="text-lead text-ink-muted mt-7 max-w-xl">
              We help Pakistani students get into universities in the UK,
              Canada, Australia and Uzbekistan. Our whole process is published
              up front — including the parts other consultants would rather you
              didn&apos;t ask about.
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink
                href="/contact"
                size="lg"
                className="w-full sm:w-auto"
              >
                Book a free assessment
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
              <ButtonLink
                href="/how-it-works"
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
              >
                See how it works
                <PlayCircle className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal delay={0.24}>
            <ul className="mt-9 flex flex-wrap gap-x-7 gap-y-3">
              {[
                "No commission-chasing",
                "Honest fit assessment",
                "Fees published",
              ].map((item) => (
                <li
                  key={item}
                  className="text-ink-muted flex items-center gap-2.5 text-[0.9375rem] font-medium"
                >
                  <span
                    aria-hidden="true"
                    className="bg-brand-tint grid h-5 w-5 shrink-0 place-items-center rounded-full"
                  >
                    <Check className="text-brand h-3 w-3" strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* The visual: a mock of the file-status view students actually get */}
        <Reveal delay={0.15} y={24} className="relative lg:pl-4">
          <FileStatusCard />
        </Reveal>
      </div>
    </section>
  );
}
