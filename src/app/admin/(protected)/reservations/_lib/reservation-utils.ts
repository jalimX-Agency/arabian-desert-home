import { format } from "date-fns";
import { fr } from "date-fns/locale";

export interface Booking {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  serviceType: string;
  suiteId?: string | null;
  activityId?: string | null;
  dayPassId?: string | null;
  suite?: { name: string } | null;
  activity?: { name: string } | null;
  dayPass?: { name: string } | null;
  checkIn?: string | null;
  checkOut?: string | null;
  date?: string | null;
  quantity: number;
  guests: number;
  children: number;
  experiences?: string | null;
  specialReqs?: string | null;
  status: string;
  totalAmount: number;
  currency: string;
  createdAt: string;
  reservation?: {
    id: string;
    totalAmount: number;
    currency: string;
    channel: string;
    _count: { items: number };
  } | null;
}

export interface ReservationGroup {
  id: string;
  items: Booking[];
}

export const statusOptions = ["pending", "confirmed", "cancelled"];
export const statusColors: Record<string, string> = {
  pending: "bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20",
  confirmed: "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20",
  cancelled: "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20",
};

export const serviceTypeOptions = ["suite", "activity", "daypass"];
export const serviceTypeLabel: Record<string, string> = {
  suite: "Tente",
  activity: "Activité",
  daypass: "Day Pass",
};
export const serviceTypeBadge: Record<string, string> = {
  suite: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400",
  activity: "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400",
  daypass: "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400",
};

export const CHANNELS = ["website", "email", "whatsapp", "booking.com", "expedia", "trip.com"] as const;
export type Channel = (typeof CHANNELS)[number];

export const channelLabel: Record<string, string> = {
  website: "Site web",
  email: "Email",
  whatsapp: "WhatsApp",
  "booking.com": "Booking.com",
  expedia: "Expedia",
  "trip.com": "Trip.com",
};
export const channelBadgeColor: Record<string, string> = {
  website: "bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white/60",
  email: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
  whatsapp: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  "booking.com": "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  expedia: "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  "trip.com": "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
};

export function getServiceName(b: Booking): string {
  const base =
    b.serviceType === "suite" ? b.suite?.name ?? "—" :
    b.serviceType === "activity" ? b.activity?.name ?? "—" :
    b.serviceType === "daypass" ? b.dayPass?.name ?? "—" : "—";
  return b.quantity > 1 ? `${base} × ${b.quantity}` : base;
}

export function formatDateCellText(b: Booking): string {
  if (b.serviceType === "suite" && b.checkIn && b.checkOut) {
    return `${format(new Date(b.checkIn), "d MMM", { locale: fr })} → ${format(new Date(b.checkOut), "d MMM yyyy", { locale: fr })}`;
  }
  if (b.date) return format(new Date(b.date), "d MMM yyyy", { locale: fr });
  return "—";
}

/** The earliest relevant date for a booking item — used to sort/display the reservation's nearest date. */
export function earliestDate(b: Booking): Date | null {
  if (b.checkIn) return new Date(b.checkIn);
  if (b.date) return new Date(b.date);
  return null;
}

/** Groups line-item bookings back into one reservation per customer submission. */
export function groupBookings(bookings: Booking[]): ReservationGroup[] {
  const map = new Map<string, Booking[]>();
  for (const b of bookings) {
    const key = b.reservation?.id ?? b.id;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(b);
  }
  return Array.from(map.entries()).map(([id, items]) => ({ id, items }));
}

export function groupTotalAmount(g: ReservationGroup): number {
  return g.items[0]?.reservation?.totalAmount ?? g.items.reduce((sum, b) => sum + b.totalAmount, 0);
}

export function groupChannel(g: ReservationGroup): string {
  return g.items[0]?.reservation?.channel ?? "website";
}

export function groupNearestDate(g: ReservationGroup): Date | null {
  const dates = g.items.map(earliestDate).filter((d): d is Date => d !== null);
  if (dates.length === 0) return null;
  return new Date(Math.min(...dates.map((d) => d.getTime())));
}

interface CalendarEntry {
  booking: Booking;
  date: Date;
  label: string;
}

export function bookingCalendarEntries(b: Booking): CalendarEntry[] {
  if (b.serviceType === "suite") {
    const entries: CalendarEntry[] = [];
    if (b.checkIn) entries.push({ booking: b, date: new Date(b.checkIn), label: "Arrivée" });
    if (b.checkOut) entries.push({ booking: b, date: new Date(b.checkOut), label: "Départ" });
    return entries;
  }
  if (b.date) return [{ booking: b, date: new Date(b.date), label: serviceTypeLabel[b.serviceType] ?? b.serviceType }];
  return [];
}

function csvField(value: string | number): string {
  const s = String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function bookingsToCsv(bookings: Booking[]): string {
  const headers = [
    "Prénom", "Nom", "Email", "Téléphone", "Canal", "Service", "Prestation",
    "Arrivée", "Départ", "Date", "Adultes", "Enfants",
    "Expériences", "Demandes spéciales", "Statut", "Montant", "Devise", "Reçue le",
  ];
  const rows = bookings.map((b) => [
    b.firstName,
    b.lastName,
    b.email,
    b.phone ?? "",
    channelLabel[b.reservation?.channel ?? "website"] ?? "Site web",
    serviceTypeLabel[b.serviceType] ?? b.serviceType,
    getServiceName(b),
    b.checkIn ? format(new Date(b.checkIn), "yyyy-MM-dd") : "",
    b.checkOut ? format(new Date(b.checkOut), "yyyy-MM-dd") : "",
    b.date ? format(new Date(b.date), "yyyy-MM-dd") : "",
    b.guests,
    b.children,
    b.experiences ?? "",
    b.specialReqs ?? "",
    b.status,
    b.totalAmount,
    b.currency ?? "MAD",
    format(new Date(b.createdAt), "yyyy-MM-dd HH:mm"),
  ]);
  return [headers, ...rows].map((row) => row.map(csvField).join(",")).join("\n");
}
