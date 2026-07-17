import Image from "next/image";
import { ParallaxLayer } from "@/components/fx/ParallaxLayer";
import { cx } from "@/lib/cx";
import type { ImageSlot } from "@/config/images";
import styles from "./Figure.module.css";

type FigureProps = {
  image: ImageSlot;
  /** Attribut sizes de next/image (largeurs servies par breakpoint). */
  sizes: string;
  /** Intégré en tête de card : pas de cadre propre (la card porte le sien). */
  flush?: boolean;
  /** Remplit un parent positionné au lieu d'imposer le ratio intrinsèque. */
  fill?: boolean;
  /**
   * Profondeur parallax [-1, 1] : l'image glisse dans son cadre au scroll
   * (ParallaxLayer mode inset — sur-échelle auto, bords jamais découverts).
   * Toute la logique motion est déléguée à la primitive fx.
   */
  parallax?: number;
  className?: string;
};

/**
 * Visuel de section : réserve son ratio (zéro CLS), cadre verre discret.
 * Sert les placeholders SVG comme les photos finales — remplacer le fichier
 * et l'extension dans src/config/images.ts suffit, aucun composant à toucher.
 */
export function Figure({
  image,
  sizes,
  flush = false,
  fill = false,
  parallax,
  className,
}: FigureProps) {
  /* unoptimized : les .webp du manifeste sont déjà générés aux dimensions
     et à la compression exactes du brief (docs/images-brief.md) — le
     ré-encodage à la volée n'apporte rien et son endpoint casse sous la
     rafale du premier chargement (13 images en erreur constatées). */
  const img = (
    <Image src={image.src} alt={image.alt} fill sizes={sizes} className={styles.img} unoptimized />
  );

  return (
    <div
      className={cx(styles.figure, flush && styles.flush, fill && styles.fill, className)}
      style={fill ? undefined : { aspectRatio: `${image.width} / ${image.height}` }}
    >
      {parallax === undefined ? (
        img
      ) : (
        <ParallaxLayer mode="inset" depth={parallax}>
          {img}
        </ParallaxLayer>
      )}
    </div>
  );
}
