import type { CSSProperties } from "react";
import { Counter } from "@/components/motion/counter";
import { VisualFrame } from "@/components/visuals/visual-frame";

const stages = [
  { name: "Commit", detail: "lint · types" },
  { name: "Build", detail: "docker · cache" },
  { name: "Test", detail: "8 shards" },
  { name: "Gate", detail: "smoke · budgets" },
  { name: "Deploy", detail: "verified" },
];

/**
 * CI/CD Test Integration — the delivery pipeline running end to end.
 * Stages light up in sequence and the connector between them fills, so the
 * order of execution (and where the quality gate sits) is legible.
 */
export function PipelineFlow() {
  return (
    <VisualFrame
      label="PIPELINE / PULL REQUEST → PRODUCTION"
      caption="GitHub Actions · 8 parallel shards"
      metric={
        <>
          <Counter value={11} suffix="m" /> from push to release signal
        </>
      }
    >
      <ol className="flex flex-col items-stretch sm:flex-row sm:items-center" aria-hidden="true">
        {stages.map((stage, index) => (
          <li key={stage.name} className="flex flex-col items-center sm:flex-1 sm:flex-row">
            <div
              className="stage-run w-full border border-line bg-canvas px-3 py-4 text-center"
              style={{ "--stage-index": index } as CSSProperties}
            >
              <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="mt-3 text-sm font-medium tracking-[-0.02em]">{stage.name}</p>
              <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.1em] text-muted">{stage.detail}</p>
            </div>

            {index < stages.length - 1 ? (
              <span className="relative block h-7 w-px shrink-0 bg-line sm:h-px sm:w-8">
                <span
                  className="connector-fill absolute inset-0 block origin-top bg-accent sm:origin-left"
                  style={{ "--stage-index": index } as CSSProperties}
                />
              </span>
            ) : null}
          </li>
        ))}
      </ol>
      <p className="sr-only">
        Pipeline stages run in order: commit, build, test across eight shards, quality gate, then a verified deploy —
        eleven minutes from push to release signal.
      </p>
    </VisualFrame>
  );
}
