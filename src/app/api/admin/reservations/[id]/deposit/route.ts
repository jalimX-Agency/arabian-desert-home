import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { parseMoney, roundMoney, sumMoney } from "@/lib/money";
import { balanceDue } from "@/lib/payments";
import { queueConfirmedEmail } from "@/lib/reservation-confirm";

export const maxDuration = 60;

/**
 * "Valider l'acompte et confirmer": records the advance the guest sent (with the proof they
 * uploaded), confirms every line still open and emails the guest the confirmation + fiche PDF.
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;

  const reservation = await db.reservation.findUnique({
    where: { id },
    include: { items: { select: { status: true } }, payments: { select: { amount: true } } },
  });
  if (!reservation) return NextResponse.json({ error: "Réservation introuvable." }, { status: 404 });
  if (reservation.items.every((b) => b.status === "cancelled")) {
    return NextResponse.json({ error: "Cette réservation est annulée." }, { status: 400 });
  }

  const body = (await req.json().catch(() => ({}))) as { amount?: unknown };
  const amount = parseMoney(String(body.amount ?? ""));
  if (amount === null || amount <= 0) {
    return NextResponse.json({ error: "Montant invalide : indiquez le montant reçu (ex. 150 ou 150,50)." }, { status: 400 });
  }
  const owed = balanceDue(reservation.totalAmount, sumMoney(reservation.payments.map((p) => p.amount)));
  if (amount > owed + 0.005) {
    return NextResponse.json({ error: `Ce montant dépasse le reste à payer (${owed} ${reservation.currency}).` }, { status: 400 });
  }

  await db.$transaction([
    db.payment.create({
      data: {
        reservationId: id,
        amount: roundMoney(amount),
        currency: reservation.currency,
        method: "bank_transfer",
        paidAt: new Date(new Date().toISOString().slice(0, 10) + "T00:00:00.000Z"),
        note: "Acompte envoyé par le client depuis sa page de réservation",
        proofUrl: reservation.depositProofUrl,
        // The confirmation email that follows carries the fiche with this advance on it.
        emailSentAt: new Date(),
      },
    }),
    db.booking.updateMany({ where: { reservationId: id, status: { not: "cancelled" } }, data: { status: "confirmed" } }),
  ]);

  const items = await db.booking.findMany({
    where: { reservationId: id, status: "confirmed" },
    include: { suite: true, activity: true, dayPass: true },
    orderBy: { createdAt: "asc" },
  });
  queueConfirmedEmail(id, items);

  return NextResponse.json({ ok: true });
}
