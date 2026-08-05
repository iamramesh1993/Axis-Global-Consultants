import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { LeadForm } from "@/components/forms/lead-form";
import type { TARGET_COUNTRIES } from "@/lib/validation";

export function LeadCta({
  defaultCountry,
  title = "Find out where you actually stand.",
  lead = "A free profile assessment. We read your grades, budget and timeline and tell you honestly what is realistic — including when the answer is “not yet”.",
  eyebrow = "Free assessment",
}: {
  defaultCountry?: (typeof TARGET_COUNTRIES)[number];
  title?: string;
  lead?: string;
  eyebrow?: string;
}) {
  return (
    <Section id="assessment" className="scroll-mt-24">
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <Reveal>
          <p className="text-eyebrow text-accent font-sans uppercase">
            {eyebrow}
          </p>
          <h2 className="text-heading mt-4">{title}</h2>
          <p className="text-lead text-fg-muted mt-5">{lead}</p>

          <ul className="border-line mt-8 space-y-4 border-t pt-8">
            {[
              ["One working day", "That is when you hear back from a person."],
              [
                "No obligation",
                "You keep the assessment whether or not you work with us.",
              ],
              [
                "An honest no",
                "If we cannot help, we will say so and tell you why.",
              ],
            ].map(([label, body]) => (
              <li key={label} className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="bg-accent mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                />
                <div>
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-fg-muted mt-1 text-sm">{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1} y={24}>
          <div className="rounded-card-lg border-line-strong bg-ink-raised/60 border p-6 shadow-[var(--shadow-card)] md:p-8">
            <LeadForm defaultCountry={defaultCountry} />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
