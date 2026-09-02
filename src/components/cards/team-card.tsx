import type { CSSProperties } from "react";
import Image from "next/image";
import type { TeamMember } from "@/types/content";
import { TechBadge } from "@/components/ui/primitives";

export function TeamCard({ member, index = 0 }: { member: TeamMember; index?: number }) {
  return (
    <article
      data-reveal
      style={{ "--reveal-delay": `${index * 90}ms` } as CSSProperties}
      className="group border-b border-line p-5 transition-colors duration-500 last:border-b-0 hover:bg-panel/70 md:p-8 lg:border-b-0 lg:border-r lg:last:border-r-0"
    >
      <div className="reactive-grid surface relative flex aspect-[4/3] items-center justify-center overflow-hidden border border-line">
        {member.image ? (
          <Image
            src={member.image}
            alt=""
            fill
            sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
            className="object-cover object-top grayscale transition-[filter,transform] duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
          />
        ) : (
          <span className="font-mono text-3xl tracking-[-0.05em] text-muted transition-colors duration-500 group-hover:text-accent">
            {member.initials}
          </span>
        )}
      </div>
      <h3 className="mt-6 text-xl font-medium tracking-[-0.03em]">{member.name}</h3>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-muted">{member.role}</p>
      <p className="mt-5 min-h-[84px] leading-7 text-muted">{member.description}</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {member.technologies.map((technology) => <TechBadge key={technology}>{technology}</TechBadge>)}
      </div>
    </article>
  );
}
