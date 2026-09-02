"use client";

import { useEffect } from "react";

const LERP = 0.115;
const WHEEL_MULTIPLIER = 1;
const SETTLE = 0.35;

/**
 * Dependency-free inertial scrolling in the spirit of Lenis / Locomotive.
 *
 * It animates the *native* scroll position instead of transforming a wrapper,
 * so `position: sticky`, anchor links, scroll-margin and the browser scrollbar
 * all keep working exactly as they do without it.
 *
 * Opt out of a subtree (modals, code panes, overflow areas) with
 * `data-scroll-native` on any ancestor of the wheel target.
 *
 * Swapping in Lenis later means replacing only this file.
 */
export function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduced || coarse) return;

    let target = window.scrollY;
    let current = window.scrollY;
    let frame = 0;
    let animating = false;

    const maxScroll = () =>
      Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    const stop = () => {
      animating = false;
      cancelAnimationFrame(frame);
      document.documentElement.removeAttribute("data-scrolling");
    };

    const tick = () => {
      current += (target - current) * LERP;

      if (Math.abs(target - current) < SETTLE) {
        current = target;
        window.scrollTo(0, current);
        stop();
        return;
      }

      window.scrollTo(0, current);
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (animating) return;
      animating = true;
      document.documentElement.setAttribute("data-scrolling", "");
      frame = requestAnimationFrame(tick);
    };

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey || event.defaultPrevented) return;
      if (event.deltaMode !== 0) return; // line/page scrolling — leave native
      if ((event.target as Element | null)?.closest?.("[data-scroll-native]")) return;

      event.preventDefault();
      target = Math.max(0, Math.min(maxScroll(), target + event.deltaY * WHEEL_MULTIPLIER));
      start();
    };

    // Keyboard, scrollbar dragging, anchor jumps and `scrollIntoView` all move
    // the page without a wheel event — resync so the next wheel tick is smooth.
    const onScroll = () => {
      if (animating) return;
      target = window.scrollY;
      current = window.scrollY;
    };

    const onKeyDown = () => stop();

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("touchstart", onKeyDown, { passive: true });

    return () => {
      stop();
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("touchstart", onKeyDown);
    };
  }, []);

  return null;
}
