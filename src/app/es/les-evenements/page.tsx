import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { EvenementsContent } from "@/app/les-evenements/EvenementsContent";
import { esAlternates } from "@/lib/seo/hreflang";

const OG_IMAGE = "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";

export const metadata = {
  title: "Bodas & Eventos en el Desierto de Agafay | Arabian Desert Home",
  description:
    "Organiza tu evento, seminario, boda o team building en el desierto de Agafay. 6 hectáreas de entorno único a 30 km de Marrakech. Presupuesto personalizado en 24 h.",
  keywords: [
    "evento desierto agafay",
    "seminario marrakech desierto",
    "boda desierto marruecos",
    "team building agafay",
    "boda desierto marrakech",
    "evento privado agafay",
    "corporate event agafay morocco",
  ],
  openGraph: {
    locale: "es_ES",
    title: "Eventos y Seminarios en el Desierto de Agafay | Arabian Desert Home",
    description:
      "Boda, seminario o team building en 6 hectáreas de desierto a 30 km de Marrakech. Entorno único, servicio a medida.",
    url: "https://www.arabiandeserthome.ma/es/les-evenements",
    images: [{ url: OG_IMAGE, width: 1344, height: 768, alt: "Eventos desierto Agafay — Arabian Desert Home" }],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Eventos en el Desierto de Agafay | Arabian Desert Home",
    description: "Boda, seminario o team building en 6 hectáreas de desierto a 30 km de Marrakech.",
    images: [OG_IMAGE],
  },
  alternates: esAlternates("/les-evenements"),
};

export default function SpanishEvenementsPage() {
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
