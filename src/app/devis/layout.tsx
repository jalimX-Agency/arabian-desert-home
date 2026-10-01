import type { Metadata } from "next";

// Private, token-gated quote pages: never index them or follow links from them.
export const metadata: Metadata = {
  title: "Arabian Desert Home",
  robots: { index: false, follow: false, nocache: true },
};

export default function PrivateQuoteLayout({ children }: { children: React.ReactNode }) {
  return children;
}
