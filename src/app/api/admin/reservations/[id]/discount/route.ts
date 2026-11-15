import { NextRequest, NextResponse, after } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { parseMoney, roundMoney, sumMoney } from "@/lib/money";
import { balanceDue } from "@/lib/payments";
import { parseReservationLang } from "@/lib/reservation-lang";
import { sendDiscountEmail, reservationManageUrl } from "@/lib/email";
import { buildFicheHtml, generateFichePdf } from "@/lib/fiche-pdf";

export const maxDuration = 60;

/**
 * Sets (or removes, with 0) the discount on a reservation. The total stays the sum of the lines
 * minus the discount, so balances and payments keep working unchanged. Optionally emails the
 * guest the new price, with the updated fiche PDF once every line is confirmed.
 */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;

  const reservation = await db.reservation.findUnique({
    where: { id },
    include: {
      items: { include: { suite: true, activity: true, dayPass: true }, orderBy: { createdAt: "asc" } },
      payments: { select: { amount: true } },
    },
  });
  if (!reservation) {
    return NextResponse.json({ error: "Ancienne réservation sans dossier : la réduction ne peut pas y être appliquée." }, { status: 404 });
  }
  if (reservation.items.length === 0) {
    return NextResponse.json({ error: "Cette réservation n'a aucune prestation." }, { status: 400 });
  }

  const body = (await req.json().catch(() => ({}))) as { amount?: unknown; note?: unknown; sendEmail?: unknown };
  const amount = parseMoney(String(body.amount ?? ""));
  if (amount === null || amount < 0) {
    return NextResponse.json({ error: "Montant invalide : indiquez un montant (ex. 50 ou 50,50), ou 0 pour retirer la réduction." }, { status: 400 });
  }

  const subtotal = sumMoney(reservation.items.map((b) => b.totalAmount));
  const discount = roundMoney(amount);
  if (discount > subtotal) {
    return NextResponse.json({ error: `La réduction ne peut pas dépasser le total des prestations (${subtotal} ${reservation.currency}).` }, { status: 400 });
  }

  const paid = sumMoney(reservation.payments.map((p) => p.amount));
  const totalAmount = roundMoney(subtotal - discount);
  if (paid > totalAmount + 0.005) {
    return NextResponse.json({
      error: `Le client a déjà réglé ${paid} ${reservation.currency} : la réduction ne peut pas dépasser ${roundMoney(subtotal - paid)} ${reservation.currency}.`,
    }, { status: 400 });
  }

  const note = discount > 0 ? String(body.note ?? "").trim().slice(0, 200) || null : null;
  await db.reservation.update({ where: { id }, data: { discount, discountNote: note, totalAmount } });

  const sendEmail = body.sendEmail === true && discount > 0 && !!reservation.email;
  if (sendEmail) {
    // The PDF can take longer than the proxy holds a request open: the discount is already saved.
    after(async () => {
      try {
        const lang = parseReservationLang(reservation.lang);
        const reference = `ADH-${id.slice(-8).toUpperCase()}`;
        // The fiche says "confirmed", so it is only attached once every line really is.
        const confirmed = reservation.items.every((b) => b.status === "confirmed");
        const pdf = confirmed
          ? await generateFichePdf(buildFicheHtml({
              reservationRef: reference,
              items: reservation.items,
              totalAmount,
              currency: reservation.currency,
              lang,
              paidAmount: paid,
              discount,
              discountNote: note,
            }))
          : null;
        await sendDiscountEmail({
          to: reservation.email,
          firstName: reservation.firstName,
          lang,
          currency: reservation.currency,
          reference,
          subtotal,
          discount,
          note,
          paidTotal: paid,
          manageUrl: reservationManageUrl(reservation.accessToken),
          pdf,
        });
      } catch (err) {
        console.error("Failed to send discount email:", err);
      }
    });
  }

  return NextResponse.json({ discount, discountNote: note, total: totalAmount, subtotal, paid, balance: balanceDue(totalAmount, paid), emailQueued: sendEmail });
}
