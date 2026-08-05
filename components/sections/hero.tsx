import { ArrowRight, Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { FileStatusCard } from "@/components/sections/file-status-card";

export function Hero() {
  return (
    <section className="bg-grain relative isolate overflow-hidden">
      {/* Backdrop: hairline grid, faded out toward the bottom */}
      <div
        aria-hidden="true"
        className="bg-grid absolute inset-0 -z-10 [mask-image:radial-gradient(120%_80%_at_50%_0%,black,transparent_75%)] opacity-60"
      />
      {/* Accent bloom behind the headline */}
      <div
        aria-hidden="true"
        className="bg-accent/9 absolute -top-48 left-1/2 -z-10 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full blur-[110px] md:left-[24%]"
      />

      <div className="container-page relative grid items-center gap-14 pt-14 pb-20 md:pt-20 md:pb-28 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pt-24">
        {/* Copy */}
        <div>
          <Reveal>
            <span className="border-line-strong text-eyebrow text-fg-muted inline-flex items-center gap-2 rounded-full border bg-white/[0.03] px-3.5 py-1.5 font-sans uppercase">
              <span className="relative flex h-1.5 w-1.5">
                <span className="bg-accent absolute inline-flex h-full w-full animate-ping rounded-full opacity-70" />
                <span className="bg-accent relative inline-flex h-1.5 w-1.5 rounded-full" />
              </span>
              Now advising for Jan &amp; Sep 2027 intakes
            </span>
          </Reveal>

          <Reveal delay={0.06}>
            <h1 className="text-display-xl mt-7">
              Know exactly
              <br />
              where you
              <br />
              <span className="text-gradient-accent">stand.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="text-lead text-fg-muted mt-7 max-w-lg">
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
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
              >
                See how it works
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal delay={0.24}>
            <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-3">
              {[
                "No commission-chasing",
                "Honest fit assessment",
                "Fees published",
              ].map((item) => (
                <li
                  key={item}
                  className="text-fg-muted flex items-center gap-2 text-sm"
                >
                  <Check
                    className="text-accent h-4 w-4 shrink-0"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* The visual: a mock of the file-status view students actually get */}
        <Reveal delay={0.15} y={28} className="relative lg:pl-6">
          <FileStatusCard />
        </Reveal>
      </div>
    </section>
  );
}
