import { NextRequest, NextResponse, after } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { sendReservationCancelledByAdminEmail, sendDepositRequestEmail, reservationManageUrl } from "@/lib/email";
import { parseReservationLang } from "@/lib/reservation-lang";
import { reservationPaid } from "@/lib/payments";
import { AWAITING_PAYMENT, depositDue, reservationReference } from "@/lib/deposit";
import { queueConfirmedEmail } from "@/lib/reservation-confirm";

export const maxDuration = 60;

const include = { suite: true, activity: true, dayPass: true } as const;

/** Updates every Booking in a reservation at once. Falls back to a single booking
 *  id for reservations created before the Reservation model existed. */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  const { status } = await req.json();

  // Asking for the advance needs the guest's page (bank details + proof upload), so a reservation row.
  let deposit = 0;
  if (status === AWAITING_PAYMENT) {
    const reservation = await db.reservation.findUnique({ where: { id }, select: { totalAmount: true } });
    if (!reservation) {
      return NextResponse.json({ error: "Ancienne réservation sans page client : l'acompte ne peut pas être demandé en ligne." }, { status: 400 });
    }
    deposit = depositDue(reservation.totalAmount, await reservationPaid(id));
    if (deposit <= 0) {
      return NextResponse.json({ error: "L'acompte de 50 % est déjà reçu : confirmez directement la réservation." }, { status: 400 });
    }
    // A new request starts clean: a proof sent earlier (e.g. refused) no longer counts.
    await db.reservation.update({ where: { id }, data: { depositAmount: deposit, depositProofUrl: null, depositProofAt: null } });
  }

  const grouped = await db.booking.updateMany({ where: { reservationId: id }, data: { status } });

  const items = grouped.count > 0
    ? await db.booking.findMany({ where: { reservationId: id }, include, orderBy: { createdAt: "asc" } })
    : await (async () => {
        await db.booking.update({ where: { id }, data: { status } });
        return db.booking.findMany({ where: { id }, include });
      })();

  // The status change is the core action; PDF generation + email can take
  // longer than the edge/proxy will hold a request open (Chromium cold
  // start alone can take tens of seconds), so it runs *after* the response
  // has already been sent instead of blocking it — avoids gateway timeouts
  // on an action that actually succeeds server-side either way.
  if (status === "confirmed" && items.length > 0) {
    queueConfirmedEmail(id, items);
  } else if (status === AWAITING_PAYMENT && items.length > 0) {
    after(async () => {
      try {
        const reservation = await db.reservation.findUnique({ where: { id }, select: { accessToken: true, lang: true, totalAmount: true, currency: true, email: true, firstName: true } });
        if (!reservation) return;
        await sendDepositRequestEmail({
          to: reservation.email,
          firstName: reservation.firstName,
          lang: parseReservationLang(reservation.lang),
          items: items.filter((b) => b.status !== "cancelled"),
          currency: reservation.currency,
          reference: reservationReference(id),
          total: reservation.totalAmount,
          deposit,
          manageUrl: reservationManageUrl(reservation.accessToken),
        });
      } catch (err) {
        console.error("Failed to send deposit-request email:", err);
      }
    });
  } else if (status === "cancelled" && items.length > 0) {
    after(async () => {
      try {
        const first = items[0];
        const currency = first.currency;
        const reservation = await db.reservation.findUnique({ where: { id }, select: { lang: true } });
        await sendReservationCancelledByAdminEmail(first.email, first.firstName, items, currency, parseReservationLang(reservation?.lang));
      } catch (err) {
        console.error("Failed to send reservation-cancelled email:", err);
      }
    });
  }

  return NextResponse.json({ items });
}
