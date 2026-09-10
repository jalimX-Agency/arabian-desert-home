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
