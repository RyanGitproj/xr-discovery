"use client";

import { useCallback, useRef, useState, useSyncExternalStore, useEffect } from "react";
import { useMotionValue, useSpring, type MotionValue } from "framer-motion";
import {
  EMPTY_TILT_SUM,
  TILT_MAX_DEG_DEFAULT,
  addTiltSample,
  normalizeTilt,
  tiltNeutral,
  type TiltSampleSum,
} from "./deviceTiltMath";
import { useReducedMotionPref } from "./useReducedMotion";

/** Lissage doux : la profondeur répond à l'inclinaison, elle ne tremble pas. */
const SPRING = { stiffness: 60, damping: 20 };
/** Refus iOS persisté pour ne jamais re-solliciter dans la session. */
const DENIED_KEY = "xr-tilt-denied";
/** Sans permission requise, le support réel se prouve par la réception d'un
 * premier événement sous ce délai (desktop : jamais reçu → unsupported). */
const PROBE_TIMEOUT_MS = 1000;

export type DeviceTiltStatus = "unsupported" | "prompt" | "granted" | "denied";

export type DeviceTilt = {
  /** Inclinaison gauche/droite (gamma) normalisée -1..1, lissée. */
  x: MotionValue<number>;
  /** Inclinaison avant/arrière (beta) normalisée -1..1, lissée. */
  y: MotionValue<number>;
  status: DeviceTiltStatus;
  /** iOS 13+ : DOIT être appelé dans un geste utilisateur. No-op ailleurs. */
  requestAccess: () => Promise<void>;
};

/** iOS 13+ expose requestPermission en statique sur DeviceOrientationEvent. */
type OrientationEventClass = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<"granted" | "denied">;
};

/** Capacité de l'environnement — invariante pendant la vie de la page. */
type TiltEnv = "ssr" | "none" | "permission" | "auto";

let cachedEnv: TiltEnv | null = null;

function envSnapshot(): TiltEnv {
  if (cachedEnv === null) {
    if (typeof DeviceOrientationEvent === "undefined") {
      cachedEnv = "none";
    } else {
      const eventClass = DeviceOrientationEvent as OrientationEventClass;
      cachedEnv = typeof eventClass.requestPermission === "function" ? "permission" : "auto";
    }
  }
  return cachedEnv;
}

const subscribeNever = () => () => {};
const serverEnv = (): TiltEnv => "ssr";

/** Résultat des interactions asynchrones (probe 1 s, prompt iOS). */
type TiltInteraction = "idle" | "granted" | "denied";

/**
 * Gyroscope → MotionValues (Immersion v2.1) : écrit directement dans les
 * springs à ~60 Hz, zéro re-render React. Neutre calibré sur les premières
 * lectures (deviceTiltMath). Inerte sous prefers-reduced-motion et sur les
 * appareils sans capteur. Le statut est DÉRIVÉ au rendu (capacité via
 * useSyncExternalStore, hydration-safe) — seuls les callbacks d'événements
 * écrivent l'état.
 */
export function useDeviceTilt(options?: { maxDeg?: number }): DeviceTilt {
  const maxDeg = options?.maxDeg ?? TILT_MAX_DEG_DEFAULT;
  const reduce = useReducedMotionPref();
  const env = useSyncExternalStore(subscribeNever, envSnapshot, serverEnv);
  const [interaction, setInteraction] = useState<TiltInteraction>("idle");
  const xRaw = useMotionValue(0);
  const yRaw = useMotionValue(0);
  const x = useSpring(xRaw, SPRING);
  const y = useSpring(yRaw, SPRING);
  const detachRef = useRef<(() => void) | null>(null);

  const attach = useCallback(() => {
    if (detachRef.current) return;
    let sum: TiltSampleSum = EMPTY_TILT_SUM;
    let neutral: { beta: number; gamma: number } | null = null;
    const onOrientation = (event: DeviceOrientationEvent) => {
      if (event.beta === null || event.gamma === null) return;
      if (!neutral) {
        sum = addTiltSample(sum, event.beta, event.gamma);
        neutral = tiltNeutral(sum);
        return;
      }
      xRaw.set(normalizeTilt(event.gamma, neutral.gamma, maxDeg));
      yRaw.set(normalizeTilt(event.beta, neutral.beta, maxDeg));
    };
    window.addEventListener("deviceorientation", onOrientation);
    detachRef.current = () => window.removeEventListener("deviceorientation", onOrientation);
  }, [maxDeg, xRaw, yRaw]);

  // Android/desktop (pas de permission) : sonde le support réel — un capteur
  // présent émet dans la seconde. Tout setState vit dans les callbacks.
  useEffect(() => {
    if (reduce || env !== "auto") {
      return () => {
        detachRef.current?.();
        detachRef.current = null;
      };
    }
    let timer = 0;
    const probe = () => {
      window.clearTimeout(timer);
      attach();
      setInteraction("granted");
    };
    window.addEventListener("deviceorientation", probe, { once: true });
    timer = window.setTimeout(() => {
      window.removeEventListener("deviceorientation", probe);
    }, PROBE_TIMEOUT_MS);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("deviceorientation", probe);
      detachRef.current?.();
      detachRef.current = null;
    };
  }, [reduce, env, attach]);

  const requestAccess = useCallback(async () => {
    if (envSnapshot() !== "permission") return;
    const eventClass = DeviceOrientationEvent as OrientationEventClass;
    try {
      const result = await eventClass.requestPermission?.();
      if (result === "granted") {
        attach();
        setInteraction("granted");
        return;
      }
      sessionStorage.setItem(DENIED_KEY, "1");
      setInteraction("denied");
    } catch {
      // Prompt refusé par le navigateur (hors geste utilisateur, iframe…).
      sessionStorage.setItem(DENIED_KEY, "1");
      setInteraction("denied");
    }
  }, [attach]);

  const sessionDenied =
    env === "permission" && interaction === "idle" && sessionStorage.getItem(DENIED_KEY) !== null;

  let status: DeviceTiltStatus;
  if (reduce || env === "ssr" || env === "none") {
    status = "unsupported";
  } else if (env === "permission") {
    if (interaction === "granted") status = "granted";
    else if (interaction === "denied" || sessionDenied) status = "denied";
    else status = "prompt";
  } else {
    status = interaction === "granted" ? "granted" : "unsupported";
  }

  return { x, y, status, requestAccess };
}
