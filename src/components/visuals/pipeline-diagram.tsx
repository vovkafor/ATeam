import type { CSSProperties } from "react";

const upstream = ["Developer", "Pull request", "CI"];
const layers = [
  { name: "Unit tests", detail: "~90s" },
  { name: "API tests", detail: "~4m" },
  { name: "E2E tests", detail: "~11m" },
];

/**
 * Developer → deployment quality pipeline. Each node lights in sequence and the
 * connectors fill behind it, so the diagram reads as an execution order rather
 * than a static org chart.
 */
export function PipelineDiagram() {
  return (
    <div className="reactive-grid surface border border-line p-5 md:p-8" aria-label="Developer to deployment quality pipeline">
      <div className="mx-auto flex max-w-2xl flex-col items-center">
        {upstream.map((item, index) => (
          <div key={item} className="contents">
            <div
              className="stage-run w-full border border-strong bg-canvas px-4 py-3 text-center font-mono text-xs uppercase tracking-[0.1em]"
              style={{ "--stage-index": index } as CSSProperties}
            >
              {item}
            </div>
            <span className="relative h-7 w-px bg-line" aria-hidden="true">
              <span
                className="connector-fill absolute inset-0 block origin-top bg-ink"
                style={{ "--stage-index": index } as CSSProperties}
              />
            </span>
          </div>
        ))}

        <div className="grid w-full border border-ink bg-canvas sm:grid-cols-3">
          {layers.map((layer, index) => (
            <div
              key={layer.name}
              className="stage-run border-b border-ink p-5 text-center last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"
              style={{ "--stage-index": index + 3 } as CSSProperties}
            >
              <p className="font-medium">{layer.name}</p>
              <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted">{layer.detail}</p>
            </div>
          ))}
        </div>

        <span className="relative h-7 w-px bg-line" aria-hidden="true">
          <span className="connector-fill absolute inset-0 block origin-top bg-ink" style={{ "--stage-index": 4 } as CSSProperties} />
        </span>
        <div
          className="stage-run w-full border border-strong bg-canvas px-4 py-3 text-center font-mono text-xs uppercase tracking-[0.1em]"
          style={{ "--stage-index": 5 } as CSSProperties}
        >
          Report
        </div>

        <span className="relative h-7 w-px bg-line" aria-hidden="true">
          <span className="connector-fill absolute inset-0 block origin-top bg-accent" style={{ "--stage-index": 5 } as CSSProperties} />
        </span>
        <div
          className="stage-run w-full border border-accent bg-gradient-to-r from-accent to-[#4a72ff] px-4 py-3 text-center font-mono text-xs uppercase tracking-[0.1em] text-white shadow-[0_12px_30px_-16px_rgba(36,85,255,0.9)]"
          style={{ "--stage-index": 6 } as CSSProperties}
        >
          Deploy / verified
        </div>
      </div>
    </div>
  );
}
