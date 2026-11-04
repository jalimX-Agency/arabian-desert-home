import { NextRequest, NextResponse, after } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { uploadToR2 } from "@/lib/r2";
import { parseMoney, roundMoney, sumMoney } from "@/lib/money";
import { isPaymentMethod, balanceDue } from "@/lib/payments";
import { parseReservationLang } from "@/lib/reservation-lang";
import { sendPaymentReceivedEmail, reservationManageUrl } from "@/lib/email";
import { buildFicheHtml, generateFichePdf } from "@/lib/fiche-pdf";
import { randomUUID } from "crypto";

export const maxDuration = 60;

// Vercel refuses request bodies above ~4.5 MB, so the proof is capped just below that.
const MAX_PROOF_BYTES = 4 * 1024 * 1024;
const PROOF_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "application/pdf": "pdf",
};

const LEGACY_MESSAGE = "Cette réservation est une ancienne réservation sans dossier de paiement : l'acompte ne peut pas y être enregistré.";

/** Payments recorded on a reservation, oldest first, with the totals the admin needs. */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;

  const reservation = await db.reservation.findUnique({
    where: { id },
    select: { totalAmount: true, currency: true, payments: { orderBy: [{ paidAt: "asc" }, { createdAt: "asc" }] } },
  });
  if (!reservation) return NextResponse.json({ payments: [], total: null, paid: 0, balance: null, legacy: true });

  const paid = sumMoney(reservation.payments.map((p) => p.amount));
  return NextResponse.json({
    payments: reservation.payments,
    total: reservation.totalAmount,
    currency: reservation.currency,
    paid,
    balance: balanceDue(reservation.totalAmount, paid),
    legacy: false,
  });
}

/** Records a payment (typically an advance) with an optional proof, then emails the guest a receipt. */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
  if (!reservation) return NextResponse.json({ error: LEGACY_MESSAGE }, { status: 404 });

  const form = await req.formData();
  const amount = parseMoney(String(form.get("amount") ?? ""));
  if (amount === null || amount <= 0) {
    return NextResponse.json({ error: "Montant invalide : indiquez un montant supérieur à 0 (ex. 150 ou 150,50)." }, { status: 400 });
  }

  const method = String(form.get("method") ?? "bank_transfer");
  if (!isPaymentMethod(method)) return NextResponse.json({ error: "Mode de paiement invalide." }, { status: 400 });

  const paidAtText = String(form.get("paidAt") ?? "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(paidAtText)) return NextResponse.json({ error: "Date de paiement invalide." }, { status: 400 });
  const paidAt = new Date(`${paidAtText}T00:00:00.000Z`);
  if (Number.isNaN(paidAt.getTime())) return NextResponse.json({ error: "Date de paiement invalide." }, { status: 400 });

  // A payment above what is still owed is almost always a typo (an extra zero).
  const alreadyPaid = sumMoney(reservation.payments.map((p) => p.amount));
  const owed = balanceDue(reservation.totalAmount, alreadyPaid);
  if (amount > owed + 0.005) {
    return NextResponse.json({
      error: owed > 0
        ? `Ce montant dépasse le reste à payer (${owed} ${reservation.currency}).`
        : "Cette réservation est déjà réglée en totalité.",
    }, { status: 400 });
  }

  const note = String(form.get("note") ?? "").trim().slice(0, 500) || null;
  const sendEmail = String(form.get("sendEmail") ?? "true") !== "false";

  let proofUrl: string | null = null;
  const file = form.get("proof");
  if (file instanceof File && file.size > 0) {
    const ext = PROOF_TYPES[file.type];
    if (!ext) return NextResponse.json({ error: "Justificatif non supporté : utilisez une image (JPG, PNG, WebP) ou un PDF." }, { status: 400 });
    if (file.size > MAX_PROOF_BYTES) return NextResponse.json({ error: "Justificatif trop volumineux (4 Mo maximum)." }, { status: 400 });
    // The bucket is public, so the key is random: the link only works for whoever the admin shares it with.
    const key = `payments/${id}/${Date.now()}-${randomUUID()}.${ext}`;
    proofUrl = await uploadToR2(key, Buffer.from(await file.arrayBuffer()), file.type);
  }

  const payment = await db.payment.create({
    data: { reservationId: id, amount: roundMoney(amount), currency: reservation.currency, method, paidAt, note, proofUrl },
  });
  const paidTotal = roundMoney(alreadyPaid + payment.amount);

  const primary = reservation.items[0];
  const willEmail = sendEmail && !!primary?.email;
  if (willEmail) {
    // The receipt (and the updated fiche PDF) can take longer than the proxy holds a request,
    // so it goes out after the response; the payment itself is already saved.
    after(async () => {
      try {
        const lang = parseReservationLang(reservation.lang);
        const reference = `ADH-${id.slice(-8).toUpperCase()}`;
        // The fiche says "confirmed", so it is only attached once every line really is.
        const confirmed = reservation.items.length > 0 && reservation.items.every((b) => b.status === "confirmed");
        const pdf = confirmed
          ? await generateFichePdf(buildFicheHtml({
              reservationRef: reference,
              items: reservation.items,
              totalAmount: reservation.totalAmount,
              currency: reservation.currency,
              lang,
              paidAmount: paidTotal,
            }))
          : null;
        await sendPaymentReceivedEmail({
          to: primary.email,
          firstName: primary.firstName,
          lang,
          amount: payment.amount,
          paidAt: payment.paidAt,
          method: payment.method,
          currency: reservation.currency,
          reference,
          total: reservation.totalAmount,
          paidTotal,
          manageUrl: reservationManageUrl(reservation.accessToken),
          pdf,
        });
        await db.payment.update({ where: { id: payment.id }, data: { emailSentAt: new Date() } });
      } catch (err) {
        console.error("Failed to send payment-received email:", err);
      }
    });
  }

  return NextResponse.json(
    { payment, paid: paidTotal, balance: balanceDue(reservation.totalAmount, paidTotal), emailQueued: willEmail },
    { status: 201 },
  );
}
