import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { sendReviewRequestEmail, type ReviewLang } from "@/lib/email";
import { checkEmailAddress } from "@/lib/email-check";

const LANGS: ReviewLang[] = ["fr", "en", "es", "it"];

/**
 * POST { lang, to?, checkOnly? } — the admin sends the post-stay thank-you +
 * Google review button, in the language they choose.
 * - `to` lets the admin correct the address in the confirm step (defaults to
 *   the reservation's email); the reservation itself is not modified.
 * - `checkOnly: true` only verifies the address (format, typo, relay, domain
 *   MX) so the dialog can show the result before anything is sent.
 * A real send always re-verifies server-side.
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

  const to = typeof body.to === "string" && body.to.trim() ? body.to.trim() : guest.email;
  const check = await checkEmailAddress(to);
  if (body.checkOnly) return NextResponse.json({ to, check });
  if (!check.ok) return NextResponse.json({ error: check.message, check }, { status: 422 });

  try {
    await sendReviewRequestEmail(to, guest.firstName, lang);
  } catch (err) {
    console.error("[review-request] send failed", id, err);
    return NextResponse.json({ error: "L'envoi de l'email a échoué." }, { status: 502 });
  }

  const sentAt = new Date();
  if (reservation) await db.reservation.update({ where: { id }, data: { reviewRequestSentAt: sentAt } });
  return NextResponse.json({ sentAt, to });
}
