import { Plus } from "lucide-react";
import type { Faq } from "@/lib/content-schema";

/**
 * Native <details> accordion — no JS, works before hydration, and the answer
 * text stays in the DOM so search and answer engines can read it.
 */
export function FaqList({ faqs }: { faqs: readonly Faq[] }) {
  return (
    <div className="divide-line rounded-card border-line divide-y overflow-hidden border">
      {faqs.map((faq) => (
        <details key={faq.q} className="group bg-ink-raised/40">
          <summary className="font-display hover:text-accent flex cursor-pointer list-none items-start justify-between gap-4 px-5 py-5 text-left text-base font-medium tracking-tight transition-colors md:text-lg">
            <span>{faq.q}</span>
            <Plus
              className="text-accent mt-0.5 h-5 w-5 shrink-0 transition-transform duration-300 group-open:rotate-45"
              aria-hidden="true"
            />
          </summary>
          <div className="-mt-1 px-5 pb-5">
            <p className="text-fg-muted max-w-2xl text-sm leading-relaxed md:text-[0.9375rem]">
              {faq.a}
            </p>
          </div>
        </details>
      ))}
    </div>
  );
}
