import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Token-gated, not admin-gated: the access token in the URL IS the auth —
// this is the guest's own "manage my reservation" link from their
// confirmation email. Never expose other reservations here.

async function loadReservation(token: string) {
  return db.reservation.findUnique({
    where: { accessToken: token },
    include: {
      items: {
        include: { suite: true, activity: true, dayPass: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const reservation = await loadReservation(token);
  if (!reservation) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(reservation);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const reservation = await loadReservation(token);
  if (!reservation) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const { action } = body as { action?: string };

  if (action === "cancelItem") {
    const { itemId } = body as { itemId?: string };
    const item = reservation.items.find((i) => i.id === itemId);
    if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });
    if (item.status === "cancelled") {
      return NextResponse.json({ error: "Already cancelled" }, { status: 400 });
    }
    await db.booking.update({ where: { id: item.id }, data: { status: "cancelled" } });
  } else if (action === "cancelAll") {
    await db.booking.updateMany({
      where: { reservationId: reservation.id, status: { not: "cancelled" } },
      data: { status: "cancelled" },
    });
  } else if (action === "updateSpecialReqs") {
    const { specialReqs } = body as { specialReqs?: string };
    await db.reservation.update({ where: { id: reservation.id }, data: { specialReqs: specialReqs || null } });
  } else {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const updated = await loadReservation(token);
  return NextResponse.json(updated);
}
