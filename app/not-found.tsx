import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { ButtonLink } from "@/components/ui/button";
import { mainNav } from "@/lib/site";

export const metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    /*
     * The root not-found renders in the root layout, which carries no chrome
     * since the marketing header moved into the (marketing) route group. A 404
     * still has to look like the site, so it brings the chrome itself.
     */
    <>
      <SiteHeader />
      <main id="main" className="bg-page relative isolate overflow-hidden">
        <div
          aria-hidden="true"
          className="bg-grid absolute inset-0 -z-10 [mask-image:radial-gradient(100%_60%_at_50%_0%,black,transparent_70%)] opacity-40"
        />

        <div className="container-page flex min-h-[70vh] flex-col justify-center py-20">
          <p className="text-brand text-sm font-bold tracking-[0.12em] uppercase">
            404
          </p>

          <h1 className="text-display mt-5 max-w-2xl">
            That page doesn&apos;t exist.
          </h1>

          <p className="text-lead text-ink-muted mt-6 max-w-lg">
            The link is probably out of date. Everything on the site is one
            click from here.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/" size="lg" className="w-full sm:w-auto">
              Back to home
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink
              href="/contact"
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
            >
              Book a free assessment
            </ButtonLink>
          </div>

          <nav
            aria-label="Site pages"
            className="border-line mt-14 border-t pt-8"
          >
            <p className="text-eyebrow text-ink-subtle uppercase">
              Or try one of these
            </p>
            <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-ink-muted hover:text-brand text-sm transition-colors"
                  >
                    {item.longLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
