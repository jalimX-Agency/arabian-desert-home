import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { revalidateLocalized } from "@/lib/revalidate";

export async function GET() {
  const deny = await requireAdmin();
  if (deny) return deny;
  const venues = await db.diningVenue.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(venues);
}

export async function POST(req: NextRequest) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const data = await req.json();
  const venue = await db.diningVenue.create({ data });
  revalidateLocalized("/restaurant");
  return NextResponse.json(venue, { status: 201 });
}
