"use client";

import { useId, useState, type CSSProperties } from "react";
import { useSpotlight } from "@/components/motion/spotlight";
import type { ProcessStage } from "@/types/content";

/**
 * Decorative run status. The graph simulates an execution sweep rather than
 * reporting real data, so the whole strip is `aria-hidden` — what the stage
 * actually means is in the panel beside it, as text.
 */
function NodeStatus() {
  return (
    <span
      aria-hidden="true"
      className="node-status relative hidden h-4 w-24 shrink-0 font-mono text-[9px] uppercase tracking-[0.12em] sm:block"
    >
      <span className="node-status-queued absolute inset-0 flex items-center justify-end gap-1.5 text-strong">
        <span className="h-1 w-1 rounded-full bg-strong" />
        Queued
      </span>
      <span className="node-status-running absolute inset-0 flex items-center justify-end gap-1.5 text-accent">
        <span className="node-pulse h-1 w-1 rounded-full bg-accent" />
        Running
      </span>
      <span className="node-status-passed absolute inset-0 flex items-center justify-end gap-1.5 text-signal-ok">
        <span className="h-1 w-1 rounded-full bg-signal-ok" />
        Passed
      </span>
    </span>
  );
}

/**
 * The process stages as a living graph: a run sweeps top to bottom on a
 * shared CSS timeline — each node lights, its connector fills, a token travels
 * to the next — while pointing at or focusing a node opens that stage in the
 * panel beside it.
 *
 * Every panel is rendered, with the inactive ones `hidden`, so the full stage
 * copy is in the server-rendered HTML instead of appearing only after a click.
 */
export function ProcessGraph({ stages }: { stages: ProcessStage[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const panelId = useId();
  const { ref, onPointerMove } = useSpotlight();

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      className="spotlight-host graph reactive-grid surface relative border border-line p-5 md:p-8"
    >
      <span className="spotlight" aria-hidden="true" />

      <div className="relative grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10">
        <ol className="min-w-0">
          {stages.map((stage, index) => {
            const isActive = index === activeIndex;

            return (
              <li key={stage.number}>
                <button
                  type="button"
                  onMouseEnter={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                  onClick={() => setActiveIndex(index)}
                  aria-controls={`${panelId}-${stage.number}`}
                  aria-current={isActive ? "step" : undefined}
                  data-active={isActive ? "" : undefined}
                  style={{ "--node-index": index } as CSSProperties}
                  className="node-run group/node relative flex w-full items-center gap-4 border bg-panel px-4 py-3.5 text-left transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent data-[active]:translate-x-1 data-[active]:shadow-[0_18px_40px_-26px_rgba(0,0,0,0.95)]"
                >
                  <span className="node-bar" aria-hidden="true" />
                  <span className="font-mono text-[10px] tracking-[0.1em] text-accent">{stage.number}</span>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium tracking-[-0.02em]">
                    {stage.shortTitle}
                  </span>
                  <NodeStatus />
                </button>

                {index < stages.length - 1 ? (
                  <span aria-hidden="true" className="relative ml-8 block h-9 w-px bg-line">
                    <span
                      className="edge-fill absolute inset-0 block bg-accent/45"
                      style={{ "--node-index": index } as CSSProperties}
                    />
                    <span
                      className="edge-token absolute -left-0.5 top-0 block h-1.5 w-1.5 bg-accent"
                      style={{ "--node-index": index } as CSSProperties}
                    />
                  </span>
                ) : null}
              </li>
            );
          })}
        </ol>

        <div className="min-w-0 border-t border-line pt-7 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
          {stages.map((stage, index) => (
            <div key={stage.number} id={`${panelId}-${stage.number}`} hidden={index !== activeIndex}>
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-strong">
                Stage {stage.number} / {String(stages.length).padStart(2, "0")}
              </p>
              <h3 className="mt-5 text-2xl font-medium tracking-[-0.035em]">{stage.title}</h3>
              <p className="mt-4 leading-7 text-muted">{stage.description}</p>

              <dl className="mt-7 border-t border-line pt-6">
                <dt className="font-mono text-[10px] uppercase tracking-[0.1em] text-strong">Client receives</dt>
                <dd className="mt-3 leading-7">{stage.deliverable}</dd>
              </dl>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
