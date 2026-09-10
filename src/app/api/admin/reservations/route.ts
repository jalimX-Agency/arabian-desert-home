import { NextRequest, NextResponse, after } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { priceCartItem, type CartItemInput } from "@/lib/reservation-item";
import { sendReservationConfirmation, sendReservationConfirmedEmail } from "@/lib/email";
import { buildFicheHtml, generateFichePdf } from "@/lib/fiche-pdf";

export const maxDuration = 60;

/** Manual reservation creation for the admin panel — phone/WhatsApp/OTA bookings that
 *  didn't come through the public site's wizard. Reuses the same seasonal-aware
 *  pricing as the public /api/bookings route. */
export async function POST(req: NextRequest) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const body = await req.json();
  const {
    firstName, lastName, email, phone, specialReqs, channel, status, notifyClient, items,
  } = body as {
    firstName?: string; lastName?: string; email?: string; phone?: string;
    specialReqs?: string; channel?: string; status?: string; notifyClient?: boolean;
    items?: CartItemInput[];
  };

  if (!firstName || !lastName || !email || !phone) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "At least one item is required" }, { status: 400 });
  }
  if (!channel) {
    return NextResponse.json({ error: "Channel is required" }, { status: 400 });
  }

  let priced;
  try {
    // Admin-recorded bookings (phone/WhatsApp/OTA) are allowed through a closed
    // period — the admin already knows what they're doing when entering one manually.
    priced = await Promise.all(items.map((item) => priceCartItem({ ...item, allowClosedPeriod: true })));
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Invalid item" }, { status: 400 });
  }

  const totalAmount = priced.reduce((sum, p) => sum + p.totalAmount, 0);
  const currency = priced[0].currency;
  const bookingStatus = status === "confirmed" ? "confirmed" : "pending";

  const reservation = await db.reservation.create({
    data: {
      firstName, lastName, email, phone,
      specialReqs: specialReqs || null,
      channel,
      totalAmount,
      currency,
      items: {
        create: priced.map((p) => ({
          firstName, lastName, email, phone,
          serviceType: p.serviceType,
          suiteId: p.suiteId,
          activityId: p.activityId,
          dayPassId: p.dayPassId,
          checkIn: p.checkIn,
          checkOut: p.checkOut,
          date: p.date,
          quantity: p.quantity,
          guests: p.guests,
          children: p.children,
          experiences: p.experiences,
          specialReqs: specialReqs || null,
          totalAmount: p.totalAmount,
          currency: p.currency,
          status: bookingStatus,
        })),
      },
    },
    include: {
      items: { include: { suite: true, activity: true, dayPass: true } },
    },
  });

  // PDF generation (cold Chromium boot) can take longer than the edge/proxy holds a
  // request open, so it runs after the response is sent — same fix as the confirm-status route.
  if (notifyClient) {
    after(async () => {
      try {
        if (bookingStatus === "confirmed") {
          const reservationRef = `ADH-${reservation.id.slice(-8).toUpperCase()}`;
          const html = buildFicheHtml({ reservationRef, items: reservation.items, totalAmount, currency });
          const pdf = await generateFichePdf(html);
          await sendReservationConfirmedEmail(email, firstName, reservation.items, totalAmount, currency, pdf);
        } else {
          const manageUrl = `https://www.arabiandeserthome.ma/mes-reservations/${reservation.accessToken}`;
          await sendReservationConfirmation(email, firstName, reservation.items, totalAmount, currency, manageUrl);
        }
      } catch (err) {
        console.error("Failed to notify client for manual reservation:", err);
      }
    });
  }

  return NextResponse.json({ success: true, reservation }, { status: 201 });
}
