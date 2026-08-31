import Link from "next/link";
import type { ComponentProps } from "react";

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: "primary" | "secondary" | "inverse" | "text";
};

const variants = {
  primary: "border-accent bg-accent text-white hover:border-accent-hover hover:bg-accent-hover",
  secondary: "border-strong bg-transparent text-ink hover:border-ink hover:bg-ink hover:text-white",
  inverse: "border-white bg-white text-ink hover:border-accent hover:bg-accent hover:text-white",
  text: "border-transparent px-0 text-ink hover:text-accent",
};

export function ButtonLink({ className = "", variant = "primary", ...props }: ButtonLinkProps) {
  return (
    <Link
      className={`inline-flex min-h-12 items-center justify-center border px-5 font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
