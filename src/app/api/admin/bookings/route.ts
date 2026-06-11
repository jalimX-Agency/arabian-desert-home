import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";

export async function GET() {
  const deny = await requireAdmin();
  if (deny) return deny;
  const bookings = await db.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: { suite: { select: { name: true } } },
  });
  return NextResponse.json(bookings);
}
