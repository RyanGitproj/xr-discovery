"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/tracking/attribution";

/** Capture l'attribution (UTM/pub) au premier rendu — monté une fois dans le layout. */
export function AttributionCapture() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}
