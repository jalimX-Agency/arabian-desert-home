import { db } from "@/lib/db";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { BlogContent } from "@/app/(fr)/blog/BlogContent";
import { enAlternates } from "@/lib/seo/hreflang";

const OG_IMAGE = "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";

export const metadata = {
  title: "Blog | Arabian Desert Home — Agafay Desert, Marrakech",
  description: "Articles and inspiration about the Agafay desert, luxury glamping, activities and Marrakech's secrets. Discover Arabian Desert Home through our stories.",
  keywords: [
    "agafay desert blog", "agafay marrakech travel", "morocco glamping blog",
    "luxury bivouac agafay", "marrakech desert activities", "morocco desert stay",
  ],
  openGraph: {
    title: "Blog | Arabian Desert Home — Agafay Desert Inspirations",
    description: "Articles and stories about the Agafay desert, activities and luxury bivouac life 30 min from Marrakech.",
    url: "https://www.arabiandeserthome.ma/en/blog",
    images: [{ url: OG_IMAGE, width: 1344, height: 768, alt: "Blog Arabian Desert Home — Agafay Desert" }],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Blog | Arabian Desert Home",
    description: "Articles and inspiration about the Agafay desert and luxury glamping in Marrakech.",
    images: [OG_IMAGE],
  },
  alternates: enAlternates("/blog"),
};

export const revalidate = 60;

export default async function EnglishBlogPage() {
  const posts = await db.blogPost.findMany({ orderBy: { createdAt: "desc" } });

  const itemListSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Blog Arabian Desert Home — Agafay Desert",
    itemListElement: posts.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://www.arabiandeserthome.ma/en/blog/${p.slug}`,
      name: p.titleEn || p.title,
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
