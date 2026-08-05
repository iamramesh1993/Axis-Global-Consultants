/**
 * Pre-launch indexing guard.
 *
 * Defaults to NOT indexable. Search engines only get a green light once
 * SITE_INDEXABLE=true is set in the environment — do that at Stage 5, when the
 * country pages, guides and lead form are all real. Until then Google would
 * only see a thin page, which is a bad first impression for the money keywords
 * ("study in uk from pakistan" and friends).
 *
 * Fails closed on purpose: a typo in the env var keeps us noindex rather than
 * silently publishing an unfinished site.
 */
export const isIndexable = process.env.SITE_INDEXABLE === "true";

/** Robots directives for Next.js `metadata`. */
export const robotsMeta = isIndexable
  ? { index: true, follow: true }
  : { index: false, follow: false, nocache: true };
