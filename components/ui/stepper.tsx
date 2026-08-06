import { stages } from "@/lib/site";
import { Reveal } from "@/components/ui/reveal";

/**
 * The seven published stages.
 * Vertical rail on mobile, horizontal rail from lg — same markup either way, so
 * there is one accessible ordered list rather than two competing copies.
 */
export function Stepper() {
  return (
    <ol className="relative mt-14 grid gap-10 md:grid-cols-2 md:gap-x-10 md:gap-y-12 lg:grid-cols-4 xl:grid-cols-7 xl:gap-x-4">
      {stages.map((stage, i) => (
        <Reveal as="li" key={stage.key} delay={i * 0.05} className="relative">
          {/* Rail: vertical on mobile, horizontal from xl */}
          <span
            aria-hidden="true"
            className="bg-line absolute top-11 left-[17px] h-[calc(100%+1rem)] w-px md:hidden"
          />
          <span
            aria-hidden="true"
            className="bg-line absolute top-[17px] left-10 hidden h-px w-[calc(100%-2.5rem)] xl:block"
          />

          <div className="relative flex items-start gap-4 md:block">
            <span className="border-line bg-card text-brand relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full border text-sm font-bold shadow-[0_1px_2px_rgb(15_23_42_/_0.05)]">
              {stage.n}
            </span>
            <div className="md:mt-5">
              <h3 className="text-base font-bold tracking-[-0.01em]">
                {stage.title}
              </h3>
              <p className="text-ink-muted mt-2 text-[0.9375rem] leading-relaxed">
                {stage.blurb}
              </p>
            </div>
          </div>
        </Reveal>
      ))}
    </ol>
  );
}
