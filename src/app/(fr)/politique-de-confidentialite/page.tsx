import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { PrivacyContent } from "./PrivacyContent";
import { frAlternates } from "@/lib/seo/hreflang";

export const metadata = {
  title: "Politique de confidentialité | Arabian Desert Home",
  description: "Quelles données Arabian Desert Home collecte, pourquoi, combien de temps elles sont conservées, vos droits et la gestion des cookies.",
  openGraph: {
    locale: "fr_FR",
    title: "Politique de confidentialité | Arabian Desert Home",
    description: "Quelles données Arabian Desert Home collecte, pourquoi, combien de temps elles sont conservées, vos droits et la gestion des cookies.",
    url: "https://www.arabiandeserthome.ma/politique-de-confidentialite",
  },
  alternates: frAlternates("/politique-de-confidentialite"),
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <PrivacyContent />
      </main>
      <Footer />
    </div>
  );
}
