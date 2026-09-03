"use client";

import { useRef, type PointerEvent as ReactPointerEvent } from "react";

/**
 * Publishes the pointer's position within an element as `--pointer-x` /
 * `--pointer-y`, which the `.spotlight` layer renders as a soft light.
 *
 * Shared by the Hero clip tiles and the case-study cards so the interaction
 * feels like one system rather than two similar effects.
 */
export function useSpotlight<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  function onPointerMove(event: ReactPointerEvent<T>) {
    const node = ref.current;
    if (!node) return;

    const rect = node.getBoundingClientRect();
    node.style.setProperty("--pointer-x", `${((event.clientX - rect.left) / rect.width) * 100}%`);
    node.style.setProperty("--pointer-y", `${((event.clientY - rect.top) / rect.height) * 100}%`);
  }

  return { ref, onPointerMove };
}
