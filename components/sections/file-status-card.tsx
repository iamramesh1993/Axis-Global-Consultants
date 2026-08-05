import { Check } from "lucide-react";
import { stages } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * The hero visual. Deliberately a product mock, not a stock photo — it shows
 * the transparency promise instead of describing it.
 * Illustrative sample data, clearly labelled as an example.
 */
const CURRENT_STAGE = 4; // "Applied"

export function FileStatusCard() {
  return (
    <div className="relative">
      {/* Glow beneath the card */}
      <div
        aria-hidden="true"
        className="bg-accent/15 absolute inset-x-6 -bottom-6 -z-10 h-40 rounded-full blur-3xl"
      />

      <div className="rounded-card-lg border-line-strong bg-ink-raised relative overflow-hidden border shadow-[var(--shadow-card)]">
        {/* Card header */}
        <div className="border-line flex items-center justify-between gap-4 border-b px-5 py-4">
          <div>
            <p className="text-eyebrow text-fg-subtle font-sans uppercase">
              Your file
            </p>
            <p className="font-display mt-1.5 text-base font-semibold tracking-tight">
              MSc Data Science · UK
            </p>
          </div>
          <span className="bg-accent/15 text-accent ring-accent/25 rounded-full px-2.5 py-1 text-xs font-medium ring-1">
            On track
          </span>
        </div>

        {/* Stage list */}
        <ol className="px-5 py-5">
          {stages.map((stage, i) => {
            const done = stage.n < CURRENT_STAGE;
            const current = stage.n === CURRENT_STAGE;
            const isLast = i === stages.length - 1;

            return (
              <li
                key={stage.key}
                className="relative flex gap-4 pb-5 last:pb-0"
              >
                {/* Connector */}
                {!isLast && (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute top-6 left-[11px] h-full w-px",
                      done ? "bg-accent/40" : "bg-line-strong",
                    )}
                  />
                )}

                {/* Node */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "relative z-10 grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[0.625rem] font-semibold",
                    done && "border-accent/50 bg-accent text-on-accent",
                    current &&
                      "border-accent bg-ink-raised text-accent ring-accent/15 ring-4",
                    !done &&
                      !current &&
                      "border-line-strong bg-ink text-fg-subtle",
                  )}
                >
                  {done ? <Check className="h-3.5 w-3.5" /> : stage.n}
                </span>

                {/* Label */}
                <div className="min-w-0 pt-0.5">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      current
                        ? "text-fg"
                        : done
                          ? "text-fg-muted"
                          : "text-fg-subtle",
                    )}
                  >
                    {stage.title}
                    {current && (
                      <span className="text-accent ml-2 text-xs font-normal">
                        in progress
                      </span>
                    )}
                  </p>
                  {current && (
                    <p className="text-fg-muted mt-1 text-xs leading-relaxed">
                      4 applications submitted · reference numbers on file
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>

        {/* Card footer */}
        <div className="border-line border-t bg-white/[0.02] px-5 py-3.5">
          <p className="text-fg-subtle text-[0.6875rem] leading-relaxed">
            Illustrative example. The live status view arrives with the student
            portal in the next release — until then you get the same detail by
            email and WhatsApp.
          </p>
        </div>
      </div>
    </div>
  );
}
