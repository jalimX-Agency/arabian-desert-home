import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { deleteR2Urls } from "@/lib/r2";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  const { status } = await req.json();
  const booking = await db.booking.update({ where: { id }, data: { status } });
  return NextResponse.json(booking);
}

/**
 * Deletes one line of a reservation. When it was the reservation's last line, the reservation
 * itself goes too (with its payments and their proof files): an empty reservation is invisible
 * in the admin list but would still be counted as a booking. The list deletes the lines of a
 * reservation in parallel, so the check runs after this line is gone and only removes the
 * reservation once no line is left at all.
 */
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  const booking = await db.booking.delete({ where: { id }, select: { reservationId: true } });

  if (booking.reservationId) {
    const proofs = await db.payment.findMany({
      where: { reservationId: booking.reservationId, proofUrl: { not: null } },
      select: { proofUrl: true },
    });
    const removed = await db.reservation.deleteMany({ where: { id: booking.reservationId, items: { none: {} } } });
    if (removed.count > 0 && proofs.length > 0) {
      try {
        await deleteR2Urls(proofs.map((p) => p.proofUrl!).join(","));
      } catch (err) {
        console.error("Failed to delete payment proofs of a deleted reservation:", err);
      }
    }
  }
  return NextResponse.json({ success: true });
}
