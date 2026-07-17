import { cx } from "@/lib/cx";
import styles from "./RadarPing.module.css";

type RadarPingProps = {
  /** Abscisse du centre dans le conteneur positionné, en %. */
  x: number;
  /** Ordonnée du centre dans le conteneur positionné, en %. */
  y: number;
  /** Départ de l'allumage, en secondes. */
  delay?: number;
  className?: string;
};

/**
 * Point lumineux à ondes radar (marqueur de la capitale) : cœur cyan à glow
 * statique + deux ondes concentriques. Sous prefers-reduced-motion : cœur
 * allumé, ondes absentes.
 */
export function RadarPing({ x, y, delay = 0, className }: RadarPingProps) {
  return (
    <div
      aria-hidden="true"
      className={cx(styles.ping, className)}
      style={{ left: `${x}%`, top: `${y}%`, "--ping-delay": `${delay}s` }}
    >
      <span className={styles.core} />
      <span className={styles.wave} />
      <span className={cx(styles.wave, styles.wave2)} />
    </div>
  );
}
