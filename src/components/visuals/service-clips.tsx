import type { CSSProperties } from "react";

/* ── Web UI Automation ──────────────────── visual diff: design vs. rendered */

/** Blocks that sit at a different offset in the DOM than in the design. */
const driftedBlocks = [
  { x: 12, y: 20, width: 74, height: 9 },
  { x: 12, y: 52, width: 52, height: 9 },
  { x: 12, y: 84, width: 64, height: 9 },
];

const stableBlocks = [
  { x: 12, y: 36, width: 88, height: 6 },
  { x: 12, y: 68, width: 80, height: 6 },
  { x: 12, y: 100, width: 44, height: 6 },
];

function Wireframe({ label, drifted }: { label: string; drifted: boolean }) {
  return (
    <g>
      <text x="12" y="10" style={{ font: "500 7px var(--font-geist-mono), monospace", letterSpacing: "0.12em" }} fill="var(--muted)">
        {label}
      </text>
      {stableBlocks.map((block) => (
        <rect key={`${block.x}-${block.y}`} {...block} fill="var(--strong)" fillOpacity="0.35" />
      ))}
      {driftedBlocks.map((block, index) =>
        drifted ? (
          <rect
            key={`${block.x}-${block.y}`}
            className="diff-block"
            {...block}
            strokeWidth="1"
            style={{ "--diff-index": index } as CSSProperties}
          />
        ) : (
          <rect key={`${block.x}-${block.y}`} {...block} fill="var(--strong)" fillOpacity="0.35" />
        ),
      )}
    </g>
  );
}

/**
 * Pixel diff between the design source and the rendered DOM: three regions
 * drift, get flagged, then snap into alignment and clear.
 */
export function VisualDiffClip() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <span
        aria-hidden="true"
        className="scan-sweep absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-transparent via-accent/[0.08] to-transparent"
      />
      <svg viewBox="0 0 240 128" className="absolute inset-0 h-full w-full p-5" role="img" aria-label="Visual diff: three regions drift out of alignment between the design and the rendered DOM, are flagged, then resolve.">
        <Wireframe label="FIGMA" drifted={false} />
        <line x1="120" y1="4" x2="120" y2="124" stroke="var(--line)" strokeWidth="1" />
        <g transform="translate(128 0)">
          <Wireframe label="DOM" drifted />
        </g>
      </svg>

      <p className="diff-count absolute bottom-4 left-5 font-mono text-[10px] uppercase tracking-[0.12em] text-clip-fail">
        3 regions drifted
      </p>
      <p className="diff-clear absolute bottom-4 left-5 font-mono text-[10px] uppercase tracking-[0.12em] text-clip-ok">
        pixel parity restored
      </p>
    </div>
  );
}

/* ── API Automation ────────────────────── contract validation, live console */

const apiLines = [
  { method: "POST", path: "/v1/orders", status: "200", ms: "62ms" },
  { method: "GET", path: "/v1/orders/{id}", status: "200", ms: "41ms" },
  { method: "POST", path: "/v1/refunds", status: "422", ms: "38ms", warn: true },
  { method: "GET", path: "/v1/ledger", status: "200", ms: "55ms" },
];

/** Endpoints answering while each response is checked against its schema. */
export function ApiConsoleClip() {
  return (
    <div className="absolute inset-0 mx-auto flex w-full max-w-lg flex-col justify-center gap-1.5 p-5 font-mono text-[10.5px] leading-[1.7] md:p-6 md:text-[11px]">
      {apiLines.map((line, index) => (
        <div key={line.path} className="term-line" style={{ "--line-index": index * 2 } as CSSProperties}>
          <p className="flex items-baseline gap-2 whitespace-nowrap">
            <span className="w-9 shrink-0 text-muted">{line.method}</span>
            <span className="truncate">{line.path}</span>
            <span className={`ml-auto pl-3 ${line.warn ? "text-clip-warn" : "text-clip-ok"}`}>{line.status}</span>
            <span className="w-11 shrink-0 text-right text-strong">{line.ms}</span>
          </p>
          <p className="flex items-baseline gap-2 pl-11 text-strong">
            <span className="text-clip-ok">✓</span> schema valid
          </p>
        </div>
      ))}
      <p
        className="term-line mt-1 font-medium text-clip-ok"
        style={{ "--line-index": apiLines.length * 2 } as CSSProperties}
      >
        41 contracts · 0 drift
      </p>
    </div>
  );
}

/* ── CI/CD Testing ─────────────────────────── the suite across four workers */

const lanes = [
  { name: "worker 1", specs: 11 },
  { name: "worker 2", specs: 10 },
  { name: "worker 3", specs: 11 },
  { name: "worker 4", specs: 10 },
];

/** One suite fanned across four parallel workers, each finishing at its own pace. */
export function ParallelWorkersClip() {
  return (
    <div className="absolute inset-0 mx-auto flex w-full max-w-lg flex-col justify-center gap-4 p-5 md:p-6">
      {lanes.map((lane, index) => (
        <div key={lane.name} className="flex items-center gap-3">
          <span className="w-16 shrink-0 font-mono text-[9.5px] uppercase tracking-[0.1em] text-muted">
            {lane.name}
          </span>
          <span className="relative h-1.5 flex-1 overflow-hidden bg-line" aria-hidden="true">
            <span
              className="worker-fill absolute inset-0 block bg-accent/55"
              data-lane={index}
              style={{ "--lane": index } as CSSProperties}
            />
          </span>
          <span
            className="worker-tick w-7 shrink-0 text-right font-mono text-[10px] text-clip-ok"
            style={{ "--lane": index } as CSSProperties}
          >
            ✓
          </span>
          <span className="w-8 shrink-0 text-right font-mono text-[9.5px] text-strong">{lane.specs}</span>
        </div>
      ))}
      <p className="sr-only">Forty-two specs distributed across four parallel CI workers, each completing independently.</p>
    </div>
  );
}
