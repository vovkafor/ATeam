import type { CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/types/content";
import { TrackLink } from "@/components/analytics/track-link";

/**
 * Case-study row. On hover the whole block lifts and the technical grid behind
 * it tightens and shifts toward the accent, so the surface reads as a live
 * instrument panel rather than a static table row.
 */
export function ProjectCard({ project, headingLevel = "h3" }: { project: Project; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;

  return (
    <div data-reveal className="group relative border-t border-line">
      <span aria-hidden="true" className="reactive-grid pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

      <article className="raise relative grid bg-canvas/50 lg:grid-cols-[0.72fr_1.28fr]">
        <div className="flex flex-col justify-between border-b border-line p-5 md:p-8 lg:border-b-0 lg:border-r">
          <div>
            <p className="font-mono text-[11px] tracking-[0.12em] text-muted transition-colors duration-500 group-hover:text-accent">
              CASE STUDY / {project.number}
            </p>
            <p className="mt-5 text-sm text-muted">{project.clientType}</p>
          </div>
          <TrackLink
            href={`/work/${project.slug}`}
            event="case_study_opened"
            properties={{ project: project.slug }}
            className="mt-12 inline-flex w-fit items-center gap-2 text-sm font-medium transition-colors duration-500 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            Read case study
            <ArrowUpRight
              aria-hidden="true"
              size={15}
              className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </TrackLink>
        </div>

        <div>
          <div className="p-5 md:p-8">
            <Heading className="max-w-3xl text-[clamp(1.8rem,4vw,3.4rem)] font-medium leading-[1.02] tracking-[-0.045em]">
              {project.title}
            </Heading>
            <p className="mt-6 max-w-2xl leading-7 text-muted">{project.summary}</p>
          </div>

          <dl className="grid border-t border-line sm:grid-cols-3">
            {project.metrics.map((metric, index) => (
              <div
                key={metric.label}
                style={{ transitionDelay: `${index * 70}ms` } as CSSProperties}
                className="border-b border-line p-5 transition-colors duration-500 last:border-b-0 group-hover:bg-accent/[0.04] sm:border-b-0 sm:border-r sm:last:border-r-0 md:p-8"
              >
                <dt className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">{metric.label}</dt>
                <dd
                  className="mt-4 text-[clamp(1.8rem,3vw,3rem)] font-medium tracking-[-0.05em] transition-colors duration-500 group-hover:text-accent"
                  style={{ transitionDelay: `${index * 70}ms` }}
                >
                  {metric.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </article>
    </div>
  );
}
