import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { EvenementsContent } from "@/app/les-evenements/EvenementsContent";
import { enAlternates } from "@/lib/seo/hreflang";

const OG_IMAGE = "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";

export const metadata = {
  title: "Weddings & Events in the Agafay Desert | Arabian Desert Home",
  description:
    "Organize your event, seminar, wedding or team building in the Agafay desert. 6 hectares of unique setting 30 km from Marrakech. Personalized quote within 24h.",
  keywords: [
    "agafay desert event",
    "marrakech desert seminar",
    "desert wedding morocco",
    "agafay team building",
    "marrakech desert wedding",
    "private event agafay",
    "corporate event agafay morocco",
  ],
  openGraph: {
    locale: "en_US",
    title: "Events & Seminars in the Agafay Desert | Arabian Desert Home",
    description:
      "Wedding, seminar or team building on 6 hectares of desert 30 km from Marrakech. Unique setting, tailor-made service.",
    url: "https://www.arabiandeserthome.ma/en/les-evenements",
    images: [{ url: OG_IMAGE, width: 1344, height: 768, alt: "Agafay desert events — Arabian Desert Home" }],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Events in the Agafay Desert | Arabian Desert Home",
    description: "Wedding, seminar or team building on 6 hectares of desert 30 km from Marrakech.",
    images: [OG_IMAGE],
  },
  alternates: enAlternates("/les-evenements"),
};

export default function EnglishEvenementsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-20">
        <EvenementsContent />
      </main>
      <Footer />
    </div>
  );
}
