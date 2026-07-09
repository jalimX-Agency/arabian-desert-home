import { db } from "@/lib/db";
import { Navigation } from "@/components/arabian/Navigation";
import { HomePage } from "@/components/arabian/HomePage";
import { Footer } from "@/components/arabian/Footer";
import { esAlternates } from "@/lib/seo/hreflang";

export const revalidate = 300;

const OG_IMAGE = "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";

export const metadata = {
  title: "Arabian Desert Home | Bivouac de Lujo y Hotel en Agafay, Marrakech",
  description:
    "Arabian Desert Home — bivouac de lujo en el desierto de Agafay, a 30 minutos de Marrakech. Suites de jaimas exclusivas, restaurante gourmet, piscina, actividades en el desierto (paseos en camello, equitación) y eventos bajo las estrellas.",
  keywords: [
    "campamento de lujo Agafay", "desierto de Agafay Marrakech", "campamento de lujo Marrakech",
    "glamping Marruecos", "jaima de lujo desierto", "Arabian Desert Home",
    "estancia desierto Agafay", "day pass Agafay", "boda en el desierto Marrakech",
    "restaurante desierto Agafay", "paseo en camello Agafay", "equitación desierto Marruecos",
    "retiro de lujo desierto Marruecos", "Agafay desierto de lujo", "hotel Agafay",
  ],
  openGraph: {
    title: "Arabian Desert Home | Bivouac de Lujo — Desierto de Agafay, Marrakech",
    description:
      "Una invitación a evadirse en el corazón del desierto de Agafay. Bivouac de lujo en 6 hectáreas, a solo 30 minutos de Marrakech.",
    url: "https://www.arabiandeserthome.ma/es",
    siteName: "Arabian Desert Home",
    type: "website",
    locale: "es_ES",
    alternateLocale: ["fr_FR"],
    images: [{ url: OG_IMAGE, width: 1344, height: 768, alt: "Arabian Desert Home — Bivouac de Lujo en el Desierto de Agafay" }],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Arabian Desert Home | Bivouac de Lujo — Agafay, Marrakech",
    description: "Una invitación a evadirse en el desierto de Agafay. Suites de jaimas de lujo, restaurante, actividades y eventos a 30 min de Marrakech.",
    images: [OG_IMAGE],
  },
  alternates: esAlternates("/"),
};

export default async function SpanishHome() {
  const [suites, galleryImages, testimonials, blogPosts] = await Promise.all([
    db.suite.findMany({ where: { featured: true }, orderBy: { order: "asc" } }),
    db.galleryImage.findMany({ orderBy: { order: "asc" } }),
    db.testimonial.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
    db.blogPost.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
      select: { id: true, title: true, titleEn: true, titleEs: true, slug: true, excerpt: true, excerptEn: true, excerptEs: true, image: true, category: true },
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
