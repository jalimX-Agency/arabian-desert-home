import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";

export async function GET() {
  const deny = await requireAdmin();
  if (deny) return deny;

  try {
    const [
      totalBookings,
      pendingBookings,
      confirmedBookings,
      unreadMessages,
      totalMessages,
      totalSuites,
      totalActivities,
      recentBookings,
      recentMessages,
    ] = await Promise.all([
      db.booking.count(),
      db.booking.count({ where: { status: "pending" } }),
      db.booking.count({ where: { status: "confirmed" } }),
      db.contactMessage.count({ where: { read: false } }),
      db.contactMessage.count(),
      db.suite.count(),
      db.activity.count(),
      db.booking.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { suite: { select: { name: true } } },
      }),
      db.contactMessage.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
    ]);

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
