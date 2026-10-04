import { NextRequest, NextResponse, after } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { DEVIS_INCLUDE } from "@/lib/devis";
import { priceCartItem } from "@/lib/reservation-item";
import { formatMoney } from "@/lib/money";
import { buildFicheHtml, generateFichePdf } from "@/lib/fiche-pdf";
import { parseReservationLang } from "@/lib/reservation-lang";
import { reservationManageUrl, sendReservationConfirmedEmail } from "@/lib/email";

export const maxDuration = 60;

/** Turns an accepted quote into a reservation. The quoted amounts are kept as they are:
 *  the quote is what the client agreed to, so seasonal drift must never change it. */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;

  const { channel, notifyClient } = (await req.json().catch(() => ({}))) as {
    channel?: string; notifyClient?: boolean;
  };

  const devis = await db.devis.findUnique({ where: { id }, include: DEVIS_INCLUDE });
  if (!devis) return NextResponse.json({ error: "Devis introuvable" }, { status: 404 });
  if (devis.status !== "accepted") {
    return NextResponse.json({ error: "Seul un devis accepté peut être converti en réservation" }, { status: 409 });
  }
  if (devis.reservationId) {
    return NextResponse.json({ error: "Ce devis est déjà converti en réservation" }, { status: 409 });
  }

  const catalogItems = devis.items.filter((i) => i.kind === "catalog");
  const customItems = devis.items.filter((i) => i.kind === "custom");

  // Re-price only to warn the admin: the reservation still carries the quoted amounts.
  const priceDrift: { label: string; quoted: number; current: number }[] = [];
  for (const item of catalogItems) {
    // A price typed per person / per night was never a catalogue price: nothing to compare.
    if (item.unitPrice > 0) continue;
    try {
      const fresh = await priceCartItem({
        serviceType: item.serviceType as "suite" | "activity" | "daypass",
        suiteId: item.suiteId ?? undefined,
        activityId: item.activityId ?? undefined,
        dayPassId: item.dayPassId ?? undefined,
        checkIn: item.checkIn?.toISOString(),
        checkOut: item.checkOut?.toISOString(),
        date: item.date?.toISOString(),
        quantity: item.quantity,
        guests: item.guests,
        children: item.children,
        allowClosedPeriod: true,
      });
      // Rates in another currency than the quote can't be compared.
      if (fresh.currency === devis.currency && fresh.totalAmount !== item.totalAmount) {
        priceDrift.push({ label: item.label, quoted: item.totalAmount, current: fresh.totalAmount });
      }
    } catch {
      // A catalogue entry may have been deleted since the quote — not a reason to block.
    }
  }

  // Free lines have no catalogue link, so they can't be bookings. They stay in the total and
  // are written into the reservation notes so nothing quoted gets lost.
  const customRecap = customItems.length
    ? `Devis ${devis.reference} — ${customItems
        .map((i) => `${i.label} × ${i.quantity} : ${formatMoney(i.totalAmount)} ${devis.currency}`)
        .join("; ")}`
    : null;
  const specialReqs = [devis.title, customRecap].filter(Boolean).join(" · ") || null;

  const reservation = await db.$transaction(async (tx) => {
    const created = await tx.reservation.create({
      data: {
        firstName: devis.firstName,
        lastName: devis.lastName,
        email: devis.email,
        phone: devis.phone,
        specialReqs,
        channel: channel || devis.channel || "email",
        totalAmount: devis.totalAmount,
        currency: devis.currency,
        // The quote was written in the client's language — their emails and fiche follow it.
        lang: parseReservationLang(devis.lang),
        items: {
          create: catalogItems.map((item) => ({
            firstName: devis.firstName,
            lastName: devis.lastName,
            email: devis.email,
            phone: devis.phone,
            serviceType: item.serviceType,
            suiteId: item.suiteId,
            activityId: item.activityId,
            dayPassId: item.dayPassId,
            checkIn: item.checkIn,
            checkOut: item.checkOut,
            date: item.date,
            quantity: item.quantity,
            guests: item.guests,
            children: item.children,
            specialReqs,
            status: "confirmed",
            totalAmount: item.totalAmount,
            currency: item.currency,
          })),
        },
      },
      include: { items: { include: { suite: true, activity: true, dayPass: true } } },
    });

    await tx.devis.update({
      where: { id },
      data: { status: "converted", reservationId: created.id, convertedAt: new Date() },
    });

    return created;
  });

  if (notifyClient && reservation.items.length > 0) {
    after(async () => {
      try {
        const reservationRef = `ADH-${reservation.id.slice(-8).toUpperCase()}`;
        const html = buildFicheHtml({
          reservationRef,
          items: reservation.items,
          totalAmount: reservation.totalAmount,
          currency: reservation.currency,
          lang: parseReservationLang(reservation.lang),
        });
        const pdf = await generateFichePdf(html);
        await sendReservationConfirmedEmail(
          devis.email, devis.firstName, reservation.items, reservation.totalAmount,
          reservation.currency, pdf, reservationManageUrl(reservation.accessToken),
          parseReservationLang(reservation.lang),
        );
      } catch (err) {
        console.error("Failed to send confirmation for converted devis:", err);
      }
    });
  }

  return NextResponse.json({ success: true, reservation, priceDrift });
}
