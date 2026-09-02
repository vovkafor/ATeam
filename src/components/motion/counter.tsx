"use client";

import { useEffect, useState } from "react";
import { useInView, usePrefersReducedMotion } from "@/lib/use-in-view";

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

function format(value: number, decimals: number) {
  return decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString("en-US");
}

/**
 * Counts up to `value` the first time it scrolls into view.
 * `prefix`/`suffix` carry the units so the animated part stays purely numeric.
 */
export function Counter({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1600,
  className = "",
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.4);
  const reduced = usePrefersReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView || reduced) return;

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      setDisplay(value * easeOutExpo(progress));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [duration, inView, reduced, value]);

  // Reduced motion (and any pre-hydration render) shows the final figure.
  const shown = reduced ? value : display;

  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true">
        {prefix}
        {format(shown, decimals)}
        {suffix}
      </span>
      <span className="sr-only">{`${prefix}${format(value, decimals)}${suffix}`}</span>
    </span>
  );
}
