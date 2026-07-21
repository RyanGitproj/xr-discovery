"use client";

// Comparaison typo : Unbounded chargé uniquement sur ce banc (page-scoped).
import "@fontsource/unbounded/latin-700.css";

import { AuroraField } from "@/components/fx/AuroraField";
import { BackgroundBeams } from "@/components/fx/BackgroundBeams";
import { BeamBorder } from "@/components/fx/BeamBorder";
import { ContainerScroll } from "@/components/fx/ContainerScroll";
import { DecryptNumber } from "@/components/fx/DecryptNumber";
import { Embers } from "@/components/fx/Embers";
import { EnterRise } from "@/components/fx/EnterRise";
import { GeoFrame } from "@/components/fx/GeoFrame";
import { GlassPanel } from "@/components/fx/GlassPanel";
import { GlowReactive, GlowReactiveGroup } from "@/components/fx/GlowReactive";
import { GridPulse } from "@/components/fx/GridPulse";
import { HeadsetScene } from "@/components/fx/HeadsetScene";
import { HoloFigure } from "@/components/fx/HoloFigure";
import { HoloHeadset } from "@/components/fx/HoloHeadset";
import { LampHeader } from "@/components/fx/LampHeader";
import { MadagascarField } from "@/components/fx/MadagascarField";
import { NeuralField } from "@/components/fx/NeuralField";
import { Sparkles } from "@/components/fx/Sparkles";
import { TapHint } from "@/components/fx/TapHint";
import { MagneticButton } from "@/components/fx/MagneticButton";
import { Meteors } from "@/components/fx/Meteors";
import { NumberTicker } from "@/components/fx/NumberTicker";
import { ParallaxLayer } from "@/components/fx/ParallaxLayer";
import { ParallaxScene } from "@/components/fx/ParallaxScene";
import { ProjectionBeam } from "@/components/fx/ProjectionBeam";
import { RadarPing } from "@/components/fx/RadarPing";
import { RevealGroup, RevealItem } from "@/components/fx/Reveal";
import { ScrollStage } from "@/components/fx/ScrollStage";
import { ShimmerCTA } from "@/components/fx/ShimmerCTA";
import { StageLayer } from "@/components/fx/StageLayer";
import { Spotlight } from "@/components/fx/Spotlight";
import { StickyScrollReveal } from "@/components/fx/StickyScrollReveal";
import { TextGenerate } from "@/components/fx/TextGenerate";
import { TextScrollReveal } from "@/components/fx/TextScrollReveal";
import { TiltCard } from "@/components/fx/TiltCard";
import { TracingBeam } from "@/components/fx/TracingBeam";
import { VelocityMarquee } from "@/components/fx/VelocityMarquee";
import { PROJECTION_TIMELINE } from "@/components/fx/projectionTimeline";
import { Figure } from "@/components/ui/Figure";
import Image from "next/image";
import { m, useMotionValue, useTransform } from "framer-motion";
import { useState } from "react";
import { diveImages, galleryImages } from "@/config/images";
import { ANTANANARIVO } from "@/lib/geo/madagascar";
import { toViewPct } from "@/lib/geo/madagascarView";
import { cx } from "@/lib/cx";
import { useDeviceTilt } from "@/lib/motion/useDeviceTilt";
import styles from "./fx-lab.module.css";

const TANA = toViewPct(ANTANANARIVO);
const BEAM_TOP = { x: 50, width: 28, y: 42.5 } as const;

const DEMO_STEPS = [
  { title: "Brief & objectifs", body: "30 minutes pour cadrer date, lieu et public." },
  { title: "Proposition & devis", body: "Format et pack adaptés, envoyés sous 48 h." },
  { title: "Préparation", body: "Sélection des expériences et de l'habillage." },
  { title: "Jour J", body: "Installation et animation par notre équipe." },
  { title: "Bilan", body: "Chiffres de participation et recommandations." },
] as const;

function LabSection({
  title,
  note,
  children,
}: {
  title: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`fx-section ${styles.section}`}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <p className={styles.sectionNote}>{note}</p>
        {children}
      </div>
    </section>
  );
}

