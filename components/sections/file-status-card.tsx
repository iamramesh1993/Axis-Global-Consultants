import { Check } from "lucide-react";
import { stages } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * The hero visual. Deliberately a product mock, not a stock photo — it shows
 * the transparency promise instead of describing it, and it reads like a
 * banking dashboard rather than a marketing graphic.
 * Illustrative sample data, clearly labelled as an example.
 */
const CURRENT_STAGE = 4; // "Applied"

export function FileStatusCard() {
  return (
    <div className="rounded-card-lg border-line bg-card border shadow-[var(--shadow-card)]">
      {/* Card header */}
      <div className="border-line flex items-start justify-between gap-4 border-b px-6 py-5">
        <div>
          <p className="text-eyebrow text-ink-subtle font-semibold uppercase">
            Your file
          </p>
          <p className="mt-2 text-[1.0625rem] font-bold tracking-[-0.015em]">
            MSc Data Science · UK
          </p>
        </div>
        <span className="bg-brand-tint text-brand shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold">
          On track
        </span>
      </div>

      {/* Stage list */}
      <ol className="px-6 py-5">
        {stages.map((stage, i) => {
          const done = stage.n < CURRENT_STAGE;
          const current = stage.n === CURRENT_STAGE;
          const isLast = i === stages.length - 1;

          return (
            <li key={stage.key} className="relative flex gap-4 pb-5 last:pb-0">
              {/* Connector */}
              {!isLast && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute top-7 left-[13px] h-full w-[2px] rounded-full",
                    done ? "bg-brand" : "bg-line",
                  )}
                />
              )}

              {/* Node */}
              <span
                aria-hidden="true"
                className={cn(
                  "relative z-10 grid h-7 w-7 shrink-0 place-items-center rounded-full text-[0.6875rem] font-bold",
                  done && "bg-brand text-on-brand",
                  current && "bg-brand text-on-brand ring-brand-light ring-4",
                  !done &&
                    !current &&
                    "border-line bg-panel text-ink-subtle border",
                )}
              >
                {done ? <Check className="h-4 w-4" strokeWidth={3} /> : stage.n}
              </span>

              {/* Label */}
              <div className="min-w-0 pt-0.5">
                <p
                  className={cn(
                    "text-[0.9375rem] font-semibold",
                    current || done ? "text-ink" : "text-ink-subtle",
                  )}
                >
                  {stage.title}
                  {current && (
                    <span className="text-brand ml-2 text-xs font-semibold">
                      in progress
                    </span>
                  )}
                </p>
                {current && (
                  <ul className="mt-1.5 space-y-1">
                    {[
                      "4 applications submitted",
                      "Reference numbers on file",
                    ].map((detail) => (
                      <li
                        key={detail}
                        className="text-ink-muted flex items-center gap-2 text-[0.8125rem] leading-relaxed"
                      >
                        <span
                          aria-hidden="true"
                          className="bg-ink-subtle h-1 w-1 shrink-0 rounded-full"
                        />
                        {detail}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {/* Card footer */}
      <div className="border-line bg-panel border-t px-6 py-4">
        <p className="text-ink-subtle text-xs leading-relaxed">
          Illustrative example. The live status view arrives with the student
          portal in the next release — until then you get the same detail by
          email and WhatsApp.
        </p>
      </div>
    </div>
  );
}
