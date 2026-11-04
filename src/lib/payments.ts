import { db } from "@/lib/db";
import { roundMoney, sumMoney } from "@/lib/money";

export const PAYMENT_METHODS = ["bank_transfer", "cash", "card", "other"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export function isPaymentMethod(value: unknown): value is PaymentMethod {
  return typeof value === "string" && (PAYMENT_METHODS as readonly string[]).includes(value);
}

/** Total received so far for a reservation, in its currency. Reservations without a row (legacy single bookings) have none. */
export async function reservationPaid(reservationId: string): Promise<number> {
  const rows = await db.payment.findMany({ where: { reservationId }, select: { amount: true } });
  return sumMoney(rows.map((r) => r.amount));
}

/** What is still to be paid; never negative. */
export function balanceDue(total: number, paid: number): number {
  return Math.max(0, roundMoney(total - paid));
}
