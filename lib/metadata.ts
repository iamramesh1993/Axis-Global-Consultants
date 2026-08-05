import type { Metadata } from "next";
import { site } from "@/lib/site";
import { robotsMeta } from "@/lib/seo";

/**
 * Builds page metadata with a canonical URL and a matching dynamic OG image.
 * Every page should go through here so canonicals and OG never drift.
 */
export function pageMetadata({
  title,
  description,
  path,
  ogTitle,
  ogSubtitle,
  type = "website",
  publishedTime,
  modifiedTime,
}: {
  title: string;
  description: string;
  /** Route path starting with "/" */
  path: string;
  ogTitle?: string;
  ogSubtitle?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
}): Metadata {
  const url = `${site.url}${path === "/" ? "" : path}`;
  const ogParams = new URLSearchParams({ title: ogTitle ?? title });
  if (ogSubtitle) ogParams.set("subtitle", ogSubtitle);
  const ogImage = `${site.url}/api/og?${ogParams.toString()}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    robots: robotsMeta,
    openGraph: {
      type,
      url,
      siteName: site.name,
      locale: site.locale,
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
