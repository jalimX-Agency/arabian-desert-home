import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { deleteR2Urls } from "@/lib/r2";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  const data = await req.json();
  const pass = await db.dayPass.update({ where: { id }, data });
  return NextResponse.json(pass);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  const pass = await db.dayPass.findUnique({ where: { id } });
  if (pass?.image) await deleteR2Urls(pass.image).catch(() => {});
  await db.dayPass.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
