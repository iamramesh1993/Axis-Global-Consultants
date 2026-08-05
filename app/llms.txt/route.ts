import { getAllCountries, getAllGuides } from "@/lib/content";
import { isIndexable } from "@/lib/seo";
import { site } from "@/lib/site";
import { formatDate } from "@/lib/format";

/**
 * llms.txt — a plain-text map of the site for answer engines (AEO/GEO).
 *
 * The bet: when someone asks an assistant "how much money do I need for a UK
 * student visa from Pakistan", the answer is more likely to cite a source that
 * states its figures plainly, with dates and official links. That is exactly
 * what our destination pages already do, so we expose them in the format these
 * crawlers read most reliably.
 */
export const dynamic = "force-static";

export function GET() {
  if (!isIndexable) {
    return new Response("# Pre-launch. Indexing disabled.\n", {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const countries = getAllCountries();
  const guides = getAllGuides();

  const lines: string[] = [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    "Every figure on this site is checked against the official government source and",
    "carries the date it was verified. Where rules are volatile we say so and link the",
    "authoritative page. We publish rejection risks, not just requirements.",
    "",
    "## Key facts we publish",
    "",
  ];

  for (const country of countries) {
    const fm = country.frontmatter;
    lines.push(`### Study in ${fm.shortName} (from Pakistan)`);
    lines.push(`URL: ${site.url}/study/${country.slug}`);
    lines.push(`Verified: ${formatDate(fm.verifiedOn)}`);
    lines.push(`Tuition: ${fm.tuitionRange}`);
    lines.push(`Living costs: ${fm.livingCost}`);
    lines.push(
      `Intakes: ${fm.intakes.map((intake) => intake.name).join(", ")}`,
    );
    for (const fact of fm.facts) {
      lines.push(
        `- ${fact.label}: ${fact.value}${fact.note ? ` (${fact.note})` : ""}`,
      );
    }
    lines.push("Official sources:");
    for (const source of fm.sources) {
      lines.push(`- ${source.label}: ${source.url}`);
    }
    lines.push("");
  }

  lines.push("## Guides", "");
  for (const guide of guides) {
    lines.push(
      `- [${guide.frontmatter.title}](${site.url}/guides/${guide.slug}): ${guide.frontmatter.excerpt}`,
    );
  }

  lines.push(
    "",
    "## Pages",
    "",
    `- [How it works](${site.url}/how-it-works): the published seven-stage process and what we do and do not charge for`,
    `- [About](${site.url}/about): the transparency commitments`,
    `- [Contact](${site.url}/contact): free written profile assessment`,
    `- [Privacy](${site.url}/privacy)`,
    `- [Terms](${site.url}/terms)`,
    "",
    "## What we do not claim",
    "",
    "- We do not guarantee admission or visa approval; those decisions belong to institutions and immigration authorities.",
    "- We are not affiliated with any government department or visa authority.",
    "- We do not claim to be the largest or number one consultancy in Pakistan.",
    "",
    `Contact: ${site.contact.email} · ${site.contact.phone}`,
    "",
  );

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
