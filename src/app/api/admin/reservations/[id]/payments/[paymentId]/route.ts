import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { deleteR2Urls } from "@/lib/r2";

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
