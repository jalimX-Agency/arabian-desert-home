import { db } from "@/lib/db";
import { sendBookingConfirmation, sendBookingNotification } from "@/lib/email";

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

    if (!firstName || !lastName || !email) {
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
      const suite = await db.suite.findUnique({ where: { id: suiteId } });
      if (suite) {
        const nights = Math.max(1, Math.round(
          (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86_400_000
        ));
        // Flat price per night — covers the whole tent regardless of guest count
        totalAmount = suite.price * nights;
        currency = suite.currency;
      }
    } else if (serviceType === "activity" && activityId) {
      const activity = await db.activity.findUnique({ where: { id: activityId } });
      if (activity) {
        totalAmount = guests * activity.price + children * Math.round(activity.price * activity.childPricePercent / 100);
        currency = activity.currency;
      }
    } else if (serviceType === "daypass" && dayPassId) {
      const pass = await db.dayPass.findUnique({ where: { id: dayPassId } });
      if (pass) {
        totalAmount = guests * pass.price + children * Math.round(pass.price * pass.childPricePercent / 100);
        currency = pass.currency;
      }
    }

    const booking = await db.booking.create({
      data: {
        firstName, lastName, email,
        phone: phone || null,
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
