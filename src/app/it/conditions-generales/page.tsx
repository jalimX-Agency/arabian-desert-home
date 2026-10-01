import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { ConditionsContent } from "@/app/(fr)/conditions-generales/ConditionsContent";
import { itAlternates } from "@/lib/seo/hreflang";

export const metadata = {
  title: "Termini e condizioni | Arabian Desert Home",
  description: "Condizioni generali di Arabian Desert Home: prezzi, conferma, pagamento, annullamento, sicurezza e legge applicabile.",
  openGraph: {
    locale: "it_IT",
    title: "Termini e condizioni | Arabian Desert Home",
    description: "Condizioni generali di Arabian Desert Home: prezzi, conferma, pagamento, annullamento, sicurezza e legge applicabile.",
    url: "https://www.arabiandeserthome.ma/it/conditions-generales",
  },
  alternates: itAlternates("/conditions-generales"),
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
