import type { CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Service } from "@/types/content";
import { TechBadge } from "@/components/ui/primitives";
import { TrackLink } from "@/components/analytics/track-link";

/**
 * Service tile. Hover (or keyboard focus) expands a capability list using the
 * grid-rows 0fr → 1fr technique, so the panel animates to its natural height
 * without a hard-coded max-height.
 */
export function ServiceCard({ service, index = 0 }: { service: Service; index?: number }) {
  return (
    <article
      data-reveal
      style={{ "--reveal-delay": `${index * 80}ms` } as CSSProperties}
      className="group relative flex min-h-[360px] flex-col justify-between overflow-hidden border-b border-line p-5 transition-colors duration-500 hover:bg-panel/80 focus-within:bg-panel/80 md:p-8 lg:border-b-0 lg:border-r lg:last:border-r-0"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 group-focus-within:scale-x-100"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -right-16 h-48 w-48 rounded-full bg-accent/10 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100 group-focus-within:opacity-100"
      />

      <p className="relative font-mono text-xs tracking-[0.12em] text-muted transition-colors duration-500 group-hover:text-accent">
        AUTOMATION / {service.number}
      </p>

      <div className="relative py-12">
        <h3 className="text-2xl font-medium tracking-[-0.035em]">{service.title}</h3>
        <p className="mt-5 max-w-md leading-7 text-muted">{service.shortDescription}</p>

        <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:grid-rows-[1fr] group-focus-within:grid-rows-[1fr]">
          <ul className="overflow-hidden opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-within:opacity-100">
            {service.capabilities.slice(0, 4).map((capability) => (
              <li key={capability} className="mt-3 flex items-start gap-2.5 border-t border-line pt-3 text-[13px] leading-5 text-muted first:mt-6">
                <span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 bg-accent" />
                {capability}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative">
        <div className="flex flex-wrap gap-2">
          {service.technologies.slice(0, 3).map((technology) => <TechBadge key={technology}>{technology}</TechBadge>)}
        </div>
        <TrackLink
          href={`/services#${service.slug}`}
          event="service_opened"
          properties={{ service: service.slug }}
          className="mt-8 inline-flex items-center gap-2 text-sm font-medium transition-colors duration-500 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          Explore service
          <ArrowUpRight
            aria-hidden="true"
            size={15}
            className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </TrackLink>
      </div>
    </article>
  );
}
