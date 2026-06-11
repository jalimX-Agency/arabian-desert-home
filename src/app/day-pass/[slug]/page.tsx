import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { DayPassDetailContent } from "./DayPassDetailContent";

export async function generateStaticParams() {
  const passes = await db.dayPass.findMany({ select: { slug: true } });
  return passes.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pass = await db.dayPass.findUnique({ where: { slug }, select: { name: true, description: true } });
  if (!pass) return {};
  return {
    title: `${pass.name} — Arabian Desert Home`,
    description: pass.description,
  };
}

export default async function DayPassDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pass = await db.dayPass.findUnique({ where: { slug } });
  if (!pass) notFound();

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-20">
        <DayPassDetailContent pass={pass} />
      </main>
      <Footer />
    </div>
  );
}
