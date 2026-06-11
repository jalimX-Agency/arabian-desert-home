import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { ActiviteDetailContent } from "./ActiviteDetailContent";

export async function generateStaticParams() {
  const activities = await db.activity.findMany({ select: { slug: true } });
  return activities.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const activity = await db.activity.findUnique({ where: { slug }, select: { name: true, description: true } });
  if (!activity) return {};
  return {
    title: `${activity.name} — Arabian Desert Home`,
    description: activity.description,
  };
}

export default async function ActiviteDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const activity = await db.activity.findUnique({ where: { slug } });
  if (!activity) notFound();

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-20">
        <ActiviteDetailContent activity={activity} />
      </main>
      <Footer />
    </div>
  );
}
