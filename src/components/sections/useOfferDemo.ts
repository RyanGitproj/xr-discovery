"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { useInView } from "framer-motion";

/** Timeline de la boucle (ms). */
const START_DELAY_MS = 900;
/** Tap déclenché une fois la main arrivée sur la tuile (déplacement ~450 ms). */
const TAP_AFTER_MOVE_MS = 600;
/** Un tap toutes les ~3,5 s : le temps de lire les packs affichés. */
const CYCLE_MS = 3_500;
/** Laisse le fondu de sortie de TapHint se jouer avant de démonter la main. */
const EXIT_MS = 300;

/** Posée UNIQUEMENT au premier geste utilisateur : la démo ne rejoue plus de
    la session. Best-effort (navigation privée : rejouable, non bloquant). */
const DEMO_DISMISSED_KEY = "xr_offres_demo";

type HandPosition = { x: number; y: number };

export type OfferDemoState = {
  visible: boolean;
  tapCount: number;
  /** null tant que la main n'est pas montée. */
  position: HandPosition | null;
};

const IDLE: OfferDemoState = { visible: false, tapCount: 0, position: null };

function readDismissed(): boolean {
  try {
    return sessionStorage.getItem(DEMO_DISMISSED_KEY) !== null;
  } catch {
    return false;
  }
}

function markDismissed(): void {
  try {
    sessionStorage.setItem(DEMO_DISMISSED_KEY, "1");
  } catch {
    // sessionStorage indisponible : non bloquant.
  }
}

/**
 * Démo guidée du sélecteur d'offres, en boucle « visite des 8 offres » : la
 * main TapHint fait le tour des tuiles (un tap ≈ 3,5 s, activation réelle :
 * les packs changent sous les yeux du visiteur) tant qu'aucune interaction
 * n'a eu lieu. Pause quand les tuiles sortent de l'écran ou pendant
 * `suspended` (survol des zones interactives), reprise là où le tour s'était
 * arrêté. `cancel()` (premier geste utilisateur) l'arrête définitivement
 * pour la session.
 */
export function useOfferDemo({
  wrapRef,
  enabled,
  suspended,
  tileCount,
  getTile,
  onDemoSelect,
}: {
  wrapRef: RefObject<HTMLDivElement | null>;
  /** false = jamais de démo (prefers-reduced-motion). */
  enabled: boolean;
  /** true = pause (survol du sélecteur ou des packs) ; reprise à false. */
  suspended: boolean;
  tileCount: number;
  /** Tuile par index d'offre (callbacks STABLES, useCallback côté appelant). */
  getTile: (offerIndex: number) => HTMLButtonElement | undefined;
  /** Activation d'une offre SANS event de tracking ni écriture du store. */
  onDemoSelect: (offerIndex: number) => void;
}): { state: OfferDemoState; cancel: () => void } {
  const [state, setState] = useState<OfferDemoState>(IDLE);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);
  const dismissed = useRef(false);
  /** Prochaine tuile du tour ; persiste entre pauses (reprise sans reset). */
  const nextIndex = useRef(1);
  const inView = useInView(wrapRef, { margin: "-120px" });

  const clearTimeline = () => {
    for (const timeout of timeouts.current) clearTimeout(timeout);
    timeouts.current = [];
  };

  useEffect(() => {
    if (!inView || !enabled || suspended || dismissed.current || readDismissed()) return;

    const schedule = (fn: () => void, ms: number) => {
      timeouts.current.push(setTimeout(fn, ms));
    };

    /* Position mesurée à chaque tap (pas au resize : la main est déplacée
       toutes les 3,5 s, un décalage transitoire se corrige au tap suivant). */
    const positionOf = (tile: HTMLButtonElement): HandPosition => ({
      x: tile.offsetLeft + tile.offsetWidth * 0.6,
      y: tile.offsetTop + tile.offsetHeight * 0.62,
    });

    const cycle = () => {
      let index = nextIndex.current % tileCount;
      let tile = getTile(index);
      if (tile === undefined) {
        index = 0;
        tile = getTile(0);
        if (tile === undefined) return; // tuiles pas montées : run abandonné
      }
      setState((s) => ({ visible: true, tapCount: s.tapCount, position: positionOf(tile) }));
      schedule(() => {
        setState((s) => ({ ...s, tapCount: s.tapCount + 1 }));
        onDemoSelect(index);
      }, TAP_AFTER_MOVE_MS);
      nextIndex.current = (index + 1) % tileCount;
      schedule(cycle, CYCLE_MS);
    };

    schedule(cycle, START_DELAY_MS);

    return () => {
      // Pause (sortie d'écran, suspension, démontage) : fondu puis démontage
      // de la main. Le timer d'IDLE rejoint la timeline : purgé si reprise.
      clearTimeline();
      setState((s) => (s.position === null ? s : { ...s, visible: false }));
      timeouts.current.push(setTimeout(() => setState(IDLE), EXIT_MS));
    };
  }, [inView, enabled, suspended, tileCount, getTile, onDemoSelect]);

  /** Premier geste utilisateur : la main disparaît IMMÉDIATEMENT (pas de
      fondu : le retrait instantané répond au geste) et la démo est condamnée
      pour la session. Idempotent. */
  const cancel = useCallback(() => {
    clearTimeline();
    setState((s) => (s.position === null ? s : IDLE));
    if (dismissed.current) return;
    dismissed.current = true;
    markDismissed();
  }, []);

  return { state, cancel };
}
