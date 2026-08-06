"use client";

import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

/**
 * Password input with a show/hide toggle.
 *
 * A masked field with no way to reveal it is a trap: the only feedback on a
 * typo is a failed sign-in, and the operator cannot tell a wrong password from
 * a mistyped one. The toggle is not a security weakness here — the person can
 * already see their own screen.
 *
 * The field is still a real `<input type="password">` inside a plain form POST,
 * so password managers work and the value never passes through client state.
 */
export function PasswordField({
  name = "password",
  label = "Password",
  disabled = false,
  autoFocus = false,
}: {
  name?: string;
  label?: string;
  disabled?: boolean;
  autoFocus?: boolean;
}) {
  const [revealed, setRevealed] = useState(false);
  const id = useId();

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          name={name}
          type={revealed ? "text" : "password"}
          required
          autoComplete="current-password"
          autoFocus={autoFocus}
          disabled={disabled}
          // Trailing spaces from a paste are a common cause of a "wrong"
          // password; the server trims too, but keep the field tidy.
          spellCheck={false}
          autoCapitalize="off"
          className="rounded-control border-line-strong bg-card text-ink focus:border-brand focus:ring-brand-light h-12 w-full border pr-12 pl-4 text-base transition-[border-color,box-shadow] duration-200 outline-none focus:ring-4 disabled:opacity-50 md:text-[0.9375rem]"
        />

        <button
          type="button"
          onClick={() => setRevealed((v) => !v)}
          disabled={disabled}
          aria-label={revealed ? "Hide password" : "Show password"}
          aria-pressed={revealed}
          // tabIndex -1 keeps Tab going straight from the field to Sign in.
          tabIndex={-1}
          className="text-ink-subtle hover:text-brand absolute top-1/2 right-1 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-lg transition-colors disabled:opacity-50"
        >
          {revealed ? (
            <EyeOff className="h-[1.125rem] w-[1.125rem]" aria-hidden="true" />
          ) : (
            <Eye className="h-[1.125rem] w-[1.125rem]" aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
}
