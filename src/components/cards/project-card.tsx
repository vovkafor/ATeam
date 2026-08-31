import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/types/content";
import { TrackLink } from "@/components/analytics/track-link";

export function ProjectCard({ project, headingLevel = "h3" }: { project: Project; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <article className="grid border-t border-line lg:grid-cols-[0.72fr_1.28fr]">
      <div className="flex flex-col justify-between border-b border-line p-5 md:p-8 lg:border-b-0 lg:border-r">
        <div>
          <p className="font-mono text-[11px] tracking-[0.12em] text-muted">CASE STUDY / {project.number}</p>
          <p className="mt-5 text-sm text-muted">{project.clientType}</p>
        </div>
        <TrackLink
          href={`/work/${project.slug}`}
          event="case_study_opened"
          properties={{ project: project.slug }}
          className="mt-12 inline-flex items-center gap-2 text-sm font-medium hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          Read case study <ArrowUpRight aria-hidden="true" size={15} />
        </TrackLink>
      </div>
      <div>
        <div className="p-5 md:p-8">
          <Heading className="max-w-3xl text-[clamp(1.8rem,4vw,3.4rem)] font-medium leading-[1.02] tracking-[-0.045em]">{project.title}</Heading>
          <p className="mt-6 max-w-2xl leading-7 text-muted">{project.summary}</p>
        </div>
        <dl className="grid border-t border-line sm:grid-cols-3">
          {project.metrics.map((metric) => (
            <div key={metric.label} className="border-b border-line p-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 md:p-8">
              <dt className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">{metric.label}</dt>
              <dd className="mt-4 text-[clamp(1.8rem,3vw,3rem)] font-medium tracking-[-0.05em]">{metric.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
}
