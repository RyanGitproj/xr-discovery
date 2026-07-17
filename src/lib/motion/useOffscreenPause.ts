import { useEffect, type RefObject } from "react";

/**
 * Bascule la classe globale `is-offscreen` quand l'élément quitte le viewport
 * (marge 160px) : le CSS associé met en pause les animations de paint
 * continues et/ou relâche les effets coûteux (backdrop-filter). Pattern
 * budget chap. 8, partagé par GlassPanel, MadagascarField et les champs fx
 * (`.fx-field` dans fx-ambient.css).
 */
export function useOffscreenPause(ref: RefObject<Element | null>, enabled = true) {
  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          el.classList.toggle("is-offscreen", !entry.isIntersecting);
        }
      },
      { rootMargin: "160px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, enabled]);
}
