import { after } from "next/server";
import { db } from "@/lib/db";
import { sendReservationConfirmedEmail, reservationManageUrl } from "@/lib/email";
import { buildFicheHtml, generateFichePdf } from "@/lib/fiche-pdf";
import { parseReservationLang } from "@/lib/reservation-lang";
import { reservationPaid } from "@/lib/payments";
import { reservationReference } from "@/lib/deposit";

/** The reservation lines, as both the email and the fiche PDF read them. */
type ConfirmedItems = Parameters<typeof sendReservationConfirmedEmail>[2] & Parameters<typeof buildFicheHtml>[0]["items"];

/**
 * Emails the guest that the reservation is confirmed, with the fiche PDF. Runs after the
 * response: the PDF (Chromium cold start) can take longer than the proxy holds a request.
 */
export function queueConfirmedEmail(id: string, items: ConfirmedItems) {
  if (items.length === 0) return;
  after(async () => {
    try {
      const first = items[0];
      const currency = first.currency;
      // Legacy single bookings predate Reservation: no manage link, and French by default.
      const reservation = await db.reservation.findUnique({ where: { id }, select: { accessToken: true, lang: true, discount: true, discountNote: true } });
      const discount = reservation?.discount ?? 0;
      const totalAmount = Math.max(0, items.reduce((sum, b) => sum + b.totalAmount, 0) - discount);
      const lang = parseReservationLang(reservation?.lang);
      const paidAmount = await reservationPaid(id);
      const html = buildFicheHtml({ reservationRef: reservationReference(id), items, totalAmount, currency, lang, paidAmount, discount, discountNote: reservation?.discountNote });
      const pdf = await generateFichePdf(html);
      const manageUrl = reservation ? reservationManageUrl(reservation.accessToken) : null;
      await sendReservationConfirmedEmail(first.email, first.firstName, items, totalAmount, currency, pdf, manageUrl, lang, discount);
    } catch (err) {
      console.error("Failed to send reservation-confirmed email:", err);
    }
  });
}
