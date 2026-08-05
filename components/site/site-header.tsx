"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { ButtonLink } from "@/components/ui/button";
import { mainNav } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
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
        "sticky top-0 z-50 transition-colors duration-300",
        scrolled || open
          ? "border-line bg-ink/80 border-b backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-6 md:h-18">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {mainNav.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-3 py-2 text-sm transition-colors",
                  active
                    ? "text-fg"
                    : "text-fg-muted hover:text-fg hover:bg-white/[0.05]",
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
          </ButtonLink>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="border-line-strong text-fg hover:border-accent/60 hover:text-accent grid h-10 w-10 place-items-center rounded-full border transition-colors lg:hidden"
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
        className="border-line bg-ink border-t lg:hidden"
      >
        <nav aria-label="Mobile" className="container-page flex flex-col py-4">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="border-line font-display text-fg border-b py-3.5 text-lg tracking-tight last:border-b-0"
            >
              {item.longLabel}
            </Link>
          ))}
          <ButtonLink href="/contact" size="lg" className="mt-5 w-full">
            Book a free assessment
          </ButtonLink>
        </nav>
      </div>
    </header>
  );
}
