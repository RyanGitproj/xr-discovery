/**
 * Coordonnées et identité du site. Les valeurs de contact sont des
 * PLACEHOLDERS tant que le client n'a pas fourni les vraies — voir TODO.md.
 */
export const siteConfig = {
  name: "XR VR Discovery",
  company: "XR Technology",
  city: "Antananarivo",
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://xr-technologie.com",
  /** Format international sans « + » — numéro WhatsApp de réception des leads. */
  whatsappNumber: "261340000000",
  contactEmail: "contact@xr-technologie.com",
} as const;