function DemoCard({ title, note }: { title: string; note: string }) {
  return (
    <>
      <p className={styles.cardTitle}>{title}</p>
      <p className={styles.cardNote}>{note}</p>
    </>
  );
}

/** Banc de la scène casque 3D : slider = progression du scroll simulée. */
function HeadsetLabDemo() {
  const progress = useMotionValue(0);
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const [value, setValue] = useState(0);
  return (
    <>
      <div className={cx(styles.demo, styles.headsetDemo)}>
        <HeadsetScene progress={progress} tiltX={tiltX} tiltY={tiltY} />
      </div>
      <label className={styles.headsetSlider}>
        progression {value.toFixed(2)}
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={value}
          onChange={(e) => {
            const v = Number(e.target.value);
            setValue(v);
            progress.set(v);
          }}
        />
      </label>
    </>
  );
}

/** Banc du gyroscope : le palet suit l'inclinaison réelle de l'appareil. */
function DeviceTiltDemo() {
  const { x, y, status, requestAccess } = useDeviceTilt();
  const puckX = useTransform(x, (v) => v * 48);
  const puckY = useTransform(y, (v) => v * 32);

  return (
    <div className={cx(styles.demo, styles.demoH56, styles.tiltDemo)}>
      <m.div style={{ x: puckX, y: puckY }} className={styles.tiltPuck}>
        VR
      </m.div>
      {status === "prompt" && (
        <button
          type="button"
          className={styles.tiltButton}
          onClick={() => void requestAccess()}
        >
          Activer l&apos;effet 3D
        </button>
      )}
      <span className={styles.demoLabel}>statut : {status}</span>
    </div>
  );
}

/** Banc TapHint : rejoue le geste de tap et l'entrée/sortie de la main. */
function TapHintDemo() {
  const [visible, setVisible] = useState(true);
  const [tapCount, setTapCount] = useState(0);

  return (
    <div className={cx(styles.demo, styles.demoH40, styles.tapHintDemo)}>
      <TapHint visible={visible} tapCount={tapCount} />
      <div className={styles.tapHintControls}>
        <button
          type="button"
          className={styles.tiltButton}
          onClick={() => setTapCount((count) => count + 1)}
        >
          Rejouer le tap
        </button>
        <button
          type="button"
          className={styles.tiltButton}
          onClick={() => setVisible((v) => !v)}
        >
          {visible ? "Masquer" : "Afficher"}
        </button>
      </div>
      <span className={styles.demoLabel}>taps : {tapCount}</span>
    </div>
  );
}

