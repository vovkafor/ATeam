"use client";

import Image from "next/image";
import { useId, useState, type CSSProperties } from "react";
import { useSpotlight } from "@/components/motion/spotlight";
import { clients } from "@/content/clients";
import type { ClientEngagement } from "@/types/content";

/**
 * Real logo when one has been dropped into /public/logos; until then the name
 * itself is set as a wordmark — legible on sight, which an abstract monogram
 * is not, and it holds the same space a logo will take.
 */
function Mark({ client, compact = false }: { client: ClientEngagement; compact?: boolean }) {
  if (client.logo) {
    // Equal height would make a tall lockup (Adobe) a fifth of the optical
    // weight of a long wordmark (FEELD). Sizing toward a common *width* and
    // clamping the height evens the wall out.
    const aspect = client.logo.width / client.logo.height;
    const height = Math.round(Math.min(64, Math.max(34, 168 / aspect)));

    return (
      <Image
        src={client.logo.src}
        alt={client.name}
        width={client.logo.width}
        height={client.logo.height}
        style={{ height: `${compact ? Math.round(height * 0.55) : height}px` }}
        className="wall-logo w-auto max-w-[76%] object-contain object-left"
      />
    );
  }

  return (
    <span
      className={`inline-flex items-baseline font-medium tracking-[-0.055em] ${
        compact ? "text-lg" : "text-[clamp(1.75rem,2.8vw,2.35rem)]"
      }`}
    >
      <span className="text-accent">{client.name.slice(0, 1)}</span>
      {client.name.slice(1)}
    </span>
  );
}

function Card({ client, index }: { client: ClientEngagement; index: number }) {
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);
  const panelId = useId();
  const open = pinned || hovered;

  return (
    <button
      type="button"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      onClick={() => setPinned((current) => !current)}
      aria-expanded={pinned}
      aria-controls={panelId}
      data-open={open ? "" : undefined}
      data-reveal
      style={{ "--reveal-delay": `${index * 70}ms` } as CSSProperties}
      className="wall-card group relative h-60 overflow-hidden border border-line bg-panel/70 p-5 text-left transition-[transform,box-shadow,border-color] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent data-[open]:-translate-y-1 data-[open]:border-accent/40 data-[open]:shadow-[0_30px_70px_-40px_rgba(0,0,0,0.95)] md:p-6"
    >
      <span
        aria-hidden="true"
        className="wall-glow pointer-events-none absolute inset-0 bg-[radial-gradient(24rem_16rem_at_85%_110%,rgba(76,125,255,0.16),transparent_70%)]"
      />
      {/* The "reading the CV" pass: a light sweeps the card once it opens. */}
      <span aria-hidden="true" className="wall-scan pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-transparent via-accent/[0.18] to-transparent" />
      <span aria-hidden="true" className="wall-brackets pointer-events-none absolute inset-0">
        <span className="hud-bracket hud-bracket-tl" />
        <span className="hud-bracket hud-bracket-tr" />
        <span className="hud-bracket hud-bracket-bl" />
        <span className="hud-bracket hud-bracket-br" />
      </span>

      {/* Resting state: the mark, and one line on what the product is. */}
      <span className="wall-rest absolute inset-0 flex flex-col items-start justify-between p-5 md:p-6">
        <span className="flex w-full items-center justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-strong">
          {String(index + 1).padStart(2, "0")}
          <span className="text-accent/70">{String(client.skills.length).padStart(2, "0")} skills</span>
        </span>
        <span className="block">
          <Mark client={client} />
          <span className="mt-3 block max-w-[26ch] text-sm leading-6 text-muted">{client.product}</span>
        </span>
      </span>

      {/* Open state: what we actually did there. */}
      <span id={panelId} className="wall-detail absolute inset-0 flex flex-col p-5 md:p-6">
        <span className="flex items-center justify-between gap-3">
          <Mark client={client} compact />
          <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.12em] text-accent">
            {String(client.skills.length).padStart(2, "0")} skills
          </span>
        </span>

        <span className="mt-4 block text-sm leading-6 text-muted">{client.work}</span>

        <span className="mt-auto flex flex-wrap gap-1.5 pt-4">
          {client.skills.map((skill, chipIndex) => (
            <span
              key={skill}
              style={{ "--chip-index": chipIndex } as CSSProperties}
              className="wall-chip border border-accent/25 bg-accent/[0.08] px-2 py-1 font-mono text-[9px] uppercase tracking-[0.08em] text-accent"
            >
              {skill}
            </span>
          ))}
        </span>
      </span>
    </button>
  );
}

/**
 * Where the team has worked. Every card carries the same two states: the mark
 * at rest, and — on hover, focus or tap — the skills that engagement actually
 * used, swept in by a scan line. Hovering one card dims the rest, so the wall
 * reads as one thing being inspected rather than six competing tiles.
 */
export function ClientWall() {
  const { ref, onPointerMove } = useSpotlight<HTMLDivElement>();

  return (
    <div ref={ref} onPointerMove={onPointerMove} className="spotlight-host relative px-5 pb-16 md:px-10 md:pb-24">
      <span className="spotlight" aria-hidden="true" />
      <div className="wall relative grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {clients.map((client, index) => (
          <Card key={client.slug} client={client} index={index} />
        ))}
      </div>
      <p className="relative mt-6 font-mono text-[10px] uppercase tracking-[0.12em] text-strong">
        Point at a company to see what we used there
      </p>
    </div>
  );
}
