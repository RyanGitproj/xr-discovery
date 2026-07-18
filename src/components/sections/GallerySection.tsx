import { ParallaxLayer } from "@/components/fx/ParallaxLayer";
import { ParallaxScene } from "@/components/fx/ParallaxScene";
import { Figure } from "@/components/ui/Figure";
import { cx } from "@/lib/cx";
import { galleryImages } from "@/config/images";
import styles from "./GallerySection.module.css";

/* Composition fixe à 6 tuiles : 2 rangées de largeurs inégales (5/4/3 puis
   3/4/5) — la seule mosaïque sans trou dans une hauteur d'un viewport. */
const TILE_PLACEMENTS = [styles.t1, styles.t2, styles.t3, styles.t4, styles.t5, styles.t6];

/** Profondeurs alternées par tuile (Immersion v2.1) — transform UNIQUEMENT,
    jamais d'opacité : la garantie de visibilité de la section tient.
    Débattement réduit (±40px) : dans une grille à hauteur contrainte, ±72px
    ferait se chevaucher les rangées. */
const TILE_DEPTHS = [-0.22, 0.14, -0.12, 0.2, -0.16, 0.18] as const;

/**
 * Mosaïque de moments XR — apparition scrubée par le scroll (classe fx
 * `scroll-reveal`, scroll-driven animation native) + parallax par tuile.
 * L'apparition est EMBOÎTÉE dans le ParallaxLayer (jamais fusionnée — le
 * layer possède son transform, cf. ParallaxLayer). Visibilité garantie :
 * sans support navigateur, sans JS ou sous reduced-motion, les tuiles sont
 * visibles d'emblée (aucun état caché par défaut).
 * Photos : src/config/images.ts.
 */
export function GallerySection() {
  return (
    <section aria-label="L'expérience XR en images" className={`fx-section ${styles.section}`}>
      <ParallaxScene className={styles.grid}>
        {galleryImages.slice(0, TILE_PLACEMENTS.length).map((image, i) => (
          <ParallaxLayer
            key={image.src}
            depth={TILE_DEPTHS[i % TILE_DEPTHS.length]}
            range={40}
            touchRange={24}
            className={cx(styles.tile, TILE_PLACEMENTS[i])}
          >
            <div className={`scroll-reveal ${styles.tileInner}`}>
              <Figure image={image} fill sizes="(max-width: 767px) 50vw, 33vw" />
            </div>
          </ParallaxLayer>
        ))}
      </ParallaxScene>
    </section>
  );
}
