"use client";

import { useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { cx } from "@/lib/cx";
import styles from "./GeoFrame.module.css";

type Shape = "hud" | "ticket" | "chamfer";

type GeoFrameProps = {
  /** Langage de forme : octogone doux | bouton ticket à encoches | coin coupé. */
  shape?: Shape;
  /** Taille du chanfrein en px (langage de formes varié selon la surface). */
  chamfer?: number;
  /** Profondeur des encoches latérales (shape="ticket"). */
  notch?: number;
  /**
   * Matériau : verre liquide propre, aplat (CTA orange), ou « frame » —
   * aucun fill : le contenu (ex. GlassPanel existant) est clippé à la forme
   * et l'arête SVG remplace sa bordure rectangulaire.
   */
  variant?: "glass" | "solid" | "frame";
  /** Faisceau qui parcourt le contour — RÉSERVÉ aux éléments focaux. */
  trace?: boolean;
  className?: string;
  /** Classe du conteneur de contenu (padding, etc.). */
  innerClassName?: string;
  children: ReactNode;
};

type Pt = readonly [number, number];

/** Sommets du polygone selon la forme (repère px, origine haut-gauche). */
function shapePoints(shape: Shape, w: number, h: number, c: number, n: number): Pt[] {
  const k = Math.max(2, Math.min(c, w / 2, h / 2));
  if (shape === "chamfer") {
    return [
      [0, 0],
      [w, 0],
      [w, h - k],
      [w - k, h],
      [0, h],
    ];
  }
  if (shape === "ticket") {
    const my = h / 2;
    const d = Math.max(2, Math.min(n, my - k));
    return [
      [k, 0],
      [w - k, 0],
      [w, k],
      [w, my - d],
      [w - d, my],
      [w, my + d],
      [w, h - k],
      [w - k, h],
      [k, h],
      [0, h - k],
      [0, my + d],
      [d, my],
      [0, my - d],
      [0, k],
    ];
  }
  // hud : octogone doux (4 coins biseautés)
  return [
    [k, 0],
    [w - k, 0],
    [w, k],
    [w, h - k],
    [w - k, h],
    [k, h],
    [0, h - k],
    [0, k],
  ];
}

const round = (v: number) => Math.round(v * 10) / 10;

/**
 * Cadre géométrique HUD (v3) : verre liquide (ou aplat) découpé en forme
 * chanfreinée par clip-path, ceint d'une ARÊTE LUMINEUSE dessinée en SVG qui
 * suit exactement le polygone — un `border` CSS serait coupé par le clip.
 * Le polygone px est mesuré (ResizeObserver) et PARTAGÉ entre le clip-path et
 * le tracé SVG (échelle 1:1, stroke non-scalé). Avant mesure / sans JS : repli
 * verre à coins arrondis. `trace` (focal only) fait courir un reflet le long
 * du contour ; neutralisé sous prefers-reduced-motion.
 */
export function GeoFrame({
  shape = "hud",
  chamfer = 16,
  notch = 8,
  variant = "glass",
  trace = false,
  className,
  innerClassName,
  children,
}: GeoFrameProps) {
  const ref = useRef<HTMLDivElement>(null);
  const gradientId = useId();
  const [size, setSize] = useState({ w: 0, h: 0 });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ w: width, h: height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const pts = size.w > 0 ? shapePoints(shape, size.w, size.h, chamfer, notch) : [];
  const svgPoints = pts.map(([x, y]) => `${round(x)},${round(y)}`).join(" ");
  const clipPath =
    pts.length > 0 ? `polygon(${pts.map(([x, y]) => `${round(x)}px ${round(y)}px`).join(", ")})` : undefined;

  return (
    <div ref={ref} className={cx(styles.frame, className)}>
      {variant !== "frame" && (
        <div
          aria-hidden="true"
          className={cx(styles.fill, variant === "solid" ? styles.solid : styles.glass)}
          style={clipPath ? { clipPath } : undefined}
        />
      )}
      <div
        className={cx(styles.content, variant === "frame" && styles.contentClipped, innerClassName)}
        style={variant === "frame" && clipPath ? { clipPath } : undefined}
      >
        {children}
      </div>
      {size.w > 0 && (
        <svg
          aria-hidden="true"
          className={styles.edge}
          viewBox={`0 0 ${round(size.w)} ${round(size.h)}`}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--color-fx-cyan)" />
              <stop offset="52%" stopColor="var(--color-accent)" />
              <stop offset="100%" stopColor="var(--color-fx-pink)" />
            </linearGradient>
          </defs>
          <polygon
            className={styles.edgeLine}
            points={svgPoints}
            fill="none"
            stroke={`url(#${gradientId})`}
            vectorEffect="non-scaling-stroke"
          />
          {trace && (
            <polygon
              className={styles.edgeTrace}
              points={svgPoints}
              pathLength={100}
              fill="none"
              stroke={`url(#${gradientId})`}
              vectorEffect="non-scaling-stroke"
            />
          )}
        </svg>
      )}
    </div>
  );
}
