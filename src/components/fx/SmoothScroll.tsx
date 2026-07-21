"use client";

import { useEffect } from "react";
import { cancelFrame, frame } from "framer-motion";
import Lenis from "lenis";
import { registerLenis } from "@/lib/scrollToSection";
import { useReducedMotionPref } from "@/lib/motion/useReducedMotion";

/** Inertie courte : de la présence, pas du flottement. */
const DURATION_S = 1.05;

/**
 * Smooth scroll inertiel global (Immersion v2.1). Lenis pilote le scroll
 * NATIF, et window.scrollY reste la source de vérité : les useScroll framer
 * (ScrollProgress, StickyScrollReveal…), position: sticky et l'uniform
 * u_scroll du LiquidBackground fonctionnent sans adaptation.
 *
 * Décisions actées :
 * - tactile NATIF (syncTouch false) : le momentum iOS/Android est
 *   irremplaçable, l'immersion mobile passe par le gyroscope ;
 * - AUCUNE ancre d'URL (décision Ryan) : la navigation interne passe par des
 *   boutons + `scrollToSection` (lib/scrollToSection, fluide via l'instance
 *   enregistrée ici ; Lenis lit LUI-MÊME le scroll-padding-top CSS). Seule
 *   ancre restante : le skip-link (contrat d'accessibilité natif) ;
 * - jamais instancié sous prefers-reduced-motion (scrollToSection bascule
 *   alors sur scrollIntoView natif), et détruit si la préférence change.
 */
export function SmoothScroll() {
  const reduce = useReducedMotionPref();

  useEffect(() => {
    if (reduce) return;
    const lenis = new Lenis({
      duration: DURATION_S,
      smoothWheel: true,
      syncTouch: false,
      anchors: false,
    });
    registerLenis(lenis);
    // Un seul RAF pour tout le motion : Lenis écrit la position de scroll
    // dans la boucle framer, avant que les useScroll ne lisent.
    const update = (data: { timestamp: number }) => lenis.raf(data.timestamp);
    frame.update(update, true);
    return () => {
      registerLenis(null);
      cancelFrame(update);
      lenis.destroy();
    };
  }, [reduce]);

  return null;
}
