interface ClosureWindow {
  startDate: Date;
  endDate: Date;
}

/** Whether a single date falls inside any closure window. */
export function isDateBlocked(date: Date, closures: ClosureWindow[]): boolean {
  return closures.some((c) => date >= c.startDate && date <= c.endDate);
}

/** Whether any night of a stay (checkIn inclusive to checkOut exclusive) falls inside a closure window. */
export function rangeOverlapsClosure(checkIn: Date, checkOut: Date, closures: ClosureWindow[]): boolean {
  const nights = Math.max(1, Math.round((checkOut.getTime() - checkIn.getTime()) / 86_400_000));
  for (let i = 0; i < nights; i++) {
    const night = new Date(checkIn);
    night.setDate(night.getDate() + i);
    if (isDateBlocked(night, closures)) return true;
  }
  return false;
}

const DAY_MS = 86_400_000;

interface StayLike {
  checkIn: Date | null;
  checkOut: Date | null;
  quantity: number;
}

/**
 * The most tents of one type taken on any single night of [checkIn, checkOut).
 * A booking occupies the nights from its check-in up to (not including) its check-out.
 */
export function peakUnitsTaken(checkIn: Date, checkOut: Date, stays: StayLike[]): number {
  const nights = Math.max(1, Math.round((checkOut.getTime() - checkIn.getTime()) / DAY_MS));
  let peak = 0;
  for (let i = 0; i < nights; i++) {
    const night = checkIn.getTime() + i * DAY_MS;
    let taken = 0;
    for (const s of stays) {
      if (!s.checkIn || !s.checkOut) continue;
      if (s.checkIn.getTime() <= night && night < s.checkOut.getTime()) taken += s.quantity;
    }
    if (taken > peak) peak = taken;
  }
  return peak;
}

export interface SuiteAvailability {
  suiteId: string;
  units: number;
  /** Tents still free for every night of the stay (0 when closed). */
  left: number;
  /** A closure window covers the stay: nothing can be booked. */
  closed: boolean;
}

/**
 * Availability of every tent type for a stay: tent count minus what active
 * (pending or confirmed) bookings already hold. `excludeBookingId` lets a guest
 * moving their own stay ignore it.
 */
export async function suitesAvailability(
  db: {
    suite: { findMany: (args: unknown) => Promise<{ id: string; units: number; closures: ClosureWindow[] }[]> };
    booking: { findMany: (args: unknown) => Promise<{ suiteId: string | null; checkIn: Date | null; checkOut: Date | null; quantity: number }[]> };
  },
  checkIn: Date,
  checkOut: Date,
  opts: { excludeBookingId?: string; suiteIds?: string[] } = {},
): Promise<SuiteAvailability[]> {
  const suites = await db.suite.findMany({
    where: opts.suiteIds ? { id: { in: opts.suiteIds } } : {},
    select: { id: true, units: true, closures: true },
  });
  const bookings = await db.booking.findMany({
    where: {
      serviceType: "suite",
      status: { not: "cancelled" },
      suiteId: { in: suites.map((s) => s.id) },
      checkIn: { lt: checkOut },
      checkOut: { gt: checkIn },
      ...(opts.excludeBookingId ? { id: { not: opts.excludeBookingId } } : {}),
    },
    select: { suiteId: true, checkIn: true, checkOut: true, quantity: true },
  });
  return suites.map((suite) => {
    const closed = rangeOverlapsClosure(checkIn, checkOut, suite.closures);
    const taken = peakUnitsTaken(checkIn, checkOut, bookings.filter((b) => b.suiteId === suite.id));
    return { suiteId: suite.id, units: suite.units, left: closed ? 0 : Math.max(0, suite.units - taken), closed };
  });
}

