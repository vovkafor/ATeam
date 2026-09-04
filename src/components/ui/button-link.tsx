import Link from "next/link";
import type { ComponentProps } from "react";

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: "primary" | "secondary" | "inverse" | "text";
};

const base =
  "group/btn relative inline-flex min-h-12 items-center justify-center overflow-hidden border px-5 font-medium transition-[transform,box-shadow,background-color,border-color,color] duration-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent";

const variants = {
  primary:
    "border-accent bg-gradient-to-r from-accent to-[#6f92ff] text-white shadow-[0_14px_36px_-14px_rgba(76,125,255,0.85)] hover:-translate-y-0.5 hover:border-accent-hover hover:shadow-[0_22px_44px_-14px_rgba(76,125,255,1)]",
  secondary:
    "border-line bg-panel/60 text-ink hover:-translate-y-0.5 hover:border-accent hover:bg-accent/10 hover:text-accent hover:shadow-[var(--shadow-raise)]",
  inverse:
    "border-accent bg-accent text-white hover:-translate-y-0.5 hover:border-accent-hover hover:bg-accent-hover hover:shadow-[0_22px_44px_-14px_rgba(76,125,255,0.95)]",
  text: "border-transparent px-0 text-ink hover:text-accent",
};

/**
 * Shared call-to-action. The primary and inverse variants carry a soft gradient
 * plus a light sweep on hover; the sweep is decorative and purely CSS.
 */
export function ButtonLink({ className = "", variant = "primary", children, ...props }: ButtonLinkProps) {
  return (
    <Link className={`${base} ${variants[variant]} ${className}`} {...props}>
      {variant !== "text" ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:translate-x-full"
        />
      ) : null}
      <span className="relative">{children}</span>
    </Link>
  );
}
