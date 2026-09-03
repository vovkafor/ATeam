import type { CSSProperties } from "react";

/* ── Clip 1 ─────────────────────────────────────────────── Fast Feedback */

const terminalLines = [
  { text: "pnpm playwright test --shard=1/8", prompt: true },
  { text: "Running 42 tests using 8 workers", dim: true },
  { text: "checkout › applies discount", ms: "412ms", pass: true },
  { text: "auth › rejects expired token", ms: "208ms", pass: true },
  { text: "billing › proration on upgrade", ms: "355ms", pass: true },
  { text: "search › debounces input", ms: "141ms", pass: true },
  { text: "42 passed", ms: "11.4s", summary: true },
];

/** A Playwright run: specs land one by one, each closing green. */
export function TerminalClip() {
  return (
    <div className="absolute inset-0 flex flex-col justify-center p-6 font-mono text-[11px] leading-[1.9] md:p-8 md:text-[12px]">
      {terminalLines.map((line, index) => (
        <p
          key={line.text}
          className={`term-line flex items-baseline gap-2 whitespace-nowrap ${line.dim ? "text-muted" : ""}`}
          style={{ "--line-index": index } as CSSProperties}
        >
          {line.prompt ? <span className="text-accent">$</span> : null}
          {line.pass ? <span className="text-clip-ok">✓</span> : null}
          <span className={line.summary ? "font-medium text-clip-ok" : ""}>{line.text}</span>
          {line.ms ? <span className="ml-auto pl-3 text-strong">{line.ms}</span> : null}
        </p>
      ))}
      <span
        className="term-caret mt-1 inline-block h-3.5 w-1.5 bg-accent"
        style={{ animationDelay: "3s" }}
        aria-hidden="true"
      />
    </div>
  );
}

/* ── Clip 2 ────────────────────────────────────────────── High Code Quality */

const nodes = [
  { x: 52, y: 60 },
  { x: 132, y: 34 },
  { x: 132, y: 96 },
  { x: 216, y: 60 },
  { x: 296, y: 34 },
  { x: 296, y: 96 },
];

const edges: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 3],
  [3, 4],
  [3, 5],
];

/** Static analysis sweeping the module graph: flags amber, settles green. */
export function QualityGraphClip() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <span
        aria-hidden="true"
        className="scan-sweep absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-accent/[0.10] to-transparent"
      />
      <svg viewBox="0 0 348 130" className="absolute inset-0 h-full w-full p-6 md:p-8" role="img" aria-label="Static analysis sweeping a module graph: one module flags a warning, then every module settles green.">
        {edges.map(([from, to], index) => (
          <line
            key={`${from}-${to}`}
            className="edge-trace"
            x1={nodes[from].x}
            y1={nodes[from].y}
            x2={nodes[to].x}
            y2={nodes[to].y}
            stroke="var(--accent)"
            strokeOpacity="0.35"
            strokeWidth="1.25"
            style={{ "--node-index": index } as CSSProperties}
          />
        ))}
        {nodes.map((node, index) => (
          <circle
            key={`${node.x}-${node.y}`}
            className="node-check"
            cx={node.x}
            cy={node.y}
            r="4"
            style={{ "--node-index": index } as CSSProperties}
          />
        ))}
      </svg>
    </div>
  );
}

/* ── Clip 3 ─────────────────────────────────────── Complete Release Control */

const stages = ["Commit", "Build", "Test", "Gate", "Deploy"];

/** Commit to production, with a gate at every stage and a green landing. */
export function ReleasePipelineClip() {
  return (
    <div className="absolute inset-0 flex flex-col justify-center gap-8 p-6 md:p-8">
      <div className="relative h-px w-full bg-line" aria-hidden="true">
        <span className="rail-fill absolute inset-0 block bg-accent/40" />
        <span className="rail-token absolute top-1/2 block h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_0_5px_rgba(36,85,255,0.14)]" />
        {stages.map((stage, index) => (
          <span
            key={stage}
            className="absolute top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-strong"
            style={{ left: `${(index / (stages.length - 1)) * 100}%` }}
          />
        ))}
      </div>

      <div className="flex justify-between font-mono text-[10px] uppercase tracking-[0.12em]">
        {stages.map((stage, index) => (
          <span key={stage} className="stage-lit" style={{ "--stage-slot": index } as CSSProperties}>
            {stage}
          </span>
        ))}
      </div>

      <div className="flex justify-center">
        <span className="deployed-chip inline-flex items-center gap-2 bg-clip-ok/[0.10] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-clip-ok">
          <span className="h-1.5 w-1.5 rounded-full bg-clip-ok" aria-hidden="true" />
          Deployed
        </span>
      </div>

      <p className="sr-only">
        A release moves from commit through build, test and the quality gate to a verified production deploy.
      </p>
    </div>
  );
}
