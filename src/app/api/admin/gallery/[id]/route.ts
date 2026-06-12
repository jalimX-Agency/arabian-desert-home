import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { deleteR2Urls } from "@/lib/r2";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  const data = await req.json();
  const image = await db.galleryImage.update({ where: { id }, data });
  return NextResponse.json(image);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  const image = await db.galleryImage.findUnique({ where: { id } });
  if (image?.url) {
    await deleteR2Urls(image.url).catch(() => {});
  }
  await db.galleryImage.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
