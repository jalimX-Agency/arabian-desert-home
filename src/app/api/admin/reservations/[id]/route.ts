import { NextRequest, NextResponse, after } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { sendReservationConfirmedEmail } from "@/lib/email";
import { buildFicheHtml, generateFichePdf } from "@/lib/fiche-pdf";

export const maxDuration = 60;

const include = { suite: true, activity: true, dayPass: true } as const;

/** Updates every Booking in a reservation at once. Falls back to a single booking
 *  id for reservations created before the Reservation model existed. */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  const { status } = await req.json();

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
    after(async () => {
      try {
        const first = items[0];
        const totalAmount = items.reduce((sum, b) => sum + b.totalAmount, 0);
        const currency = first.currency;
        const reservationRef = `ADH-${id.slice(-8).toUpperCase()}`;

        const html = buildFicheHtml({ reservationRef, items, totalAmount, currency });
        const pdf = await generateFichePdf(html);
        await sendReservationConfirmedEmail(first.email, first.firstName, items, totalAmount, currency, pdf);
      } catch (err) {
        console.error("Failed to send reservation-confirmed email:", err);
      }
    });
  }

  return NextResponse.json({ items });
}
