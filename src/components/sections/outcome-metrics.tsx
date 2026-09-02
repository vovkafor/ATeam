"use client";

import type { CSSProperties, ReactNode } from "react";
import { Counter } from "@/components/motion/counter";
import { useInView } from "@/lib/use-in-view";

/* Efficiency gained: engineer-hours returned per release, indexed. */
const efficiencySeries = [18, 22, 27, 33, 41, 48, 56, 63, 71, 78, 86, 94];
/* Release frequency: deploys per week before → after. */
const releaseSeries = [2, 2, 3, 2, 3, 4, 5, 6, 6, 7, 8, 8];
/* Defects escaping to production per month. */
const defectSeries = [96, 88, 74, 61, 47, 38, 31, 26, 22, 19, 18, 17];

function Metric({
  label,
  headline,
  caption,
  children,
}: {
  label: string;
  headline: ReactNode;
  caption: string;
  children: ReactNode;
}) {
  return (
    <div className="group flex flex-col justify-between gap-8 border-b border-line p-5 transition-colors duration-500 hover:bg-panel/70 md:p-10 lg:border-b-0 lg:border-r lg:last:border-r-0">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">{label}</p>
        <p className="mt-7 text-[clamp(2.6rem,5vw,4.25rem)] font-medium leading-none tracking-[-0.055em]">{headline}</p>
      </div>
      <div className="h-24">{children}</div>
      <p className="max-w-xs text-sm leading-6 text-muted">{caption}</p>
    </div>
  );
}

function Bars({ series, live, tone }: { series: number[]; live: boolean; tone: string }) {
  const max = Math.max(...series);
  return (
    <div className="flex h-full items-end gap-1.5" aria-hidden="true">
      {series.map((value, index) => (
        <span
          key={index}
          className={`flex-1 rounded-[1px] ${tone} ${live ? "bar-grow" : "scale-y-[0.06] origin-bottom"}`}
          style={{ height: `${(value / max) * 100}%`, "--bar-index": index } as CSSProperties}
        />
      ))}
    </div>
  );
}

function StepLine({ series, live }: { series: number[]; live: boolean }) {
  const max = Math.max(...series);
  const width = 260;
  const height = 96;
  const path = series
    .map((value, index) => {
      const x = (index / (series.length - 1)) * width;
      const y = height - (value / max) * (height - 8) - 4;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" aria-hidden="true">
      <path d={`${path} L ${width} ${height} L 0 ${height} Z`} fill="var(--accent)" opacity={live ? 0.08 : 0} className="transition-opacity duration-1000" />
      <path
        d={path}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={live ? "trace-draw" : undefined}
        style={{ "--trace-length": 420, strokeDashoffset: live ? undefined : 420, strokeDasharray: 420 } as CSSProperties}
      />
    </svg>
  );
}

/**
 * Outcome band for the Work page: three counters that run once the section
 * scrolls into view, each paired with the shape of the trend behind it.
 */
export function OutcomeMetrics() {
  const { ref, inView } = useInView<HTMLDivElement>(0.25);

  return (
    <section ref={ref} className="border-b border-line" aria-label="Aggregate outcomes across demonstration engagements">
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 border-b border-line p-5 md:px-10">
        <p className="eyebrow">AGGREGATE OUTCOMES / 03 ENGAGEMENTS</p>
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted">measured 6 months post-handover</p>
      </div>

      <div className="grid lg:grid-cols-3">
        <Metric
          label="EFFICIENCY GAINED"
          headline={<Counter value={50} prefix="+" suffix="%" />}
          caption="Engineer-hours returned per release once manual regression passes were replaced by targeted automation."
        >
          <Bars series={efficiencySeries} live={inView} tone="bg-accent" />
        </Metric>

        <Metric
          label="RELEASE FREQUENCY"
          headline={<Counter value={2} suffix="×" />}
          caption="Deploys per week after quality gates moved into the pull-request path instead of a pre-release batch."
        >
          <StepLine series={releaseSeries} live={inView} />
        </Metric>

        <Metric
          label="DEFECT REDUCTION"
          headline={<Counter value={80} prefix="−" suffix="%" />}
          caption="Defects escaping to production, once contract and integration coverage caught them before merge."
        >
          <Bars series={defectSeries} live={inView} tone="bg-signal-ok" />
        </Metric>
      </div>
    </section>
  );
}
