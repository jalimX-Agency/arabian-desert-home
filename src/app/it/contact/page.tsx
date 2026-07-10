import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { ContactContent } from "@/app/contact/ContactContent";
import { itAlternates } from "@/lib/seo/hreflang";

const OG_IMAGE = "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";

export const metadata = {
  title: "Contatto | Arabian Desert Home — Deserto di Agafay, Marrakech",
  description:
    "Contatta Arabian Desert Home per qualsiasi domanda o prenotazione. Situati a 30 km da Marrakech nel deserto di Agafay. Risposta entro 24 ore.",
  keywords: [
    "contatto arabian desert home",
    "prenotazione bivacco agafay",
    "contatto deserto agafay marrakech",
    "arabian desert home telefono",
  ],
  openGraph: {
    locale: "it_IT",
    title: "Contatto Arabian Desert Home | Bivacco di Lusso Agafay",
    description: "Contattaci per prenotare il tuo soggiorno nel deserto di Agafay. Risposta garantita entro 24 ore.",
    url: "https://www.arabiandeserthome.ma/it/contact",
    images: [{ url: OG_IMAGE, width: 1344, height: 768, alt: "Contatto Arabian Desert Home" }],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Contatto | Arabian Desert Home",
    description: "Contattaci per prenotare il tuo soggiorno nel deserto di Agafay.",
    images: [OG_IMAGE],
  },
  alternates: itAlternates("/contact"),
};

export default function ItalianContactPage() {
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
