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
 * Mosaïque de moments XR — sans marquee NI reveal : ce contenu image doit
 * être visible inconditionnellement (un observer qui rate son déclenchement
 * laisserait une section vide). Le parallax par tuile ne déplace qu'en
 * transform, le contenu reste rendu tel quel côté serveur.
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
            <Figure
              image={image}
              sizes={
                FEATURE_INDEXES.has(i) ? "(max-width: 768px) 50vw, 768px" : "(max-width: 768px) 50vw, 384px"
              }
            />
          </ParallaxLayer>
        ))}
      </ParallaxScene>
    </section>
  );
}
