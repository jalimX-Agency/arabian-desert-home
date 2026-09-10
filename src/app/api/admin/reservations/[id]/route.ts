import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { sendReservationConfirmedEmail } from "@/lib/email";
import { buildFicheHtml, generateFichePdf } from "@/lib/fiche-pdf";

export const maxDuration = 30;

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

  if (status === "confirmed" && items.length > 0) {
    const first = items[0];
    const totalAmount = items.reduce((sum, b) => sum + b.totalAmount, 0);
    const currency = first.currency;
    const reservationRef = `ADH-${id.slice(-8).toUpperCase()}`;

    const html = buildFicheHtml({ reservationRef, items, totalAmount, currency });
    const pdf = await generateFichePdf(html);
    await sendReservationConfirmedEmail(first.email, first.firstName, items, totalAmount, currency, pdf);
  }

  return NextResponse.json(items);
}
