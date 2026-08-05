import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { Section, SectionHeader } from "@/components/ui/section";
import { SourceList } from "@/components/sections/fact-grid";
import { FaqList } from "@/components/ui/faq";
import { LeadCta } from "@/components/sections/lead-cta";
import { MdxContent } from "@/components/mdx/mdx-content";
import {
  ArticleJsonLd,
  BreadcrumbJsonLd,
  FaqJsonLd,
} from "@/components/seo/json-ld";
import { getAllGuides, getGuide, getGuideSlugs } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { formatDate } from "@/lib/format";

export const dynamicParams = false;

export function generateStaticParams() {
  return getGuideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = getGuide(slug);
  if (!doc) return {};

  return pageMetadata({
    title: doc.frontmatter.metaTitle ?? doc.frontmatter.title,
    description: doc.frontmatter.metaDescription,
    path: `/guides/${slug}`,
    ogTitle: doc.frontmatter.title,
    ogSubtitle: `${doc.frontmatter.readingMinutes} min read`,
    type: "article",
    publishedTime: doc.frontmatter.date,
    modifiedTime: doc.frontmatter.updated ?? doc.frontmatter.date,
  });
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = getGuide(slug);
  if (!doc) notFound();

  const fm = doc.frontmatter;
  const others = getAllGuides()
    .filter((g) => g.slug !== slug)
    .slice(0, 2);

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Guides", path: "/guides" },
    { name: fm.title, path: `/guides/${slug}` },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <FaqJsonLd faqs={fm.faqs} />
      <ArticleJsonLd
        title={fm.title}
        description={fm.metaDescription}
        path={`/guides/${slug}`}
        datePublished={fm.date}
        dateModified={fm.updated}
      />

      <PageHero
        title={fm.title}
        lead={fm.excerpt}
        breadcrumbs={breadcrumbs}
        meta={
          <div className="text-fg-subtle flex flex-wrap items-center gap-x-3 gap-y-2 text-xs">
            <span>{formatDate(fm.date)}</span>
            <span aria-hidden="true">·</span>
            <span>{fm.readingMinutes} min read</span>
            {fm.updated && (
              <>
                <span aria-hidden="true">·</span>
                <span>Updated {formatDate(fm.updated)}</span>
              </>
            )}
            {fm.tags.length > 0 && (
              <span className="flex flex-wrap gap-2">
                {fm.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border-line rounded-full border px-2.5 py-1 text-[0.6875rem]"
                  >
                    {tag}
                  </span>
                ))}
              </span>
            )}
          </div>
        }
      />

      <Section className="pt-0 md:pt-0">
        <article className="max-w-3xl">
          <MdxContent source={doc.body} />
        </article>
      </Section>

      {fm.faqs.length > 0 && (
        <Section tone="raised">
          <SectionHeader eyebrow="Questions" title="Quick answers" />
          <div className="mt-10 max-w-3xl">
            <FaqList faqs={fm.faqs} />
          </div>
        </Section>
      )}

      {fm.sources.length > 0 && (
        <Section className="pt-0 md:pt-0">
          <div className="max-w-3xl">
            <SourceList
              sources={fm.sources}
              verifiedOn={fm.updated ?? fm.date}
            />
          </div>
        </Section>
      )}

      <LeadCta
        eyebrow="Free assessment"
        title="Want this checked against your own profile?"
        lead="Send us your grades, budget and timeline. We will tell you exactly how these rules apply to you — before you pay anyone a deposit."
      />

      <Section tone="raised">
        <div className="flex flex-col gap-8">
          <Link
            href="/guides"
            className="text-fg-muted hover:text-accent inline-flex items-center gap-2 text-sm transition-colors"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            All guides
          </Link>

          {others.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              {others.map((other) => (
                <Link
                  key={other.slug}
                  href={`/guides/${other.slug}`}
                  className="group rounded-card border-line bg-ink hover:border-accent/40 flex items-start justify-between gap-4 border p-5 transition-colors"
                >
                  <div>
                    <p className="font-display leading-snug font-semibold tracking-tight">
                      {other.frontmatter.title}
                    </p>
                    <p className="text-fg-subtle mt-1.5 text-xs">
                      {other.frontmatter.readingMinutes} min read
                    </p>
                  </div>
                  <ArrowRight
                    className="text-fg-subtle group-hover:text-accent mt-1 h-4 w-4 shrink-0 transition-colors"
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
      </Section>
    </>
  );
}
