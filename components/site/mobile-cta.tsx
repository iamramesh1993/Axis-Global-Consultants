"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WhatsappIcon } from "@/components/site/social-icons";
import { whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Sticky bottom CTA for mobile — ~90% of traffic arrives from Instagram and
 * Facebook ads on a phone.
 *
 * Appears after a short scroll so it never covers the hero CTA, and hides itself
 * on /contact where the form is already the whole page. The bottom padding
 * respects the iOS home-bar safe area.
 */
export function MobileCta() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname === "/contact") return null;

  return (
    <div
      className={cn(
        "border-line bg-ink/90 fixed inset-x-0 bottom-0 z-40 border-t backdrop-blur-xl transition-transform duration-300 [transition-timing-function:var(--ease-out-soft)] lg:hidden",
        "pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]",
        visible ? "translate-y-0" : "translate-y-full",
      )}
    >
      <div className="container-page flex items-center gap-3">
        <Link
          href="/contact"
          className="bg-accent text-on-accent flex h-12 flex-1 items-center justify-center rounded-full px-5 text-[0.9375rem] font-semibold active:scale-[0.98]"
        >
          Book a free assessment
        </Link>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Message us on WhatsApp"
          className="border-line-strong text-fg-muted grid h-12 w-12 shrink-0 place-items-center rounded-full border active:scale-[0.98]"
        >
          <WhatsappIcon className="h-5 w-5" />
        </a>
      </div>
    </div>
  );
}
