"use client";

import { forwardRef, useId } from "react";
import { AlertCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Inputs are 16px on mobile on purpose — anything smaller makes iOS Safari zoom
 * the viewport on focus, which feels broken and is the classic mobile-form bug.
 */
const controlBase =
  "w-full rounded-control border bg-card px-4 text-base text-ink " +
  "placeholder:text-ink-subtle transition-[border-color,box-shadow] duration-200 outline-none " +
  "focus:border-brand focus:ring-4 focus:ring-brand-light md:text-[0.9375rem]";

function FieldShell({
  id,
  label,
  error,
  hint,
  optional,
  children,
  className,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label
        htmlFor={id}
        className="flex items-baseline gap-2 text-sm font-semibold"
      >
        {label}
        {optional && (
          <span className="text-ink-subtle text-xs font-normal">optional</span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-ink-subtle text-xs">
          {hint}
        </p>
      )}
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-danger flex items-center gap-1.5 text-xs font-medium"
        >
          <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

type TextFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  wrapperClassName?: string;
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(
    { label, error, hint, optional, wrapperClassName, className, ...props },
    ref,
  ) {
    const generated = useId();
    const id = props.id ?? generated;
    return (
      <FieldShell
        id={id}
        label={label}
        error={error}
        hint={hint}
        optional={optional}
        className={wrapperClassName}
      >
        <input
          ref={ref}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            error ? `${id}-error` : hint ? `${id}-hint` : undefined
          }
          className={cn(
            controlBase,
            "h-12",
            error ? "border-danger" : "border-line-strong",
            className,
          )}
          {...props}
        />
      </FieldShell>
    );
  },
);

type SelectFieldProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  placeholder?: string;
  options: readonly string[];
  wrapperClassName?: string;
};

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  function SelectField(
    {
      label,
      error,
      hint,
      optional,
      placeholder = "Select…",
      options,
      wrapperClassName,
      className,
      ...props
    },
    ref,
  ) {
    const generated = useId();
    const id = props.id ?? generated;
    return (
      <FieldShell
        id={id}
        label={label}
        error={error}
        hint={hint}
        optional={optional}
        className={wrapperClassName}
      >
        <div className="relative">
          <select
            ref={ref}
            id={id}
            defaultValue=""
            aria-invalid={error ? true : undefined}
            aria-describedby={
              error ? `${id}-error` : hint ? `${id}-hint` : undefined
            }
            className={cn(
              controlBase,
              "h-12 appearance-none pr-11",
              error ? "border-danger" : "border-line-strong",
              className,
            )}
            {...props}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ChevronDown
            className="text-ink-subtle pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2"
            aria-hidden="true"
          />
        </div>
      </FieldShell>
    );
  },
);

type TextAreaFieldProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  wrapperClassName?: string;
};

export const TextAreaField = forwardRef<
  HTMLTextAreaElement,
  TextAreaFieldProps
>(function TextAreaField(
  { label, error, hint, optional, wrapperClassName, className, ...props },
  ref,
) {
  const generated = useId();
  const id = props.id ?? generated;
  return (
    <FieldShell
      id={id}
      label={label}
      error={error}
      hint={hint}
      optional={optional}
      className={wrapperClassName}
    >
      <textarea
        ref={ref}
        id={id}
        rows={4}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          error ? `${id}-error` : hint ? `${id}-hint` : undefined
        }
        className={cn(
          controlBase,
          "resize-y py-3 leading-relaxed",
          error ? "border-danger" : "border-line-strong",
          className,
        )}
        {...props}
      />
    </FieldShell>
  );
});
