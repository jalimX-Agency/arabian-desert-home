import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendReviewRequestEmail } from "@/lib/email";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Daily (vercel.json cron): email a Google review request to guests whose stay
 * ended 1–3 days ago. The short window means past guests are never mass-emailed
 * when this ships, and a missed day is still caught on the next run.
 *
 * OTA bookings are skipped: their guest emails are platform relay addresses and
 * the platforms forbid steering their guests to other review sites.
 */
const OTA_CHANNELS = ["booking.com", "expedia", "trip.com"];
const WINDOW_DAYS = 3;

function startOfUtcDay(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

export async function GET(req: NextRequest) {
  // Vercel Cron sends `Authorization: Bearer $CRON_SECRET` when that env var is set.
  const secret = process.env.CRON_SECRET;
  if (!secret) return NextResponse.json({ error: "CRON_SECRET is not configured" }, { status: 500 });
  if (req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = startOfUtcDay(new Date());
  const windowStart = new Date(today.getTime() - WINDOW_DAYS * 24 * 60 * 60 * 1000);
  const inWindow = { gte: windowStart, lt: today };

  const candidates = await db.reservation.findMany({
    where: {
      reviewRequestSentAt: null,
      channel: { notIn: OTA_CHANNELS },
      items: { some: { OR: [{ checkOut: inWindow }, { date: inWindow }] } },
    },
    include: { items: { select: { status: true, checkIn: true, checkOut: true, date: true } } },
  });

  let sent = 0;
  const failed: string[] = [];

  for (const r of candidates) {
    // Only stays that actually happened: every non-cancelled item confirmed.
    const active = r.items.filter((i) => i.status !== "cancelled");
    if (active.length === 0 || active.some((i) => i.status !== "confirmed")) continue;

    // The stay is over only once its LAST item is — a tent + a later activity
    // waits for the activity.
    const lastDay = Math.max(...active.map((i) => (i.checkOut ?? i.date ?? i.checkIn ?? new Date(0)).getTime()));
    if (lastDay < windowStart.getTime() || lastDay >= today.getTime()) continue;

    // Claim the row first so two overlapping runs can't both email the guest.
    const claim = await db.reservation.updateMany({
      where: { id: r.id, reviewRequestSentAt: null },
      data: { reviewRequestSentAt: new Date() },
    });
    if (claim.count === 0) continue;

    try {
      await sendReviewRequestEmail(r.email, r.firstName);
      sent++;
    } catch (err) {
      console.error("[review-requests] send failed", r.id, err);
      // Release the claim so tomorrow's run retries (still inside the window).
      await db.reservation.update({ where: { id: r.id }, data: { reviewRequestSentAt: null } });
      failed.push(r.id);
    }
  }

  return NextResponse.json({ candidates: candidates.length, sent, failed: failed.length });
}
