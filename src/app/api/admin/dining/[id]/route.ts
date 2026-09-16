import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { revalidateLocalized } from "@/lib/revalidate";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  const data = await req.json();
  const venue = await db.diningVenue.update({ where: { id }, data });
  revalidateLocalized("/restaurant");
  return NextResponse.json(venue);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  await db.diningVenue.delete({ where: { id } });
  revalidateLocalized("/restaurant");
  return NextResponse.json({ success: true });
}
