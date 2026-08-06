import { ArrowRight, Info } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/section";
import { Stepper } from "@/components/ui/stepper";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

export function HowItWorksPreview() {
  return (
    <Section id="how-it-works" tone="page">
      <SectionHeader
        eyebrow="The process"
        title="Seven stages. You always know which one you're in."
        lead="Published up front, because a process you can see is a process you can hold us to."
        align="center"
      />

      <Stepper />

      <Reveal delay={0.1}>
        <div className="rounded-card border-line bg-card mt-16 flex flex-col gap-5 border px-7 py-6 shadow-[var(--shadow-soft)] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-4">
            <span
              aria-hidden="true"
              className="rounded-control bg-brand-tint grid h-10 w-10 shrink-0 place-items-center"
            >
              <Info className="text-brand h-5 w-5" />
            </span>
            <p className="text-ink-muted max-w-xl text-[0.9375rem] leading-relaxed">
              <span className="text-ink font-semibold">
                Live status tracking is coming to your student portal.
              </span>{" "}
              Until it ships, you get the same detail the old-fashioned way — a
              named advisor who tells you where your file is without being
              chased.
            </p>
          </div>
          <ButtonLink
            href="/how-it-works"
            variant="secondary"
            className="shrink-0"
          >
            Read the full process
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </ButtonLink>
        </div>
      </Reveal>
    </Section>
  );
}
