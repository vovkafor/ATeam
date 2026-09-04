"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { useSpotlight } from "@/components/motion/spotlight";
import { ApiConsoleClip, ParallelWorkersClip, VisualDiffClip } from "@/components/visuals/service-clips";
import { services } from "@/content/services";
import type { Service } from "@/types/content";

const clips: Record<string, ReactNode> = {
  "web-ui-automation": <VisualDiffClip />,
  "api-automation": <ApiConsoleClip />,
  "ci-cd-integration": <ParallelWorkersClip />,
};

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="border border-line bg-panel px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-muted">
      {children}
    </span>
  );
}

function Preview({ service }: { service: Service }) {
  return (
    <div key={service.slug} className="fade-up-delayed flex h-full flex-col">
      <div className="cine relative aspect-[16/9] max-h-[380px] overflow-hidden border border-line bg-panel">
        {clips[service.slug]}
      </div>

      <div className="mt-8">
        <h3 className="text-[clamp(1.5rem,2.4vw,2rem)] font-medium tracking-[-0.035em]">{service.title}</h3>
        <p className="mt-4 max-w-xl leading-7 text-muted">{service.description}</p>

        <div className="mt-6 flex flex-wrap gap-1.5">
          {service.technologies.map((technology) => (
            <Chip key={technology}>{technology}</Chip>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * One service in focus with its clip and copy, the others as a quiet index.
 * Pointing at — or tabbing to — any row brings it into focus. The rows are
 * buttons rather than links: there is no separate services page to go to any
 * more, the whole thing lives here.
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
              <button
                type="button"
                onMouseEnter={() => setActiveSlug(service.slug)}
                onFocus={() => setActiveSlug(service.slug)}
                onClick={() => setActiveSlug(service.slug)}
                aria-current={isActive ? "true" : undefined}
                style={{ "--reveal-delay": `${index * 70}ms` } as CSSProperties}
                className="group/row flex w-full items-baseline gap-4 border-b border-line py-5 text-left transition-colors duration-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
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
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
