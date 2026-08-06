import type { NextConfig } from "next";

/**
 * Content Security Policy.
 *
 * 'unsafe-inline' on script-src is required by GA4 and the Meta Pixel bootstrap
 * snippets, which are inline by design. Tightening this to a nonce means moving
 * both to a tag-manager container or dropping them — worth doing later, noted
 * here so the trade-off is explicit rather than accidental.
 */
const isProd = process.env.NODE_ENV === "production";

/**
 * Note on `upgrade-insecure-requests`: deliberately absent.
 *
 * It rewrites every asset request to https, which fails the TLS handshake on a
 * local http build — WebKit is strict about this and it breaks the entire
 * stylesheet, not just one request. Gating it on an env var turned out to be
 * fragile too: `vercel env pull` writes VERCEL=1 into .env.local, so a local
 * build silently started emitting it again.
 *
 * It is also redundant here. Every source below is already 'self' or an
 * explicit https origin, Vercel redirects http→https at the edge, and HSTS with
 * preload pins the domain to https in the browser. So it buys nothing and has
 * cost two broken builds.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://connect.facebook.net",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://www.googletagmanager.com https://www.google-analytics.com https://www.facebook.com",
  "font-src 'self' data:",
  "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://www.googletagmanager.com https://connect.facebook.net https://graph.facebook.com",
  "frame-src 'self' https://www.facebook.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  // HSTS only makes sense where the site is actually served over TLS.
  ...(isProd
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]
    : []),
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // Never cache the lead endpoint.
        source: "/api/leads",
        headers: [{ key: "Cache-Control", value: "no-store, max-age=0" }],
      },
    ];
  },

  async redirects() {
    return [
      // Apex is canonical. Without this, www serves the whole site too and
      // Google sees two copies of every page.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.axisglobalpk.com" }],
        destination: "https://axisglobalpk.com/:path*",
        permanent: true,
      },

      // Friendly shortcuts people type or that appear in ad copy.
      { source: "/study", destination: "/#destinations", permanent: false },
      { source: "/uk", destination: "/study/uk", permanent: true },
      { source: "/canada", destination: "/study/canada", permanent: true },
      {
        source: "/australia",
        destination: "/study/australia",
        permanent: true,
      },
      {
        source: "/uzbekistan",
        destination: "/study/uzbekistan",
        permanent: true,
      },
      { source: "/blog", destination: "/guides", permanent: true },
      { source: "/blog/:slug", destination: "/guides/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
