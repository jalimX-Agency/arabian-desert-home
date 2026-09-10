import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { buildFicheHtml, generateFichePdf } from "@/lib/fiche-pdf";

export const maxDuration = 60;

const include = { suite: true, activity: true, dayPass: true } as const;

/** Generates the fiche PDF on demand so the admin can preview or download it
 *  without waiting for a status change / confirmation email to trigger it. */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;

  const byReservation = await db.booking.findMany({
    where: { reservationId: id },
    include,
    orderBy: { createdAt: "asc" },
  });
  const items = byReservation.length > 0
    ? byReservation
    : await db.booking.findMany({ where: { id }, include });

  if (items.length === 0) {
    return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
  }

  const totalAmount = items.reduce((sum, b) => sum + b.totalAmount, 0);
  const currency = items[0].currency;
  const reservationRef = `ADH-${id.slice(-8).toUpperCase()}`;

  const html = buildFicheHtml({ reservationRef, items, totalAmount, currency });
  const pdf = await generateFichePdf(html);

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="Fiche-de-reservation-${reservationRef}.pdf"`,
    },
  });
}
