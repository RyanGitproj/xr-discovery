import type Lenis from "lenis";

/** Instance active, enregistrée par SmoothScroll (null sous reduced-motion). */
let lenis: Lenis | null = null;

export function registerLenis(instance: Lenis | null): void {
  lenis = instance;
}

/**
 * Défilement vers une section SANS ancre d'URL (décision Ryan : aucun #hash,
 * ni dans les liens ni dans la barre d'adresse). Fluide via Lenis quand il
 * est actif ; sous prefers-reduced-motion : scrollIntoView natif instantané
 * (le scroll-padding-top CSS place la cible sous la navbar dans les deux
 * cas). Le focus suit la cible — la navigation clavier repart de la section.
 */
export function scrollToSection(id: string): void {
  const target = document.getElementById(id);
  if (!target) return;
  if (lenis) lenis.scrollTo(target);
  else target.scrollIntoView();
  if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
}

/** Retour en haut de page (logo) — même politique sans hash. */
export function scrollToTop(): void {
  if (lenis) lenis.scrollTo(0);
  else window.scrollTo(0, 0);
}
