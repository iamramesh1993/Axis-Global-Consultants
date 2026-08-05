import type { MetadataRoute } from "next";
import { getAllCountries, getAllGuides } from "@/lib/content";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = (
    [
      { url: `${site.url}/`, changeFrequency: "weekly", priority: 1 },
      {
        url: `${site.url}/how-it-works`,
        changeFrequency: "monthly",
        priority: 0.9,
      },
      { url: `${site.url}/contact`, changeFrequency: "monthly", priority: 0.9 },
      { url: `${site.url}/guides`, changeFrequency: "weekly", priority: 0.8 },
      { url: `${site.url}/about`, changeFrequency: "monthly", priority: 0.7 },
      { url: `${site.url}/privacy`, changeFrequency: "yearly", priority: 0.2 },
      { url: `${site.url}/terms`, changeFrequency: "yearly", priority: 0.2 },
    ] satisfies MetadataRoute.Sitemap
  ).map((entry) => ({ ...entry, lastModified: now }));

  const countryRoutes: MetadataRoute.Sitemap = getAllCountries().map(
    (country) => ({
      url: `${site.url}/study/${country.slug}`,
      // Destination pages carry the dated figures — that date is the real signal.
      lastModified: new Date(`${country.frontmatter.verifiedOn}T00:00:00Z`),
      changeFrequency: "monthly",
      priority: 0.95,
    }),
  );

  const guideRoutes: MetadataRoute.Sitemap = getAllGuides().map((guide) => ({
    url: `${site.url}/guides/${guide.slug}`,
    lastModified: new Date(
      `${guide.frontmatter.updated ?? guide.frontmatter.date}T00:00:00Z`,
    ),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...countryRoutes, ...guideRoutes];
}
