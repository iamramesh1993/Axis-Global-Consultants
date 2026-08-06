import Link from "next/link";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { LeadCta } from "@/components/sections/lead-cta";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { getAllGuides } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { formatDate } from "@/lib/format";

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Guides", path: "/guides" },
];

export const metadata = pageMetadata({
  title: "Guides for Pakistani students studying abroad",
  description:
    "Straight guides to visas, proof of funds, intakes and the rules that actually decide your application — written for Pakistani students, dated and sourced.",
  path: "/guides",
  ogTitle: "Guides",
  ogSubtitle: "The things we wish someone had told you first",
});

export default function GuidesPage() {
  const guides = getAllGuides();

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />

      <PageHero
        eyebrow="Guides"
        title="The things we wish someone had told you first."
        lead="No filler, no “top 10 universities” listicles. Just the rules that decide applications, with the government source and the date we checked it."
        breadcrumbs={breadcrumbs}
      />

      <Section tone="panel">
        {guides.length === 0 ? (
          <p className="text-ink-muted">
            New guides are on the way. In the meantime, the destination pages
            carry the current figures.
          </p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {guides.map((guide, i) => (
              <Reveal key={guide.slug} delay={i * 0.06}>
                <Link
                  href={`/guides/${guide.slug}`}
                  className="group rounded-card border-line bg-page hover:border-brand/40 flex h-full flex-col border p-6 transition-[border-color,transform] duration-300 [transition-timing-function:var(--ease-out-soft)] hover:-translate-y-1 md:p-7"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    {guide.frontmatter.tags.map((tag) => (
                      <span
                        key={tag}
                        className="border-line text-ink-subtle rounded-full border px-2.5 py-1 text-[0.6875rem]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h2 className="group-hover:text-brand mt-5 text-xl leading-snug font-bold tracking-[-0.015em] transition-colors">
                    {guide.frontmatter.title}
                  </h2>

                  <p className="text-ink-muted mt-3 flex-1 text-sm leading-relaxed">
                    {guide.frontmatter.excerpt}
                  </p>

                  <p className="text-ink-subtle mt-6 text-xs">
                    {formatDate(guide.frontmatter.date)} ·{" "}
                    {guide.frontmatter.readingMinutes} min read
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </Section>

      <LeadCta />
    </>
  );
}
