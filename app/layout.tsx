import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { site } from "@/lib/site";
import { robotsMeta } from "@/lib/seo";
import "./globals.css";

/**
 * Display face: Space Grotesk — geometric grotesk, tight tracking, reads modern.
 * (Satoshi / General Sans are the ideal picks but aren't on Google Fonts;
 * swap them in via next/font/local later if we license them.)
 */
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Study in the UK, Canada & Australia`,
    template: `%s · ${site.shortName}`,
  },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: site.name,
    url: site.url,
    title: `${site.name} — Study in the UK, Canada & Australia`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Study in the UK, Canada & Australia`,
    description: site.description,
  },
  robots: robotsMeta,
};

export const viewport: Viewport = {
  themeColor: "#0b0b0f",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} antialiased`}
      >
        <a
          href="#main"
          className="focus:bg-accent focus:text-on-accent sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-lg focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
