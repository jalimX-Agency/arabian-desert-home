import { db } from "@/lib/db";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { BlogContent } from "@/app/blog/BlogContent";
import { esAlternates } from "@/lib/seo/hreflang";

const OG_IMAGE = "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";

export const metadata = {
  title: "Blog | Arabian Desert Home — Desierto de Agafay, Marrakech",
  description: "Artículos e inspiración sobre el desierto de Agafay, el glamping de lujo, las actividades y los secretos de Marrakech. Descubre Arabian Desert Home a través de nuestras historias.",
  keywords: [
    "blog desierto agafay", "viaje agafay marrakech", "blog glamping marruecos",
    "bivouac de lujo agafay", "actividades desierto marrakech", "estancia desierto marruecos",
  ],
  openGraph: {
    title: "Blog | Arabian Desert Home — Inspiraciones del Desierto de Agafay",
    description: "Artículos e historias sobre el desierto de Agafay, actividades y la vida en un bivouac de lujo a 30 min de Marrakech.",
    url: "https://www.arabiandeserthome.ma/es/blog",
    images: [{ url: OG_IMAGE, width: 1344, height: 768, alt: "Blog Arabian Desert Home — Desierto de Agafay" }],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Blog | Arabian Desert Home",
    description: "Artículos e inspiración sobre el desierto de Agafay y el glamping de lujo en Marrakech.",
    images: [OG_IMAGE],
  },
  alternates: esAlternates("/blog"),
};

export const revalidate = 60;

export default async function SpanishBlogPage() {
  const posts = await db.blogPost.findMany({ orderBy: { createdAt: "desc" } });

  const itemListSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Blog Arabian Desert Home — Desierto de Agafay",
    itemListElement: posts.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://www.arabiandeserthome.ma/es/blog/${p.slug}`,
      name: p.titleEs || p.title,
    })),
  });

  return (
    <div className="min-h-screen flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: itemListSchema }} />
      <Navigation />
      <main className="flex-1 pt-20">
        <BlogContent posts={posts} />
      </main>
      <Footer />
    </div>
  );
}
