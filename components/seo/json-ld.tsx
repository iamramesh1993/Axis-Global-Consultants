import { site, liveSocials } from "@/lib/site";
import type { Faq } from "@/lib/content-schema";

/**
 * Structured data. Rendered as a plain script tag so it lands in the static HTML
 * — which is what both search crawlers and answer engines actually read.
 */
function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Content is built from our own typed data, never from user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        "@id": `${site.url}/#organization`,
        name: site.name,
        url: site.url,
        description: site.description,
        email: site.contact.email,
        telephone: site.contact.phone,
        areaServed: { "@type": "Country", name: "Pakistan" },
        address: {
          "@type": "PostalAddress",
          addressLocality: site.contact.address.locality,
          postalCode: site.contact.address.postalCode,
          addressCountry: "PK",
        },
        // Only real profiles. Pointing a search engine at a 404 is worse than
        // saying nothing about a platform we are not on yet.
        sameAs: liveSocials.map((s) => s.url),
        knowsAbout: [
          "Study abroad advisory",
          "UK Student visa",
          "Canada study permit",
          "Australia subclass 500 student visa",
          "MBBS abroad PMDC recognition",
        ],
      }}
    />
  );
}

export function WebSiteJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: site.name,
        publisher: { "@id": `${site.url}/#organization` },
        inLanguage: "en",
      }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; path: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          item: `${site.url}${item.path === "/" ? "" : item.path}`,
        })),
      }}
    />
  );
}

export function FaqJsonLd({ faqs }: { faqs: readonly Faq[] }) {
  if (faqs.length === 0) return null;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      }}
    />
  );
}

export function ArticleJsonLd({
  title,
  description,
  path,
  datePublished,
  dateModified,
}: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
}) {
  const url = `${site.url}${path}`;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        datePublished,
        dateModified: dateModified ?? datePublished,
        author: { "@type": "Organization", name: site.name, url: site.url },
        publisher: { "@id": `${site.url}/#organization` },
        inLanguage: "en",
      }}
    />
  );
}

export function ServiceJsonLd({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Service",
        name,
        description,
        serviceType: "Overseas education advisory",
        provider: { "@id": `${site.url}/#organization` },
        areaServed: { "@type": "Country", name: "Pakistan" },
        url: `${site.url}${path}`,
      }}
    />
  );
}
