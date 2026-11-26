import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { ReveillonContent } from "@/components/reveillon/ReveillonContent";
import { getReveillonOffer } from "@/lib/reveillon-offer";
import { reveillonJsonLd, reveillonMetadata } from "@/lib/seo/reveillon-seo";

// Seats and tents left are refreshed in the browser; the cached page only seeds them.
export const revalidate = 3600;

export const metadata = reveillonMetadata("es");

export default async function ReveillonPage() {
  const offer = await getReveillonOffer();
  return (
    <div className="min-h-screen flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: reveillonJsonLd("es", offer) }} />
      <Navigation />
      <main className="flex-1">
        <ReveillonContent lang="es" initialOffer={offer} />
      </main>
      <Footer />
    </div>
  );
}
