"use client";

import Image from "next/image";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { useId, useState, type CSSProperties } from "react";
import type { TeamMember } from "@/types/content";
import { TechBadge } from "@/components/ui/primitives";

function ProfileLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted transition-colors duration-500 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
    >
      {label} <ArrowUpRight aria-hidden="true" size={12} />
    </a>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">{children}</p>;
}

/**
 * Team profile with an expanding drawer.
 *
 * Two ways in, because a hover-only disclosure is unusable on touch and with a
 * keyboard: pointer hover previews it, and the header button pins it open with
 * proper `aria-expanded` state. The drawer animates on grid-template-rows
 * (0fr → 1fr) so it eases to its natural height without a measured max-height
 * or an animation library, and goes `inert` while collapsed so keyboard focus
 * never lands inside content nobody can see.
 */
export function TeamCard({ member, index = 0 }: { member: TeamMember; index?: number }) {
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);
  const panelId = useId();

  const expanded = pinned || hovered;

  return (
    <article
      data-reveal
      style={{ "--reveal-delay": `${index * 90}ms` } as CSSProperties}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group relative self-start overflow-hidden border bg-canvas/70 transition-[border-color,box-shadow,transform] duration-500 ${
        expanded ? "border-strong shadow-[var(--shadow-raise)]" : "border-line"
      }`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-0 h-px origin-left bg-accent transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          expanded ? "scale-x-100" : "scale-x-0"
        }`}
      />

      <div className="flex flex-col gap-6 p-5 md:p-8 sm:flex-row">
        <div className="reactive-grid surface relative aspect-[3/4] w-full shrink-0 overflow-hidden border border-line sm:w-36 lg:w-40">
          {member.image ? (
            <Image
              src={member.image}
              alt={`${member.name}, ${member.role}`}
              fill
              sizes="(min-width: 1024px) 10rem, (min-width: 640px) 9rem, 90vw"
              className={`object-cover object-top transition-[filter,transform] duration-700 ${
                expanded ? "scale-[1.03] grayscale-0" : "grayscale"
              }`}
            />
          ) : (
            <span
              className={`absolute inset-0 grid place-items-center font-mono text-3xl tracking-[-0.05em] transition-colors duration-500 ${
                expanded ? "text-accent" : "text-muted"
              }`}
            >
              {member.initials}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-medium tracking-[-0.03em]">{member.name}</h3>
          <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted">{member.role}</p>
          <p className="mt-4 text-[15px] leading-6 text-ink/80">{member.focus}</p>
          <p className="mt-3 leading-7 text-muted">{member.description}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {member.technologies.slice(0, 6).map((technology) => (
              <TechBadge key={technology}>{technology}</TechBadge>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setPinned((current) => !current)}
            aria-expanded={pinned}
            aria-controls={panelId}
            className="mt-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-accent transition-colors duration-500 hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            {pinned ? "Hide full profile" : "Full profile"}
            <ChevronDown
              aria-hidden="true"
              size={13}
              className={`transition-transform duration-500 ${expanded ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </div>

      <div
        id={panelId}
        inert={!expanded}
        className={`grid transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div
            className={`border-t border-line transition-opacity duration-500 ${expanded ? "opacity-100 delay-100" : "opacity-0"}`}
          >
            <dl className="grid border-b border-line sm:grid-cols-3">
              {member.highlights.map((highlight) => (
                <div key={highlight.label} className="border-b border-line p-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
                  <dd className="text-[clamp(1.5rem,2.4vw,2rem)] font-medium leading-none tracking-[-0.05em] text-accent">
                    {highlight.value}
                  </dd>
                  <dt className="mt-3 font-mono text-[10px] uppercase leading-4 tracking-[0.1em] text-muted">
                    {highlight.label}
                  </dt>
                </div>
              ))}
            </dl>

            <div className="p-5 md:p-8">
              <SectionLabel>What {member.name.split(" ")[0]} brings</SectionLabel>
              <ul className="mt-5 space-y-3.5">
                {member.strengths.map((strength) => (
                  <li key={strength} className="flex gap-3 text-[15px] leading-6 text-muted">
                    <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 bg-accent" />
                    {strength}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-line p-5 md:p-8">
              <SectionLabel>Experience</SectionLabel>
              <ol className="mt-5 space-y-6">
                {member.experience.map((role) => (
                  <li key={`${role.org}-${role.period}`} className="border-l border-line pl-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <p className="font-medium tracking-[-0.02em]">
                        {role.role} <span className="text-muted">· {role.org}</span>
                      </p>
                      <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">{role.period}</p>
                    </div>
                    <p className="mt-2.5 text-sm leading-6 text-muted">{role.detail}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="border-t border-line p-5 md:p-8">
              <SectionLabel>Education</SectionLabel>
              <ul className="mt-5 space-y-4">
                {member.education.map((entry) => (
                  <li key={entry.school} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <p className={entry.featured ? "font-medium" : ""}>
                      {entry.program} <span className="text-muted">· {entry.school}</span>
                      {entry.featured ? (
                        <span className="ml-2 inline-block border border-accent/40 bg-accent/[0.07] px-2 py-0.5 align-middle font-mono text-[9px] uppercase tracking-[0.1em] text-accent">
                          Apple Developer Academy
                        </span>
                      ) : null}
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">{entry.period}</p>
                  </li>
                ))}
              </ul>

              {member.linkedin || member.github ? (
                <div className="mt-7 flex items-center gap-5 border-t border-line pt-5">
                  {member.linkedin ? <ProfileLink href={member.linkedin} label="LinkedIn" /> : null}
                  {member.github ? <ProfileLink href={member.github} label="GitHub" /> : null}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
