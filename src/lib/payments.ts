import { db } from "@/lib/db";
import { roundMoney, sumMoney } from "@/lib/money";

export const PAYMENT_METHODS = ["bank_transfer", "cash", "card", "other"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export function isPaymentMethod(value: unknown): value is PaymentMethod {
  return typeof value === "string" && (PAYMENT_METHODS as readonly string[]).includes(value);
}

/** Proof of payment uploads: Vercel refuses request bodies above ~4.5 MB, so the proof is capped just below that. */
export const MAX_PROOF_BYTES = 4 * 1024 * 1024;
export const PAYMENT_PROOF_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "application/pdf": "pdf",
};

/** Total received so far for a reservation, in its currency. Reservations without a row (legacy single bookings) have none. */
export async function reservationPaid(reservationId: string): Promise<number> {
  const rows = await db.payment.findMany({ where: { reservationId }, select: { amount: true } });
  return sumMoney(rows.map((r) => r.amount));
}

/** What is still to be paid; never negative. */
export function balanceDue(total: number, paid: number): number {
  return Math.max(0, roundMoney(total - paid));
}
