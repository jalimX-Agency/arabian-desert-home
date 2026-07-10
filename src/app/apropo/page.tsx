import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { ApropoContent } from "./ApropoContent";

export default function ApropoPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-20">
        <ApropoContent />
      </main>
      <Footer />
    </div>
  );
}
