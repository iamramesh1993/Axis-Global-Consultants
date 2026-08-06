import type { MetadataRoute } from "next";
import { isIndexable } from "@/lib/seo";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  if (!isIndexable) {
    // Pre-launch: block everything. See lib/seo.ts.
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    // /admin and the admin API are staff-only and must stay out of the index
    // even once the marketing site is indexable.
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
