import { db } from "@/lib/db";
import { Navigation } from "@/components/arabian/Navigation";
import { HomePage } from "@/components/arabian/HomePage";
import { Footer } from "@/components/arabian/Footer";
import { enAlternates } from "@/lib/seo/hreflang";

export const revalidate = 300;

const OG_IMAGE = "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";

export const metadata = {
  title: "Arabian Desert Home | Luxury Bivouac & Hotel in Agafay, Marrakech",
  description:
    "Arabian Desert Home — luxury bivouac in the Agafay desert, 30 minutes from Marrakech. Exclusive tent suites, gourmet restaurant, pool, desert activities (camel rides, horseback riding) and events under the stars.",
  keywords: [
    "luxury desert camp Agafay", "Agafay desert Marrakech", "luxury camp Marrakech",
    "Morocco glamping", "luxury desert tent", "Arabian Desert Home",
    "Agafay desert stay", "Agafay day pass", "desert wedding Marrakech",
    "Agafay desert restaurant", "Agafay camel ride", "Morocco desert horseback riding",
    "luxury desert retreat Morocco", "Agafay desert luxury", "hotel Agafay",
  ],
  openGraph: {
    title: "Arabian Desert Home | Luxury Bivouac — Agafay Desert, Marrakech",
    description:
      "An invitation to escape in the heart of the Agafay desert. Luxury bivouac on 6 hectares, just 30 minutes from Marrakech.",
    url: "https://www.arabiandeserthome.ma/en",
    siteName: "Arabian Desert Home",
    type: "website",
    locale: "en_US",
    alternateLocale: ["fr_FR"],
    images: [{ url: OG_IMAGE, width: 1344, height: 768, alt: "Arabian Desert Home — Luxury Bivouac in the Agafay Desert" }],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Arabian Desert Home | Luxury Bivouac — Agafay, Marrakech",
    description: "An invitation to escape in the Agafay desert. Luxury tent suites, restaurant, activities and events 30 min from Marrakech.",
    images: [OG_IMAGE],
  },
  alternates: enAlternates("/"),
};

export default async function EnglishHome() {
  const [suites, galleryImages, testimonials, blogPosts] = await Promise.all([
    db.suite.findMany({ where: { featured: true }, orderBy: { order: "asc" } }),
    db.galleryImage.findMany({ orderBy: { order: "asc" } }),
    db.testimonial.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
    db.blogPost.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
      select: { id: true, title: true, titleEn: true, slug: true, excerpt: true, excerptEn: true, image: true, category: true },
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
