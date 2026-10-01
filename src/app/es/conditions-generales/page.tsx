import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { ConditionsContent } from "@/app/(fr)/conditions-generales/ConditionsContent";
import { esAlternates } from "@/lib/seo/hreflang";

export const metadata = {
  title: "Términos y condiciones | Arabian Desert Home",
  description: "Condiciones generales de Arabian Desert Home: precios, confirmación, pago, cancelación, seguridad y ley aplicable.",
  openGraph: {
    locale: "es_ES",
    title: "Términos y condiciones | Arabian Desert Home",
    description: "Condiciones generales de Arabian Desert Home: precios, confirmación, pago, cancelación, seguridad y ley aplicable.",
    url: "https://www.arabiandeserthome.ma/es/conditions-generales",
  },
  alternates: esAlternates("/conditions-generales"),
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
