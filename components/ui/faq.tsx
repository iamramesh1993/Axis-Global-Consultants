import { Plus } from "lucide-react";
import type { Faq } from "@/lib/content-schema";

/**
 * Native <details> accordion — no JS, works before hydration, and the answer
 * text stays in the DOM so search and answer engines can read it.
 */
export function FaqList({ faqs }: { faqs: readonly Faq[] }) {
  return (
    <div className="divide-line rounded-card border-line bg-card divide-y overflow-hidden border shadow-[var(--shadow-soft)]">
      {faqs.map((faq) => (
        <details key={faq.q} className="group">
          <summary className="hover:text-brand flex cursor-pointer list-none items-start justify-between gap-5 px-6 py-5 text-left text-base font-semibold tracking-[-0.01em] transition-colors md:text-[1.0625rem]">
            <span>{faq.q}</span>
            <span
              aria-hidden="true"
              className="bg-brand-tint text-brand mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full transition-transform duration-200 group-open:rotate-45"
            >
              <Plus className="h-4 w-4" />
            </span>
          </summary>
          <div className="px-6 pb-6">
            <p className="text-ink-muted max-w-2xl text-[0.9375rem] leading-relaxed md:text-base">
              {faq.a}
            </p>
          </div>
        </details>
      ))}
    </div>
  );
}
