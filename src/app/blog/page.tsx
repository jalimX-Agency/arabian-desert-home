import { db } from "@/lib/db";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { BlogContent } from "./BlogContent";

const OG_IMAGE = "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";

export const metadata = {
  title: "Blog | Arabian Desert Home — Désert Agafay, Marrakech",
  description: "Articles et inspirations sur le désert d'Agafay, le glamping de luxe, les activités et les secrets de Marrakech. Découvrez Arabian Desert Home à travers nos récits.",
  keywords: [
    "blog désert agafay", "agafay marrakech voyage", "glamping maroc blog",
    "bivouac luxe agafay", "activités marrakech désert", "séjour désert maroc",
  ],
  openGraph: {
    title: "Blog | Arabian Desert Home — Inspirations Désert Agafay",
    description: "Articles et récits sur le désert d'Agafay, les activités et la vie en bivouac de luxe à 30 min de Marrakech.",
    url: "https://www.arabiandeserthome.ma/blog",
    images: [{ url: OG_IMAGE, width: 1344, height: 768, alt: "Blog Arabian Desert Home — Désert Agafay" }],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Blog | Arabian Desert Home",
    description: "Articles et inspirations sur le désert d'Agafay et le glamping de luxe à Marrakech.",
    images: [OG_IMAGE],
  },
  alternates: { canonical: "https://www.arabiandeserthome.ma/blog" },
};

export default async function BlogPage() {
  const posts = await db.blogPost.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-20">
        <BlogContent posts={posts} />
      </main>
      <Footer />
    </div>
  );
}
