import { describe, expect, it } from "vitest";
import { buildWhatsAppLink } from "./whatsapp";

describe("buildWhatsAppLink", () => {
  it("nettoie le numéro et encode le texte", () => {
    expect(buildWhatsAppLink("+261 34 00 000 00", "Bonjour XR !")).toBe(
      "https://wa.me/261340000000?text=Bonjour%20XR%20!",
    );
  });

  it("accepte un numéro déjà nu", () => {
    expect(buildWhatsAppLink("261340000000", "a b")).toBe("https://wa.me/261340000000?text=a%20b");
  });
});
