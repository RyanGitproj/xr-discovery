import { ParallaxLayer } from "@/components/fx/ParallaxLayer";
import { ParallaxScene } from "@/components/fx/ParallaxScene";
import { Figure } from "@/components/ui/Figure";
import { galleryImages } from "@/config/images";
import styles from "./GallerySection.module.css";

/* UNE seule tuile 2×2 (la première) : avec 5 simples en grille 3 colonnes,
   la mosaïque est asymétrique ET sans cellule vide. */
const FEATURE_INDEXES = new Set([0]);

/** Profondeurs alternées par tuile (Immersion v2.1) — transform UNIQUEMENT,
    jamais d'opacité : la garantie de visibilité de la section tient. */
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
        {galleryImages.map((image, i) => (
          <ParallaxLayer
            key={image.src}
            depth={TILE_DEPTHS[i % TILE_DEPTHS.length]}
            range={72}
            touchRange={40}
            className={FEATURE_INDEXES.has(i) ? styles.feature : undefined}
          >
            <div className="scroll-reveal">
              <Figure
                image={image}
                sizes={
                  FEATURE_INDEXES.has(i) ? "(max-width: 768px) 50vw, 768px" : "(max-width: 768px) 50vw, 384px"
                }
              />
            </div>
          </ParallaxLayer>
        ))}
      </ParallaxScene>
    </section>
  );
}
