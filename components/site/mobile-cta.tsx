"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { WhatsappIcon } from "@/components/site/social-icons";
import { whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Sticky bottom CTA for mobile — ~90% of traffic arrives from Instagram and
 * Facebook ads on a phone.
 *
 * Appears after a short scroll so it never covers the hero CTA, and hides on
 * /contact where the form is already the whole page.
 *
 * The `mobile-cta` class is what the open nav drawer hides via
 * `[data-nav-open="true"]` in globals.css — otherwise this bar sits behind the
 * drawer and the user sees two identical "Book a free assessment" buttons.
 */
export function MobileCta() {
  const [scrolledEnough, setScrolledEnough] = useState(false);
  const [formInView, setFormInView] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolledEnough(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /**
   * Stand down once the assessment form reaches the bottom of the screen.
   *
   * The bar is fixed over the last ~72px of the viewport, which is exactly where
   * the form's submit button sits while someone is filling it in. Sending a
   * student to /contact from a bar covering the button they were about to press
   * is the worst possible moment to interrupt.
   *
   * The negative top rootMargin shrinks the observation area to the bottom 40%
   * of the viewport — the band the bar actually occupies — so the CTA stays up
   * while the form is merely somewhere below.
   */
  useEffect(() => {
    const form = document.getElementById("assessment");
    if (!form) {
      setFormInView(false);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setFormInView(entry.isIntersecting);
      },
      { rootMargin: "-60% 0px 0px 0px" },
    );

    observer.observe(form);
    return () => observer.disconnect();
  }, [pathname]);

  if (pathname === "/contact") return null;

  const visible = scrolledEnough && !formInView;

  return (
    <div
      className={cn(
        "mobile-cta border-line bg-page/95 fixed inset-x-0 bottom-0 z-40 border-t backdrop-blur-xl transition-transform duration-300 [transition-timing-function:var(--ease-out-soft)] lg:hidden",
        "pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]",
        visible ? "translate-y-0" : "translate-y-full",
      )}
    >
      <div className="container-page flex items-center gap-3">
        <Link
          href="/contact"
          className="rounded-control bg-brand text-on-brand hover:bg-brand-hover flex h-12 flex-1 items-center justify-center gap-2 px-5 text-[0.9375rem] font-semibold transition-colors duration-200 active:scale-[0.99]"
        >
          Book a free assessment
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Message us on WhatsApp"
          className="rounded-control border-line-strong text-brand hover:border-brand hover:bg-brand hover:text-on-brand grid h-12 w-12 shrink-0 place-items-center border transition-colors duration-200 active:scale-[0.99]"
        >
          <WhatsappIcon className="h-5 w-5" />
        </a>
      </div>
    </div>
  );
}
