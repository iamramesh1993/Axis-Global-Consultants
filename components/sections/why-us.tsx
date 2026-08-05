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
    <Section id="why-us">
      <SectionHeader
        eyebrow="Why us"
        title="The old way, and how we do it instead."
        lead="Not a swipe at anyone in particular. Just the specific things students tell us went wrong last time."
      />

      <div className="rounded-card-lg border-line mt-12 overflow-hidden border">
        {/* Column headers — desktop only; mobile gets inline labels instead */}
        <div className="border-line bg-ink-raised/60 hidden border-b md:grid md:grid-cols-2">
          <div className="px-6 py-4">
            <p className="text-eyebrow text-fg-subtle font-sans uppercase">
              The old way
            </p>
          </div>
          <div className="border-line border-l px-6 py-4">
            <p className="text-eyebrow text-accent font-sans uppercase">
              The Axis way
            </p>
          </div>
        </div>

        <ul className="divide-line divide-y">
          {comparisons.map((row, i) => (
            <Reveal as="li" key={row.ours} delay={i * 0.04}>
              <div className="grid md:grid-cols-2">
                <div className="flex gap-3 px-6 py-5">
                  <X
                    className="text-fg-subtle mt-0.5 h-4 w-4 shrink-0"
                    aria-hidden="true"
                  />
                  <p className="text-fg-subtle text-sm leading-relaxed">
                    <span className="mb-1 block text-xs font-medium tracking-wide uppercase md:hidden">
                      Old way
                    </span>
                    {row.old}
                  </p>
                </div>
                <div className="border-line bg-ink-raised/30 flex gap-3 border-t px-6 py-5 md:border-t-0 md:border-l">
                  <Check
                    className="text-accent mt-0.5 h-4 w-4 shrink-0"
                    aria-hidden="true"
                  />
                  <p className="text-fg text-sm leading-relaxed">
                    <span className="text-accent mb-1 block text-xs font-medium tracking-wide uppercase md:hidden">
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
