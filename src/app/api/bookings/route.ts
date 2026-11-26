import { db } from "@/lib/db";
import { priceCartItem, type CartItemInput } from "@/lib/reservation-item";
import { parseReservationLang } from "@/lib/reservation-lang";
import { createGuestReservation } from "@/lib/create-reservation";
import { dayIsReveillon, stayTouchesReveillon } from "@/lib/reveillon";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, specialReqs, items, lang: rawLang, source: rawSource } = body as {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      specialReqs?: string;
      items?: CartItemInput[];
      /** The site language the guest booked in — decides the language of their emails and fiche. */
      lang?: string;
      /** Where the guest came from (ads, organic, ai…), worked out by the page. */
      source?: string;
    };
    const lang = parseReservationLang(rawLang);

    if (!firstName || !lastName || !email || !phone) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return Response.json({ error: "At least one item is required" }, { status: 400 });
    }

    // Transport is an extra on a stay or an activity, never booked on its own.
    if (items.every((item) => item.serviceType === "transport")) {
      return Response.json({ error: "Transport must be added to a stay or an activity" }, { status: 400 });
    }

    // The night of 31 Dec (and anything dated the 31st) is sold from the New Year's Eve page only.
    if (items.some((item) => stayTouchesReveillon(item.checkIn, item.checkOut) || dayIsReveillon(item.date))) {
      return Response.json({ error: "Le 31 décembre se réserve depuis la page du réveillon.", code: "reveillon" }, { status: 400 });
    }

    // Hidden activities can still be booked from the admin, never from the public form.
    const activityIds = items.filter((item) => item.serviceType === "activity" && item.activityId).map((item) => item.activityId!);
    if (activityIds.length > 0) {
      const hidden = await db.activity.count({ where: { id: { in: activityIds }, published: false } });
      if (hidden > 0) return Response.json({ error: "Activity not available" }, { status: 400 });
    }

    let priced;
    try {
      priced = await Promise.all(items.map((item) => priceCartItem(item)));
    } catch (e) {
      return Response.json({ error: e instanceof Error ? e.message : "Invalid item" }, { status: 400 });
    }

    const { reservation, manageUrl } = await createGuestReservation({
      firstName, lastName, email, phone,
      specialReqs: specialReqs || null,
      lang,
      source: rawSource,
      page: "/reservez-votre-sejour",
      priced,
    }, request.headers);

    return Response.json({ success: true, reservation, manageUrl }, { status: 201 });
  } catch {
    return Response.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
