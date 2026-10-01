import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { PrivacyContent } from "@/app/(fr)/politique-de-confidentialite/PrivacyContent";
import { itAlternates } from "@/lib/seo/hreflang";

export const metadata = {
  title: "Informativa sulla privacy | Arabian Desert Home",
  description: "Quali dati raccoglie Arabian Desert Home, perché, per quanto tempo vengono conservati, i vostri diritti e la gestione dei cookie.",
  openGraph: {
    locale: "it_IT",
    title: "Informativa sulla privacy | Arabian Desert Home",
    description: "Quali dati raccoglie Arabian Desert Home, perché, per quanto tempo vengono conservati, i vostri diritti e la gestione dei cookie.",
    url: "https://www.arabiandeserthome.ma/it/politique-de-confidentialite",
  },
  alternates: itAlternates("/politique-de-confidentialite"),
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
