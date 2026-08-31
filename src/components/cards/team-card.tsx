import type { TeamMember } from "@/types/content";
import { TechBadge } from "@/components/ui/primitives";

export function TeamCard({ member }: { member: TeamMember }) {
  return (
    <article className="border-b border-line p-5 last:border-b-0 md:p-8 lg:border-b-0 lg:border-r lg:last:border-r-0">
      <div className="technical-grid flex aspect-[4/3] items-center justify-center border border-line bg-panel">
        <span className="font-mono text-3xl tracking-[-0.05em] text-muted">{member.initials}</span>
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
