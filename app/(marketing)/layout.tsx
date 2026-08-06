import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { MobileCta } from "@/components/site/mobile-cta";

/**
 * The public site's chrome.
 *
 * This lives in a route group rather than the root layout so /admin can have its
 * own. When the header sat in the root layout, the admin dashboard rendered both
 * it and the admin bar — two stacked headers, with the marketing nav and a
 * "Book a free assessment" CTA above a staff-only page.
 *
 * A nested layout cannot remove a parent's chrome, so separating them at the
 * root is the only structural fix. Route groups do not affect URLs.
 */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
      <MobileCta />
    </>
  );
}
