import type { CSSProperties, ReactNode } from "react";
import { cx } from "@/lib/cx";
import styles from "./EnterRise.module.css";

type EnterRiseProps = {
  /** Départ de l'apparition, en secondes. */
  delay?: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

/**
 * Apparition chronométrée (fade + légère montée), pour les mises en scène à
 * timeline — contrairement à Reveal, déclenché au scroll. Utilise `translate`
 * (pas `transform`) : composable avec un enfant animé en transform. Sous
 * prefers-reduced-motion : contenu directement en place.
 */
export function EnterRise({ delay = 0, className, style, children }: EnterRiseProps) {
  return (
    <div
      className={cx(styles.rise, className)}
      style={{ ...style, "--rise-delay": `${delay}s` }}
    >
      {children}
    </div>
  );
}
