import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { deleteR2Urls, uploadToR2 } from "@/lib/r2";
import { parseMoney, roundMoney, sumMoney } from "@/lib/money";
import { balanceDue, isPaymentMethod, MAX_PROOF_BYTES, PAYMENT_PROOF_TYPES } from "@/lib/payments";

/**
 * Corrects a recorded payment: amount, date, method, note, and the proof (replace it or remove it).
 * The same rules as adding one apply: the amount must stay within what the reservation still owes
 * once this payment is set aside. No email is sent to the guest; the fiche PDF and the guest page
 * read the payments live, so they show the corrected figures the next time they are opened.
 */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string; paymentId: string }> }) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id, paymentId } = await params;

  const payment = await db.payment.findFirst({ where: { id: paymentId, reservationId: id } });
  if (!payment) return NextResponse.json({ error: "Paiement introuvable." }, { status: 404 });
  const reservation = await db.reservation.findUnique({
    where: { id },
    select: { totalAmount: true, currency: true, payments: { select: { id: true, amount: true } } },
  });
  if (!reservation) return NextResponse.json({ error: "Réservation introuvable." }, { status: 404 });

  const form = await req.formData();
  const amount = parseMoney(String(form.get("amount") ?? ""));
  if (amount === null || amount <= 0) {
    return NextResponse.json({ error: "Montant invalide : indiquez un montant supérieur à 0 (ex. 150 ou 150,50)." }, { status: 400 });
  }
  const method = String(form.get("method") ?? payment.method);
  if (!isPaymentMethod(method)) return NextResponse.json({ error: "Mode de paiement invalide." }, { status: 400 });

  const paidAtText = String(form.get("paidAt") ?? "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(paidAtText)) return NextResponse.json({ error: "Date de paiement invalide." }, { status: 400 });
  const paidAt = new Date(`${paidAtText}T00:00:00.000Z`);
  if (Number.isNaN(paidAt.getTime())) return NextResponse.json({ error: "Date de paiement invalide." }, { status: 400 });

  const others = sumMoney(reservation.payments.filter((p) => p.id !== paymentId).map((p) => p.amount));
  const owed = balanceDue(reservation.totalAmount, others);
  if (amount > owed + 0.005) {
    return NextResponse.json({
      error: owed > 0
        ? `Ce montant dépasse ce que cette réservation peut encore recevoir (${owed} ${reservation.currency}).`
        : "Les autres paiements couvrent déjà le total de la réservation.",
    }, { status: 400 });
  }

  const note = String(form.get("note") ?? "").trim().slice(0, 500) || null;

  // The old proof is only deleted once the new data is saved, so a failure never loses it.
  let proofUrl = payment.proofUrl;
  let staleProof: string | null = null;
  const file = form.get("proof");
  if (file instanceof File && file.size > 0) {
    const ext = PAYMENT_PROOF_TYPES[file.type];
    if (!ext) return NextResponse.json({ error: "Justificatif non supporté : utilisez une image (JPG, PNG, WebP) ou un PDF." }, { status: 400 });
    if (file.size > MAX_PROOF_BYTES) return NextResponse.json({ error: "Justificatif trop volumineux (4 Mo maximum)." }, { status: 400 });
    const key = `payments/${id}/${Date.now()}-${randomUUID()}.${ext}`;
    proofUrl = await uploadToR2(key, Buffer.from(await file.arrayBuffer()), file.type);
    staleProof = payment.proofUrl;
  } else if (String(form.get("removeProof") ?? "") === "true" && payment.proofUrl) {
    proofUrl = null;
    staleProof = payment.proofUrl;
  }

  let updated;
  try {
    updated = await db.payment.update({
      where: { id: paymentId },
      data: { amount: roundMoney(amount), method, paidAt, note, proofUrl },
    });
  } catch (err) {
    // The new proof was uploaded for nothing: remove it rather than leave an orphan.
    if (proofUrl && proofUrl !== payment.proofUrl) await deleteR2Urls(proofUrl).catch(() => {});
    console.error("Failed to update payment:", err);
    return NextResponse.json({ error: "La modification a échoué." }, { status: 500 });
  }
  if (staleProof) {
    try {
      await deleteR2Urls(staleProof);
    } catch (err) {
      console.error("Failed to delete replaced payment proof from R2:", err);
    }
  }

  const paid = roundMoney(others + updated.amount);
  return NextResponse.json({ payment: updated, paid, balance: balanceDue(reservation.totalAmount, paid) });
}

/** Removes a payment recorded by mistake, and its proof file. No email is sent to the guest. */
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string; paymentId: string }> }) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id, paymentId } = await params;

  const payment = await db.payment.findFirst({ where: { id: paymentId, reservationId: id } });
  if (!payment) return NextResponse.json({ error: "Paiement introuvable." }, { status: 404 });

  await db.payment.delete({ where: { id: paymentId } });
  if (payment.proofUrl) {
    try {
      await deleteR2Urls(payment.proofUrl);
    } catch (err) {
      console.error("Failed to delete payment proof from R2:", err);
    }
  }
  return NextResponse.json({ ok: true });
}
