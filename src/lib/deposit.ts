import { roundMoney } from "@/lib/money";

/** Share of the total the guest pays in advance to confirm a reservation. */
export const DEPOSIT_RATE = 0.5;

/** Reservation line statuses of the advance flow, between "pending" and "confirmed". */
export const AWAITING_PAYMENT = "awaiting_payment";
export const PAYMENT_REVIEW = "payment_review";

/** Advance still to send: 50 % of the total, less what was already received; never negative. */
export function depositDue(total: number, paid: number): number {
  return Math.max(0, roundMoney(total * DEPOSIT_RATE - paid));
}

/** The reference the guest writes on the transfer and that every email shows. */
export function reservationReference(id: string): string {
  return `ADH-${id.slice(-8).toUpperCase()}`;
}
