"use client";

import { useEffect } from "react";

/**
 * Global scroll-reveal driver.
 *
 * Any element (server or client) can opt in with `data-reveal` — no wrapper
 * component and no extra client boundary required:
 *
 *   <div data-reveal>…</div>
 *   <div data-reveal="left" style={{ "--reveal-delay": "120ms" }}>…</div>
 *
 * The hidden state lives behind `html[data-reveal-ready]`, which is only set
 * once this component mounts, so the page stays fully visible without JS.
 */
export function ScrollReveal() {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      document.querySelectorAll("[data-reveal]").forEach((node) => node.classList.add("is-revealed"));
      return;
    }

    root.setAttribute("data-reveal-ready", "");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );

    const observeAll = () => {
      document.querySelectorAll("[data-reveal]:not(.is-revealed)").forEach((node) => observer.observe(node));
    };

    observeAll();

    // Route changes swap the subtree without remounting this component.
    const mutations = new MutationObserver(observeAll);
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
      root.removeAttribute("data-reveal-ready");
    };
  }, []);

  return null;
}
