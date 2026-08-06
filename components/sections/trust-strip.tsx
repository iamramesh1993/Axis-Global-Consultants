import { BadgeCheck, FileText, Radar } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

/**
 * The statistics-bar treatment: white card, thin border, blue icons, dark text,
 * no gradients.
 *
 * Words, not numbers. The brief is explicit that fabricated credibility metrics
 * ("10,000+ placed", "98% success") are the thing this brand positions against —
 * and /about states plainly that we don't claim to be number one. Swap in real,
 * auditable figures when they exist; until then these are claims we can defend.
 */
const claims = [
  {
    Icon: BadgeCheck,
    title: "No commission-chasing",
    body: "We are not paid more to send you somewhere expensive.",
  },
  {
    Icon: FileText,
    title: "Published process",
    body: "All seven stages are on this site, including the fees.",
  },
  {
    Icon: Radar,
    title: "You always know your status",
    body: "Where your file is, what is next, who has it.",
  },
];

export function TrustStrip() {
  return (
    /* A tight band under the hero rather than a full section — it belongs to
       the hero visually, so it sits inside the hero's rhythm, not the
       inter-section one. Kept outside <Section> deliberately. */
    <section className="bg-page pb-2">
      <div className="container-page">
        <Reveal>
          <div className="divide-line rounded-card border-line bg-card grid divide-y overflow-hidden border shadow-[var(--shadow-soft)] md:grid-cols-3 md:divide-x md:divide-y-0">
            {claims.map(({ Icon, title, body }) => (
              <div key={title} className="flex gap-4 px-6 py-7 md:px-7">
                <span
                  aria-hidden="true"
                  className="rounded-control bg-brand-tint grid h-11 w-11 shrink-0 place-items-center"
                >
                  <Icon className="text-brand h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-[0.9375rem] font-bold tracking-[-0.01em]">
                    {title}
                  </h2>
                  <p className="text-ink-muted mt-1.5 text-sm leading-relaxed">
                    {body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
