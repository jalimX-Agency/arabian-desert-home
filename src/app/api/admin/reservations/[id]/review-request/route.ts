import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { sendReviewRequestEmail, type ReviewLang } from "@/lib/email";

const LANGS: ReviewLang[] = ["fr", "en", "es", "it"];

/**
 * POST { lang } — the admin sends the post-stay thank-you + Google review
 * button to the guest, in the language they choose. Records the send date on
 * the reservation so the sheet shows it was already done.
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;

  const body = await req.json().catch(() => ({}));
  const lang: ReviewLang = LANGS.includes(body.lang) ? body.lang : "fr";

  const reservation = await db.reservation.findUnique({ where: { id }, select: { email: true, firstName: true } });
  // Legacy single bookings predate Reservation: send, but there's nowhere to record it.
  const guest = reservation ?? (await db.booking.findUnique({ where: { id }, select: { email: true, firstName: true } }));
  if (!guest) return NextResponse.json({ error: "Réservation introuvable" }, { status: 404 });

  try {
    await sendReviewRequestEmail(guest.email, guest.firstName, lang);
  } catch (err) {
    console.error("[review-request] send failed", id, err);
    return NextResponse.json({ error: "L'envoi de l'email a échoué." }, { status: 502 });
  }

  const sentAt = new Date();
  if (reservation) await db.reservation.update({ where: { id }, data: { reviewRequestSentAt: sentAt } });
  return NextResponse.json({ sentAt });
}
