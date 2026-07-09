import { db } from "@/lib/db";
import { Navigation } from "@/components/arabian/Navigation";
import { HomePage } from "@/components/arabian/HomePage";
import { Footer } from "@/components/arabian/Footer";
import { itAlternates } from "@/lib/seo/hreflang";

export const revalidate = 300;

const OG_IMAGE = "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";

export const metadata = {
  title: "Arabian Desert Home | Bivacco di Lusso e Hotel ad Agafay, Marrakech",
  description:
    "Arabian Desert Home — bivacco di lusso nel deserto di Agafay, a 30 minuti da Marrakech. Suite tenda esclusive, ristorante gourmet, piscina, attività nel deserto (giri in cammello, equitazione) ed eventi sotto le stelle.",
  keywords: [
    "campo di lusso deserto Agafay", "deserto Agafay Marrakech", "campo di lusso Marrakech",
    "glamping Marocco", "tenda di lusso deserto", "Arabian Desert Home",
    "soggiorno deserto Agafay", "day pass Agafay", "matrimonio nel deserto Marrakech",
    "ristorante deserto Agafay", "giro in cammello Agafay", "equitazione deserto Marocco",
    "ritiro di lusso nel deserto Marocco", "deserto Agafay lusso", "hotel Agafay",
  ],
  openGraph: {
    title: "Arabian Desert Home | Bivacco di Lusso — Deserto di Agafay, Marrakech",
    description:
      "Un invito alla fuga nel cuore del deserto di Agafay. Bivacco di lusso su 6 ettari, a soli 30 minuti da Marrakech.",
    url: "https://www.arabiandeserthome.ma/it",
    siteName: "Arabian Desert Home",
    type: "website",
    locale: "it_IT",
    alternateLocale: ["fr_FR"],
    images: [{ url: OG_IMAGE, width: 1344, height: 768, alt: "Arabian Desert Home — Bivacco di Lusso nel Deserto di Agafay" }],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Arabian Desert Home | Bivacco di Lusso — Agafay, Marrakech",
    description: "Un invito alla fuga nel deserto di Agafay. Suite tenda di lusso, ristorante, attività ed eventi a 30 minuti da Marrakech.",
    images: [OG_IMAGE],
  },
  alternates: itAlternates("/"),
};

export default async function ItalianHome() {
  const [suites, galleryImages, testimonials, blogPosts] = await Promise.all([
    db.suite.findMany({ where: { featured: true }, orderBy: { order: "asc" } }),
    db.galleryImage.findMany({ orderBy: { order: "asc" } }),
    db.testimonial.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
    db.blogPost.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
      select: { id: true, title: true, titleEn: true, titleIt: true, slug: true, excerpt: true, excerptEn: true, excerptIt: true, image: true, category: true },
    }),
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <HomePage suites={suites} galleryImages={galleryImages} testimonials={testimonials} blogPosts={blogPosts} />
      </main>
      <Footer />
    </div>
  );
}
