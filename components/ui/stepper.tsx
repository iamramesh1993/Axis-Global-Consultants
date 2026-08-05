import { stages } from "@/lib/site";
import { Reveal } from "@/components/ui/reveal";

/**
 * The seven published stages.
 * Horizontal rail on desktop, vertical rail on mobile — same markup, so there
 * is one accessible ordered list rather than two competing copies.
 */
export function Stepper() {
  return (
    <ol className="relative mt-12 grid gap-8 md:mt-16 md:grid-cols-4 md:gap-x-6 md:gap-y-12 lg:grid-cols-7 lg:gap-x-4">
      {stages.map((stage, i) => (
        <Reveal as="li" key={stage.key} delay={i * 0.05} className="relative">
          {/* Rail: vertical on mobile, horizontal from lg */}
          <span
            aria-hidden="true"
            className="bg-line absolute top-10 left-[15px] h-[calc(100%+2rem)] w-px md:hidden"
          />
          <span
            aria-hidden="true"
            className="bg-line absolute top-[15px] left-8 hidden h-px w-[calc(100%-2rem)] lg:block"
          />

          <div className="relative flex items-start gap-4 md:block">
            <span className="border-line-strong bg-ink font-display text-accent relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border text-xs font-semibold">
              {stage.n}
            </span>
            <div className="md:mt-5">
              <h3 className="font-display text-base font-semibold tracking-tight">
                {stage.title}
              </h3>
              <p className="text-fg-muted mt-2 text-sm leading-relaxed">
                {stage.blurb}
              </p>
            </div>
          </div>
        </Reveal>
      ))}
    </ol>
  );
}
