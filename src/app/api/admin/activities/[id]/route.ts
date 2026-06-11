import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { deleteR2Urls } from "@/lib/r2";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  const data = await req.json();
  const activity = await db.activity.update({ where: { id }, data });
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
  return NextResponse.json({ success: true });
}
