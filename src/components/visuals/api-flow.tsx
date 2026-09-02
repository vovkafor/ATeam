import type { CSSProperties } from "react";
import { Counter } from "@/components/motion/counter";
import { VisualFrame } from "@/components/visuals/visual-frame";

type Node = { id: string; label: string; x: number; y: number };

const nodes: Node[] = [
  { id: "client", label: "CLIENT", x: 42, y: 100 },
  { id: "gateway", label: "GATEWAY", x: 158, y: 46 },
  { id: "orders", label: "ORDERS", x: 158, y: 154 },
  { id: "ledger", label: "LEDGER", x: 282, y: 46 },
  { id: "store", label: "STORE", x: 282, y: 154 },
  { id: "assert", label: "ASSERT", x: 398, y: 100 },
];

const edges: [string, string][] = [
  ["client", "gateway"],
  ["client", "orders"],
  ["gateway", "ledger"],
  ["orders", "store"],
  ["gateway", "store"],
  ["ledger", "assert"],
  ["store", "assert"],
];

const byId = Object.fromEntries(nodes.map((node) => [node.id, node]));

function edgePath(from: Node, to: Node) {
  const midX = (from.x + to.x) / 2;
  return `M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`;
}

/**
 * API Automation — request packets travelling across the service graph.
 * Each edge is a dashed stroke whose offset animates, so the dots move along
 * the exact curve without SMIL or per-dot JavaScript.
 */
export function ApiFlow() {
  return (
    <VisualFrame
      label="API / REQUEST FLOW"
      caption="41 contracts · REST + GraphQL"
      metric={
        <>
          <Counter value={8} suffix="m" /> to a full integration signal
        </>
      }
    >
      <svg viewBox="0 0 440 200" className="h-auto w-full" role="img" aria-label="Animated diagram of test requests flowing from a client through gateway, orders, ledger and storage services to assertion checks.">
        {edges.map(([fromId, toId], index) => {
          const path = edgePath(byId[fromId], byId[toId]);
          return (
            <g key={`${fromId}-${toId}`}>
              <path d={path} fill="none" stroke="var(--line)" strokeWidth="1" />
              <path
                className="packet-stream"
                d={path}
                fill="none"
                stroke="var(--accent)"
                strokeWidth="4"
                style={{ "--stream-index": index } as CSSProperties}
              />
            </g>
          );
        })}

        {nodes.map((node, index) => (
          <g key={node.id}>
            <rect
              x={node.x - 34}
              y={node.y - 15}
              width="68"
              height="30"
              fill="var(--canvas)"
              stroke={index === nodes.length - 1 ? "var(--accent)" : "var(--strong)"}
              strokeWidth="1"
            />
            <text
              x={node.x}
              y={node.y + 4}
              textAnchor="middle"
              fill={index === nodes.length - 1 ? "var(--accent)" : "var(--ink)"}
              style={{ font: "500 9px var(--font-geist-mono), monospace", letterSpacing: "0.1em" }}
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </VisualFrame>
  );
}
