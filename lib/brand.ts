/**
 * Literal brand colours.
 *
 * Everything that renders in the browser should use the Tailwind tokens
 * (`bg-brand`, `text-ink`, …) which resolve to the CSS custom properties in
 * `app/globals.css`. That is the single source of truth for the palette.
 *
 * Two places genuinely cannot read those variables and need literals:
 *   - `app/manifest.ts` — a web manifest is JSON, with no CSS context
 *   - `app/api/og/route.tsx` — satori renders on the edge with no CSSOM
 *
 * They import from here rather than hardcoding, so there is one literal per
 * colour instead of one per file. If you change a value in globals.css, change
 * it here too — the test in `e2e/production-hygiene.spec.ts` does not catch a
 * drift between the two, because the OG image is a raster.
 */
export const BRAND_HEX = {
  brand: "#2563eb",
  brandHover: "#1d4ed8",
  brandLight: "#dbeafe",
  brandTint: "#eff6ff",

  page: "#ffffff",
  panel: "#f8fafc",

  ink: "#0f172a",
  inkMuted: "#475569",
  inkSubtle: "#94a3b8",

  line: "#e2e8f0",
} as const;
