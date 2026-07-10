import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { ContactContent } from "@/app/contact/ContactContent";
import { esAlternates } from "@/lib/seo/hreflang";

const OG_IMAGE = "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";

export const metadata = {
  title: "Contacto | Arabian Desert Home — Desierto de Agafay, Marrakech",
  description:
    "Contacta con Arabian Desert Home para cualquier pregunta o reserva. Situados a 30 km de Marrakech en el desierto de Agafay. Respuesta en 24 horas.",
  keywords: [
    "contacto arabian desert home",
    "reserva bivouac agafay",
    "contacto desierto agafay marrakech",
    "arabian desert home telefono",
  ],
  openGraph: {
    title: "Contacto Arabian Desert Home | Bivouac de Lujo Agafay",
    description: "Contáctanos para reservar tu estancia en el desierto de Agafay. Respuesta garantizada en 24 horas.",
    url: "https://www.arabiandeserthome.ma/es/contact",
    images: [{ url: OG_IMAGE, width: 1344, height: 768, alt: "Contacto Arabian Desert Home" }],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Contacto | Arabian Desert Home",
    description: "Contáctanos para reservar tu estancia en el desierto de Agafay.",
    images: [OG_IMAGE],
  },
  alternates: esAlternates("/contact"),
};

export default function SpanishContactPage() {
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
