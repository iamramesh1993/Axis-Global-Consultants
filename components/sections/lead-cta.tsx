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
    <Section id="assessment" tone="panel">
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <Reveal>
          <p className="text-eyebrow text-brand font-semibold uppercase">
            {eyebrow}
          </p>
          <h2 className="text-heading mt-4">{title}</h2>
          <p className="text-lead text-ink-muted mt-5">{lead}</p>

          <ul className="border-line mt-9 space-y-5 border-t pt-9">
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
                  className="bg-brand mt-2 h-2 w-2 shrink-0 rounded-full"
                />
                <div>
                  <p className="text-[0.9375rem] font-bold">{label}</p>
                  <p className="text-ink-muted mt-1 text-[0.9375rem]">{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1} y={20}>
          <div className="rounded-card-lg border-line bg-card border p-7 shadow-[var(--shadow-card)] md:p-9">
            <LeadForm defaultCountry={defaultCountry} />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
