import type { CSSProperties } from "react";
import { Counter } from "@/components/motion/counter";

/* Minutes of wall-clock CI time per build, oldest run on the left. */
const buildTimes = [96, 91, 88, 93, 84, 79, 74, 61, 54, 47, 41, 35, 31, 28, 25, 24, 22, 21, 20, 19, 18, 18];
const worst = Math.max(...buildTimes);

function toneFor(minutes: number) {
  if (minutes > 70) return "bg-signal-fail";
  if (minutes > 34) return "bg-signal-warn";
  return "bg-signal-ok";
}

const RING_RADIUS = 52;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
const RELEASE_COVERAGE = 0.87;

function Frame({
  label,
  value,
  depth,
  className = "",
  children,
}: {
  label: string;
  value: string;
  depth: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`instrument group/instrument relative flex flex-col justify-between border-line bg-canvas/70 p-5 backdrop-blur-sm transition-colors hover:bg-canvas md:p-6 ${className}`}
      style={{ "--depth": depth } as CSSProperties}
    >
      <div className="flex items-baseline justify-between gap-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">{label}</p>
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent opacity-0 transition-opacity duration-500 group-hover/instrument:opacity-100">
          live
        </p>
      </div>
      {children}
      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">{value}</p>
    </div>
  );
}

/** CI: build-time histogram that heals from red to green, left to right. */
function BuildTimeChart() {
  return (
    <Frame label="CI / BUILD TIME" value="22 runs · trailing 30 days" depth="10px" className="border-b lg:border-b-0 lg:border-r">
      <div className="my-7 flex h-24 items-end gap-[3px]" aria-hidden="true">
        {buildTimes.map((minutes, index) => (
          <span
            key={index}
            className={`bar-grow flex-1 rounded-[1px] transition-colors duration-700 group-hover/instrument:bg-signal-ok ${toneFor(minutes)}`}
            style={{ height: `${(minutes / worst) * 100}%`, "--bar-index": index } as CSSProperties}
          />
        ))}
      </div>
      <p className="sr-only">Median CI build time fell from 96 minutes to 18 minutes across the last 22 runs.</p>
      <div className="mb-5 flex items-end gap-2">
        <span className="text-4xl font-medium leading-none tracking-[-0.05em]">
          <Counter value={18} suffix="m" />
        </span>
        <span className="pb-1 font-mono text-[10px] uppercase tracking-[0.1em] text-signal-ok">↓ from 96m</span>
      </div>
    </Frame>
  );
}

/** Centre: composite code-quality index with a segmented meter. */
function QualityIndex() {
  const segments = 22;
  const filled = 19;

  return (
    <Frame label="CODE QUALITY" value="flake rate 0.4% · debt 3.1d" depth="18px" className="border-b lg:border-b-0 lg:border-r">
      <div className="my-7" aria-hidden="true">
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-medium leading-none tracking-[-0.055em]">
            <Counter value={94} />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">/ 100</span>
        </div>
        <div className="mt-6 flex gap-[3px]">
          {Array.from({ length: segments }, (_, index) => (
            <span
              key={index}
              className={`bar-grow h-9 flex-1 rounded-[1px] ${index < filled ? "bg-accent" : "bg-strong/60"}`}
              style={{ "--bar-index": index } as CSSProperties}
            />
          ))}
        </div>
        <div className="mt-4 flex justify-between font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
          <span>maintainability</span>
          <span className="text-accent">+12 this quarter</span>
        </div>
      </div>
      <p className="sr-only">Composite code-quality index of 94 out of 100, up 12 points this quarter.</p>
    </Frame>
  );
}

/** Release: coverage ring that fills to the current release-readiness figure. */
function ReleaseRing() {
  return (
    <Frame label="RELEASE / COVERAGE" value="critical flows verified" depth="10px">
      <div className="my-6 flex items-center gap-6" aria-hidden="true">
        <div className="relative h-[132px] w-[132px] shrink-0">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <circle cx="60" cy="60" r={RING_RADIUS} fill="none" stroke="var(--line)" strokeWidth="7" />
            <circle
              className="ring-fill"
              cx="60"
              cy="60"
              r={RING_RADIUS}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="7"
              strokeLinecap="butt"
              style={
                {
                  "--ring-circumference": RING_CIRCUMFERENCE,
                  "--ring-target": RING_CIRCUMFERENCE * (1 - RELEASE_COVERAGE),
                } as CSSProperties
              }
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-medium leading-none tracking-[-0.05em]">
              <Counter value={87} suffix="%" />
            </span>
            <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-muted">ready</span>
          </div>
        </div>
        <ul className="space-y-3 font-mono text-[10px] uppercase tracking-[0.1em]">
          {[
            ["checkout", "pass"],
            ["auth", "pass"],
            ["billing", "pass"],
            ["reporting", "queued"],
          ].map(([flow, state], index) => (
            <li key={flow} className="flex items-center gap-2.5">
              <span
                className={`h-1.5 w-1.5 shrink-0 ${state === "pass" ? "bg-signal-ok" : "bg-strong"}`}
                style={{ animationDelay: `${index * 240}ms` }}
              />
              <span className="text-muted">{flow}</span>
              <span className={state === "pass" ? "text-signal-ok" : "text-muted"}>{state}</span>
            </li>
          ))}
        </ul>
      </div>
      <p className="sr-only">87 percent of critical release flows verified; reporting still queued.</p>
    </Frame>
  );
}

export function HeroInstruments() {
  return (
    <div className="grid border-t border-line lg:grid-cols-3">
      <BuildTimeChart />
      <QualityIndex />
      <ReleaseRing />
    </div>
  );
}
