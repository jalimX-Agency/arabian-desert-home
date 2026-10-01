import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { ConditionsContent } from "@/app/(fr)/conditions-generales/ConditionsContent";
import { enAlternates } from "@/lib/seo/hreflang";

export const metadata = {
  title: "Terms & Conditions | Arabian Desert Home",
  description: "Arabian Desert Home terms and conditions: prices, confirmation, payment, cancellation, safety and governing law.",
  openGraph: {
    locale: "en_US",
    title: "Terms & Conditions | Arabian Desert Home",
    description: "Arabian Desert Home terms and conditions: prices, confirmation, payment, cancellation, safety and governing law.",
    url: "https://www.arabiandeserthome.ma/en/conditions-generales",
  },
  alternates: enAlternates("/conditions-generales"),
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
