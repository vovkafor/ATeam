import type { ReactNode } from "react";

/**
 * Shared chrome for every service infographic: mono label, live dot, the visual
 * itself, and a single headline metric under a hairline.
 */
export function VisualFrame({
  label,
  caption,
  metric,
  children,
}: {
  label: string;
  caption: string;
  metric: ReactNode;
  children: ReactNode;
}) {
  return (
    <figure className="group/visual m-0 w-full border border-line bg-canvas/80 backdrop-blur-sm transition-shadow duration-500 hover:shadow-[var(--shadow-raise)]">
      <figcaption className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">{label}</span>
        <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-accent">
          <span className="graph-node h-1.5 w-1.5 bg-accent" aria-hidden="true" />
          running
        </span>
      </figcaption>

      <div className="surface p-5 md:p-6">{children}</div>

      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t border-line px-5 py-4">
        <p className="text-sm font-medium tracking-[-0.01em]">{metric}</p>
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">{caption}</p>
      </div>
    </figure>
  );
}
