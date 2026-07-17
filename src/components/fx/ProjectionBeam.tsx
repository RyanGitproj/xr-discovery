import { cx } from "@/lib/cx";
import type { Vec2 } from "@/lib/geo/madagascar";
import { beamLayout, type BeamTop } from "./beamLayout";
import styles from "./ProjectionBeam.module.css";

type ProjectionBeamProps = {
  /** Pointe du cône (la source lumineuse), en % du conteneur positionné. */
  apex: Vec2;
  /** Bord haut du cône (ce qui est projeté), en % du conteneur. */
  top: BeamTop;
  /** Départ du jaillissement, en secondes. */
  delay?: number;
  className?: string;
};

/**
 * Faisceau de projection holographique : cône qui jaillit d'un point (scaleY
 * depuis la base) puis respire lentement en opacité. Recette lumineuse de
 * `.holo-cone`, portée en tokens. Sous prefers-reduced-motion : faisceau
 * statique déjà déployé.
 */
export function ProjectionBeam({ apex, top, delay = 0, className }: ProjectionBeamProps) {
  const layout = beamLayout(apex, top);

  return (
    <div
      aria-hidden="true"
      className={cx(styles.beam, className)}
      style={{
        left: `${layout.left}%`,
        top: `${layout.top}%`,
        width: `${layout.width}%`,
        height: `${layout.height}%`,
        clipPath: layout.clipPath,
        "--beam-delay": `${delay}s`,
      }}
    />
  );
}
