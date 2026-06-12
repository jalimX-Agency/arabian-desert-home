import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { deleteR2Urls } from "@/lib/r2";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  const data = await req.json();
  const post = await db.blogPost.update({ where: { id }, data });
  return NextResponse.json(post);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  const post = await db.blogPost.findUnique({ where: { id } });
  if (post?.image) await deleteR2Urls(post.image).catch(() => {});
  await db.blogPost.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
