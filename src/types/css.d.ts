import "react";

/**
 * Autorise les variables CSS (--meteor-dur, --beam-delay...) dans la prop
 * style — les primitives fx pilotent leurs réglages par custom properties.
 */
declare module "react" {
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined;
  }
}
