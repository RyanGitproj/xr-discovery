"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import type { VideoSlot } from "@/config/images";
import { cx } from "@/lib/cx";
import { useReducedMotionPref } from "@/lib/motion/useReducedMotion";
import styles from "./AmbientVideo.module.css";

type AmbientVideoProps = {
  video: VideoSlot;
  soundOnLabel: string;
  soundOffLabel: string;
  className?: string;
};

/**
 * Vidéo d'ambiance : autoplay muet en boucle qui ne se charge et ne joue
 * QUE lorsqu'elle entre à l'écran (IntersectionObserver + preload=none),
 * se met en pause hors écran et quand l'onglet est masqué. Sous
 * `prefers-reduced-motion`, aucune lecture auto : poster figé + contrôles
 * natifs pour lancer à la demande. Un bouton coupe/active le son (démarrage
 * muet obligatoire pour l'autoplay). Ratio réservé par le poster (zéro CLS).
 */
export function AmbientVideo({ video, soundOnLabel, soundOffLabel, className }: AmbientVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotionPref();
  const [muted, setMuted] = useState(true);
  const { poster } = video;

  // Lecture pilotée par la visibilité (écran + onglet), mais jamais sous
  // reduced-motion (le fallback poster/contrôles prend le relais).
  useEffect(() => {
    const el = ref.current;
    if (reduce || el === null) return;

    let onScreen = false;
    const sync = () => {
      if (onScreen && !document.hidden) void el.play().catch(() => {});
      else el.pause();
    };
    const observer = new IntersectionObserver(
      (entries) => {
        onScreen = entries[0]?.isIntersecting ?? false;
        sync();
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [reduce]);

  function toggleSound() {
    const el = ref.current;
    if (el === null) return;
    const next = !muted;
    setMuted(next);
    el.muted = next;
    if (!next) void el.play().catch(() => {});
  }

  return (
    <div className={cx(styles.root, className)}>
      <video
        ref={ref}
        className={styles.video}
        poster={poster.src}
        width={poster.width}
        height={poster.height}
        aria-label={poster.alt}
        muted={muted}
        loop
        playsInline
        preload="none"
        controls={reduce}
      >
        <source src={video.webm} type="video/webm" />
        <source src={video.mp4} type="video/mp4" />
      </video>

      {!reduce && (
        <button
          type="button"
          className={styles.sound}
          onClick={toggleSound}
          aria-pressed={!muted}
          aria-label={muted ? soundOnLabel : soundOffLabel}
        >
          {muted ? (
            <VolumeX aria-hidden="true" className={styles.soundIcon} />
          ) : (
            <Volume2 aria-hidden="true" className={styles.soundIcon} />
          )}
        </button>
      )}
    </div>
  );
}
