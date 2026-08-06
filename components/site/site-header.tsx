"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Mail, Menu, Phone, X } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { ButtonLink } from "@/components/ui/button";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TiktokIcon,
  WhatsappIcon,
} from "@/components/site/social-icons";
import { mainNav, site, whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";

const drawerLegal = [
  { href: "/how-it-works#faqs", label: "FAQs" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

const socials = [
  { href: site.socials.instagram, label: "Instagram", Icon: InstagramIcon },
  { href: site.socials.tiktok, label: "TikTok", Icon: TiktokIcon },
  { href: site.socials.facebook, label: "Facebook", Icon: FacebookIcon },
  { href: site.socials.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
];

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

  /**
   * Lock the page behind the drawer, and flag the open state on <html> so the
   * sticky bottom CTA can hide itself. Without that flag the CTA sits behind the
   * drawer and you see two identical "Book a free assessment" buttons.
   */
  useEffect(() => {
    const root = document.documentElement;
    document.body.style.overflow = open ? "hidden" : "";
    if (open) root.dataset.navOpen = "true";
    else delete root.dataset.navOpen;

    return () => {
      document.body.style.overflow = "";
      delete root.dataset.navOpen;
    };
  }, [open]);

  // Escape closes the drawer.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cn(
        "border-line bg-page/90 sticky top-0 z-50 border-b backdrop-blur-xl transition-shadow duration-200",
        (scrolled || open) && "shadow-[0_1px_3px_rgb(15_23_42_/_0.06)]",
      )}
    >
      <div className="container-page flex h-18 items-center justify-between gap-6">
        <Logo showTagline={false} />

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
                    : "text-ink-muted hover:bg-brand-tint hover:text-brand",
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

      {/*
        Mobile drawer. Height is capped to the viewport minus the header so long
        menus scroll instead of running off the bottom of the screen, and
        overscroll-contain stops the scroll chaining to the locked page behind.
      */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="border-line bg-page max-h-[calc(100dvh-4.5rem)] overflow-y-auto overscroll-contain border-t lg:hidden"
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
                  "border-line flex items-center justify-between border-b py-4 text-base font-semibold transition-colors",
                  active ? "text-brand" : "text-ink hover:text-brand",
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

          <ButtonLink href="/contact" size="lg" className="mt-5 w-full">
            Book a free assessment
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </ButtonLink>

          {/* Contact */}
          <div className="border-line mt-7 border-t pt-6">
            <p className="text-eyebrow text-ink-subtle font-semibold uppercase">
              Talk to us
            </p>
            <div className="mt-4 grid gap-2.5">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-control border-line hover:border-brand hover:text-brand flex items-center gap-3 border px-4 py-3 text-[0.9375rem] font-medium transition-colors"
              >
                <WhatsappIcon className="text-brand h-[1.125rem] w-[1.125rem] shrink-0" />
                WhatsApp {site.contact.phone}
              </a>
              <a
                href={`tel:${site.contact.phone.replace(/\s/g, "")}`}
                className="rounded-control border-line hover:border-brand hover:text-brand flex items-center gap-3 border px-4 py-3 text-[0.9375rem] font-medium transition-colors"
              >
                <Phone
                  className="text-brand h-[1.125rem] w-[1.125rem] shrink-0"
                  aria-hidden="true"
                />
                Call us
              </a>
              <a
                href={`mailto:${site.contact.email}`}
                className="rounded-control border-line hover:border-brand hover:text-brand flex items-center gap-3 border px-4 py-3 text-[0.9375rem] font-medium transition-colors"
              >
                <Mail
                  className="text-brand h-[1.125rem] w-[1.125rem] shrink-0"
                  aria-hidden="true"
                />
                {site.contact.email}
              </a>
            </div>
          </div>

          {/* Socials + legal */}
          <div className="border-line mt-7 flex flex-col gap-5 border-t pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            <div className="flex items-center gap-2">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="rounded-control border-line text-brand hover:border-brand hover:bg-brand hover:text-on-brand grid h-10 w-10 place-items-center border transition-colors"
                >
                  <Icon
                    className="h-[1.125rem] w-[1.125rem]"
                    aria-hidden="true"
                  />
                </a>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {drawerLegal.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-ink-muted hover:text-brand text-sm transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
