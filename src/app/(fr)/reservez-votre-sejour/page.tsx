import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { ReservationContent } from "./ReservationContent";

export default function ReservezPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-20">
        <ReservationContent />
      </main>
      <Footer />
    </div>
  );
}
