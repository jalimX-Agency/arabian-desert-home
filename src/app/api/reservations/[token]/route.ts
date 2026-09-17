import { NextRequest, NextResponse, after } from "next/server";
import { db } from "@/lib/db";
import {
  sendClientCancellationNotification,
  sendClientModificationNotification,
  sendReservationModifiedEmail,
  reservationManageUrl,
} from "@/lib/email";
import { priceCartItem } from "@/lib/reservation-item";

// Token-gated, not admin-gated: the access token in the URL IS the auth —
// this is the guest's own "manage my reservation" link from their
// confirmation email. Never expose other reservations here.

async function loadReservation(token: string) {
  return db.reservation.findUnique({
    where: { accessToken: token },
    include: {
      items: {
        include: {
          // Closure windows (dates only, never the internal reason) let the guest's date
          // picker grey out unavailable nights; the server re-checks them on save anyway.
          suite: { include: { closures: { select: { startDate: true, endDate: true } } } },
          activity: true,
          dayPass: true,
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

// Dates arrive as the guest's local midnight in ISO form, which can be the previous
// day in UTC — allow a day and a half of slack so "today" is never rejected.
function isInPast(d: Date): boolean {
  return d.getTime() < Date.now() - 36 * 3600 * 1000;
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

  const contact = { firstName: reservation.firstName, lastName: reservation.lastName, email: reservation.email, phone: reservation.phone };

  if (action === "cancelItem") {
    const { itemId } = body as { itemId?: string };
    const item = reservation.items.find((i) => i.id === itemId);
    if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });
    if (item.status === "cancelled") {
      return NextResponse.json({ error: "Already cancelled" }, { status: 400 });
    }
    await db.booking.update({ where: { id: item.id }, data: { status: "cancelled" } });

    const updated = await loadReservation(token);
    const allCancelled = updated!.items.every((i) => i.status === "cancelled");
    try {
      await sendClientCancellationNotification(contact, [item], allCancelled);
    } catch (err) {
      console.error("Failed to notify admin of item cancellation:", err);
    }
    return NextResponse.json(updated);
  }

  if (action === "cancelAll") {
    const activeItems = reservation.items.filter((i) => i.status !== "cancelled");
    await db.booking.updateMany({
      where: { reservationId: reservation.id, status: { not: "cancelled" } },
      data: { status: "cancelled" },
    });

    const updated = await loadReservation(token);
    if (activeItems.length > 0) {
      try {
        await sendClientCancellationNotification(contact, activeItems, true);
      } catch (err) {
        console.error("Failed to notify admin of reservation cancellation:", err);
      }
    }
    return NextResponse.json(updated);
  }

  if (action === "modifyItem") {
    const { itemId, checkIn, checkOut, date } = body as {
      itemId?: string; checkIn?: string; checkOut?: string; date?: string;
    };
    const item = reservation.items.find((i) => i.id === itemId);
    if (!item) return NextResponse.json({ error: "Prestation introuvable" }, { status: 404 });
    if (item.status === "cancelled") {
      return NextResponse.json({ error: "Cette prestation est annulée et ne peut plus être modifiée" }, { status: 400 });
    }
    const originalStart = item.checkIn ?? item.date;
    if (originalStart && isInPast(originalStart)) {
      return NextResponse.json({ error: "Cette prestation a déjà commencé et ne peut plus être modifiée" }, { status: 400 });
    }

    if (item.serviceType === "suite") {
      if (!checkIn || !checkOut) return NextResponse.json({ error: "Dates d'arrivée et de départ requises" }, { status: 400 });
      const inDate = new Date(checkIn);
      const outDate = new Date(checkOut);
      if (Number.isNaN(inDate.getTime()) || Number.isNaN(outDate.getTime())) {
        return NextResponse.json({ error: "Dates invalides" }, { status: 400 });
      }
      if (outDate <= inDate) return NextResponse.json({ error: "La date de départ doit être après la date d'arrivée" }, { status: 400 });
      if (isInPast(inDate)) return NextResponse.json({ error: "La date d'arrivée ne peut pas être dans le passé" }, { status: 400 });
      if (item.checkIn?.getTime() === inDate.getTime() && item.checkOut?.getTime() === outDate.getTime()) {
        return NextResponse.json({ error: "Les nouvelles dates sont identiques aux dates actuelles" }, { status: 400 });
      }
    } else {
      if (!date) return NextResponse.json({ error: "Date requise" }, { status: 400 });
      const newDate = new Date(date);
      if (Number.isNaN(newDate.getTime())) return NextResponse.json({ error: "Date invalide" }, { status: 400 });
      if (isInPast(newDate)) return NextResponse.json({ error: "La date ne peut pas être dans le passé" }, { status: 400 });
      if (item.date?.getTime() === newDate.getTime()) {
        return NextResponse.json({ error: "La nouvelle date est identique à la date actuelle" }, { status: 400 });
      }
    }

    let priced;
    try {
      // Same pricing path as a new booking: seasonal rates, and tent closures are rejected.
      // The original currency is kept so the reservation total stays in one currency.
      priced = await priceCartItem({
        serviceType: item.serviceType as "suite" | "activity" | "daypass",
        suiteId: item.suiteId ?? undefined,
        activityId: item.activityId ?? undefined,
        dayPassId: item.dayPassId ?? undefined,
        checkIn: item.serviceType === "suite" ? checkIn : undefined,
        checkOut: item.serviceType === "suite" ? checkOut : undefined,
        date: item.serviceType === "suite" ? undefined : date,
        quantity: item.quantity,
        guests: item.guests,
        children: item.children,
        currencyOverride: item.currency,
      });
    } catch (e) {
      return NextResponse.json({ error: e instanceof Error ? e.message : "Ces dates ne sont pas disponibles" }, { status: 400 });
    }

    const before = { checkIn: item.checkIn, checkOut: item.checkOut, date: item.date };
    const newTotal = reservation.totalAmount - item.totalAmount + priced.totalAmount;

    // Any date change needs a fresh review, so the whole reservation goes back to pending.
    await db.$transaction([
      db.booking.update({
        where: { id: item.id },
        data: { checkIn: priced.checkIn, checkOut: priced.checkOut, date: priced.date, totalAmount: priced.totalAmount },
      }),
      db.booking.updateMany({
        where: { reservationId: reservation.id, status: { not: "cancelled" } },
        data: { status: "pending" },
      }),
      db.reservation.update({ where: { id: reservation.id }, data: { totalAmount: newTotal } }),
    ]);

    const updated = await loadReservation(token);
    const modified = updated!.items.find((i) => i.id === item.id)!;
    after(async () => {
      const results = await Promise.allSettled([
        sendReservationModifiedEmail(
          reservation.email, reservation.firstName, before, modified, newTotal, reservation.currency,
          reservationManageUrl(reservation.accessToken),
        ),
        sendClientModificationNotification({ ...contact }, before, modified),
      ]);
      results.forEach((r) => {
        if (r.status === "rejected") console.error("Failed to send reservation-modified email:", r.reason);
      });
    });
    return NextResponse.json(updated);
  }

  if (action === "updateSpecialReqs") {
    const { specialReqs } = body as { specialReqs?: string };
    await db.reservation.update({ where: { id: reservation.id }, data: { specialReqs: specialReqs || null } });
    return NextResponse.json(await loadReservation(token));
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
