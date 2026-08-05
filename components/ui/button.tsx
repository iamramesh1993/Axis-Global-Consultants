import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "accent" | "outline" | "ghost" | "paper";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap " +
  "transition-[transform,background-color,border-color,color,box-shadow] duration-200 " +
  "[transition-timing-function:var(--ease-out-soft)] active:scale-[0.98] " +
  "disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  accent:
    "bg-accent text-on-accent hover:bg-accent-hover hover:shadow-[var(--shadow-accent)] font-semibold",
  outline:
    "border border-line-strong text-fg hover:border-accent/60 hover:bg-white/[0.04] hover:text-accent",
  ghost: "text-fg-muted hover:bg-white/[0.05] hover:text-fg",
  paper: "bg-paper-fg text-paper hover:bg-paper-fg/85 font-semibold",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-13 px-7 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

export function Button({
  variant = "accent",
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
  variant = "accent",
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
