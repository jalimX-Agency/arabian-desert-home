import { NextRequest, NextResponse, after } from "next/server";
import { randomUUID } from "crypto";
import { db } from "@/lib/db";
import { uploadToR2 } from "@/lib/r2";
import { getBankDetails, hasBankDetails } from "@/lib/bank-details";
import { AWAITING_PAYMENT, PAYMENT_REVIEW, reservationReference } from "@/lib/deposit";
import { MAX_PROOF_BYTES, PAYMENT_PROOF_TYPES } from "@/lib/payments";
import { sendDepositProofNotification } from "@/lib/email";

// Token-gated like the rest of /api/reservations/[token]: the guest's private link is the auth.

/** Reservations whose advance was asked: the guest may see the bank details and send (or resend) the proof. */
function inDepositFlow(items: { status: string }[]): boolean {
  return items.some((i) => i.status === AWAITING_PAYMENT || i.status === PAYMENT_REVIEW);
}

/** Bank details and transfer reference, only while an advance is expected from this guest. */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const reservation = await db.reservation.findUnique({
    where: { accessToken: token },
    select: { id: true, items: { select: { status: true } } },
  });
  if (!reservation) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!inDepositFlow(reservation.items)) return NextResponse.json({ bank: null, reference: reservationReference(reservation.id) });

  const bank = await getBankDetails();
  return NextResponse.json({ bank: hasBankDetails(bank) ? bank : null, reference: reservationReference(reservation.id) });
}

/** The guest uploads the proof of their advance: the reservation moves to "payment_review" and the admin is told. */
export async function POST(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const reservation = await db.reservation.findUnique({
    where: { accessToken: token },
    include: { items: { select: { status: true } } },
  });
  if (!reservation) return NextResponse.json({ error: "Not found", code: "not_found" }, { status: 404 });
  if (!inDepositFlow(reservation.items)) {
    return NextResponse.json({ error: "No advance is expected for this reservation", code: "not_expected" }, { status: 400 });
  }

  const form = await req.formData().catch(() => null);
  const file = form?.get("proof");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Missing file", code: "missing_file" }, { status: 400 });
  }
  const ext = PAYMENT_PROOF_TYPES[file.type];
  if (!ext) return NextResponse.json({ error: "Unsupported file", code: "bad_type" }, { status: 400 });
  if (file.size > MAX_PROOF_BYTES) return NextResponse.json({ error: "File too large", code: "too_large" }, { status: 400 });

  // The bucket is public, so the key is random: only whoever holds the link can open it.
  const key = `payments/${reservation.id}/deposit-${Date.now()}-${randomUUID()}.${ext}`;
  const proofUrl = await uploadToR2(key, Buffer.from(await file.arrayBuffer()), file.type);

  await db.$transaction([
    db.reservation.update({ where: { id: reservation.id }, data: { depositProofUrl: proofUrl, depositProofAt: new Date() } }),
    db.booking.updateMany({ where: { reservationId: reservation.id, status: AWAITING_PAYMENT }, data: { status: PAYMENT_REVIEW } }),
  ]);

  after(async () => {
    try {
      await sendDepositProofNotification({
        firstName: reservation.firstName,
        lastName: reservation.lastName,
        email: reservation.email,
        phone: reservation.phone,
        reference: reservationReference(reservation.id),
        deposit: reservation.depositAmount,
        currency: reservation.currency,
        proofUrl,
      });
    } catch (err) {
      console.error("Failed to send deposit-proof notification:", err);
    }
  });

  return NextResponse.json({ ok: true });
}
