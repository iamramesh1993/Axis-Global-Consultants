"use client";

import { useEffect, useId, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import {
  TextField,
  SelectField,
  TextAreaField,
} from "@/components/forms/field";
import { Button } from "@/components/ui/button";
import {
  leadSchema,
  BUDGET_RANGES,
  INTAKES,
  QUALIFICATIONS,
  TARGET_COUNTRIES,
  type LeadInput,
} from "@/lib/validation";
import { captureSource, trackFormStart, trackLead } from "@/lib/analytics";
import { site, whatsappLink } from "@/lib/site";

type Status = "idle" | "submitting" | "success" | "error";

export function LeadForm({
  defaultCountry,
}: {
  defaultCountry?: (typeof TARGET_COUNTRIES)[number];
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [startedTracked, setStartedTracked] = useState(false);
  const uid = useId();
  const consentId = `${uid}-consent`;
  const honeypotId = `${uid}-website`;

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    mode: "onBlur",
    defaultValues: {
      targetCountry: defaultCountry,
      website: "",
    },
  });

  // Fire the form-start event once, on first interaction rather than on render,
  // so a scroll past the section doesn't count as an intent signal.
  useEffect(() => {
    if (!startedTracked) return;
    trackFormStart();
  }, [startedTracked]);

  const onSubmit = handleSubmit(async (values) => {
    setStatus("submitting");
    setServerMessage(null);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, source: captureSource() }),
      });

      const data = (await res.json()) as {
        ok: boolean;
        message?: string;
        fieldErrors?: Record<string, string>;
      };

      if (!res.ok || !data.ok) {
        if (data.fieldErrors) {
          for (const [field, message] of Object.entries(data.fieldErrors)) {
            setError(field as keyof LeadInput, { type: "server", message });
          }
        }
        setStatus("error");
        setServerMessage(
          data.message ?? "Something went wrong. Please try again.",
        );
        return;
      }

      trackLead({
        country: String(values.targetCountry),
        intake: String(values.intake),
      });
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
      setServerMessage(
        `We couldn't reach the server. Please WhatsApp us on ${site.contact.phone} and we'll pick it up straight away.`,
      );
    }
  });

  if (status === "success") {
    return <SuccessState onReset={() => setStatus("idle")} />;
  }

  return (
    <form
      onSubmit={onSubmit}
      onFocus={() => setStartedTracked(true)}
      noValidate
      className="space-y-5"
    >
      {/* Honeypot: hidden from people, irresistible to bots. */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
        <label htmlFor={honeypotId}>Website</label>
        <input
          id={honeypotId}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Full name"
          autoComplete="name"
          placeholder="Ayesha Khan"
          error={errors.fullName?.message}
          {...register("fullName")}
        />
        <TextField
          label="Email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Phone / WhatsApp"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="0313 5155868"
          hint="Pakistani mobile — we'll WhatsApp you first"
          error={errors.phone?.message}
          {...register("phone")}
        />
        <SelectField
          label="Highest qualification"
          placeholder="Select qualification"
          options={QUALIFICATIONS}
          error={errors.qualification?.message}
          {...register("qualification")}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField
          label="Where do you want to study?"
          placeholder="Select destination"
          options={TARGET_COUNTRIES}
          error={errors.targetCountry?.message}
          {...register("targetCountry")}
        />
        <SelectField
          label="Intended intake"
          placeholder="Select intake"
          options={INTAKES}
          error={errors.intake?.message}
          {...register("intake")}
        />
      </div>

      <SelectField
        label="Budget per year"
        placeholder="Select a range"
        optional
        options={BUDGET_RANGES}
        hint="Helps us shortlist honestly instead of wasting your time"
        error={errors.budgetRange?.message}
        {...register("budgetRange")}
      />

      <TextAreaField
        label="Anything we should know?"
        optional
        placeholder="Grades, gaps in study, previous refusals, a course you have in mind…"
        error={errors.message?.message}
        {...register("message")}
      />

      <div className="flex flex-col gap-2">
        {/* Explicit id + htmlFor rather than relying on implicit nesting — a11y
            tooling and some screen readers handle the explicit pairing better. */}
        <label
          htmlFor={consentId}
          className="text-fg-muted flex cursor-pointer items-start gap-3 text-sm"
        >
          <input
            id={consentId}
            type="checkbox"
            className="border-line-strong bg-ink-raised accent-accent mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded"
            {...register("consent")}
          />
          <span>
            I agree to be contacted about my enquiry and I&apos;ve read the{" "}
            <a
              href="/privacy"
              className="text-accent decoration-accent/30 underline underline-offset-4"
            >
              privacy policy
            </a>
            .
          </span>
        </label>
        {errors.consent && (
          <p role="alert" className="text-danger text-xs">
            {errors.consent.message}
          </p>
        )}
      </div>

      {status === "error" && serverMessage && (
        <div
          role="alert"
          className="border-danger/40 bg-danger/10 text-fg rounded-xl border px-4 py-3 text-sm"
        >
          {serverMessage}
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={status === "submitting"}
        className="w-full"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Sending…
          </>
        ) : (
          <>
            Book my free assessment
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </>
        )}
      </Button>

      <p className="text-fg-subtle flex items-start gap-2 text-xs leading-relaxed">
        <ShieldCheck
          className="text-accent/70 mt-0.5 h-4 w-4 shrink-0"
          aria-hidden="true"
        />
        No obligation, no commission-chasing. We reply within one working day —
        and if we don&apos;t think we can help, we&apos;ll say so.
      </p>
    </form>
  );
}

function SuccessState({ onReset }: { onReset: () => void }) {
  return (
    // role=status + aria-live so screen readers announce the confirmation,
    // which otherwise replaces the form with no spoken feedback at all.
    <div
      data-testid="lead-success"
      role="status"
      aria-live="polite"
      className="rounded-card border-accent/30 bg-accent/[0.06] border p-7 text-center md:p-9"
    >
      <div className="bg-accent/15 mx-auto grid h-14 w-14 place-items-center rounded-full">
        <CheckCircle2 className="text-accent h-7 w-7" aria-hidden="true" />
      </div>

      <h3 className="font-display mt-6 text-2xl font-semibold tracking-tight">
        Got it — we&apos;ll be in touch.
      </h3>

      <p className="text-fg-muted mx-auto mt-4 max-w-md text-sm leading-relaxed">
        A real advisor is going to read what you sent, not an autoresponder.
        Expect a WhatsApp message or a call within one working day. If your
        profile isn&apos;t a fit for what you&apos;ve asked for, we&apos;ll tell
        you that honestly rather than book a meeting to sell you something else.
      </p>

      <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="border-line-strong hover:border-accent/60 hover:text-accent inline-flex h-11 items-center justify-center rounded-full border px-5 text-sm font-medium transition-colors"
        >
          Message us now instead
        </a>
        <button
          type="button"
          onClick={onReset}
          className="text-fg-subtle decoration-line-strong hover:text-fg text-sm underline underline-offset-4 transition-colors"
        >
          Send another enquiry
        </button>
      </div>
    </div>
  );
}
