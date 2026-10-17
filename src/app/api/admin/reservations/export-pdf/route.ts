import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { generateFichePdf } from "@/lib/fiche-pdf";
import { buildReservationsTableHtml, sortForPlanning, TABLE_PDF_FOOTER } from "@/lib/reservations-table-pdf";

export const maxDuration = 60;

const MAX_ROWS = 2000;

/** Landscape PDF planning of the given bookings. Rows are re-read from the DB rather than
 *  trusting client data, and laid out by day: tent arrival or activity date, whatever order
 *  the rows were selected in. */
export async function POST(req: NextRequest) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const { bookingIds, scope } = (await req.json()) as { bookingIds?: unknown; scope?: string };
  if (!Array.isArray(bookingIds) || bookingIds.length === 0 || !bookingIds.every((id) => typeof id === "string")) {
    return NextResponse.json({ error: "bookingIds is required" }, { status: 400 });
  }
  if (bookingIds.length > MAX_ROWS) {
    return NextResponse.json({ error: `Trop de lignes (maximum ${MAX_ROWS})` }, { status: 400 });
  }

  const found = await db.booking.findMany({
    where: { id: { in: bookingIds as string[] } },
    include: {
      suite: { select: { name: true } },
      activity: { select: { name: true } },
      dayPass: { select: { name: true } },
      reservation: { select: { id: true, channel: true, specialReqs: true } },
    },
  });
  if (found.length === 0) return NextResponse.json({ error: "Aucune réservation trouvée" }, { status: 404 });

  const ordered = sortForPlanning(found);

  const scopeLabel = scope === "selection" ? "Sélection" : "Toutes (filtrées)";
  const pdf = await generateFichePdf(buildReservationsTableHtml(ordered, scopeLabel), { footerTemplate: TABLE_PDF_FOOTER });
  const filename = `planning-reservations-${new Date().toISOString().slice(0, 10)}.pdf`;

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
