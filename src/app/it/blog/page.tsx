import { db } from "@/lib/db";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { BlogContent } from "@/app/(fr)/blog/BlogContent";
import { itAlternates } from "@/lib/seo/hreflang";

const OG_IMAGE = "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";

export const metadata = {
  title: "Blog | Arabian Desert Home — Deserto di Agafay, Marrakech",
  description: "Articoli e ispirazioni sul deserto di Agafay, il glamping di lusso, le attività e i segreti di Marrakech. Scopri Arabian Desert Home attraverso i nostri racconti.",
  keywords: [
    "blog deserto agafay", "viaggio agafay marrakech", "blog glamping marocco",
    "bivacco di lusso agafay", "attività deserto marrakech", "soggiorno deserto marocco",
  ],
  openGraph: {
    title: "Blog | Arabian Desert Home — Ispirazioni dal Deserto di Agafay",
    description: "Articoli e racconti sul deserto di Agafay, le attività e la vita nel bivacco di lusso a 30 minuti da Marrakech.",
    url: "https://www.arabiandeserthome.ma/it/blog",
    images: [{ url: OG_IMAGE, width: 1344, height: 768, alt: "Blog Arabian Desert Home — Deserto di Agafay" }],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Blog | Arabian Desert Home",
    description: "Articoli e ispirazioni sul deserto di Agafay e il glamping di lusso a Marrakech.",
    images: [OG_IMAGE],
  },
  alternates: itAlternates("/blog"),
};

export const revalidate = 60;

export default async function ItalianBlogPage() {
  const posts = await db.blogPost.findMany({ orderBy: { createdAt: "desc" } });

  const itemListSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Blog Arabian Desert Home — Deserto di Agafay",
    itemListElement: posts.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://www.arabiandeserthome.ma/it/blog/${p.slug}`,
      name: p.titleIt || p.title,
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
