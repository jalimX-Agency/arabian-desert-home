import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { ApropoContent } from "@/app/(fr)/apropo/ApropoContent";
import { enAlternates } from "@/lib/seo/hreflang";

const OG_IMAGE = "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";

export const metadata = {
  title: "About Us | Arabian Desert Home — Our Story, Agafay Desert",
  description:
    "Discover the story of Arabian Desert Home, a luxury bivouac in the Agafay desert for several years. 6 hectares of preserved nature 30 km from Marrakech.",
  keywords: [
    "about arabian desert home",
    "agafay bivouac story",
    "about arabian desert home",
    "luxury camp agafay morocco story",
  ],
  openGraph: {
    locale: "en_US",
    title: "About Us | Arabian Desert Home — Luxury Agafay Bivouac",
    description: "Discover the story and values of Arabian Desert Home, a luxury bivouac in the Agafay desert.",
    url: "https://www.arabiandeserthome.ma/en/apropo",
    images: [{ url: OG_IMAGE, width: 1344, height: 768, alt: "About Arabian Desert Home" }],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "About Us | Arabian Desert Home",
    description: "The story of Arabian Desert Home, a luxury bivouac in the Agafay desert.",
    images: [OG_IMAGE],
  },
  alternates: enAlternates("/apropo"),
};

export default function EnglishApropoPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-20">
        <ApropoContent />
      </main>
      <Footer />
    </div>
  );
}
