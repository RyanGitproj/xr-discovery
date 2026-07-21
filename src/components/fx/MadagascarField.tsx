"use client";

import { useId, useMemo, useRef } from "react";
import { buildConstellation } from "@/lib/geo/constellation";
import { MADAGASCAR_OUTLINE } from "@/lib/geo/madagascar";
import { toView, VIEW } from "@/lib/geo/madagascarView";
import { cx } from "@/lib/cx";
import { pseudoRandom } from "@/lib/pseudoRandom";
import { useOffscreenPause } from "@/lib/motion/useOffscreenPause";
import { FX_NODE_COLORS } from "./fxPalette";
import { MADA_FORM_END_S } from "./projectionTimeline";
import styles from "./MadagascarField.module.css";

const INTERIOR_REACH = 0.12;
/** Dispersion de départ du morph (± la moitié, en unités viewBox). */
const SCATTER_SPREAD = 260;
/** Fenêtre du stagger des points pendant la formation. */
const MORPH_DELAY_MAX_S = 0.5;

type MadagascarFieldProps = {
  /** Points de côte (défaut 64). */
  contourPoints?: number;
  /** Points intérieurs (défaut 14). */
  interiorPoints?: number;
  className?: string;
};

/**
 * Constellation en forme de Madagascar : au chargement les points dispersés
 * convergent vers la silhouette de l'île (morph CSS one-shot), puis la chaîne
 * de côte s'allume et les signaux comète la parcourent. Même vie que
 * NeuralField (classes neural-* de fx-neon.css) ; layout déterministe, donc
 * aucun mismatch SSR. Sous prefers-reduced-motion : île directement formée.
 */
export function MadagascarField({
  contourPoints = 64,
  interiorPoints = 14,
  className,
}: MadagascarFieldProps) {
  const gradientId = useId();
  const svgRef = useRef<SVGSVGElement>(null);

  // Hors écran, toutes les animations passent en pause (les comètes
  // stroke-dashoffset sont des animations de paint).
  useOffscreenPause(svgRef);

  const { points, links } = useMemo(() => {
    const constellation = buildConstellation({
      polygon: MADAGASCAR_OUTLINE,
      contourCount: contourPoints,
      interiorCount: interiorPoints,
      interiorReach: INTERIOR_REACH,
    });
    return { points: constellation.points.map(toView), links: constellation.links };
  }, [contourPoints, interiorPoints]);

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      viewBox={`0 0 ${VIEW} ${VIEW}`}
      preserveAspectRatio="xMidYMid meet"
      className={cx(styles.field, className)}
      style={{ "--mada-form-end": `${MADA_FORM_END_S}s` }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--color-fx-cyan)" />
          <stop offset="55%" stopColor="var(--color-fx-violet)" />
          <stop offset="100%" stopColor="var(--color-fx-pink)" />
        </linearGradient>
      </defs>
      <g className={styles.linksIn}>
        {links.map((link, i) => {
          const isCoast = i < contourPoints;
          return (
            <line
              key={`link-${i}`}
              className={isCoast ? styles.coast : "neural-link"}
              x1={points[link.a].x}
              y1={points[link.a].y}
              x2={points[link.b].x}
              y2={points[link.b].y}
              stroke="var(--color-accent)"
              strokeWidth={isCoast ? "0.8" : "0.6"}
            />
          );
        })}
      </g>
      <g className={styles.signalsIn}>
        {links
          .slice(0, contourPoints)
          .filter((_, i) => i % 13 === 0)
          .map((link, i) => (
            <line
              key={`signal-${i}`}
              className="neural-signal"
              pathLength={100}
              x1={points[link.a].x}
              y1={points[link.a].y}
              x2={points[link.b].x}
              y2={points[link.b].y}
              stroke={`url(#${gradientId})`}
              strokeWidth="1.1"
              style={{
                "--n-dur": `${(6 + pseudoRandom(i, 31) * 5).toFixed(1)}s`,
                "--n-delay": `${(pseudoRandom(i, 32) * 5).toFixed(1)}s`,
              }}
            />
          ))}
      </g>
      {points.map((point, i) => {
        // Seuls les points intérieurs pulsent : la côte reste allumée en
        // continu, d'où une silhouette stable et 78 → 14 animations de paint.
        const isCoast = i < contourPoints;
        return (
          <g
            key={`dot-${i}`}
            className={styles.dot}
            style={{
              "--sx": `${((pseudoRandom(i, 42) - 0.5) * SCATTER_SPREAD).toFixed(1)}px`,
              "--sy": `${((pseudoRandom(i, 43) - 0.5) * SCATTER_SPREAD).toFixed(1)}px`,
              "--m-delay": `${(pseudoRandom(i, 41) * MORPH_DELAY_MAX_S).toFixed(2)}s`,
            }}
          >
            <circle
              className={isCoast ? styles.coastNode : "neural-node"}
              cx={point.x}
              cy={point.y}
              r={(isCoast
                ? 1.8 + pseudoRandom(i, 23) * 1.1
                : 1.3 + pseudoRandom(i, 23) * 0.9
              ).toFixed(2)}
              fill={FX_NODE_COLORS[i % FX_NODE_COLORS.length]}
              style={
                isCoast
                  ? undefined
                  : {
                      "--n-dur": `${(3.5 + pseudoRandom(i, 24) * 4).toFixed(1)}s`,
                      "--n-delay": `${(pseudoRandom(i, 25) * 4).toFixed(1)}s`,
                    }
              }
            />
          </g>
        );
      })}
    </svg>
  );
}
