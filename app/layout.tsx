import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { MobileCta } from "@/components/site/mobile-cta";
import { Analytics } from "@/components/analytics/analytics";
import { site } from "@/lib/site";
import { robotsMeta } from "@/lib/seo";
import "./globals.css";

/**
 * One family for the whole site. Headings run at 800, body at 400 — weight
 * carries the hierarchy rather than a second typeface, which is what gives the
 * Stripe/Linear register we're after.
 */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Study in the UK, Canada, Australia & Uzbekistan`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: site.shortName,
    statusBarStyle: "default",
  },
  formatDetection: {
    // Stop iOS turning every number in the copy into a phone link.
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: site.name,
    url: site.url,
    title: `${site.name} — Study in the UK, Canada, Australia & Uzbekistan`,
    description: site.description,
    images: [{ url: "/api/og", width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Study abroad, honestly`,
    description: site.description,
    images: ["/api/og"],
  },
  robots: robotsMeta,
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  // Lets the layout paint under the iOS notch and home bar; the safe-area
  // insets in globals.css and MobileCta keep content clear of both.
  viewportFit: "cover",
  // Never block pinch-zoom — capping it is an accessibility failure.
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/*
          Marks the document as JS-capable before first paint. The scroll-reveal
          CSS only hides content when this is set, so a failed or slow hydration
          leaves the page readable rather than blank. Inline and synchronous on
          purpose — a deferred script would let the un-revealed state flash.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.dataset.js="on"`,
          }}
        />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <a
          href="#main"
          className="focus:bg-brand focus:text-on-brand sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-lg focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <MobileCta />
        <Analytics />
      </body>
    </html>
  );
}
