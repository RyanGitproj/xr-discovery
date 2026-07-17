"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import type { MotionValue } from "framer-motion";
import { diveImages } from "@/config/images";
import styles from "./HeadsetScene.module.css";

/** Le chunk three.js/R3F n'est téléchargé qu'au montage de ce composant. */
const HeadsetScene = dynamic(() => import("./HeadsetScene").then((m) => m.HeadsetScene), {
  ssr: false,
});

/** Capacité WebGL — invariante, détectée une fois (hydration-safe via
 * useSyncExternalStore : true côté serveur, valeur réelle au client). */
let cachedWebGL: boolean | null = null;
function webglSnapshot(): boolean {
  if (cachedWebGL === null) {
    try {
      // Mêmes exigences que le Canvas : un contexte GPU matériel non dégradé.
      // Si seul le rendu logiciel est dispo, on préfère l'image de repli.
      const attrs = { failIfMajorPerformanceCaveat: true, powerPreference: "high-performance" as const };
      const canvas = document.createElement("canvas");
      cachedWebGL = Boolean(
        window.WebGLRenderingContext &&
          (canvas.getContext("webgl2", attrs) || canvas.getContext("webgl", attrs)),
      );
    } catch {
      cachedWebGL = false;
    }
  }
  return cachedWebGL;
}
const subscribeNever = () => () => {};

/** Image 2D de repli (Codex) : WebGL absent ou avant chargement du chunk. */
function Fallback2D() {
  return (
    <div className={styles.fallback2d} aria-hidden="true">
      <Image
        src={diveImages.headsetFront.src}
        alt=""
        width={diveImages.headsetFront.width}
        height={diveImages.headsetFront.height}
        unoptimized
      />
    </div>
  );
}

type HeadsetSceneLazyProps = {
  progress: MotionValue<number>;
  tiltX: MotionValue<number>;
  tiltY: MotionValue<number>;
  dpr?: number;
};

/**
 * Monte la scène 3D UNIQUEMENT près du viewport (IntersectionObserver, ~1
 * écran de marge) — diffère le chunk three.js hors first-view — et coupe son
 * frameloop quand elle sort de l'écran (zéro GPU au repos). Sans WebGL : image
 * 2D de repli. Le fallback reduced-motion est géré en amont (DiveSection ne
 * monte pas ScrollStage sous reduced-motion).
 */
export function HeadsetSceneLazy({ progress, tiltX, tiltY, dpr }: HeadsetSceneLazyProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);
  const webgl = useSyncExternalStore(subscribeNever, webglSnapshot, () => true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setActive(entry.isIntersecting);
        if (entry.isIntersecting) setMounted(true);
      },
      { rootMargin: "60% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={styles.root}>
      {webgl && mounted ? (
        <HeadsetScene progress={progress} tiltX={tiltX} tiltY={tiltY} dpr={dpr} active={active} />
      ) : (
        <Fallback2D />
      )}
    </div>
  );
}
