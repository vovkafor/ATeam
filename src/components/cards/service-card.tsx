import { ArrowUpRight } from "lucide-react";
import type { Service } from "@/types/content";
import { TechBadge } from "@/components/ui/primitives";
import { TrackLink } from "@/components/analytics/track-link";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="group flex min-h-[360px] flex-col justify-between border-b border-line p-5 transition-colors hover:bg-panel md:p-8 lg:border-b-0 lg:border-r lg:last:border-r-0">
      <p className="font-mono text-xs tracking-[0.12em] text-muted">AUTOMATION / {service.number}</p>
      <div className="py-12">
        <h3 className="text-2xl font-medium tracking-[-0.035em]">{service.title}</h3>
        <p className="mt-5 max-w-md leading-7 text-muted">{service.shortDescription}</p>
      </div>
      <div>
        <div className="flex flex-wrap gap-2">
          {service.technologies.slice(0, 3).map((technology) => <TechBadge key={technology}>{technology}</TechBadge>)}
        </div>
        <TrackLink
          href={`/services#${service.slug}`}
          event="service_opened"
          properties={{ service: service.slug }}
          className="mt-8 inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          Explore service <ArrowUpRight aria-hidden="true" size={15} />
        </TrackLink>
      </div>
    </article>
  );
}
