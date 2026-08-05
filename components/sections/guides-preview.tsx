import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { getAllGuides } from "@/lib/content";
import { formatDate } from "@/lib/format";

export function GuidesPreview() {
  const guides = getAllGuides().slice(0, 3);
  if (guides.length === 0) return null;

  return (
    <Section id="guides">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeader
          eyebrow="Guides"
          title="The things we wish someone had told you first."
          className="max-w-xl"
        />
        <Reveal delay={0.1}>
          <ButtonLink href="/guides" variant="outline" size="sm">
            All guides
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </ButtonLink>
        </Reveal>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {guides.map((guide, i) => (
          <Reveal key={guide.slug} delay={i * 0.08}>
            <Link
              href={`/guides/${guide.slug}`}
              className="group rounded-card border-line bg-ink-raised/60 hover:border-accent/40 hover:bg-ink-raised flex h-full flex-col border p-6 transition-[border-color,transform,background-color] duration-300 [transition-timing-function:var(--ease-out-soft)] hover:-translate-y-1"
            >
              <div className="flex flex-wrap items-center gap-2">
                {guide.frontmatter.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="border-line text-fg-subtle rounded-full border px-2.5 py-1 text-[0.6875rem]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h3 className="font-display group-hover:text-accent mt-5 text-lg leading-snug font-semibold tracking-tight transition-colors">
                {guide.frontmatter.title}
              </h3>

              <p className="text-fg-muted mt-3 flex-1 text-sm leading-relaxed">
                {guide.frontmatter.excerpt}
              </p>

              <p className="text-fg-subtle mt-6 text-xs">
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
