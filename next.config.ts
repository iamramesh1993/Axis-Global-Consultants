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
 * Served over http locally, so upgrade-insecure-requests would rewrite every
 * asset to https and fail the TLS handshake — Safari/WebKit is strict about
 * this. Only emit it where there is real TLS to upgrade to.
 */
const httpsOnly = process.env.VERCEL ? ["upgrade-insecure-requests"] : [];

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
  ...httpsOnly,
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
