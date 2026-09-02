import type { CSSProperties } from "react";
import { Counter } from "@/components/motion/counter";
import { VisualFrame } from "@/components/visuals/visual-frame";

const WIDTH = 440;
const HEIGHT = 190;

/* Virtual users ramping to peak, then holding. */
const vus = [0, 4, 12, 26, 44, 66, 88, 104, 116, 124, 128, 130, 129, 131, 130, 128, 130, 129, 130, 130];
/* Observed p95 latency, ms — degrades slightly under sustained peak. */
const p95 = [120, 118, 124, 131, 140, 152, 168, 186, 201, 214, 226, 238, 244, 249, 252, 254, 256, 255, 257, 256];

const THRESHOLD = 300;
const MAX_LATENCY = 380;

function toPoints(series: number[], max: number) {
  return series.map((value, index) => {
    const x = (index / (series.length - 1)) * WIDTH;
    const y = HEIGHT - (value / max) * HEIGHT;
    return [x, y] as const;
  });
}

function toPath(points: readonly (readonly [number, number])[]) {
  return points.map(([x, y], index) => `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
}

/**
 * Performance Testing — a load profile: virtual users ramping to peak against
 * observed p95 latency, with the agreed threshold drawn as a dashed budget line.
 */
export function LoadProfile() {
  const loadPoints = toPoints(vus, 160);
  const latencyPoints = toPoints(p95, MAX_LATENCY);
  const thresholdY = HEIGHT - (THRESHOLD / MAX_LATENCY) * HEIGHT;
  const latencyPath = toPath(latencyPoints);

  return (
    <VisualFrame
      label="LOAD PROFILE / p95 vs BUDGET"
      caption="k6 · 130 VUs · 20 min hold"
      metric={
        <>
          <Counter value={256} suffix="ms" /> p95 at peak — 15% under budget
        </>
      }
    >
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-auto w-full" role="img" aria-label="Load profile chart: virtual users ramp to 130 while p95 latency settles at 256 milliseconds, staying under the 300 millisecond budget.">
        {[0.25, 0.5, 0.75].map((ratio) => (
          <line key={ratio} x1="0" x2={WIDTH} y1={HEIGHT * ratio} y2={HEIGHT * ratio} stroke="var(--line)" strokeWidth="1" />
        ))}

        <path
          d={`${toPath(loadPoints)} L ${WIDTH} ${HEIGHT} L 0 ${HEIGHT} Z`}
          fill="var(--accent)"
          opacity="0.07"
        />
        <path
          className="trace-draw"
          d={toPath(loadPoints)}
          fill="none"
          stroke="var(--strong)"
          strokeWidth="1.5"
          style={{ "--trace-length": 900 } as CSSProperties}
        />

        <line
          x1="0"
          x2={WIDTH}
          y1={thresholdY}
          y2={thresholdY}
          stroke="var(--signal-fail)"
          strokeWidth="1"
          strokeDasharray="5 5"
        />
        <text
          x={WIDTH - 4}
          y={thresholdY - 7}
          textAnchor="end"
          fill="var(--signal-fail)"
          style={{ font: "500 9px var(--font-geist-mono), monospace", letterSpacing: "0.1em" }}
        >
          BUDGET 300ms
        </text>

        <path
          className="trace-draw"
          d={latencyPath}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ "--trace-length": 900, "--trace-delay": "260ms" } as CSSProperties}
        />

        <circle
          cx={latencyPoints[latencyPoints.length - 1][0]}
          cy={latencyPoints[latencyPoints.length - 1][1]}
          r="4.5"
          fill="var(--accent)"
          className="graph-node"
        />
      </svg>
    </VisualFrame>
  );
}
