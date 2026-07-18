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
 * Décisions actées :
 * - tactile NATIF (syncTouch false) : le momentum iOS/Android est
 *   irremplaçable, l'immersion mobile passe par le gyroscope ;
 * - ancres FLUIDES via un intercepteur maison (l'option `anchors` de Lenis
 *   ne preventDefault pas → saut natif avant l'animation, et ne gère ni le
 *   focus ni le hash). Ici : preventDefault, scrollTo animé (Lenis lit
 *   LUI-MÊME le scroll-padding-top CSS — ne pas doubler avec un offset),
 *   hash poussé dans l'URL, focus déplacé sur la cible (clavier / lecteurs
 *   d'écran). Opt-out par `data-native-anchor` (skip-link) ;
 * - jamais instancié sous prefers-reduced-motion (ancres natives + CSS
 *   `scroll-padding-top` assurent alors un saut correct sous la navbar).
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

    const onAnchorClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const origin = event.target instanceof Element ? event.target : null;
      const anchor = origin?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor || anchor.hasAttribute("data-native-anchor")) return;
      const id = decodeURIComponent(anchor.getAttribute("href")?.slice(1) ?? "");
      const target = id === "" ? null : document.getElementById(id);
      if (!target) return;

      event.preventDefault();
      history.pushState(null, "", `#${id}`);
      lenis.scrollTo(target);
      // Focus accessible sans re-scroll : la navigation clavier repart de la
      // section atteinte, comme avec une ancre native.
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    };

    document.addEventListener("click", onAnchorClick);
    // Un seul RAF pour tout le motion : Lenis écrit la position de scroll
    // dans la boucle framer, avant que les useScroll ne lisent.
    const update = (data: { timestamp: number }) => lenis.raf(data.timestamp);
    frame.update(update, true);
    return () => {
      document.removeEventListener("click", onAnchorClick);
      cancelFrame(update);
      lenis.destroy();
    };
  }, [reduce]);

  return null;
}
