import type { CSSProperties } from "react";
import { cx } from "@/lib/cx";
import styles from "./HoloFigure.module.css";

type HoloFigureProps = {
  className?: string;
  /** Permet de surcharger --holo-glitch-dur (démo) ou de positionner. */
  style?: CSSProperties;
};

/**
 * Buste holographique (v2) : photo détourée (docs/Hologramme.png →
 * public/images/hologramme.webp) aux couleurs d'origine, scanlines épousant
 * la silhouette (mask alpha), flottement lent et glitch fréquent, marqué
 * sans excès, toutes les ~2,6 s : dips d'opacité, déchirures de bandes
 * semi-transparentes (slices) et fantômes RGB-split cyan/rose (split
 * permanent léger). Sous prefers-reduced-motion : figure stable, sans glitch.
 */
export function HoloFigure({ className, style }: HoloFigureProps) {
  return (
    <div aria-hidden="true" className={cx(styles.root, className)} style={style}>
      <div className={cx("holo-float", styles.inner)}>
        <div className={styles.ghostCyan} />
        <div className={styles.ghostPink} />
        <div className={styles.figure} />
        <div className={styles.sliceHigh} />
        <div className={styles.sliceLow} />
        <div className={styles.scanlines} />
      </div>
    </div>
  );
}
