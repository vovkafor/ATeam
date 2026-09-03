"use client";

import type { CSSProperties } from "react";
import type { Project } from "@/types/content";
import { TrackLink } from "@/components/analytics/track-link";
import { MetricValue } from "@/components/motion/metric-value";
import { useSpotlight } from "@/components/motion/spotlight";

/**
 * Case study as a single premium card: the claim is the typography, the proof
 * is the metric row. A pointer-tracked spotlight matches the Hero tiles, so
 * hovering anywhere on the site feels like the same surface.
 */
export function ProjectCard({ project, headingLevel = "h3" }: { project: Project; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  const { ref, onPointerMove } = useSpotlight<HTMLDivElement>();

  return (
    <article
      ref={ref}
      onPointerMove={onPointerMove}
      data-reveal
      className="spotlight-host group relative overflow-hidden bg-[color-mix(in_oklab,var(--panel)_38%,white)] p-6 transition-[transform,box-shadow] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-[0_28px_70px_-40px_rgba(10,10,12,0.3)] md:p-10 lg:p-14"
    >
      <span className="spotlight" aria-hidden="true" />

      <div className="relative flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <p className="font-mono text-[10px] tracking-[0.14em] text-strong">CASE STUDY / {project.number}</p>
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">{project.clientType}</p>
      </div>

      <Heading className="relative mt-10 max-w-[20ch] text-[clamp(1.9rem,3.6vw,3rem)] font-medium leading-[1.05] tracking-[-0.045em]">
        {project.title}
      </Heading>

      <p className="relative mt-6 max-w-xl leading-7 text-muted">{project.summary}</p>

      <dl className="relative mt-12 grid gap-8 sm:grid-cols-3">
        {project.metrics.map((metric, index) => (
          <div key={metric.label} data-reveal style={{ "--reveal-delay": `${index * 110}ms` } as CSSProperties}>
            <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-strong">{metric.label}</dt>
            <dd className="mt-4 text-[clamp(1.6rem,2.6vw,2.4rem)] font-medium leading-none tracking-[-0.05em]">
              <MetricValue value={metric.value} />
            </dd>
          </div>
        ))}
      </dl>

      <TrackLink
        href={`/work/${project.slug}`}
        event="case_study_opened"
        properties={{ project: project.slug }}
        className="group/link relative mt-12 inline-flex items-center gap-2 text-[15px] font-medium transition-colors duration-500 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        Read case study
        <span
          aria-hidden="true"
          className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/link:translate-x-1"
        >
          →
        </span>
      </TrackLink>
    </article>
  );
}
