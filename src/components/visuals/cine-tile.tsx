"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";

/**
 * Frame for a looping clip.
 *
 * These read as video tiles but are CSS/SVG loops: no file to download, sharp
 * at any pixel density, and they hold a legible still frame when motion is
 * reduced. The only chrome is a hairline that appears on hover, plus a soft
 * light that tracks the pointer across the surface.
 */
export function CineTile({
  caption,
  index = 0,
  children,
}: {
  caption: string;
  index?: number;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    node.style.setProperty("--pointer-x", `${((event.clientX - rect.left) / rect.width) * 100}%`);
    node.style.setProperty("--pointer-y", `${((event.clientY - rect.top) / rect.height) * 100}%`);
  }

  return (
    <figure
      data-reveal
      style={{ "--reveal-delay": `${index * 130}ms` } as CSSProperties}
      className="group m-0 flex flex-col gap-5"
    >
      <div
        ref={ref}
        onPointerMove={onPointerMove}
        className="cine relative aspect-[4/3] overflow-hidden bg-[color-mix(in_oklab,var(--panel)_55%,white)] ring-1 ring-transparent transition-[transform,box-shadow,--tw-ring-color] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:shadow-[0_24px_60px_-32px_rgba(10,10,12,0.28)] group-hover:ring-[var(--line)]"
      >
        <span className="cine-glow" aria-hidden="true" />
        {children}
      </div>

      <figcaption className="flex items-baseline gap-3">
        <span className="font-mono text-[10px] tabular-nums tracking-[0.14em] text-strong">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="text-[15px] tracking-[-0.01em] transition-colors duration-500 group-hover:text-accent">
          {caption}
        </span>
      </figcaption>
    </figure>
  );
}
