/**
 * Filtre SVG global de réfraction (couche 4 du liquid glass, chap. 5.2).
 * Monté une fois dans le layout ; consommé par .glass-panel--liquid via
 * @supports (backdrop-filter: url(#liquid-refract)) — Chromium uniquement.
 */
export function LiquidRefractFilter() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <filter id="liquid-refract" x="0" y="0" width="100%" height="100%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.008 0.008"
          numOctaves="2"
          seed="4"
          result="noise"
        />
        <feGaussianBlur in="noise" stdDeviation="2" result="soft" />
        <feDisplacementMap
          in="SourceGraphic"
          in2="soft"
          scale="48"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </svg>
  );
}
