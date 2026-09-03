"use client";

import Image from "next/image";
import { useId, useState, type CSSProperties, type ReactNode } from "react";
import { useSpotlight } from "@/components/motion/spotlight";
import { TechBadge } from "@/components/ui/primitives";
import type { TeamMember } from "@/types/content";

function ProfileLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group/link inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted transition-colors duration-500 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
    >
      {label}
      <span aria-hidden="true" className="transition-transform duration-500 group-hover/link:translate-x-0.5">
        →
      </span>
    </a>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-strong">{children}</p>;
}

/**
 * Portrait with a focus-pull: monochrome and fractionally soft at rest, then
 * resolving into colour and sharpness under the pointer, with an engineering
 * HUD fading in over it. The HUD is decorative — the status it reports is
 * repeated in the profile copy, so nothing is lost with it hidden.
 */
function Portrait({ member }: { member: TeamMember }) {
  return (
    <div className="group/portrait relative aspect-[3/4] w-full shrink-0 overflow-hidden bg-[color-mix(in_oklab,var(--panel)_60%,white)] sm:w-40 lg:w-48">
      {member.image ? (
        <Image
          src={member.image}
          alt={`${member.name}, ${member.role}`}
          fill
          sizes="(min-width: 1024px) 12rem, (min-width: 640px) 10rem, 90vw"
          className="portrait object-cover object-top"
        />
      ) : (
        <span className="portrait absolute inset-0 grid place-items-center font-mono text-3xl tracking-[-0.05em] text-strong">
          {member.initials}
        </span>
      )}

      <div className="hud pointer-events-none absolute inset-0" aria-hidden="true">
        <span className="hud-grid absolute inset-0 opacity-70" />
        <span className="hud-scan absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-transparent via-accent/[0.14] to-transparent" />

        <span className="hud-bracket hud-bracket-tl" />
        <span className="hud-bracket hud-bracket-tr" />
        <span className="hud-bracket hud-bracket-bl" />
        <span className="hud-bracket hud-bracket-br" />

        <span className="absolute left-3.5 top-3.5 font-mono text-[8px] uppercase tracking-[0.16em] text-accent">
          {member.initials}
        </span>

        <span className="absolute inset-x-7 bottom-7 flex items-center gap-1.5 bg-white/85 px-2 py-1 font-mono text-[8px] uppercase leading-[1.35] tracking-[0.08em] text-accent backdrop-blur-sm">
          <span className="hud-pulse h-1 w-1 shrink-0 rounded-full bg-clip-ok" />
          {member.status}
        </span>
      </div>
    </div>
  );
}

/**
 * Team profile with an in-place drawer.
 *
 * Two ways in, because a hover-only disclosure is unusable on touch and with a
 * keyboard: pointing at the card previews the full profile, and the header
 * button pins it open with real `aria-expanded` state. The drawer animates on
 * grid-template-rows (0fr → 1fr) so it eases to its natural height without a
 * measured max-height, and goes `inert` while collapsed so keyboard focus never
 * lands inside content nobody can see.
 */
export function TeamCard({ member, index = 0 }: { member: TeamMember; index?: number }) {
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);
  const panelId = useId();
  const { ref, onPointerMove } = useSpotlight<HTMLElement>();

  const expanded = pinned || hovered;

  return (
    <article
      ref={ref}
      onPointerMove={onPointerMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-reveal
      style={{ "--reveal-delay": `${index * 110}ms` } as CSSProperties}
      className="spotlight-host group relative self-start overflow-hidden bg-[color-mix(in_oklab,var(--panel)_38%,white)] transition-[transform,box-shadow] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-[0_28px_70px_-40px_rgba(10,10,12,0.3)]"
    >
      <span className="spotlight" aria-hidden="true" />

      <div className="relative flex flex-col gap-7 p-6 md:p-8 sm:flex-row">
        <Portrait member={member} />

        <div className="min-w-0 flex-1">
          <h3 className="text-[clamp(1.25rem,1.9vw,1.6rem)] font-medium tracking-[-0.03em]">{member.name}</h3>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.1em] text-strong">{member.role}</p>
          <p className="mt-5 text-[15px] leading-6">{member.focus}</p>
          <p className="mt-3 leading-7 text-muted">{member.description}</p>

          <div className="mt-6 flex flex-wrap gap-1.5">
            {member.technologies.slice(0, 6).map((technology) => (
              <TechBadge key={technology}>{technology}</TechBadge>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setPinned((current) => !current)}
            aria-expanded={pinned}
            aria-controls={panelId}
            className="group/toggle mt-7 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-accent transition-colors duration-500 hover:text-accent-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            {pinned ? "Hide full profile" : "Full profile"}
            <span
              aria-hidden="true"
              className={`transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${expanded ? "rotate-90" : ""}`}
            >
              →
            </span>
          </button>
        </div>
      </div>

      <div
        id={panelId}
        inert={!expanded}
        className={`relative grid transition-[grid-template-rows] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className={`transition-opacity duration-500 ${expanded ? "opacity-100 delay-100" : "opacity-0"}`}>
            <dl className="grid gap-6 px-6 pb-8 sm:grid-cols-3 md:px-8">
              {member.highlights.map((highlight) => (
                <div key={highlight.label}>
                  <dd className="text-[clamp(1.3rem,2vw,1.7rem)] font-medium leading-none tracking-[-0.05em] text-accent">
                    {highlight.value}
                  </dd>
                  <dt className="mt-3 font-mono text-[10px] uppercase leading-4 tracking-[0.1em] text-muted">
                    {highlight.label}
                  </dt>
                </div>
              ))}
            </dl>

            <div className="px-6 pb-8 md:px-8">
              <SectionLabel>What {member.name.split(" ")[0]} brings</SectionLabel>
              <ul className="mt-5 space-y-3.5">
                {member.strengths.map((strength) => (
                  <li key={strength} className="flex gap-3 text-[15px] leading-6 text-muted">
                    <span aria-hidden="true" className="mt-2.5 h-px w-3 shrink-0 bg-accent" />
                    {strength}
                  </li>
                ))}
              </ul>
            </div>

            <div className="px-6 pb-8 md:px-8">
              <SectionLabel>Experience</SectionLabel>
              <ol className="mt-5 space-y-6">
                {member.experience.map((role) => (
                  <li key={`${role.org}-${role.period}`}>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <p className="font-medium tracking-[-0.02em]">
                        {role.role} <span className="text-muted">· {role.org}</span>
                      </p>
                      <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-strong">{role.period}</p>
                    </div>
                    <p className="mt-2.5 max-w-2xl text-sm leading-6 text-muted">{role.detail}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="px-6 pb-8 md:px-8">
              <SectionLabel>Education</SectionLabel>
              <ul className="mt-5 space-y-4">
                {member.education.map((entry) => (
                  <li key={entry.school} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <p className={entry.featured ? "font-medium" : ""}>
                      {entry.program} <span className="text-muted">· {entry.school}</span>
                      {entry.featured ? (
                        <span className="ml-2 inline-block bg-accent/[0.08] px-2 py-0.5 align-middle font-mono text-[9px] uppercase tracking-[0.1em] text-accent">
                          Apple Developer Academy
                        </span>
                      ) : null}
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-strong">{entry.period}</p>
                  </li>
                ))}
              </ul>

              {member.linkedin || member.github ? (
                <div className="mt-8 flex items-center gap-6">
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
