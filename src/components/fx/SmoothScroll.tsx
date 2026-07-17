"use client";

import { useEffect } from "react";
import { cancelFrame, frame } from "framer-motion";
import Lenis from "lenis";
import { useReducedMotionPref } from "@/lib/motion/useReducedMotion";

/** Inertie courte : de la présence, pas du flottement. */
const DURATION_S = 1.05;

/**
 * Smooth scroll inertiel global (Immersion v2.1). Lenis pilote le scroll
 * NATIF : window.scrollY reste la source de vérité — les useScroll framer
 * (ScrollProgress, StickyScrollReveal…), position: sticky et l'uniform
 * u_scroll du LiquidBackground fonctionnent sans adaptation.
 *
 * Décisions actées (plan Immersion v2.1) :
 * - tactile NATIF (syncTouch false) : le momentum iOS/Android est
 *   irremplaçable, l'immersion mobile passe par le gyroscope ;
 * - ancres et clavier natifs (anchors false, pas d'interception) : #devis,
 *   skip-link et lecteurs d'écran gardent un comportement déterministe ;
 * - jamais instancié sous prefers-reduced-motion (et détruit si la
 *   préférence change en cours de session).
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
    // Un seul RAF pour tout le motion : Lenis écrit la position de scroll
    // dans la boucle framer, avant que les useScroll ne lisent.
    const update = (data: { timestamp: number }) => lenis.raf(data.timestamp);
    frame.update(update, true);
    return () => {
      cancelFrame(update);
      lenis.destroy();
    };
  }, [reduce]);

  return null;
}
