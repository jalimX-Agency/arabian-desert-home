import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { ConditionsContent } from "./ConditionsContent";
import { frAlternates } from "@/lib/seo/hreflang";

export const metadata = {
  title: "Conditions générales | Arabian Desert Home",
  description: "Conditions générales de réservation et d'utilisation d'Arabian Desert Home : prix, confirmation, paiement, annulation, sécurité et droit applicable.",
  openGraph: {
    locale: "fr_FR",
    title: "Conditions générales | Arabian Desert Home",
    description: "Conditions générales de réservation et d'utilisation d'Arabian Desert Home : prix, confirmation, paiement, annulation, sécurité et droit applicable.",
    url: "https://www.arabiandeserthome.ma/conditions-generales",
  },
  alternates: frAlternates("/conditions-generales"),
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <ConditionsContent />
      </main>
      <Footer />
    </div>
  );
}
