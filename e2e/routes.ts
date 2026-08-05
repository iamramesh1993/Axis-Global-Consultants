/** Every page route the site is expected to serve. Kept in one place so the
 *  smoke, SEO and a11y suites can't drift apart. */
export const PAGE_ROUTES = [
  "/",
  "/study/uk",
  "/study/canada",
  "/study/australia",
  "/study/uzbekistan",
  "/how-it-works",
  "/about",
  "/contact",
  "/guides",
  "/guides/uk-graduate-route-deadline-2027",
  "/guides/proof-of-funds-mistakes-pakistani-students",
  "/guides/mbbs-abroad-pmdc-rules-pakistan",
  "/privacy",
  "/terms",
] as const;

export const NON_PAGE_ROUTES = [
  "/robots.txt",
  "/sitemap.xml",
  "/llms.txt",
  "/manifest.webmanifest",
  "/icon.svg",
] as const;

/** Redirects declared in next.config.ts. */
export const REDIRECTS = [
  { from: "/uk", to: "/study/uk" },
  { from: "/canada", to: "/study/canada" },
  { from: "/australia", to: "/study/australia" },
  { from: "/uzbekistan", to: "/study/uzbekistan" },
  { from: "/blog", to: "/guides" },
  {
    from: "/blog/uk-graduate-route-deadline-2027",
    to: "/guides/uk-graduate-route-deadline-2027",
  },
] as const;
