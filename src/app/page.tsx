import { db } from "@/lib/db";

export const revalidate = 300;
import { Navigation } from "@/components/arabian/Navigation";
import { HomePage } from "@/components/arabian/HomePage";
import { Footer } from "@/components/arabian/Footer";

export default async function Home() {
  const [suites, galleryImages, testimonials] = await Promise.all([
    db.suite.findMany({ where: { featured: true }, orderBy: { order: "asc" } }),
    db.galleryImage.findMany({ orderBy: { order: "asc" } }),
    db.testimonial.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <HomePage suites={suites} galleryImages={galleryImages} testimonials={testimonials} />
      </main>
      <Footer />
    </div>
  );
}
