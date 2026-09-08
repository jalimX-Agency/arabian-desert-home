import { db } from "@/lib/db";
import { sendBookingConfirmation, sendBookingNotification } from "@/lib/email";
import { priceForDate, nightlyTotal } from "@/lib/seasonal-price";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      firstName, lastName, email, phone,
      serviceType = "suite",
      suiteId, activityId, dayPassId,
      checkIn, checkOut, date,
      guests = 2, children = 0,
      experiences, specialReqs,
    } = body;

    if (!firstName || !lastName || !email || !phone) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (serviceType === "suite" && (!suiteId || !checkIn || !checkOut)) {
      return Response.json({ error: "Suite booking requires suiteId, checkIn, checkOut" }, { status: 400 });
    }
    if (serviceType === "activity" && (!activityId || !date)) {
      return Response.json({ error: "Activity booking requires activityId and date" }, { status: 400 });
    }
    if (serviceType === "daypass" && (!dayPassId || !date)) {
      return Response.json({ error: "Day pass booking requires dayPassId and date" }, { status: 400 });
    }

    let totalAmount = 0;
    let currency = "MAD";

    if (serviceType === "suite" && suiteId) {
      const suite = await db.suite.findUnique({ where: { id: suiteId }, include: { seasonalPrices: true } });
      if (suite) {
        // Flat price per night — covers the whole tent regardless of guest count.
        // Seasonal overrides (e.g. New Year's) apply per night when they cover it.
        totalAmount = nightlyTotal(suite.price, suite.seasonalPrices, new Date(checkIn), new Date(checkOut));
        currency = suite.currency;
      }
    } else if (serviceType === "activity" && activityId) {
      const activity = await db.activity.findUnique({ where: { id: activityId }, include: { seasonalPrices: true } });
      if (activity) {
        const unitPrice = priceForDate(activity.price, activity.seasonalPrices, new Date(date));
        totalAmount = guests * unitPrice + children * Math.round(unitPrice * activity.childPricePercent / 100);
        currency = activity.currency;
      }
    } else if (serviceType === "daypass" && dayPassId) {
      const pass = await db.dayPass.findUnique({ where: { id: dayPassId }, include: { seasonalPrices: true } });
      if (pass) {
        const unitPrice = priceForDate(pass.price, pass.seasonalPrices, new Date(date));
        totalAmount = guests * unitPrice + children * Math.round(unitPrice * pass.childPricePercent / 100);
        currency = pass.currency;
      }
    }

    const booking = await db.booking.create({
      data: {
        firstName, lastName, email, phone,
        serviceType,
        suiteId: suiteId || null,
        activityId: activityId || null,
        dayPassId: dayPassId || null,
        checkIn: checkIn ? new Date(checkIn) : null,
        checkOut: checkOut ? new Date(checkOut) : null,
        date: date ? new Date(date) : null,
        guests,
        children,
        experiences: experiences || null,
        specialReqs: specialReqs || null,
        totalAmount,
        currency,
        status: "pending",
      },
      include: { suite: true, activity: true, dayPass: true },
    });

    Promise.allSettled([
      sendBookingConfirmation(email, firstName, booking),
      sendBookingNotification(booking),
    ]);

    return Response.json({ success: true, booking }, { status: 201 });
  } catch {
    return Response.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
