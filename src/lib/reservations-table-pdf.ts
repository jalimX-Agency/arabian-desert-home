import type { Booking, Reservation } from "@prisma/client";
import { escapeHtml, getLogoDataUri } from "@/lib/fiche-pdf";
import { formatMoney, sumMoney } from "@/lib/money";
import { calendarDay, dayKey, nightsBetweenDays } from "@/lib/calendar-day";

export type TableBooking = Booking & {
  suite?: { name: string } | null;
  activity?: { name: string } | null;
  dayPass?: { name: string } | null;
  reservation?: Pick<Reservation, "id" | "channel" | "specialReqs"> | null;
};

const SERVICE_LABEL: Record<string, string> = { suite: "Tente", activity: "Activité", daypass: "Day Pass", custom: "Prestation" };
const CHANNEL_LABEL: Record<string, string> = {
  website: "Site web",
  email: "Email",
  whatsapp: "WhatsApp",
  "booking.com": "Booking.com",
  expedia: "Expedia",
  "trip.com": "Trip.com",
};
const STATUS: Record<string, { label: string; cls: string }> = {
  pending: { label: "En attente", cls: "st-pending" },
  confirmed: { label: "Confirmée", cls: "st-confirmed" },
  cancelled: { label: "Annulée", cls: "st-cancelled" },
};

/** Stay dates are calendar days: read them in UTC so the server never shifts them. */
function fmtDate(d: Date): string {
  return calendarDay(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });
}

