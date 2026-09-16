import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { deleteR2Urls } from "@/lib/r2";
import { notifyIndexNow, localizedUrls } from "@/lib/indexnow";
import { revalidateLocalized } from "@/lib/revalidate";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  const data = await req.json();
  const before = await db.activity.findUnique({ where: { id }, select: { slug: true } });
  const activity = await db.activity.update({ where: { id }, data });
  notifyIndexNow(localizedUrls(`/les-activites/${activity.slug}`));
  revalidateLocalized("/les-activites");
  revalidateLocalized(`/les-activites/${activity.slug}`);
  if (before && before.slug !== activity.slug) revalidateLocalized(`/les-activites/${before.slug}`);
  return NextResponse.json(activity);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  const activity = await db.activity.findUnique({ where: { id } });
  if (activity) {
    const allImages = [activity.image, activity.images].filter(Boolean).join(",");
    if (allImages) await deleteR2Urls(allImages).catch(() => {});
  }
  await db.activity.delete({ where: { id } });
  if (activity) {
    revalidateLocalized("/les-activites");
    revalidateLocalized(`/les-activites/${activity.slug}`);
  }
  return NextResponse.json({ success: true });
}
