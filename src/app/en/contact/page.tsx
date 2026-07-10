import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { ContactContent } from "@/app/(fr)/contact/ContactContent";
import { enAlternates } from "@/lib/seo/hreflang";

const OG_IMAGE = "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";

export const metadata = {
  title: "Contact | Arabian Desert Home — Agafay Desert, Marrakech",
  description:
    "Contact Arabian Desert Home for any question or reservation. Located 30 km from Marrakech in the Agafay desert. Response within 24 hours.",
  keywords: [
    "contact arabian desert home",
    "agafay bivouac reservation",
    "contact agafay desert marrakech",
    "arabian desert home phone",
  ],
  openGraph: {
    locale: "en_US",
    title: "Contact Arabian Desert Home | Luxury Agafay Bivouac",
    description: "Contact us to book your stay in the Agafay desert. Guaranteed response within 24 hours.",
    url: "https://www.arabiandeserthome.ma/en/contact",
    images: [{ url: OG_IMAGE, width: 1344, height: 768, alt: "Contact Arabian Desert Home" }],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Contact | Arabian Desert Home",
    description: "Contact us to book your stay in the Agafay desert.",
    images: [OG_IMAGE],
  },
  alternates: enAlternates("/contact"),
};

export default function EnglishContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-20">
        <ContactContent />
      </main>
      <Footer />
    </div>
  );
}