export default function FxLabPage() {
  return (
    <main id="contenu" className={styles.main}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>FX Lab</h1>
        <p className={styles.pageTagline}>
          Laboratoire des primitives fx, où chaque effet naît et s&apos;itère avant toute
          section réelle. GlowCursor et ScrollProgress sont globaux (layout / navbar).
        </p>
      </header>

      <LabSection
        title="Typographie v3 : display à valider"
        note="La réf. mixe un display bold + un grotesque neutre. Candidats display auto-hébergés (@fontsource) ; corps Inter conservé ; accent Baloo 2 pour les mots ronds. À choisir."
      >
        <div style={{ display: "grid", gap: "1.75rem" }}>
          {[
            { name: "Sora (défaut)", family: "'Sora', sans-serif" },
            { name: "Unbounded", family: "'Unbounded', sans-serif" },
            { name: "Space Grotesk (actuel)", family: "'Space Grotesk', sans-serif" },
          ].map((f) => (
            <div key={f.name}>
              <p className={styles.sectionNote}>{f.name}</p>
              <p
                style={{
                  fontFamily: f.family,
                  fontWeight: 700,
                  fontSize: "clamp(1.8rem, 4vw, 3rem)",
                  lineHeight: 1.02,
                  textTransform: "uppercase",
                  letterSpacing: "-0.02em",
                }}
              >
                Entrez dans une{" "}
                <span style={{ fontFamily: "'Baloo 2', cursive", textTransform: "none" }}>
                  autre réalité
                </span>
              </p>
            </div>
          ))}
          <p style={{ fontFamily: "'Inter', sans-serif", color: "var(--color-ink-muted)", maxWidth: "42rem" }}>
            Corps de texte en Inter. La VR clé en main pour votre centre commercial : 10 casques
            autonomes, animateurs formés, installation et bilan compris.
          </p>
        </div>
      </LabSection>

      <LabSection
        title="GeoFrame, géométrie HUD (verre + arête tracée)"
        note="Formes chanfreinées (clip-path) + arête lumineuse SVG suivant le contour. Verre liquide conservé ; CTA en aplat orange « ticket ». `trace` = reflet focal, recharger pour voir courir l'arête. Couleur surchargeable par custom properties --geo-edge-c1/c2/c3 (stops du gradient) et --geo-halo (drop-shadow), avec la comète de marque en fallback ; utilisé par les accents d'offre (PackCard)."
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1.75rem", alignItems: "center" }}>
          <GeoFrame shape="hud" chamfer={18} trace>
            <div style={{ padding: "1.5rem 1.75rem", minWidth: "12rem" }}>
              <p className={styles.cardTitle}>Card HUD</p>
              <p className={styles.cardNote}>octogone doux + arête tracée</p>
            </div>
          </GeoFrame>
          <GeoFrame shape="chamfer" chamfer={24}>
            <div style={{ padding: "1.5rem 1.75rem", minWidth: "11rem" }}>
              <p className={styles.cardTitle}>Chanfrein</p>
              <p className={styles.cardNote}>un coin coupé, sobre</p>
            </div>
          </GeoFrame>
          <GeoFrame shape="ticket" chamfer={10} notch={7} variant="solid" trace>
            <span
              style={{
                display: "inline-block",
                padding: "0.9rem 2rem",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                color: "var(--color-bg-deep)",
              }}
            >
              Pré-commander
            </span>
          </GeoFrame>
        </div>
      </LabSection>

      <LabSection
        title="Figure et son scan holographique"
        note="Signature v2 (Famille B) : au survol, une nappe de lumière balaie la photo, car chaque visuel est une projection (cohérence hero). Coupé sur tactile et sous reduced-motion."
      >
        <div className={styles.grid2}>
          {galleryImages.slice(0, 2).map((image) => (
            <Figure key={image.src} image={image} sizes="(max-width: 768px) 100vw, 480px" />
          ))}
        </div>
      </LabSection>

      <LabSection
        title="Parallax (ParallaxScene / ParallaxLayer)"
        note="Immersion v2.1, profondeur au scroll : depth < 0 traîne (fond), depth > 0 devance (avant-plan), calques alignés quand la scène est centrée dans le viewport (neutral 0.5). Mode inset : l'image glisse dans son cadre, sur-échelle auto pour ne jamais découvrir les bords. Wrapper transform dédié, jamais d'opacité, inerte sous reduced-motion."
      >
        <ParallaxScene className={styles.parallaxGrid}>
          <ParallaxLayer depth={-0.5}>
            <GlassPanel className={styles.panelPad}>
              <DemoCard title="depth −0.5" note="Fond : traîne derrière le flux de scroll." />
            </GlassPanel>
          </ParallaxLayer>
          <ParallaxLayer depth={0}>
            <GlassPanel className={styles.panelPad}>
              <DemoCard title="depth 0" note="Plan du contenu : immobile, la référence." />
            </GlassPanel>
          </ParallaxLayer>
          <ParallaxLayer depth={0.5}>
            <GlassPanel className={styles.panelPad}>
              <DemoCard title="depth +0.5" note="Avant-plan : devance le flux de scroll." />
            </GlassPanel>
          </ParallaxLayer>
        </ParallaxScene>
        <div className={styles.parallaxRow}>
          <div className={styles.parallaxFrame}>
            <ParallaxLayer mode="inset" depth={-0.25}>
              <Image
                src={galleryImages[2].src}
                alt={galleryImages[2].alt}
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, 480px"
                className={styles.parallaxImg}
              />
            </ParallaxLayer>
            <span className={styles.demoLabel}>inset −0.25 (cadre Figure)</span>
          </div>
          <ParallaxLayer depth={0.35}>
            <GlassPanel className={styles.panelPad}>
              <DemoCard
                title="standalone +0.35"
                note="Hors ParallaxScene : le calque mesure sa propre traversée du viewport."
              />
            </GlassPanel>
          </ParallaxLayer>
        </div>
      </LabSection>

      <LabSection
        title="HeadsetScene : casque Quest 3 en 3D (R3F)"
        note="Immersion v2.1. Modèle procédural piloté par la progression du scroll : le casque s'approche, s'incline et pivote 180° pour présenter ses lentilles (mise du casque). Bouge le slider pour parcourir la séquence. Réflexions néon par Lightformers locaux (aucun HDR distant)."
      >
        <HeadsetLabDemo />
      </LabSection>

      <LabSection
        title="ScrollStage / StageLayer, scrollytelling épinglé"
        note="Immersion v2.1, 3 écrans épinglés (300svh) : le casque approche (les couches front/back s'écartent), zoom dans la visière, le halo devient porte de lumière, l'univers se révèle. Timeline déclarative {at → y/x/scale/opacity}, bidirectionnelle et déterministe (remonter rejoue l'état exact). Placeholders SVG (brief Codex : docs/images-dive-brief.md). Sous reduced-motion : fallback statique complet."
      >
        <ScrollStage
          screens={3}
          className={styles.stageDemo}
          fallback={
            <div className={cx(styles.demo, styles.demoH72, styles.stageFallback)}>
              <Image
                src={diveImages.headsetFront.src}
                alt=""
                width={diveImages.headsetFront.width}
                height={diveImages.headsetFront.height}
                unoptimized
                className={styles.stageImgSm}
              />
              <p className={styles.cardNote}>
                Fallback reduced-motion : composition figée, hauteur naturelle.
              </p>
            </div>
          }
        >
          <StageLayer at={[0.45, 0.75, 1]} scale={[1.15, 1, 1]} opacity={[0, 1, 1]}>
            <Image
              src={diveImages.universe.src}
              alt=""
              width={diveImages.universe.width}
              height={diveImages.universe.height}
              unoptimized
              className={styles.stageImgFull}
            />
          </StageLayer>
          <StageLayer at={[0.4, 0.5, 0.75]} scale={[0.6, 1.6, 3.2]} opacity={[0, 0.9, 0]}>
            <Image
              src={diveImages.lensGlow.src}
              alt=""
              width={diveImages.lensGlow.width}
              height={diveImages.lensGlow.height}
              unoptimized
              className={styles.stageImgSm}
            />
          </StageLayer>
          <StageLayer at={[0, 0.45, 0.62]} y={[88, 24, 0]} scale={[0.55, 1.15, 2.2]} opacity={[1, 1, 0]} tiltRange={14}>
            <Image
              src={diveImages.headsetBack.src}
              alt=""
              width={diveImages.headsetBack.width}
              height={diveImages.headsetBack.height}
              unoptimized
              className={styles.stageImgSm}
            />
          </StageLayer>
          <StageLayer at={[0, 0.45, 0.68]} y={[64, 0, 0]} scale={[0.55, 1.15, 2.6]} opacity={[1, 1, 0]} tiltRange={14}>
            <Image
              src={diveImages.headsetFront.src}
              alt=""
              width={diveImages.headsetFront.width}
              height={diveImages.headsetFront.height}
              unoptimized
              className={styles.stageImgSm}
            />
          </StageLayer>
          <StageLayer at={[0, 0.45]} y={[120, -160]} tiltRange={8}>
            <Image
              src={diveImages.particles.src}
              alt=""
              width={diveImages.particles.width}
              height={diveImages.particles.height}
              unoptimized
              className={styles.stageImgFull}
            />
          </StageLayer>
          <StageLayer at={[0.75, 0.92]} opacity={[0, 1]} y={[32, 0]} decorative={false}>
            <p className={styles.stageRevealText}>Un autre monde s&apos;ouvre</p>
          </StageLayer>
        </ScrollStage>
      </LabSection>

      <LabSection
        title="useDeviceTilt (gyroscope)"
        note="Immersion v2.1 (mobile). Le palet suit l'inclinaison du téléphone : neutre calibré sur les 20 premières lectures, deadzone ±2°, clamp ±18°, springs 60/20, zéro re-render. iOS : bouton de permission (statut prompt), refus persisté en session. Desktop sans capteur : statut unsupported, palet immobile. Inerte sous reduced-motion."
      >
        <DeviceTiltDemo />
      </LabSection>

      <LabSection title="AuroraField" note="Famille A (ambient : 2 nappes / active : 3 nappes). Transform uniquement.">
        <div className={styles.grid2}>
          <div className={cx(styles.demo, styles.demoH64)}>
            <AuroraField intensity="ambient" />
            <span className={styles.demoLabel}>ambient</span>
          </div>
          <div className={cx(styles.demo, styles.demoH64)}>
            <AuroraField intensity="active" />
            <span className={styles.demoLabel}>active</span>
          </div>
        </div>
      </LabSection>

      <LabSection title="GridPulse" note="Famille A : trame circuit SVG, respiration d'opacité 24 s.">
        <div className={cx(styles.demo, styles.demoH56)}>
          <GridPulse intensity="ambient" />
        </div>
      </LabSection>

      <LabSection title="BeamBorder" note="Famille A. Conic-gradient tournant, zéro JS. Liseré statique sous reduced-motion.">
        <div className={styles.grid2}>
          <BeamBorder intensity="active">
            <GlassPanel className={styles.panelPadLg}>
              <DemoCard title="active (6 s)" note="Pack vedette, CTA principal." />
            </GlassPanel>
          </BeamBorder>
          <BeamBorder intensity="ambient">
            <GlassPanel className={styles.panelPadLg}>
              <DemoCard title="ambient (10 s)" note="Contours discrets." />
            </GlassPanel>
          </BeamBorder>
        </div>
      </LabSection>

      <LabSection title="GlassPanel" note="Famille A, en 4 couches : frost, liseré, sheen, réfraction (--liquid, Chromium).">
        <div className={styles.glassBackdrop}>
          <div className={styles.grid3}>
            <GlassPanel className={styles.panelPad} degradeOffscreen={false}>
              <DemoCard title="standard" note="blur 18px + saturate 160 %." />
            </GlassPanel>
            <GlassPanel thin className={styles.panelPad} degradeOffscreen={false}>
              <DemoCard title="thin" note="blur 12px (navbar)." />
            </GlassPanel>
            <GlassPanel liquid className={styles.panelPad} degradeOffscreen={false}>
              <DemoCard title="liquid" note="réfraction feDisplacementMap." />
            </GlassPanel>
            <GlassPanel surface className={styles.panelPad}>
              <DemoCard title="surface" note="sans backdrop-filter, pour les cards sur fond uni." />
            </GlassPanel>
          </div>
        </div>
      </LabSection>

      <LabSection title="Meteors" note="Famille A : traits filants rares (1 visible / 4-6 s), positions déterministes.">
        <div className={cx(styles.demo, styles.demoH56)}>
          <Meteors count={4} />
        </div>
      </LabSection>

      <LabSection title="ShimmerCTA" note="Famille A. Reflet traversant + glow pulsé lent. Composable avec BeamBorder + MagneticButton.">
        <div className={styles.rowWrap}>
          <ShimmerCTA size="sm">Demander un devis</ShimmerCTA>
          <ShimmerCTA size="md">Demander un devis</ShimmerCTA>
          <ShimmerCTA size="xl">Demander un devis</ShimmerCTA>
        </div>
      </LabSection>

      <LabSection title="Sparkles" note="v1.2 : étincelles multicolores, positions déterministes, scale + opacity.">
        <div className={cx(styles.demo, styles.demoH56)}>
          <Sparkles count={18} />
        </div>
      </LabSection>

      <LabSection title="Embers" note="v3, braises incandescentes qui montent en scintillant et dérivent (déterministes, pause hors écran). Remplacent les éclats bokeh froids de la scène de plongée. À gauche densité scène (22), à droite nappe d'ambiance (14).">
        <div className={styles.grid2}>
          <div className={cx(styles.demo, styles.demoH56)}>
            <Embers count={22} />
          </div>
          <div className={cx(styles.demo, styles.demoH56)}>
            <Embers count={14} />
          </div>
        </div>
      </LabSection>

      <LabSection
        title="TapHint"
        note="v3, famille C, hint pédagogique : main pointer + anneau d'impulsion à chaque tap. Usage : démo guidée du sélecteur d'offres en boucle « visite des 8 offres » (un tap ≈ 3,5 s, activation réelle des packs ; pause hors écran et au survol des zones interactives ; stop définitif au premier geste, pour la session). Décorative (aria-hidden, pointer-events none), transform + opacity uniquement. Sous prefers-reduced-motion : le parent ne la rend pas."
      >
        <TapHintDemo />
      </LabSection>

      <LabSection title="Scroll reveal natif" note="v4. Apparition scrubée par le scroll (animation-timeline: view, fondation v2) : fondu + montée pendant l'entrée dans le viewport, réversible en remontant, compositor-only, zéro JS. Sans support navigateur ou sous reduced-motion : visible d'emblée. En scène : mosaïque « moments XR » (emboîté dans les ParallaxLayer).">
        <div className={styles.grid2}>
          <div className="scroll-reveal">
            <div className={cx(styles.demo, styles.demoH40)}>
              <Sparkles count={8} />
            </div>
          </div>
          <div className="scroll-reveal">
            <div className={cx(styles.demo, styles.demoH40)}>
              <Embers count={10} />
            </div>
          </div>
        </div>
      </LabSection>

      <LabSection title="NeuralField" note="v1.2, réseau de neurones : nœuds qui pulsent, signaux comète le long des liens.">
        <div className={cx(styles.demo, styles.demoH64)}>
          <NeuralField nodes={26} />
        </div>
      </LabSection>

      <LabSection title="MadagascarField" note="v2, constellation Madagascar : morph au chargement (points dispersés → île), chaîne de côte + comètes. Recharger la page pour rejouer la formation.">
        <div className={cx(styles.demo, styles.demoSquare)}>
          <MadagascarField />
        </div>
      </LabSection>

      <LabSection title="RadarPing" note="v2 : point lumineux à ondes radar (marqueur de la capitale). Sous reduced-motion : cœur allumé, ondes absentes.">
        <div className={cx(styles.demo, styles.demoH40)}>
          <RadarPing x={50} y={50} delay={0.3} />
        </div>
      </LabSection>

      <LabSection title="ProjectionBeam" note="v2. Faisceau conique qui jaillit d'un point (scaleY composité) puis respire en opacité. L'apex peut être désaxé du bord haut.">
        <div className={cx(styles.demo, styles.demoH64)}>
          <ProjectionBeam apex={{ x: 58, y: 82 }} top={{ x: 50, width: 44, y: 14 }} delay={0.3} />
          <RadarPing x={58} y={82} delay={0.1} />
        </div>
      </LabSection>

      <LabSection title="EnterRise" note="v2 : apparition chronométrée (fade + montée), synchronisable avec une timeline contrairement à Reveal (scroll). Recharger pour rejouer.">
        <EnterRise delay={0.5}>
          <p className={styles.riseText}>Hologramme prêt.</p>
        </EnterRise>
      </LabSection>

      <LabSection title="HoloFigure" note="v2. Buste hologramme (photo webp, couleurs d'origine) : scanlines masquées par l'alpha, flottement, glitch fréquent marqué sans excès toutes les ~2,6 s (déchirures + split RGB permanent léger). À gauche cycle réel (3 s), à droite démo accélérée (1,5 s).">
        <div className={styles.figuresRow}>
          <HoloFigure className={styles.figureW56} />
          <HoloFigure className={styles.figureW56} style={{ "--holo-glitch-dur": "1.5s" }} />
        </div>
      </LabSection>

      <LabSection title="Projection Antananarivo" note="v2, scène composée : l'île se forme, la capitale s'allume, le faisceau jaillit, l'hologramme se matérialise. Recharger pour rejouer la séquence complète.">
        <div className={cx(styles.demo, styles.demoSquare)}>
          <MadagascarField className="fx-dim-50" />
          <ProjectionBeam apex={TANA} top={BEAM_TOP} delay={PROJECTION_TIMELINE.beam} />
          <RadarPing x={TANA.x} y={TANA.y} delay={PROJECTION_TIMELINE.ping} />
          <EnterRise
            delay={PROJECTION_TIMELINE.headset}
            className="fx-rise-overlay"
            style={{ top: "2.5%", marginInline: "auto", width: "40%" }}
          >
            <HoloFigure />
          </EnterRise>
        </div>
      </LabSection>

      <LabSection title="HoloHeadset" note="v1.2. Le casque VR dessiné en SVG (conservé comme primitive ; remplacé par HoloFigure dans le hero v2) : trait néon dégradé, fantômes chromatiques, scanlines, flottement + cône de projection.">
        <div className={styles.headsetRow}>
          <HoloHeadset className={styles.headsetW72} />
        </div>
      </LabSection>

      <LabSection title="Texte holographique" note="v1.2 : gradient iridescent clippé sur le texte ; --live (animé) limité à 1-2 éléments par page.">
        <p className={cx("holo-text", styles.holoDemo)}>Attirez le public avec la VR</p>
        <p className={cx("holo-text holo-text--live", styles.holoDemo, styles.holoDemoSecond)}>
          Attirez le public avec la VR
        </p>
      </LabSection>

      <LabSection title="LampHeader" note="Bonus blueprint : titre éclairé par le haut (section Packs).">
        <LampHeader>
          <h3 className={styles.lampDemoTitle}>Trois packs, un objectif</h3>
        </LampHeader>
      </LabSection>

      <LabSection title="BackgroundBeams" note="Bonus blueprint. Faisceaux SVG en CSS pur (stroke-dashoffset), CTA final.">
        <div className={cx(styles.demo, styles.demoH72)}>
          <BackgroundBeams intensity="active" />
        </div>
      </LabSection>

      <LabSection title="Spotlight" note="Famille B : halo radial dans une zone, variables CSS en rAF. Statique sur tactile.">
        <Spotlight className={styles.spotlightDemo}>
          <p className={styles.spotlightTitle}>Déplacez le curseur ici</p>
          <p className={styles.cardNote}>Le GlowCursor global se masque dans cette zone.</p>
        </Spotlight>
      </LabSection>

      <LabSection title="GlowReactive" note="Famille B. Bordure qui s'illumine à l'approche (un seul listener sur le groupe).">
        <GlowReactiveGroup className={styles.grid3}>
          {["Centres commerciaux", "Enseignes & magasins", "Événements"].map((label) => (
            <GlowReactive key={label}>
              <GlassPanel className={styles.panelPad} degradeOffscreen={false}>
                <DemoCard title={label} note="Approchez le curseur du bord." />
              </GlassPanel>
            </GlowReactive>
          ))}
        </GlowReactiveGroup>
      </LabSection>

      <LabSection title="MagneticButton" note="Famille B, attraction max 10px, ressort au départ. 2 occurrences max par page.">
        <MagneticButton>
          <ShimmerCTA>Je m&apos;approche du curseur</ShimmerCTA>
        </MagneticButton>
      </LabSection>

      <LabSection title="TiltCard" note="Famille B. Inclinaison max 6°, reflet glissant. Jamais combiné à GlowReactive.">
        <div className={styles.maxSm}>
          <TiltCard>
            <GlassPanel className={styles.panelPadLg} degradeOffscreen={false}>
              <DemoCard title="Pack Temps Fort" note="Survolez pour incliner la card." />
            </GlassPanel>
          </TiltCard>
        </div>
      </LabSection>

      <LabSection title="Reveal / RevealGroup" note="Famille C : fade + translateY(24px), stagger 80 ms, once.">
        <RevealGroup className={styles.grid3}>
          {[1, 2, 3].map((n) => (
            <RevealItem key={n}>
              <GlassPanel className={styles.panelPad} degradeOffscreen={false}>
                <p className={styles.cardTitle}>Card {n}</p>
              </GlassPanel>
            </RevealItem>
          ))}
        </RevealGroup>
      </LabSection>

      <LabSection title="TextGenerate" note="Focal du hero : apparition mot à mot ; variantes solid / outline / holo.">
        <h3 className={styles.textGenDemo}>
          <TextGenerate
            segments={[
              { text: "Entrez dans", variant: "solid", block: true },
              { text: "une autre réalité", variant: "outline", block: true },
              { text: "avec la VR", variant: "holo", block: true },
            ]}
          />
        </h3>
      </LabSection>

      <LabSection title="NumberTicker" note="Famille C. Compteur fr-FR, tabular-nums, once. Réservé aux chiffres d'ambiance (HUD) : sur un prix, la croissance rapide donne une impression de cherté.">
        <p className={cx(styles.tickerDemo, "tabular")}>
          <NumberTicker value={1600000} unit="ar" />
        </p>
      </LabSection>

      <LabSection title="DecryptNumber" note="Famille C, révélation « déchiffrement » : chiffres brouillés qui se résolvent de gauche à droite (620 ms), aucun montant intermédiaire affiché. C'est l'animation des PRIX (packs) ; recharger ou re-scroller pour rejouer.">
        <p className={cx(styles.tickerDemo, "tabular")}>
          <DecryptNumber value={3300000} unit="ar" />
        </p>
      </LabSection>

      <LabSection title="VelocityMarquee" note="Famille C : défilement continu qui accélère avec la vélocité du scroll.">
        <VelocityMarquee className={styles.marqueeDemo}>
          {["Basés à Antananarivo", "10 casques autonomes", "Animateurs XR formés", "Formats retail"].map(
            (item) => (
              <span key={item} className={styles.marqueeItem}>
                {item} <span className={styles.marqueeDot}>·</span>
              </span>
            ),
          )}
        </VelocityMarquee>
      </LabSection>

      <LabSection title="ContainerScroll" note="Famille C. Le visuel se redresse en entrant (rotateX 12° → 0).">
        <ContainerScroll>
          <GlassPanel className={styles.containerScrollPanel} degradeOffscreen={false}>
            <p className={styles.containerScrollText}>Visuel hero</p>
          </GlassPanel>
        </ContainerScroll>
      </LabSection>

      <LabSection title="TextScrollReveal" note="Famille C : chaque mot passe de 15 % à 100 % au fil du scroll. Une occurrence par page.">
        <TextScrollReveal
          className={styles.tsrDemo}
          text="La VR crée l'effet wow qui capte l'attention dès la première seconde : le public s'arrête, essaie, filme, et votre centre devient le sujet de conversation."
        />
      </LabSection>

      <LabSection title="TracingBeam" note="Famille C. Faisceau vertical suivant le scroll (version mobile de la section Déploiement).">
        <div className={styles.maxXl}>
          <TracingBeam steps={DEMO_STEPS} />
        </div>
      </LabSection>

      <LabSection title="StickyScrollReveal" note="Famille C : section épinglée, desktop uniquement (fallback TracingBeam en mobile).">
        <div className={styles.stickyDesktop}>
          <StickyScrollReveal
            steps={DEMO_STEPS}
            visual={(active) => (
              <GlassPanel className={styles.stickyCounterPanel} degradeOffscreen={false}>
                <p className={styles.stickyCounter}>{active + 1}/5</p>
              </GlassPanel>
            )}
          />
        </div>
        <p className={styles.stickyMobileNote}>Visible en desktop uniquement.</p>
      </LabSection>
    </main>
  );
}
