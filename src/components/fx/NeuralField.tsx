"use client";

import { useId, useRef } from "react";
import { cx } from "@/lib/cx";
import { pseudoRandom } from "@/lib/pseudoRandom";
import { useOffscreenPause } from "@/lib/motion/useOffscreenPause";
import { FX_NODE_COLORS } from "./fxPalette";

const W = 400;
const H = 240;
const LINK_REACH = 95;

type NeuralFieldProps = {
  /** Nombre de neurones (défaut 22). */
  nodes?: number;
  className?: string;
};

type Node = { x: number; y: number };
type Link = { a: Node; b: Node };

function buildGraph(count: number): { nodes: Node[]; links: Link[] } {
  const nodes = Array.from({ length: count }, (_, i) => ({
    x: 10 + pseudoRandom(i, 21) * (W - 20),
    y: 10 + pseudoRandom(i, 22) * (H - 20),
  }));
  const links: Link[] = [];
  for (let i = 0; i < count; i += 1) {
    for (let j = i + 1; j < count; j += 1) {
      if (Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y) < LINK_REACH) {
        links.push({ a: nodes[i], b: nodes[j] });
      }
    }
  }
  return { nodes, links };
}

/**
 * Réseau de neurones lumineux (v1.2) : nœuds qui pulsent (opacity), signaux
 * multicolores voyageant le long d'un lien sur quatre (stroke-dashoffset).
 * Layout déterministe : aucun mismatch SSR.
 */
export function NeuralField({ nodes = 22, className }: NeuralFieldProps) {
  const gradientId = useId();
  const svgRef = useRef<SVGSVGElement>(null);
  const graph = buildGraph(nodes);

  // Signaux stroke-dashoffset = animations de paint : pause hors écran.
  useOffscreenPause(svgRef);

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className={cx("fx-layer-svg", "fx-field", className)}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--color-fx-cyan)" />
          <stop offset="55%" stopColor="var(--color-fx-violet)" />
          <stop offset="100%" stopColor="var(--color-fx-pink)" />
        </linearGradient>
      </defs>
      {graph.links.map((link, i) => (
        <line
          key={`link-${i}`}
          className="neural-link"
          x1={link.a.x}
          y1={link.a.y}
          x2={link.b.x}
          y2={link.b.y}
          stroke="var(--color-accent)"
          strokeWidth="0.6"
        />
      ))}
      {graph.links
        .filter((_, i) => i % 6 === 0)
        .map((link, i) => (
          <line
            key={`signal-${i}`}
            className="neural-signal"
            pathLength={100}
            x1={link.a.x}
            y1={link.a.y}
            x2={link.b.x}
            y2={link.b.y}
            stroke={`url(#${gradientId})`}
            strokeWidth="1.1"
            style={{
              "--n-dur": `${(6 + pseudoRandom(i, 31) * 5).toFixed(1)}s`,
              "--n-delay": `${(pseudoRandom(i, 32) * 5).toFixed(1)}s`,
            }}
          />
        ))}
      {graph.nodes.map((node, i) => (
        <circle
          key={`node-${i}`}
          className="neural-node"
          cx={node.x}
          cy={node.y}
          r={1.4 + pseudoRandom(i, 23) * 1.4}
          fill={FX_NODE_COLORS[i % FX_NODE_COLORS.length]}
          style={{
            "--n-dur": `${(3.5 + pseudoRandom(i, 24) * 4).toFixed(1)}s`,
            "--n-delay": `${(pseudoRandom(i, 25) * 4).toFixed(1)}s`,
          }}
        />
      ))}
    </svg>
  );
}
