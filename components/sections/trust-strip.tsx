import { Reveal } from "@/components/ui/reveal";

/**
 * Words, not logos. The brief is explicit that fake credibility badges are the
 * thing we're positioning against.
 */
const claims = [
  {
    title: "No commission-chasing",
    body: "We are not paid more to send you somewhere expensive.",
  },
  {
    title: "Published process",
    body: "All seven stages are on this site, including the fees.",
  },
  {
    title: "You always know your status",
    body: "Where your file is, what is next, who has it.",
  },
];

export function TrustStrip() {
  return (
    <section className="border-line bg-ink-raised/40 border-y">
      <div className="container-page divide-line grid divide-y md:grid-cols-3 md:divide-x md:divide-y-0">
        {claims.map((claim, i) => (
          <Reveal
            key={claim.title}
            delay={i * 0.08}
            className="py-7 md:px-8 md:py-9 md:first:pl-0 md:last:pr-0"
          >
            <h2 className="font-display text-base font-semibold tracking-tight">
              {claim.title}
            </h2>
            <p className="text-fg-muted mt-2 text-sm leading-relaxed">
              {claim.body}
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
