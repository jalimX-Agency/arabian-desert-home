import { db } from "@/lib/db";
import { sendReservationConfirmation, sendReservationNotification } from "@/lib/email";
import { priceCartItem, type CartItemInput } from "@/lib/reservation-item";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, specialReqs, items } = body as {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      specialReqs?: string;
      items?: CartItemInput[];
    };

    if (!firstName || !lastName || !email || !phone) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return Response.json({ error: "At least one item is required" }, { status: 400 });
    }

    let priced;
    try {
      priced = await Promise.all(items.map((item) => priceCartItem(item)));
    } catch (e) {
      return Response.json({ error: e instanceof Error ? e.message : "Invalid item" }, { status: 400 });
    }

    const totalAmount = priced.reduce((sum, p) => sum + p.totalAmount, 0);
    const currency = priced[0].currency;

    const reservation = await db.reservation.create({
      data: {
        firstName, lastName, email, phone,
        specialReqs: specialReqs || null,
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
            status: "pending",
          })),
        },
      },
      include: {
        items: { include: { suite: true, activity: true, dayPass: true } },
      },
    });

    const manageUrl = `https://www.arabiandeserthome.ma/mes-reservations/${reservation.accessToken}`;

    Promise.allSettled([
      sendReservationConfirmation(email, firstName, reservation.items, totalAmount, currency, manageUrl),
      sendReservationNotification(reservation.items, totalAmount, currency, specialReqs),
    ]);

    return Response.json({ success: true, reservation, manageUrl }, { status: 201 });
  } catch {
    return Response.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
