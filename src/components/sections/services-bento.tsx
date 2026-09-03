"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { TrackLink } from "@/components/analytics/track-link";
import { useSpotlight } from "@/components/motion/spotlight";
import { ApiConsoleClip, ParallelWorkersClip, VisualDiffClip } from "@/components/visuals/service-clips";
import { services } from "@/content/services";
import type { Service } from "@/types/content";

/** Only the three services with a bespoke clip get one; the rest read editorially. */
const clips: Record<string, ReactNode> = {
  "web-ui-automation": <VisualDiffClip />,
  "api-automation": <ApiConsoleClip />,
  "ci-cd-integration": <ParallelWorkersClip />,
};

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="bg-[color-mix(in_oklab,var(--panel)_70%,white)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-muted">
      {children}
    </span>
  );
}

function Preview({ service }: { service: Service }) {
  const clip = clips[service.slug];

  return (
    <div key={service.slug} className="fade-up-delayed flex h-full flex-col">
      <div className="cine relative aspect-[16/9] max-h-[380px] overflow-hidden bg-[color-mix(in_oklab,var(--panel)_55%,white)]">
        {clip ?? (
          <p className="absolute inset-0 flex items-center p-8 text-[clamp(1.1rem,1.6vw,1.5rem)] font-medium leading-snug tracking-[-0.02em] md:p-10">
            {service.outcome}
          </p>
        )}
      </div>

      <div className="mt-8">
        <h3 className="text-[clamp(1.5rem,2.4vw,2rem)] font-medium tracking-[-0.035em]">{service.title}</h3>
        <p className="mt-4 max-w-xl leading-7 text-muted">{service.description}</p>

        <div className="mt-6 flex flex-wrap gap-1.5">
          {service.technologies.map((technology) => (
            <Chip key={technology}>{technology}</Chip>
          ))}
        </div>

        <TrackLink
          href={`/services#${service.slug}`}
          event="service_opened"
          properties={{ service: service.slug }}
          className="group/link mt-8 inline-flex items-center gap-2 text-[15px] font-medium text-accent transition-colors duration-500 hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          Explore service
          <span
            aria-hidden="true"
            className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/link:translate-x-1"
          >
            →
          </span>
        </TrackLink>
      </div>
    </div>
  );
}

/**
 * Bento layout for the service list: one service is in focus with its clip and
 * full copy, the other four stay as a quiet index. Pointing at — or tabbing to
 * — any row brings it into focus, so the whole set is reachable without a click.
 */
export function ServicesBento() {
  const [activeSlug, setActiveSlug] = useState(services[0].slug);
  const active = services.find((service) => service.slug === activeSlug) ?? services[0];
  const { ref, onPointerMove } = useSpotlight<HTMLDivElement>();

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      className="spotlight-host relative grid gap-12 lg:grid-cols-[1.45fr_0.55fr] lg:gap-16"
    >
      <span className="spotlight" aria-hidden="true" />

      <div data-reveal className="relative">
        <Preview service={active} />
      </div>

      <ul className="relative flex flex-col justify-center" data-reveal="right">
        {services.map((service, index) => {
          const isActive = service.slug === active.slug;

          return (
            <li key={service.slug}>
              <TrackLink
                href={`/services#${service.slug}`}
                event="service_opened"
                properties={{ service: service.slug }}
                onMouseEnter={() => setActiveSlug(service.slug)}
                onFocus={() => setActiveSlug(service.slug)}
                aria-current={isActive ? "true" : undefined}
                style={{ "--reveal-delay": `${index * 70}ms` } as CSSProperties}
                className="group/row flex items-baseline gap-4 border-b border-line py-5 transition-colors duration-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                <span
                  className={`font-mono text-[10px] tabular-nums tracking-[0.14em] transition-colors duration-500 ${
                    isActive ? "text-accent" : "text-strong"
                  }`}
                >
                  {service.number}
                </span>
                <span
                  className={`text-[17px] tracking-[-0.02em] transition-[color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isActive ? "translate-x-1 text-ink" : "text-muted"
                  }`}
                >
                  {service.title}
                </span>
              </TrackLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
