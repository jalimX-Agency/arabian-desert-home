import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";

export async function GET() {
  const deny = await requireAdmin();
  if (deny) return deny;
  const images = await db.galleryImage.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(images);
}

export async function POST(req: NextRequest) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const data = await req.json();
  const image = await db.galleryImage.create({ data });
  return NextResponse.json(image, { status: 201 });
}
