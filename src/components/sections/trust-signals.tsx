import type { CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { trustSignals } from "@/content/trust";

/**
 * Credibility strip. The Upwork rating links out to the public profile when
 * `NEXT_PUBLIC_UPWORK_URL` is set — an unverifiable badge is worth less than
 * one a prospect can click.
 */
export function TrustSignals() {
  return (
    <section aria-label="Background and credentials" className="grid border-b border-line sm:grid-cols-2 lg:grid-cols-4">
      {trustSignals.map((signal, index) => {
        const href = signal.label.includes("Upwork") ? siteConfig.upwork : signal.href;
        const linked = Boolean(href && href !== "#");

        const content = (
          <>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
            />
            <p className="flex items-baseline gap-2 text-[clamp(1.9rem,3vw,2.6rem)] font-medium leading-none tracking-[-0.05em]">
              {signal.value}
              {linked ? (
                <ArrowUpRight
                  aria-hidden="true"
                  size={15}
                  className="shrink-0 text-muted transition-[color,transform] duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                />
              ) : null}
            </p>
            <p className="mt-5 font-mono text-[10px] uppercase leading-4 tracking-[0.12em] text-accent">{signal.label}</p>
            <p className="mt-3 text-sm leading-6 text-muted">{signal.detail}</p>
          </>
        );

        const className =
          "group relative flex flex-col border-b border-line p-5 transition-colors duration-500 hover:bg-panel/70 sm:p-8 lg:border-b-0 lg:border-r lg:last:border-r-0 [&:nth-child(2)]:sm:border-r-0 [&:nth-child(2)]:lg:border-r";

        return linked ? (
          <a
            key={signal.label}
            href={href}
            target="_blank"
            rel="noreferrer"
            data-reveal
            style={{ "--reveal-delay": `${index * 80}ms` } as CSSProperties}
            className={`${className} focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent`}
          >
            {content}
          </a>
        ) : (
          <div
            key={signal.label}
            data-reveal
            style={{ "--reveal-delay": `${index * 80}ms` } as CSSProperties}
            className={className}
          >
            {content}
          </div>
        );
      })}
    </section>
  );
}
