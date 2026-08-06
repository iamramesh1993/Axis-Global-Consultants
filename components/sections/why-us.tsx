import { Check, X } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

/**
 * "Old way vs Axis way". No competitor is named — the contrast is with a
 * practice, not a company.
 */
const comparisons = [
  {
    old: "“Free consultation” that is really a sales meeting",
    ours: "A written profile assessment you keep, whether or not you sign",
  },
  {
    old: "Shortlists shaped by which university pays the most commission",
    ours: "Shortlists ranked by fit, with the rejection risk stated on each",
  },
  {
    old: "Silence after the first meeting, until you chase",
    ours: "A named advisor and a defined stage your file sits in",
  },
  {
    old: "“You will definitely get in” — then a refusal nobody explains",
    ours: "Honest odds up front, and the reason if it goes wrong",
  },
  {
    old: "Fees that appear once you are committed",
    ours: "Fees published before you decide anything",
  },
  {
    old: "Advice quoting rules that changed two years ago",
    ours: "Every figure on this site dated and sourced to the government page",
  },
];

export function WhyUs() {
  return (
    <Section id="why-us" tone="panel">
      <SectionHeader
        eyebrow="Why us"
        title={
          <>
            Why students trust <span className="text-brand">Axis Global</span>
          </>
        }
        lead="Not a swipe at anyone in particular. Just the specific things students tell us went wrong last time."
        align="center"
      />

      <div className="rounded-card border-line bg-card mt-14 overflow-hidden border shadow-[var(--shadow-soft)]">
        {/* Column headers — desktop only; mobile gets inline labels instead */}
        <div className="border-line bg-panel hidden border-b md:grid md:grid-cols-2">
          <div className="px-7 py-4">
            <p className="text-eyebrow text-ink-subtle font-semibold uppercase">
              The old way
            </p>
          </div>
          <div className="border-line border-l px-7 py-4">
            <p className="text-eyebrow text-brand font-semibold uppercase">
              The Axis way
            </p>
          </div>
        </div>

        <ul className="divide-line divide-y">
          {comparisons.map((row, i) => (
            <Reveal as="li" key={row.ours} delay={i * 0.04}>
              <div className="grid md:grid-cols-2">
                <div className="flex gap-3.5 px-7 py-6">
                  <span
                    aria-hidden="true"
                    className="bg-panel mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full"
                  >
                    <X className="text-ink-subtle h-3 w-3" strokeWidth={3} />
                  </span>
                  <p className="text-ink-subtle text-[0.9375rem] leading-relaxed">
                    <span className="mb-1.5 block text-[0.6875rem] font-semibold tracking-[0.08em] uppercase md:hidden">
                      Old way
                    </span>
                    {row.old}
                  </p>
                </div>
                <div className="border-line flex gap-3.5 border-t px-7 py-6 md:border-t-0 md:border-l">
                  <span
                    aria-hidden="true"
                    className="bg-brand-tint mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full"
                  >
                    <Check className="text-brand h-3 w-3" strokeWidth={3} />
                  </span>
                  <p className="text-ink text-[0.9375rem] leading-relaxed">
                    <span className="text-brand mb-1.5 block text-[0.6875rem] font-semibold tracking-[0.08em] uppercase md:hidden">
                      Axis way
                    </span>
                    {row.ours}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}
