"use client";

import { useEffect, useMemo, useState } from "react";
import { useInView, usePrefersReducedMotion } from "@/lib/use-in-view";

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

/** Splits "82%" into its animatable number and the text either side of it. */
function parseNumeric(value: string) {
  const match = value.match(/^(\D*?)(\d+(?:[.,]\d+)?)([\s\S]*)$/);
  if (!match) return null;

  const [, prefix, digits, suffix] = match;
  const decimals = digits.includes(".") ? digits.split(".")[1].length : 0;
  return { prefix, target: Number(digits.replace(",", ".")), suffix, decimals };
}

function CountUp({ value, live }: { value: string; live: boolean }) {
  // Memoised: a fresh object each render would re-trigger the effect below on
  // every frame, restarting the count-up so it never reaches its target.
  const parsed = useMemo(() => parseNumeric(value), [value]);
  const reduced = usePrefersReducedMotion();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!live || !parsed || reduced) return;

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = Math.min(1, (now - start) / 1500);
      setProgress(easeOutExpo(elapsed));
      if (elapsed < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [live, parsed, reduced]);

  if (!parsed) return <>{value}</>;

  const shown = reduced || !live ? parsed.target : parsed.target * progress;
  const rendered = parsed.decimals > 0 ? shown.toFixed(parsed.decimals) : Math.round(shown).toString();

  return (
    <>
      {parsed.prefix}
      {rendered}
      {parsed.suffix}
    </>
  );
}

/**
 * Animates a case-study metric as it enters the viewport.
 *
 * Two shapes appear in the content: a transition ("4h → 21m"), which resolves
 * from the old value to the new one, and a plain figure ("82%"), which counts
 * up. The visible half is `aria-hidden` and a single screen-reader copy carries
 * the exact authored string — so assistive tech and tests read one stable value
 * rather than a number mid-animation.
 */
export function MetricValue({ value, className = "" }: { value: string; className?: string }) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.5);
  const [from, to] = value.split(/\s*→\s*/);
  const isTransition = Boolean(to);

  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true" className={inView ? "metric-live" : "metric-idle"}>
        {isTransition ? (
          <>
            <span className="metric-from inline-block text-muted line-through decoration-1 decoration-strong">
              {from}
            </span>
            <span aria-hidden="true" className="px-2 text-strong">
              →
            </span>
            <span className="metric-to inline-block">{to}</span>
          </>
        ) : (
          <CountUp value={value} live={inView} />
        )}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
