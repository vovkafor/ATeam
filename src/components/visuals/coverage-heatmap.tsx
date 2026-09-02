import type { CSSProperties } from "react";
import { Counter } from "@/components/motion/counter";
import { VisualFrame } from "@/components/visuals/visual-frame";

const COLUMNS = 12;
const ROWS = 7;
const CELLS = COLUMNS * ROWS;

/* Deterministic pseudo-random so server and client markup match exactly. */
function weightFor(index: number) {
  const row = Math.floor(index / COLUMNS);
  const column = index % COLUMNS;
  return (Math.sin(row * 12.9898 + column * 78.233) * 43758.5453) % 1;
}

/**
 * Web UI Automation — a coverage heatmap where each cell is a spec file.
 * Cells ignite in a diagonal wave as the suite executes; uncovered cells stay
 * grey so the gap in coverage is readable at a glance.
 */
export function CoverageHeatmap() {
  return (
    <VisualFrame
      label="TEST COVERAGE / SPEC MATRIX"
      caption="84 specs · 7 journeys · 3 browsers"
      metric={
        <>
          <Counter value={82} suffix="%" /> critical-flow coverage
        </>
      }
    >
      <div
        className="grid gap-[3px]"
        style={{ gridTemplateColumns: `repeat(${COLUMNS}, minmax(0, 1fr))` }}
        aria-hidden="true"
      >
        {Array.from({ length: CELLS }, (_, index) => {
          const covered = Math.abs(weightFor(index)) > 0.22;
          const row = Math.floor(index / COLUMNS);
          const column = index % COLUMNS;
          const wave = row + column;

          return (
            <span key={index} className="relative aspect-square border border-line bg-canvas">
              {covered ? (
                <span
                  className="cell-light absolute inset-0 bg-accent"
                  style={{ "--cell-index": wave } as CSSProperties}
                />
              ) : null}
            </span>
          );
        })}
      </div>
      <p className="sr-only">
        Coverage matrix: 82 percent of critical user flows are covered by the browser suite across three browsers.
      </p>
    </VisualFrame>
  );
}
