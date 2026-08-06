import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/section";
import { PageHero } from "@/components/sections/page-hero";
import {
  FactGrid,
  IntakeList,
  RiskList,
  SourceList,
} from "@/components/sections/fact-grid";
import { FaqList } from "@/components/ui/faq";
import { LeadCta } from "@/components/sections/lead-cta";
import { MdxContent } from "@/components/mdx/mdx-content";
import {
  BreadcrumbJsonLd,
  FaqJsonLd,
  ServiceJsonLd,
} from "@/components/seo/json-ld";
import { getAllCountries, getCountry, getCountrySlugs } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { TARGET_COUNTRIES } from "@/lib/validation";

export const dynamicParams = false;

export function generateStaticParams() {
  return getCountrySlugs().map((country) => ({ country }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  const doc = getCountry(country);
  if (!doc) return {};

  return pageMetadata({
    title: doc.frontmatter.metaTitle,
    description: doc.frontmatter.metaDescription,
    path: `/study/${country}`,
    ogTitle: doc.frontmatter.title,
    ogSubtitle: doc.frontmatter.hook,
  });
}

export default async function CountryPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  const doc = getCountry(country);
  if (!doc) notFound();

  const fm = doc.frontmatter;
  const others = getAllCountries().filter((c) => c.slug !== country);

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: `Study in ${fm.shortName}`, path: `/study/${country}` },
  ];

  // Only pre-select the destination if it's one the form actually offers.
  const defaultCountry = (TARGET_COUNTRIES as readonly string[]).includes(
    fm.code,
  )
    ? (fm.code as (typeof TARGET_COUNTRIES)[number])
    : undefined;

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      <FaqJsonLd faqs={fm.faqs} />
      <ServiceJsonLd
        name={`Study in ${fm.shortName} advisory for Pakistani students`}
        description={fm.metaDescription}
        path={`/study/${country}`}
      />

      <PageHero
        eyebrow={`Destination · ${fm.code}`}
        title={fm.title}
        lead={fm.hook}
        breadcrumbs={breadcrumbs}
      >
        <div className="mt-9 grid gap-4 sm:grid-cols-3">
          {[
            ["Tuition", fm.tuitionRange],
            ["Living costs", fm.livingCost],
            ["Best for", fm.bestFor],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-card border-line bg-card border p-5"
            >
              <p className="text-ink-subtle text-xs">{label}</p>
              <p className="mt-2 text-sm leading-relaxed font-medium">
                {value}
              </p>
            </div>
          ))}
        </div>
      </PageHero>

      {/* Hard numbers first — this is what students came for */}
      <Section tone="panel">
        <SectionHeader
          eyebrow="The numbers"
          title="What it costs and what you must prove"
          lead="Checked against the official government pages, with the date we checked at the bottom of this page."
        />
        <div className="mt-10">
          <FactGrid facts={fm.facts} />
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="Intakes" title="When to apply" />
        <div className="mt-10">
          <IntakeList intakes={fm.intakes} />
        </div>
      </Section>

      {/* The honest bit */}
      <Section tone="panel">
        <SectionHeader
          eyebrow="Rejection risk"
          title="What commonly goes wrong"
          lead="No other consultancy in Pakistan puts this section on the page. It is the most useful thing here."
        />
        <div className="mt-10 max-w-3xl">
          <RiskList risks={fm.risks} />
        </div>
      </Section>

      {/* Long-form MDX */}
      <Section>
        <div className="max-w-3xl">
          <MdxContent source={doc.body} />
        </div>
      </Section>

      <Section tone="panel">
        <SectionHeader
          eyebrow="Questions"
          title={`Studying in ${fm.shortName}, answered`}
        />
        <div className="mt-10 max-w-3xl">
          <FaqList faqs={fm.faqs} />
        </div>
        <div className="mt-8 max-w-3xl">
          <SourceList sources={fm.sources} verifiedOn={fm.verifiedOn} />
        </div>
      </Section>

      <LeadCta
        defaultCountry={defaultCountry}
        eyebrow="Free assessment"
        title={`Is ${fm.shortName} realistic for you?`}
        lead="Send us your grades, budget and timeline. We will tell you honestly whether this destination fits — and which of the others might fit better."
      />

      {/* Internal linking: keeps crawl depth shallow and helps students compare */}
      <Section>
        <SectionHeader eyebrow="Compare" title="Other destinations" />
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {others.map((other) => (
            <Link
              key={other.slug}
              href={`/study/${other.slug}`}
              className="group rounded-card border-line bg-card hover:border-brand/40 flex items-center justify-between gap-4 border p-5 transition-colors"
            >
              <div>
                <p className="font-bold tracking-[-0.015em]">
                  Study in {other.frontmatter.shortName}
                </p>
                <p className="text-ink-muted mt-1.5 text-xs leading-relaxed">
                  {other.frontmatter.tuitionRange}
                </p>
              </div>
              <ArrowRight
                className="text-ink-subtle group-hover:text-brand h-4 w-4 shrink-0 transition-colors"
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
