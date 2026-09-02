import type { CSSProperties } from "react";
import { Counter } from "@/components/motion/counter";
import { VisualFrame } from "@/components/visuals/visual-frame";

const AXES = [
  { label: "Coverage", before: 0.42, after: 0.86 },
  { label: "Speed", before: 0.28, after: 0.79 },
  { label: "Stability", before: 0.35, after: 0.91 },
  { label: "Diagnostics", before: 0.22, after: 0.74 },
  { label: "Ownership", before: 0.31, after: 0.82 },
  { label: "CI fit", before: 0.4, after: 0.88 },
];

const CENTER = 110;
const RADIUS = 82;

function point(index: number, ratio: number) {
  const angle = (Math.PI * 2 * index) / AXES.length - Math.PI / 2;
  return [CENTER + Math.cos(angle) * RADIUS * ratio, CENTER + Math.sin(angle) * RADIUS * ratio] as const;
}

function polygon(key: "before" | "after") {
  return AXES.map((axis, index) => point(index, axis[key]).map((n) => n.toFixed(1)).join(",")).join(" ");
}

/**
 * QA Architecture & Audit — the current test estate scored on six axes, with
 * the target state overlaid. The gap between the two shapes is the roadmap.
 */
export function AuditRadar() {
  return (
    <VisualFrame
      label="AUDIT / TEST ESTATE SCORECARD"
      caption="6 axes · audited vs. target state"
      metric={
        <>
          <Counter value={17} /> prioritised findings, ranked by release risk
        </>
      }
    >
      <div className="flex flex-col items-center gap-7 sm:flex-row sm:justify-center sm:gap-10">
        <svg viewBox="0 0 220 220" className="h-48 w-48 shrink-0" role="img" aria-label="Radar chart comparing the audited test estate with the target state across coverage, speed, stability, diagnostics, ownership and CI fit.">
          {[0.25, 0.5, 0.75, 1].map((ring) => (
            <polygon
              key={ring}
              points={AXES.map((_, index) => point(index, ring).map((n) => n.toFixed(1)).join(",")).join(" ")}
              fill="none"
              stroke="var(--line)"
              strokeWidth="1"
            />
          ))}
          {AXES.map((axis, index) => {
            const [x, y] = point(index, 1);
            return <line key={axis.label} x1={CENTER} y1={CENTER} x2={x} y2={y} stroke="var(--line)" strokeWidth="1" />;
          })}

          <polygon
            className="radar-in"
            points={polygon("before")}
            fill="var(--strong)"
            fillOpacity="0.28"
            stroke="var(--strong)"
            strokeWidth="1.5"
            style={{ "--radar-delay": "120ms" } as CSSProperties}
          />
          <polygon
            className="radar-in"
            points={polygon("after")}
            fill="var(--accent)"
            fillOpacity="0.14"
            stroke="var(--accent)"
            strokeWidth="2"
            style={{ "--radar-delay": "520ms" } as CSSProperties}
          />
        </svg>

        <ul className="grid w-full grid-cols-2 gap-x-6 gap-y-3 sm:w-auto sm:grid-cols-1 sm:gap-y-2.5">
          {AXES.map((axis) => (
            <li key={axis.label} className="flex items-center justify-between gap-4 border-b border-line pb-2 font-mono text-[10px] uppercase tracking-[0.1em]">
              <span className="text-muted">{axis.label}</span>
              <span className="text-accent">
                {Math.round(axis.before * 100)} → {Math.round(axis.after * 100)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </VisualFrame>
  );
}
