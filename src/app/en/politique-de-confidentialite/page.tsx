import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { PrivacyContent } from "@/app/(fr)/politique-de-confidentialite/PrivacyContent";
import { enAlternates } from "@/lib/seo/hreflang";

export const metadata = {
  title: "Privacy Policy | Arabian Desert Home",
  description: "Which data Arabian Desert Home collects, why, how long it is kept, your rights and how cookies are managed.",
  openGraph: {
    locale: "en_US",
    title: "Privacy Policy | Arabian Desert Home",
    description: "Which data Arabian Desert Home collects, why, how long it is kept, your rights and how cookies are managed.",
    url: "https://www.arabiandeserthome.ma/en/politique-de-confidentialite",
  },
  alternates: enAlternates("/politique-de-confidentialite"),
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
