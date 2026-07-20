"use client";

import { useEffect, useRef } from "react";
import { Embers } from "./Embers";
import styles from "./LiquidBackground.module.css";

/**
 * Fond liquide global (v2) — nappes de lumière qui dérivent dans un champ
 * de distorsion, rendues par un fragment shader WebGL (aucune dépendance).
 * Interaction signature : le pointeur éclaire la profondeur avec inertie
 * (desktop), le scroll « remue » le liquide (mobile & desktop).
 *
 * Perf : rendu en demi-résolution (dégradés doux, l'upscale est invisible),
 * boucle coupée quand l'onglet est masqué. Sous prefers-reduced-motion, une
 * seule frame statique est dessinée. Sans WebGL, le dégradé CSS du conteneur
 * reste seul visible.
 */
export function LiquidBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const renderer = createRenderer(canvas);
    if (!renderer) return;

    const pointer = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 };
    let rafId = 0;
    let running = false;
    const startedAt = performance.now();

    const drawFrame = (timeMs: number) => {
      pointer.x += (pointer.targetX - pointer.x) * 0.045;
      pointer.y += (pointer.targetY - pointer.y) * 0.045;
      renderer.draw({
        time: (timeMs - startedAt) / 1000,
        pointerX: pointer.x,
        pointerY: pointer.y,
        scroll: window.scrollY / window.innerHeight,
      });
    };

    const loop = (now: number) => {
      drawFrame(now);
      rafId = requestAnimationFrame(loop);
    };

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const start = () => {
      if (running || reducedMotion.matches || document.hidden) return;
      running = true;
      rafId = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(rafId);
    };

    const onResize = () => {
      renderer.resize();
      if (!running) drawFrame(performance.now());
    };
    const onPointerMove = (event: PointerEvent) => {
      pointer.targetX = event.clientX / window.innerWidth;
      pointer.targetY = 1 - event.clientY / window.innerHeight;
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    const onMotionPref = () => {
      if (reducedMotion.matches) {
        stop();
        drawFrame(performance.now());
      } else {
        start();
      }
    };
    const onContextLost = (event: Event) => {
      event.preventDefault();
      stop();
      canvas.classList.remove(styles.isLive);
    };

    renderer.resize();
    drawFrame(performance.now());
    canvas.classList.add(styles.isLive);
    start();

    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    reducedMotion.addEventListener("change", onMotionPref);
    canvas.addEventListener("webglcontextlost", onContextLost);

    return () => {
      stop();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibility);
      reducedMotion.removeEventListener("change", onMotionPref);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      renderer.dispose();
    };
  }, []);

  return (
    <div aria-hidden="true" className={styles.root}>
      <canvas ref={canvasRef} className={styles.canvas} />
      {/* Braises d'ambiance globales (v3) : présence vivante permanente
          derrière TOUTES les sections — les sections à motifs propres
          (Sparkles/Meteors/champs) se superposent naturellement devant. */}
      <Embers count={18} />
    </div>
  );
}

type FrameUniforms = {
  time: number;
  pointerX: number;
  pointerY: number;
  scroll: number;
};

type Renderer = {
  draw: (uniforms: FrameUniforms) => void;
  resize: () => void;
  dispose: () => void;
};

/** Demi-résolution, DPR plafonné à 1 : des dégradés doux n'ont pas besoin de plus. */
const RENDER_SCALE = 0.5;

const VERTEX_SHADER = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_pointer;
uniform float u_scroll;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float glow(vec2 p, vec2 center, float radius) {
  float d = length(p - center) / radius;
  return exp(-d * d * 2.2);
}

