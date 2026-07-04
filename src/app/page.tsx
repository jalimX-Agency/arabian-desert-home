import { db } from "@/lib/db";

export const revalidate = 300;
import { Navigation } from "@/components/arabian/Navigation";
import { HomePage } from "@/components/arabian/HomePage";
import { Footer } from "@/components/arabian/Footer";

export default async function Home() {
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
