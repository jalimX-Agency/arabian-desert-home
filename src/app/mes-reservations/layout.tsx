import type { Metadata } from "next";

// Private, token-gated pages: never index them or follow links from them.
export const metadata: Metadata = {
  title: "Arabian Desert Home",
  robots: { index: false, follow: false, nocache: true },
};

export default function PrivateReservationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