void main() {
  float aspect = u_res.x / u_res.y;
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 p = vec2(uv.x * aspect, uv.y);
  float t = u_time * 0.07;
  float s = u_scroll;

  // Dérive de température au scroll (nuance chaud/froid, 20/07) : le fond se
  // rafraîchit doucement au cœur du parcours (offres → déploiement) puis
  // revient au chaud. Gaussienne centrée ~mi-page, amplitude faible — c'est
  // une nuance d'ambiance, pas une bascule. Chaud (cool≈0) en haut/bas.
  float cool = exp(-pow((s - 6.0) / 4.5, 2.0));

  // Distorsion liquide : le champ entier ondule, le scroll le remue.
  vec2 warp = vec2(
    noise(p * 1.4 + vec2(t, -t * 0.6) + s * 0.45),
    noise(p * 1.4 + vec2(-t * 0.7, t) + 11.17 - s * 0.36)
  );
  vec2 q = p + (warp - 0.5) * 0.52;

  vec3 col = vec3(0.051, 0.027, 0.024); /* --color-bg-deep #0d0706 */

  // Nappes : dérive ample + respiration liée au scroll (bornée, jamais hors champ).
  vec2 c1 = vec2(aspect * (0.22 + 0.16 * sin(t * 1.10)), 0.80 + 0.13 * cos(t * 0.80) + 0.11 * sin(s * 2.0));
  vec2 c2 = vec2(aspect * (0.85 + 0.14 * cos(t * 0.90)), 0.62 + 0.15 * sin(t * 0.70) + 0.13 * sin(s * 1.6 + 1.3));
  vec2 c3 = vec2(aspect * (0.50 + 0.20 * sin(t * 0.60 + 2.1)), 0.12 + 0.14 * cos(t * 1.00) + 0.10 * sin(s * 2.4 + 2.6));
  vec2 c4 = vec2(aspect * (0.12 + 0.13 * cos(t * 0.75 + 4.2)), 0.30 + 0.16 * sin(t * 0.85) + 0.12 * sin(s * 1.8 + 4.0));

  /* c1 (dominante, haut de page) reste chaude ; c2/c3 tirent vers le froid au
     cœur du parcours ; c4 (teal) se renforce au milieu. */
  col += vec3(0.961, 0.400, 0.118) * 0.26 * glow(q, c1, 0.58); /* accent orange #f5661e */
  col += mix(vec3(0.910, 0.353, 0.110), vec3(0.184, 0.749, 0.659), cool * 0.32)
    * 0.24 * glow(q, c2, 0.62); /* orange profond → turquoise */
  col += mix(vec3(0.910, 0.157, 0.094), vec3(0.757, 0.549, 1.000), cool * 0.42)
    * 0.17 * glow(q, c3, 0.55); /* rouge → violet #c18cff */
  col += vec3(0.184, 0.749, 0.659) * (0.13 + 0.09 * cool) * glow(q, c4, 0.50); /* teal renforcé */

  // Lumière du pointeur : discrète, elle lit comme le halo curseur qui
  // se réfracte dans la profondeur.
  vec2 pt = vec2(u_pointer.x * aspect, u_pointer.y);
  col += vec3(0.961, 0.400, 0.118) * 0.15 * glow(q, pt, 0.42); /* halo pointeur orange */

  // Vignette : bords profonds, texte lisible au centre.
  float vin = smoothstep(1.25, 0.35, length(uv - 0.5) * 1.6);
  col *= mix(0.78, 1.0, vin);

  // Dither anti-banding.
  col += (hash(gl_FragCoord.xy) - 0.5) * 0.012;

  gl_FragColor = vec4(col, 1.0);
}
`;

function createRenderer(canvas: HTMLCanvasElement): Renderer | null {
  const gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
  });
  if (!gl) return null;

  const program = buildProgram(gl);
  if (!program) return null;
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPosition = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(aPosition);
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(program, "u_res");
  const uTime = gl.getUniformLocation(program, "u_time");
  const uPointer = gl.getUniformLocation(program, "u_pointer");
  const uScroll = gl.getUniformLocation(program, "u_scroll");

  return {
    resize() {
      const scale = Math.min(window.devicePixelRatio, 1) * RENDER_SCALE;
      canvas.width = Math.max(1, Math.round(window.innerWidth * scale));
      canvas.height = Math.max(1, Math.round(window.innerHeight * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
    },
    draw({ time, pointerX, pointerY, scroll }) {
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, time);
      gl.uniform2f(uPointer, pointerX, pointerY);
      gl.uniform1f(uScroll, scroll);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    dispose() {
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}

function buildProgram(gl: WebGLRenderingContext): WebGLProgram | null {
  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };

  const vertex = compile(gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  if (!vertex || !fragment) return null;

  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  return program;
}
