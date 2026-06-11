import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { deleteR2Urls } from "@/lib/r2";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  const data = await req.json();
  const suite = await db.suite.update({ where: { id }, data });
  return NextResponse.json(suite);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  const suite = await db.suite.findUnique({ where: { id } });
  if (suite) {
    const allImages = [suite.image, suite.images].filter(Boolean).join(",");
    if (allImages) await deleteR2Urls(allImages).catch(() => {});
  }
  await db.suite.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
