interface PriceWindow {
  startDate: Date;
  endDate: Date;
  price: number;
}

/** Returns the seasonal override price active on `date`, or `basePrice` if none applies. */
export function priceForDate(basePrice: number, seasonalPrices: PriceWindow[], date: Date): number {
  const match = seasonalPrices.find((sp) => date >= sp.startDate && date <= sp.endDate);
  return match ? match.price : basePrice;
}

/** Sums the nightly price (seasonal-aware) for every night from checkIn (inclusive) to checkOut (exclusive). */
export function nightlyTotal(basePrice: number, seasonalPrices: PriceWindow[], checkIn: Date, checkOut: Date): number {
  const nights = Math.max(1, Math.round((checkOut.getTime() - checkIn.getTime()) / 86_400_000));
  let total = 0;
  for (let i = 0; i < nights; i++) {
    const night = new Date(checkIn);
    night.setDate(night.getDate() + i);
    total += priceForDate(basePrice, seasonalPrices, night);
  }
  return total;
}
