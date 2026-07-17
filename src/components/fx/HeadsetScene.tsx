"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, PerspectiveCamera } from "@react-three/drei";
import type { MotionValue } from "framer-motion";
import type { Group } from "three";
import { Quest3Gltf } from "./Quest3Gltf";
import styles from "./HeadsetScene.module.css";

const CYAN = "#18ccfc";
const VIOLET = "#ae48ff";
const PINK = "#ff4ecd";

type Choreography = {
  progress: MotionValue<number>;
  tiltX: MotionValue<number>;
  tiltY: MotionValue<number>;
};

function clamp01(v: number) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}
/** Interpolation lissée (smoothstep) de `a`→`b` sur la fenêtre [p0, p1]. */
function ramp(p: number, p0: number, p1: number, a: number, b: number) {
  const t = clamp01((p - p0) / (p1 - p0));
  const s = t * t * (3 - 2 * t);
  return a + (b - a) * s;
}

/**
 * Rig : lit la progression du scroll (et le gyro) à chaque frame et joue la
 * mise du casque. Trois temps : (1) la FAÇADE (capteurs, logo Meta) fait face
 * au spectateur, au loin ; (2) le casque s'approche et PIVOTE de 180° — on le
 * retourne vers soi pour découvrir les lentilles ; (3) plongée dans les
 * œilletons (z file vers la caméra à z=4, centré entre les deux lentilles).
 * Aucun état React : mutation directe de l'objet three. Le relais plein écran
 * (voile + embrasement CSS) prend la suite après ~0.66.
 */
function Rig({ progress, tiltX, tiltY }: Choreography) {
  const group = useRef<Group>(null);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const p = progress.get();
    const gx = tiltX.get();
    const gy = tiltY.get();
    const idle = Math.sin(state.clock.elapsedTime * 0.6) * 0.05;

    g.rotation.y = ramp(p, 0.12, 0.52, 0, Math.PI) + idle + gx * 0.3;
    g.rotation.x = ramp(p, 0.1, 0.5, 0.04, -0.05) + gy * 0.22;
    g.position.z = ramp(p, 0, 0.66, -2.8, 3.7);
    g.position.x = gx * 0.1;
    g.position.y = ramp(p, 0, 0.6, 0.02, 0.06) + gy * 0.05;
  });

  return (
    <group ref={group}>
      <Suspense fallback={null}>
        <Quest3Gltf />
      </Suspense>
    </group>
  );
}

type HeadsetSceneProps = Choreography & {
  /** DPR max (mobile : 1 ; desktop : 1.5). */
  dpr?: number;
  /** Rend uniquement quand actif (hors écran → frameloop coupé, zéro GPU). */
  active?: boolean;
};

/**
 * Scène WebGL du casque (Immersion v2.1) — react-three-fiber. Vrai Meta
 * Quest 3 (GLB Sketchfab CC-BY optimisé, chargé en Suspense), réflexions par
 * Lightformers locaux (pas d'HDR distant). Fond transparent : le
 * LiquidBackground / l'univers respirent derrière. Lazy-montée près du
 * viewport (voir HeadsetSceneLazy).
 */
export function HeadsetScene({ progress, tiltX, tiltY, dpr = 1.5, active = true }: HeadsetSceneProps) {
  return (
    <div className={styles.root} aria-hidden="true">
      <Canvas
        dpr={[1, dpr]}
        frameloop={active ? "always" : "never"}
        gl={{
          // GPU dédié (et non l'iGPU basse conso) ; MSAA sur desktop (dpr≥1.5),
          // coupé sur mobile (dpr 1) ; refus du rendu logiciel (SwiftShader) →
          // les machines sans vrai GPU basculent sur l'image de repli.
          antialias: dpr >= 1.5,
          alpha: true,
          powerPreference: "high-performance",
          failIfMajorPerformanceCaveat: true,
        }}
        onCreated={({ gl }) => gl.setClearAlpha(0)}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={42} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[2, 3, 4]} intensity={1.1} color="#d6e6ff" />
        <pointLight position={[-3.2, -1, 2.5]} intensity={40} distance={14} color={VIOLET} />
        <pointLight position={[3.2, 1.4, 1.5]} intensity={34} distance={14} color={CYAN} />
        {/* Cubemap de réflexions rendu UNE fois (frames={1}) — glossy néon
            sur la visière, sans HDR distant. */}
        <Environment resolution={128} frames={1}>
          <Lightformer intensity={2.4} color={CYAN} position={[-3, 1, 3]} scale={[5, 5, 1]} />
          <Lightformer intensity={2.4} color={PINK} position={[3, -1, 3]} scale={[5, 5, 1]} />
          <Lightformer intensity={1.2} color="#ffffff" position={[0, 3, 2]} scale={[3, 2, 1]} />
        </Environment>
        <Rig progress={progress} tiltX={tiltX} tiltY={tiltY} />
      </Canvas>
    </div>
  );
}
