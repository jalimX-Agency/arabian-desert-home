import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";

function getServiceName(b: {
  serviceType: string;
  quantity: number;
  suite: { name: string } | null;
  activity: { name: string } | null;
  dayPass: { name: string } | null;
}): string {
  const base =
    b.serviceType === "suite" ? b.suite?.name ?? "—" :
    b.serviceType === "activity" ? b.activity?.name ?? "—" :
    b.serviceType === "daypass" ? b.dayPass?.name ?? "—" : "—";
  return b.quantity > 1 ? `${base} × ${b.quantity}` : base;
}

export async function GET() {
  const deny = await requireAdmin();
  if (deny) return deny;

  try {
    const [
      unreadMessages,
      totalMessages,
      totalSuites,
      totalActivities,
      bookings,
      recentMessages,
    ] = await Promise.all([
      db.contactMessage.count({ where: { read: false } }),
      db.contactMessage.count(),
      db.suite.count(),
      db.activity.count(),
      db.booking.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          reservationId: true,
          firstName: true,
          lastName: true,
          status: true,
          totalAmount: true,
          currency: true,
          createdAt: true,
          checkIn: true,
          serviceType: true,
          quantity: true,
          suite: { select: { name: true } },
          activity: { select: { name: true } },
          dayPass: { select: { name: true } },
        },
      }),
      db.contactMessage.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    // Group line-item bookings back into one reservation per customer submission —
    // same grouping the admin reservations table uses — so the counts and the
    // "Dernières réservations" list reflect actual reservations, not raw items.
    const groups = new Map<string, typeof bookings>();
    for (const b of bookings) {
      const key = b.reservationId ?? b.id;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(b);
    }
    const reservations = Array.from(groups.values());

    const totalBookings = reservations.length;
    const pendingBookings = reservations.filter((r) => r[0].status === "pending").length;
    const confirmedBookings = reservations.filter((r) => r[0].status === "confirmed").length;

    const recentBookings = reservations.slice(0, 10).map((items) => {
      const primary = items[0];
      const totalAmount = items.reduce((sum, b) => sum + b.totalAmount, 0);
      return {
        id: primary.reservationId ?? primary.id,
        firstName: primary.firstName,
        lastName: primary.lastName,
        serviceName: getServiceName(primary),
        itemCount: items.length,
        checkIn: primary.checkIn,
        status: primary.status,
        totalAmount,
        currency: primary.currency,
      };
    });

    return NextResponse.json({
      totalBookings,
      pendingBookings,
      confirmedBookings,
      unreadMessages,
      totalMessages,
      totalSuites,
      totalActivities,
      recentBookings,
      recentMessages,
    });
  } catch {
    return NextResponse.json({
      totalBookings: 0,
      pendingBookings: 0,
      confirmedBookings: 0,
      unreadMessages: 0,
      totalMessages: 0,
      totalSuites: 0,
      totalActivities: 0,
      recentBookings: [],
      recentMessages: [],
      error: "Base de données temporairement indisponible",
    });
  }
}
