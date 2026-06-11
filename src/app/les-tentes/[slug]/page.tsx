import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/arabian/Navigation";
import { Footer } from "@/components/arabian/Footer";
import { TenteDetailContent } from "./TenteDetailContent";

export async function generateStaticParams() {
  const suites = await db.suite.findMany({ select: { slug: true } });
  return suites.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const suite = await db.suite.findUnique({ where: { slug }, select: { name: true, description: true } });
  if (!suite) return {};
  return {
    title: `${suite.name} — Arabian Desert Home`,
    description: suite.description,
  };
}

export default async function TenteDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const suite = await db.suite.findUnique({ where: { slug } });
  if (!suite) notFound();

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-20">
        <TenteDetailContent suite={suite} />
      </main>
      <Footer />
    </div>
  );
}
