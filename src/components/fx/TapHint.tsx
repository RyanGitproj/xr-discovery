"use client";

import { AnimatePresence, m } from "framer-motion";
import { Pointer } from "lucide-react";
import { cx } from "@/lib/cx";
import { EASE_OUT } from "@/lib/motion/variants";
import styles from "./TapHint.module.css";

type TapHintProps = {
  /** Affiche/masque la main (entrée et sortie animées). */
  visible: boolean;
  /** Chaque incrément (> 0) rejoue le geste de tap : appui + anneau. */
  tapCount: number;
  className?: string;
};

/**
 * Main « qui tape » (famille C — hint pédagogique one-shot) : icône pointer
 * + anneau d'impulsion rejoué à chaque incrément de tapCount. Purement
 * décorative : aria-hidden, aucun événement capté. Le parent la positionne
 * (wrapper absolu) et pilote sa timeline — sous prefers-reduced-motion, le
 * parent ne la rend simplement pas.
 */
export function TapHint({ visible, tapCount, className }: TapHintProps) {
  return (
    <AnimatePresence>
      {visible && (
        <m.div
          aria-hidden="true"
          className={cx(styles.root, className)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, transition: { duration: 0.18 } }}
          transition={{ duration: 0.35, ease: EASE_OUT }}
        >
          {tapCount > 0 && (
            <m.span
              key={tapCount}
              className={styles.ring}
              initial={{ scale: 0.4, opacity: 0.7 }}
              animate={{ scale: 1.7, opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE_OUT }}
            />
          )}
          <m.span
            key={`press-${tapCount}`}
            className={styles.press}
            animate={tapCount > 0 ? { scale: [1, 0.8, 1] } : { scale: 1 }}
            transition={{ duration: 0.3, times: [0, 0.4, 1], ease: EASE_OUT }}
          >
            <Pointer className={styles.pointer} />
          </m.span>
        </m.div>
      )}
    </AnimatePresence>
  );
}
