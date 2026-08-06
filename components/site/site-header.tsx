"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { ButtonLink } from "@/components/ui/button";
import { mainNav } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the drawer on route change.
  useEffect(() => setOpen(false), [pathname]);

  // Lock scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "border-line bg-page/90 sticky top-0 z-50 border-b backdrop-blur-xl transition-shadow duration-200",
        (scrolled || open) && "shadow-[0_1px_3px_rgb(15_23_42_/_0.06)]",
      )}
    >
      <div className="container-page flex h-18 items-center justify-between gap-6">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-0.5 lg:flex">
          {mainNav.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-lg px-3 py-2 text-[0.9375rem] font-medium transition-colors duration-200",
                  active
                    ? "bg-brand-tint text-brand"
                    : "text-ink-muted hover:bg-panel hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink
            href="/contact"
            size="sm"
            className="hidden sm:inline-flex"
          >
            Book a free assessment
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </ButtonLink>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="rounded-control border-line-strong text-ink hover:border-brand hover:text-brand grid h-11 w-11 place-items-center border transition-colors lg:hidden"
          >
            {open ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="border-line bg-page border-t lg:hidden"
      >
        <nav aria-label="Mobile" className="container-page flex flex-col py-3">
          {mainNav.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "border-line flex items-center justify-between border-b py-4 text-base font-semibold transition-colors last:border-b-0",
                  active ? "text-brand" : "text-ink",
                )}
              >
                {item.longLabel}
                <ArrowRight
                  className="text-ink-subtle h-4 w-4"
                  aria-hidden="true"
                />
              </Link>
            );
          })}
          <ButtonLink href="/contact" size="lg" className="mt-5 mb-2 w-full">
            Book a free assessment
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </ButtonLink>
        </nav>
      </div>
    </header>
  );
}
