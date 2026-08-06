import { AlertTriangle, ExternalLink } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { formatDate } from "@/lib/format";
import type { Fact, Source, Intake } from "@/lib/content-schema";

export function FactGrid({ facts }: { facts: readonly Fact[] }) {
  return (
    <dl className="rounded-card border-line bg-line grid gap-px overflow-hidden border shadow-[var(--shadow-soft)] sm:grid-cols-2 lg:grid-cols-3">
      {facts.map((fact, i) => (
        <Reveal key={fact.label} delay={i * 0.03} className="bg-card p-6">
          <dt className="text-ink-subtle text-sm">{fact.label}</dt>
          <dd className="text-brand mt-2 text-xl font-extrabold tracking-[-0.02em]">
            {fact.value}
          </dd>
          {fact.note && (
            <p className="text-ink-muted mt-2 text-sm leading-relaxed">
              {fact.note}
            </p>
          )}
        </Reveal>
      ))}
    </dl>
  );
}

export function IntakeList({ intakes }: { intakes: readonly Intake[] }) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2">
      {intakes.map((intake, i) => (
        <Reveal
          as="li"
          key={intake.name}
          delay={i * 0.05}
          className="rounded-card border-line bg-card border p-6 shadow-[var(--shadow-soft)]"
        >
          <p className="text-[1.0625rem] font-bold tracking-[-0.015em]">
            {intake.name}
          </p>
          <p className="text-brand mt-1.5 text-sm font-semibold">
            {intake.months}
          </p>
          {intake.note && (
            <p className="text-ink-muted mt-3 text-[0.9375rem] leading-relaxed">
              {intake.note}
            </p>
          )}
        </Reveal>
      ))}
    </ul>
  );
}

export function RiskList({ risks }: { risks: readonly string[] }) {
  return (
    <ul className="space-y-4">
      {risks.map((risk, i) => (
        <Reveal
          as="li"
          key={risk}
          delay={i * 0.04}
          className="rounded-card border-line bg-card flex gap-4 border p-5 shadow-[var(--shadow-soft)]"
        >
          <AlertTriangle
            className="text-danger mt-0.5 h-[1.125rem] w-[1.125rem] shrink-0"
            aria-hidden="true"
          />
          <p className="text-ink-muted text-[0.9375rem] leading-relaxed">
            {risk}
          </p>
        </Reveal>
      ))}
    </ul>
  );
}

export function SourceList({
  sources,
  verifiedOn,
}: {
  sources: readonly Source[];
  verifiedOn?: string;
}) {
  return (
    <div className="rounded-card border-line bg-panel border p-6">
      <p className="text-eyebrow text-ink-subtle font-semibold uppercase">
        Sources
      </p>
      {verifiedOn && (
        <p className="text-ink-muted mt-3 text-[0.9375rem] leading-relaxed">
          Every figure on this page was checked against the official sources
          below on{" "}
          <span className="text-ink font-semibold">
            {formatDate(verifiedOn)}
          </span>
          . Government rules change — if you spot something out of date,{" "}
          <a
            href="/contact"
            className="text-brand decoration-brand/30 hover:decoration-brand font-semibold underline underline-offset-4"
          >
            tell us
          </a>{" "}
          and we will fix it.
        </p>
      )}
      <ul className="mt-5 space-y-3">
        {sources.map((source) => (
          <li key={source.url}>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-muted hover:text-brand inline-flex items-start gap-2.5 text-[0.9375rem] transition-colors"
            >
              <ExternalLink
                className="text-brand mt-1 h-3.5 w-3.5 shrink-0"
                aria-hidden="true"
              />
              {source.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
