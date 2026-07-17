"use client";

import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { Box3, Group, Mesh, MeshStandardMaterial, Vector3 } from "three";

/** Meta Quest 3 réel — modèle Sketchfab CC-BY (AVILOV), optimisé meshopt + webp. */
const MODEL_URL = "/models/quest3.glb";
/** Largeur cible dans la scène (reprend l'empreinte de l'ancien modèle). */
const TARGET_WIDTH = 2.3;
/** GLB orienté façade (capteurs, logo Meta) vers +Z : la façade est vers la
 * caméra à rotation 0, l'intérieur (lentilles) après le demi-tour du Rig. */
const BASE_ROTATION_Y = 0;
/** Reflets néon un peu plus marqués sous les Lightformers cyan/rose. */
const ENV_MAP_INTENSITY = 1.4;

/**
 * Vrai casque Meta Quest 3. Le GLB source repose sur le plan Y=0 et n'est pas
 * normalisé : on le recentre et on le met à l'échelle une fois au montage,
 * pour que le Rig et la chorégraphie de HeadsetScene restent inchangés
 * (group centré, largeur ~2.3, façade vers +Z). useGLTF configure le décodeur
 * meshopt embarqué (three-stdlib) ; Draco est désactivé (le modèle ne l'utilise
 * pas) — aucun fetch externe au runtime.
 */
export function Quest3Gltf() {
  const { scene } = useGLTF(MODEL_URL, false);

  const model = useMemo(() => {
    const root = scene.clone(true);
    const box = new Box3().setFromObject(root);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());

    root.position.sub(center);
    root.traverse((obj) => {
      if (!(obj instanceof Mesh)) return;
      const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
      for (const material of materials) {
        if (material instanceof MeshStandardMaterial) material.envMapIntensity = ENV_MAP_INTENSITY;
      }
    });

    const wrapper = new Group();
    wrapper.add(root);
    wrapper.scale.setScalar(TARGET_WIDTH / Math.max(size.x, size.y, size.z));
    wrapper.rotation.y = BASE_ROTATION_Y;
    return wrapper;
  }, [scene]);

  return <primitive object={model} />;
}

useGLTF.preload(MODEL_URL, false);
