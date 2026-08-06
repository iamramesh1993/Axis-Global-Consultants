import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "inverse";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-control font-semibold whitespace-nowrap " +
  "transition-[transform,background-color,border-color,color,box-shadow] duration-200 " +
  "[transition-timing-function:var(--ease-out-soft)] active:scale-[0.99] " +
  "disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand text-on-brand hover:bg-brand-hover hover:shadow-[var(--shadow-brand)]",
  secondary:
    "border border-line-strong bg-card text-ink hover:border-brand hover:text-brand hover:shadow-[var(--shadow-soft)]",
  ghost: "text-ink-muted hover:bg-panel hover:text-ink",
  /** For use on top of a blue fill. */
  inverse: "bg-card text-brand hover:bg-brand-tint",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-13 px-6 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  ...props
}: CommonProps & { href: string } & Omit<
    React.ComponentPropsWithoutRef<typeof Link>,
    "href" | "className" | "children"
  >) {
  const isExternal = /^(https?:|mailto:|tel:)/.test(href);

  if (isExternal) {
    const { children, ...rest } = props as { children: React.ReactNode };
    return (
      <a
        href={href}
        className={cn(base, variants[variant], sizes[size], className)}
        rel="noopener noreferrer"
        target="_blank"
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}
