/**
 * Analytics helpers. Every call is a no-op unless the relevant env var is set,
 * so local development and preview deployments stay clean.
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export const analyticsEnabled = Boolean(GA_ID || META_PIXEL_ID);

/** Fired on a successful lead submission. */
export function trackLead(detail: { country: string; intake: string }) {
  if (typeof window === "undefined") return;

  if (GA_ID && window.gtag) {
    window.gtag("event", "generate_lead", {
      target_country: detail.country,
      intake: detail.intake,
    });
  }

  if (META_PIXEL_ID && window.fbq) {
    window.fbq("track", "Lead", {
      content_category: detail.country,
      content_name: detail.intake,
    });
  }
}

/** Fired when a student opens the assessment form. */
export function trackFormStart() {
  if (typeof window === "undefined") return;
  if (GA_ID && window.gtag) window.gtag("event", "begin_form");
  if (META_PIXEL_ID && window.fbq) window.fbq("track", "InitiateCheckout");
}

/**
 * Reads UTM params and referrer for lead attribution.
 * Returns a compact string rather than an object so it fits one text column.
 */
export function captureSource(): string | undefined {
  if (typeof window === "undefined") return undefined;

  const params = new URLSearchParams(window.location.search);
  const parts: string[] = [];

  for (const key of [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
    "fbclid",
    "gclid",
  ]) {
    const value = params.get(key);
    if (value) parts.push(`${key}=${value.slice(0, 100)}`);
  }

  if (parts.length === 0 && document.referrer) {
    try {
      const ref = new URL(document.referrer);
      if (ref.hostname !== window.location.hostname) {
        parts.push(`referrer=${ref.hostname}`);
      }
    } catch {
      // Malformed referrer — not worth reporting.
    }
  }

  parts.push(`landing=${window.location.pathname}`);

  return parts.join("&").slice(0, 500);
}
