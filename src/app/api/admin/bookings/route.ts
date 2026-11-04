import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { sumMoney } from "@/lib/money";

export async function GET() {
  const deny = await requireAdmin();
  if (deny) return deny;
  const bookings = await db.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      suite: { select: { name: true } },
      activity: { select: { name: true } },
      dayPass: { select: { name: true } },
      reservation: { select: { id: true, accessToken: true, totalAmount: true, currency: true, channel: true, lang: true, reviewRequestSentAt: true, payments: { select: { amount: true } }, _count: { select: { items: true } } } },
    },
  });
  // The list only needs how much has been received, not the payment rows themselves.
  return NextResponse.json(bookings.map((b) => {
    if (!b.reservation) return b;
    const { payments, ...reservation } = b.reservation;
    return { ...b, reservation: { ...reservation, paid: sumMoney(payments.map((p) => p.amount)) } };
  }));
}
