import { AlertTriangle, ExternalLink } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { formatDate } from "@/lib/format";
import type { Fact, Source, Intake } from "@/lib/content-schema";

export function FactGrid({ facts }: { facts: readonly Fact[] }) {
  return (
    <dl className="rounded-card border-line bg-line grid gap-px overflow-hidden border sm:grid-cols-2 lg:grid-cols-3">
      {facts.map((fact, i) => (
        <Reveal
          key={fact.label}
          delay={i * 0.03}
          className="bg-ink-raised/70 p-5"
        >
          <dt className="text-fg-subtle text-xs">{fact.label}</dt>
          <dd className="font-display text-accent mt-2 text-lg font-semibold tracking-tight">
            {fact.value}
          </dd>
          {fact.note && (
            <p className="text-fg-muted mt-1.5 text-xs leading-relaxed">
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
    <ul className="grid gap-4 sm:grid-cols-2">
      {intakes.map((intake, i) => (
        <Reveal
          as="li"
          key={intake.name}
          delay={i * 0.05}
          className="rounded-card border-line bg-ink-raised/50 border p-5"
        >
          <p className="font-display text-base font-semibold tracking-tight">
            {intake.name}
          </p>
          <p className="text-accent mt-1.5 text-sm">{intake.months}</p>
          {intake.note && (
            <p className="text-fg-muted mt-2.5 text-sm leading-relaxed">
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
        <Reveal as="li" key={risk} delay={i * 0.04} className="flex gap-4">
          <AlertTriangle
            className="text-danger/80 mt-0.5 h-4 w-4 shrink-0"
            aria-hidden="true"
          />
          <p className="text-fg-muted text-sm leading-relaxed">{risk}</p>
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
    <div className="rounded-card border-line bg-ink-raised/40 border p-5">
      <p className="text-eyebrow text-fg-subtle font-sans uppercase">Sources</p>
      {verifiedOn && (
        <p className="text-fg-muted mt-3 text-sm">
          Every figure on this page was checked against the official sources
          below on{" "}
          <span className="text-fg font-medium">{formatDate(verifiedOn)}</span>.
          Government rules change — if you spot something out of date,{" "}
          <a
            href="/contact"
            className="text-accent decoration-accent/30 underline underline-offset-4"
          >
            tell us
          </a>{" "}
          and we will fix it.
        </p>
      )}
      <ul className="mt-4 space-y-2.5">
        {sources.map((source) => (
          <li key={source.url}>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-fg-muted hover:text-accent inline-flex items-start gap-2 text-sm transition-colors"
            >
              <ExternalLink
                className="mt-0.5 h-3.5 w-3.5 shrink-0"
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
