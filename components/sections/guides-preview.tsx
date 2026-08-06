import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { getAllGuides } from "@/lib/content";
import { formatDate } from "@/lib/format";

export function GuidesPreview() {
  const guides = getAllGuides().slice(0, 3);
  if (guides.length === 0) return null;

  return (
    <Section id="guides" tone="page">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeader
          eyebrow="Guides"
          title="The things we wish someone had told you first."
          className="max-w-xl"
        />
        <Reveal delay={0.1}>
          <ButtonLink href="/guides" variant="secondary" size="sm">
            All guides
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </ButtonLink>
        </Reveal>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {guides.map((guide, i) => (
          <Reveal key={guide.slug} delay={i * 0.08}>
            <Link
              href={`/guides/${guide.slug}`}
              className="group rounded-card border-line bg-card hover:border-line-strong flex h-full flex-col border p-7 shadow-[var(--shadow-soft)] transition-[border-color,transform,box-shadow] duration-200 [transition-timing-function:var(--ease-out-soft)] hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
            >
              <div className="flex flex-wrap items-center gap-2">
                {guide.frontmatter.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="bg-brand-tint text-brand rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h3 className="group-hover:text-brand mt-5 text-[1.0625rem] leading-snug font-bold tracking-[-0.015em] transition-colors">
                {guide.frontmatter.title}
              </h3>

              <p className="text-ink-muted mt-3 flex-1 text-[0.9375rem] leading-relaxed">
                {guide.frontmatter.excerpt}
              </p>

              <p className="text-ink-subtle mt-7 flex items-center gap-2 text-xs">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                {formatDate(guide.frontmatter.date)} ·{" "}
                {guide.frontmatter.readingMinutes} min read
              </p>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
