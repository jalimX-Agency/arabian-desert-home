import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { deleteR2Urls } from "@/lib/r2";

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function uniqueSlug(base: string, excludeId: string): Promise<string> {
  let slug = base;
  let i = 1;
  while (true) {
    const existing = await db.blogPost.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    slug = `${base}-${i++}`;
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  const data = await req.json();
  const existing = await db.blogPost.findUnique({ where: { id }, select: { image: true, title: true } });
  if (existing?.image && data.image !== undefined && data.image !== existing.image) {
    await deleteR2Urls(existing.image).catch(() => {});
  }
  if (data.title && data.title !== existing?.title) {
    data.slug = await uniqueSlug(toSlug(data.title), id);
  }
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
