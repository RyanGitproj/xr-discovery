/**
 * Lien WhatsApp pré-rempli : numéro au format international sans « + »
 * ni espaces, texte encodé. https://wa.me/261xxxxxxxxx?text=...
 */
export function buildWhatsAppLink(phone: string, text: string): string {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}
