import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FX Lab, laboratoire des primitives",
  robots: { index: false, follow: false },
};

export default function FxLabLayout({ children }: { children: React.ReactNode }) {
  return children;
}
