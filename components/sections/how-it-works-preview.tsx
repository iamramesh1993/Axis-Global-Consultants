import { ArrowRight } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/section";
import { Stepper } from "@/components/ui/stepper";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

export function HowItWorksPreview() {
  return (
    <Section id="how-it-works" tone="raised">
      <SectionHeader
        eyebrow="The process"
        title="Seven stages. You always know which one you're in."
        lead="Published up front, because a process you can see is a process you can hold us to."
      />

      <Stepper />

      <Reveal delay={0.1}>
        <div className="rounded-card border-line bg-ink mt-14 flex flex-col gap-5 border px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-fg-muted max-w-xl text-sm leading-relaxed">
            <span className="text-fg font-medium">
              Live status tracking is coming to your student portal.
            </span>{" "}
            Until it ships, you get the same detail the old-fashioned way — a
            named advisor who tells you where your file is without being chased.
          </p>
          <ButtonLink
            href="/how-it-works"
            variant="outline"
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
