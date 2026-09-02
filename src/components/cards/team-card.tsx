import type { CSSProperties } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { TeamMember } from "@/types/content";
import { TechBadge } from "@/components/ui/primitives";

/**
 * Team profile: portrait (or initials block) on the left, credentials on the
 * right. The portrait desaturates until hover so the grid stays calm.
 */
export function TeamCard({ member, index = 0 }: { member: TeamMember; index?: number }) {
  return (
    <article
      data-reveal
      style={{ "--reveal-delay": `${index * 90}ms` } as CSSProperties}
      className="group flex flex-col gap-6 border-b border-line p-5 transition-colors duration-500 last:border-b-0 hover:bg-panel/70 md:p-8 sm:flex-row sm:border-b-0 sm:border-r sm:last:border-r-0"
    >
      <div className="reactive-grid surface relative aspect-[3/4] w-full shrink-0 overflow-hidden border border-line sm:w-40 lg:w-48">
        {member.image ? (
          <Image
            src={member.image}
            alt={`${member.name}, ${member.role}`}
            fill
            sizes="(min-width: 1024px) 12rem, (min-width: 640px) 10rem, 90vw"
            className="object-cover object-top grayscale transition-[filter,transform] duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
          />
        ) : (
          <span className="absolute inset-0 grid place-items-center font-mono text-3xl tracking-[-0.05em] text-muted transition-colors duration-500 group-hover:text-accent">
            {member.initials}
          </span>
        )}
      </div>

      <div className="min-w-0">
        <h3 className="text-xl font-medium tracking-[-0.03em]">{member.name}</h3>
        <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted">{member.role}</p>
        <p className="mt-5 leading-7 text-muted">{member.description}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {member.technologies.map((technology) => <TechBadge key={technology}>{technology}</TechBadge>)}
        </div>

        {member.linkedin || member.github ? (
          <div className="mt-6 flex items-center gap-5">
            {member.linkedin ? (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label={`${member.name} on LinkedIn`}
                className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.1em] text-muted transition-colors duration-500 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                LinkedIn <ArrowUpRight aria-hidden="true" size={12} />
              </a>
            ) : null}
            {member.github ? (
              <a
                href={member.github}
                target="_blank"
                rel="noreferrer"
                aria-label={`${member.name} on GitHub`}
                className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.1em] text-muted transition-colors duration-500 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
              >
                GitHub <ArrowUpRight aria-hidden="true" size={12} />
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}