function fmtDayHeading(d: Date): string {
  const s = calendarDay(d).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function fmtMoney(amount: number, currency: string): string {
  return `${formatMoney(amount)} ${currency}`;
}

function serviceName(b: TableBooking): string {
  const base = b.serviceType === "custom"
    ? b.label || "Prestation"
    : b.suite?.name ?? b.activity?.name ?? b.dayPass?.name ?? "—";
  return b.quantity > 1 ? `${base} × ${b.quantity}` : base;
}

function datesCell(b: TableBooking): string {
  if (b.checkIn && b.checkOut) {
    const nights = Math.max(1, nightsBetweenDays(b.checkIn, b.checkOut));
    return `${fmtDate(b.checkIn)} → ${fmtDate(b.checkOut)}<div class="sub">${nights} nuit${nights > 1 ? "s" : ""}</div>`;
  }
  return b.date ? fmtDate(b.date) : `<span class="sub">${b.serviceType === "custom" ? "pendant le séjour" : "—"}</span>`;
}

export function refOf(b: TableBooking): string {
  return `ADH-${(b.reservation?.id ?? b.id).slice(-8).toUpperCase()}`;
}

/** The day a line happens: arrival for a tent, the date otherwise (null when undated). */
export function startOf(b: Pick<Booking, "checkIn" | "date">): Date | null {
  const d = b.checkIn ?? b.date;
  return d ? calendarDay(d) : null;
}

/** The day a line is planned on. An undated line (transfer, lunch… added by hand) goes with
 *  its reservation: on that reservation's first dated day. */
function planningDays(bookings: TableBooking[]): (b: TableBooking) => Date | null {
  const firstDay = new Map<string, number>();
  for (const b of bookings) {
    const d = startOf(b);
    if (!d) continue;
    const r = refOf(b);
    firstDay.set(r, Math.min(firstDay.get(r) ?? Infinity, d.getTime()));
  }
  return (b) => startOf(b) ?? (firstDay.has(refOf(b)) ? new Date(firstDay.get(refOf(b))!) : null);
}

/** Placeholders some channels put in contact fields ("-", "--", "n/a"). */
export function realContact(value: string | null | undefined): string | null {
  const v = (value ?? "").trim();
  return v && !/^[-–—_.\s]*$|^n\/?a$/i.test(v) ? v : null;
}

/**
 * Chronological order for a planning: by the day each line happens (tent arrival or
 * activity date), then by reservation so a family's lines stay together on that day,
 * then tents before activities. Undated lines go last.
 */
export function sortForPlanning(bookings: TableBooking[]): TableBooking[] {
  const typeRank: Record<string, number> = { suite: 0, daypass: 1, activity: 2, custom: 3 };
  const day = planningDays(bookings);
  return [...bookings].sort((a, b) => {
    const da = day(a)?.getTime() ?? Infinity;
    const db = day(b)?.getTime() ?? Infinity;
    if (da !== db) return da - db;
    const ra = refOf(a), rb = refOf(b);
    if (ra !== rb) return ra < rb ? -1 : 1;
    return (typeRank[a.serviceType] ?? 9) - (typeRank[b.serviceType] ?? 9);
  });
}

export function buildReservationsTableHtml(bookings: TableBooking[], scopeLabel: string): string {
  const reservationCount = new Set(bookings.map((b) => b.reservation?.id ?? b.id)).size;
  const active = bookings.filter((b) => b.status !== "cancelled");

  // Totals exclude cancelled items and stay split by currency — MAD and EUR never get summed together.
  const totals = new Map<string, number[]>();
  for (const b of active) totals.set(b.currency, [...(totals.get(b.currency) ?? []), b.totalAmount]);
  const totalsText = totals.size ? [...totals].map(([cur, list]) => fmtMoney(sumMoney(list), cur)).join(" · ") : "—";
  const tentNights = active
    .filter((b) => b.serviceType === "suite" && b.checkIn && b.checkOut)
    .reduce((n, b) => n + nightsBetweenDays(b.checkIn!, b.checkOut!) * Math.max(1, b.quantity), 0);

  const dated = bookings.map(startOf).filter((d): d is Date => d !== null).map((d) => d.getTime());
  const period = dated.length
    ? `${fmtDate(new Date(Math.min(...dated)))} → ${fmtDate(new Date(Math.max(...dated)))}`
    : "";

  // One section per day, headed by what the team has to prepare that day.
  const planned = planningDays(bookings);
  const days = new Map<string, TableBooking[]>();
  for (const b of bookings) {
    const d = planned(b);
    const key = d ? dayKey(d) : "undated";
    days.set(key, [...(days.get(key) ?? []), b]);
  }

  const sections = [...days].map(([key, lines]) => {
    const live = lines.filter((b) => b.status !== "cancelled");
    const arrivals = live.filter((b) => b.serviceType === "suite").reduce((n, b) => n + Math.max(1, b.quantity), 0);
    const activities = live.filter((b) => b.serviceType === "activity" || b.serviceType === "daypass").length;
    // People are counted once per reservation that day, not once per line.
    const byRes = new Map<string, TableBooking>();
    for (const b of live) {
      const r = refOf(b);
      const prev = byRes.get(r);
      if (!prev || b.guests + b.children > prev.guests + prev.children) byRes.set(r, b);
    }
    const adults = [...byRes.values()].reduce((n, b) => n + b.guests, 0);
    const kids = [...byRes.values()].reduce((n, b) => n + b.children, 0);
    const facts = [
      arrivals ? `${arrivals} tente${arrivals > 1 ? "s" : ""} à préparer` : "",
      activities ? `${activities} activité${activities > 1 ? "s" : ""} / day pass` : "",
      adults || kids ? `${adults} adulte${adults > 1 ? "s" : ""}${kids ? ` · ${kids} enfant${kids > 1 ? "s" : ""}` : ""}` : "",
    ].filter(Boolean).join(" — ");
    const heading = key === "undated" ? "Sans date" : fmtDayHeading(new Date(key));

    let previousRef = "";
    const rows = lines.map((b) => {
      const ref = refOf(b);
      const startsGroup = ref !== previousRef;
      previousRef = ref;
      const status = STATUS[b.status] ?? { label: b.status, cls: "st-pending" };
      const contact = [realContact(b.phone), realContact(b.email)].filter(Boolean).map((s) => escapeHtml(s!)).join("<br>");
      const notes = (b.reservation?.specialReqs ?? b.specialReqs ?? "").trim();
      const fullName = [realContact(b.firstName), realContact(b.lastName)].filter(Boolean).join(" ") || "—";
      const clientCell = startsGroup
        ? `<div class="name">${escapeHtml(fullName)}</div>${contact ? `<div class="sub">${contact}</div>` : ""}${notes ? `<div class="note">${escapeHtml(notes.length > 140 ? `${notes.slice(0, 140)}…` : notes)}</div>` : ""}`
        : "";
      return `
        <tr class="${startsGroup ? "group-start" : "group-cont"}${b.status === "cancelled" ? " cancelled" : ""}">
          <td class="ref">${startsGroup ? escapeHtml(ref) : ""}</td>
          <td>${clientCell}</td>
          <td>${startsGroup ? escapeHtml(CHANNEL_LABEL[b.reservation?.channel ?? "website"] ?? "Site web") : ""}</td>
          <td><div class="kind">${escapeHtml(SERVICE_LABEL[b.serviceType] ?? b.serviceType)}</div>${escapeHtml(serviceName(b))}</td>
          <td class="nowrap">${datesCell(b)}</td>
          <td class="center">${b.serviceType === "custom" && !b.guests ? "—" : `${b.guests}${b.children > 0 ? ` <span class="sub">+ ${b.children} enf.</span>` : ""}`}</td>
          <td><span class="status ${status.cls}">${escapeHtml(status.label)}</span></td>
          <td class="amount">${escapeHtml(fmtMoney(b.totalAmount, b.currency))}</td>
          <td class="sub nowrap">${escapeHtml(fmtDate(b.createdAt))}</td>
        </tr>`;
    }).join("");

    return `
      <tbody class="day">
        <tr class="day-head"><td colspan="9"><span class="day-name">${escapeHtml(heading)}</span>${facts ? `<span class="day-facts">${escapeHtml(facts)}</span>` : ""}</td></tr>
        ${rows}
      </tbody>`;
  }).join("");

  return `<!doctype html>
<html lang="fr"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600&family=Josefin+Sans:wght@400;600;700&display=swap">
<style>
  @page { size: A4 landscape; margin: 12mm 10mm 14mm; }
  :root { --ink:#221c14; --soft:#5c5344; --label:#9c8e72; --gold:#b07f2c; --rule:#e3d6b2; --paper:#fbf7ee; }
  * { box-sizing:border-box; }
  body { margin:0; color:var(--ink); font-family:"Josefin Sans","Segoe UI",sans-serif; font-size:9.5pt; }
  header { display:flex; align-items:center; justify-content:space-between; padding-bottom:10px; border-bottom:1.5px solid var(--gold); margin-bottom:10px; }
  header img { height:34px; }
  header h1 { font-family:"Cinzel",serif; font-weight:600; font-size:15pt; letter-spacing:.06em; margin:0; }
  .meta { text-align:right; color:var(--soft); font-size:8.5pt; line-height:1.5; }
  .meta strong { color:var(--ink); }
  .kpis { display:flex; gap:10px; margin:0 0 12px; }
  .kpi { flex:1; background:var(--paper); border:1px solid var(--rule); border-radius:6px; padding:7px 10px; }
  .kpi span { display:block; font-size:7pt; letter-spacing:.14em; text-transform:uppercase; color:var(--label); }
  .kpi strong { font-size:11pt; }
  table { width:100%; border-collapse:collapse; }
  thead { display:table-header-group; }
  th { white-space:nowrap; text-align:left; font-size:7.5pt; letter-spacing:.14em; text-transform:uppercase; color:var(--label); font-weight:600; padding:6px 6px; background:var(--paper); border-bottom:1px solid var(--rule); }
  td { padding:6px 6px; vertical-align:top; border-bottom:1px solid #f0e9d8; }
  tr { page-break-inside:avoid; }
  tbody.day { page-break-inside:auto; }
  tr.day-head td { background:#f3ead5; border-top:1.5px solid var(--gold); padding:7px 8px; page-break-after:avoid; }
  .day-name { font-family:"Cinzel",serif; font-weight:600; font-size:10.5pt; margin-right:14px; }
  .day-facts { color:var(--soft); font-size:8.5pt; }
  tr.group-start td { border-top:1px solid var(--rule); }
  tr.group-cont td { border-top:none; }
  tr.cancelled td { color:#9a8f86; }
  tr.cancelled .amount { text-decoration:line-through; }
  .ref { font-weight:700; color:var(--gold); white-space:nowrap; font-size:8.5pt; }
  .name { font-weight:600; }
  .kind { font-size:7pt; letter-spacing:.12em; text-transform:uppercase; color:var(--label); }
  .sub { color:var(--soft); font-size:8pt; }
  .note { margin-top:3px; color:var(--soft); font-size:7.5pt; font-style:italic; max-width:230px; }
  .nowrap { white-space:nowrap; }
  .center { text-align:center; }
  .amount { text-align:right; white-space:nowrap; font-weight:600; }
  .status { display:inline-block; padding:2px 8px; border-radius:99px; font-size:7.5pt; font-weight:600; white-space:nowrap; }
  .st-pending { background:#fdf3d7; color:#8a6414; }
  .st-confirmed { background:#e3f3e8; color:#1e6b3f; }
  .st-cancelled { background:#f8e3e3; color:#7a3b3b; }
  .summary { display:flex; justify-content:flex-end; gap:28px; margin-top:12px; padding-top:8px; border-top:1.5px solid var(--gold); font-size:9pt; }
  .summary span { color:var(--label); text-transform:uppercase; letter-spacing:.12em; font-size:7.5pt; margin-right:6px; }
  .summary strong { color:var(--gold); }
</style></head>
<body>
  <header>
    <div style="display:flex;align-items:center;gap:14px">
      <img src="${getLogoDataUri()}" alt="Arabian Desert Home">
      <h1>Planning des réservations</h1>
    </div>
    <div class="meta">
      <div><strong>${escapeHtml(scopeLabel)}</strong>${period ? ` — ${escapeHtml(period)}` : ""}</div>
      <div>Classé par date d'arrivée / de prestation · généré le ${escapeHtml(new Date().toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short", timeZone: "Africa/Casablanca" }))}</div>
    </div>
  </header>
  <div class="kpis">
    <div class="kpi"><span>Réservations</span><strong>${reservationCount}</strong></div>
    <div class="kpi"><span>Prestations</span><strong>${bookings.length}</strong>${bookings.length !== active.length ? ` <span style="display:inline;letter-spacing:0;text-transform:none">(${bookings.length - active.length} annulée${bookings.length - active.length > 1 ? "s" : ""})</span>` : ""}</div>
    <div class="kpi"><span>Nuits de tente</span><strong>${tentNights}</strong></div>
    <div class="kpi"><span>Total (hors annulées)</span><strong>${escapeHtml(totalsText)}</strong></div>
  </div>
  <table>
    <thead><tr>
      <th>Réf.</th><th>Client</th><th>Canal</th><th>Prestation</th><th>Dates</th>
      <th class="center">Voyageurs</th><th>Statut</th><th style="text-align:right">Montant</th><th>Reçue le</th>
    </tr></thead>
    ${sections}
  </table>
  <div class="summary">
    <div><span>Total (hors annulées)</span><strong>${escapeHtml(totalsText)}</strong></div>
  </div>
</body></html>`;
}

/** Page numbers in the PDF footer (Chrome's header/footer template). */
export const TABLE_PDF_FOOTER = `<div style="width:100%;font-size:8px;color:#9c8e72;padding:0 10mm;display:flex;justify-content:space-between;font-family:Segoe UI,sans-serif">
  <span>Arabian Desert Home — Planning des réservations</span>
  <span>Page <span class="pageNumber"></span> / <span class="totalPages"></span></span>
</div>`;
