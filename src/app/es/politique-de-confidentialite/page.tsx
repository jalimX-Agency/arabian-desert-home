import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { PrivacyContent } from "@/app/(fr)/politique-de-confidentialite/PrivacyContent";
import { esAlternates } from "@/lib/seo/hreflang";

export const metadata = {
  title: "Política de privacidad | Arabian Desert Home",
  description: "Qué datos recoge Arabian Desert Home, para qué, cuánto tiempo se conservan, sus derechos y la gestión de cookies.",
  openGraph: {
    locale: "es_ES",
    title: "Política de privacidad | Arabian Desert Home",
    description: "Qué datos recoge Arabian Desert Home, para qué, cuánto tiempo se conservan, sus derechos y la gestión de cookies.",
    url: "https://www.arabiandeserthome.ma/es/politique-de-confidentialite",
  },
  alternates: esAlternates("/politique-de-confidentialite"),
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
