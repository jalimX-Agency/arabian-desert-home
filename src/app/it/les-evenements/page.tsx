import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { EvenementsContent } from "@/app/les-evenements/EvenementsContent";
import { itAlternates } from "@/lib/seo/hreflang";

const OG_IMAGE = "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";

export const metadata = {
  title: "Matrimoni & Eventi nel Deserto di Agafay | Arabian Desert Home",
  description:
    "Organizza il tuo evento, seminario, matrimonio o team building nel deserto di Agafay. 6 ettari di ambientazione unica a 30 km da Marrakech. Preventivo personalizzato entro 24 ore.",
  keywords: [
    "evento deserto agafay",
    "seminario marrakech deserto",
    "matrimonio deserto marocco",
    "team building agafay",
    "matrimonio deserto marrakech",
    "evento privato agafay",
    "corporate event agafay morocco",
  ],
  openGraph: {
    title: "Eventi e Seminari nel Deserto di Agafay | Arabian Desert Home",
    description:
      "Matrimonio, seminario o team building su 6 ettari di deserto a 30 km da Marrakech. Ambientazione unica, servizio su misura.",
    url: "https://www.arabiandeserthome.ma/it/les-evenements",
    images: [{ url: OG_IMAGE, width: 1344, height: 768, alt: "Eventi deserto Agafay — Arabian Desert Home" }],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Eventi nel Deserto di Agafay | Arabian Desert Home",
    description: "Matrimonio, seminario o team building su 6 ettari di deserto a 30 km da Marrakech.",
    images: [OG_IMAGE],
  },
  alternates: itAlternates("/les-evenements"),
};

export default function ItalianEvenementsPage() {
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
