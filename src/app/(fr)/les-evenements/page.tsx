import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { EvenementsContent } from "./EvenementsContent";

export default function EvenementsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-20">
        <EvenementsContent />
      </main>
      <Footer />
    </div>
  );
}
