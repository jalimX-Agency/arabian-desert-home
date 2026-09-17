import type { Booking, Reservation } from "@prisma/client";
import { escapeHtml, getLogoDataUri } from "@/lib/fiche-pdf";

export type TableBooking = Booking & {
  suite?: { name: string } | null;
  activity?: { name: string } | null;
  dayPass?: { name: string } | null;
  reservation?: Pick<Reservation, "id" | "channel"> | null;
};

const SERVICE_LABEL: Record<string, string> = { suite: "Tente", activity: "Activité", daypass: "Day Pass" };
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

function fmtDate(d: Date): string {
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

function fmtMoney(amount: number, currency: string): string {
  return `${amount.toLocaleString("fr-FR")} ${currency}`;
}

function serviceName(b: TableBooking): string {
  const base = b.suite?.name ?? b.activity?.name ?? b.dayPass?.name ?? "—";
  return b.quantity > 1 ? `${base} × ${b.quantity}` : base;
}

function datesCell(b: TableBooking): string {
  if (b.checkIn && b.checkOut) {
    const nights = Math.max(1, Math.round((b.checkOut.getTime() - b.checkIn.getTime()) / 86_400_000));
    return `${fmtDate(b.checkIn)} → ${fmtDate(b.checkOut)}<div class="sub">${nights} nuit${nights > 1 ? "s" : ""}</div>`;
  }
  return b.date ? fmtDate(b.date) : "—";
}

function refOf(b: TableBooking): string {
  return `ADH-${(b.reservation?.id ?? b.id).slice(-8).toUpperCase()}`;
}

export function buildReservationsTableHtml(bookings: TableBooking[], scopeLabel: string): string {
  const reservationCount = new Set(bookings.map((b) => b.reservation?.id ?? b.id)).size;

  // Totals exclude cancelled items and stay split by currency — MAD and EUR never get summed together.
  const totals = new Map<string, number>();
  for (const b of bookings) {
    if (b.status === "cancelled") continue;
    totals.set(b.currency, (totals.get(b.currency) ?? 0) + b.totalAmount);
  }
  const totalsText = totals.size
    ? [...totals].map(([cur, sum]) => fmtMoney(sum, cur)).join(" · ")
    : "—";

  let previousRef = "";
  const rows = bookings
    .map((b) => {
      const ref = refOf(b);
      const startsGroup = ref !== previousRef;
      previousRef = ref;
      const status = STATUS[b.status] ?? { label: b.status, cls: "st-pending" };
      const contact = [b.phone, b.email].filter(Boolean).map((s) => escapeHtml(String(s))).join("<br>");
      return `
        <tr class="${startsGroup ? "group-start" : "group-cont"}">
          <td class="ref">${startsGroup ? escapeHtml(ref) : ""}</td>
          <td>${startsGroup ? `<div class="name">${escapeHtml(`${b.firstName} ${b.lastName}`)}</div><div class="sub">${contact}</div>` : ""}</td>
          <td>${startsGroup ? escapeHtml(CHANNEL_LABEL[b.reservation?.channel ?? "website"] ?? "Site web") : ""}</td>
          <td><div class="kind">${escapeHtml(SERVICE_LABEL[b.serviceType] ?? b.serviceType)}</div>${escapeHtml(serviceName(b))}</td>
          <td class="nowrap">${datesCell(b)}</td>
          <td class="center">${b.guests}${b.children > 0 ? ` <span class="sub">+ ${b.children} enf.</span>` : ""}</td>
          <td><span class="status ${status.cls}">${escapeHtml(status.label)}</span></td>
          <td class="amount">${escapeHtml(fmtMoney(b.totalAmount, b.currency))}</td>
          <td class="sub nowrap">${escapeHtml(fmtDate(b.createdAt))}</td>
        </tr>`;
    })
    .join("");

  return `<!doctype html>
<html lang="fr"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600&family=Josefin+Sans:wght@400;600;700&display=swap">
<style>
  @page { size: A4 landscape; margin: 12mm 10mm 12mm; }
  :root { --ink:#221c14; --soft:#5c5344; --label:#9c8e72; --gold:#b07f2c; --rule:#e3d6b2; --paper:#fbf7ee; }
  * { box-sizing:border-box; }
  body { margin:0; color:var(--ink); font-family:"Josefin Sans","Segoe UI",sans-serif; font-size:9.5pt; }
  header { display:flex; align-items:center; justify-content:space-between; padding-bottom:10px; border-bottom:1.5px solid var(--gold); margin-bottom:10px; }
  header img { height:34px; }
  header h1 { font-family:"Cinzel",serif; font-weight:600; font-size:15pt; letter-spacing:.06em; margin:0; }
  .meta { text-align:right; color:var(--soft); font-size:8.5pt; line-height:1.5; }
  .meta strong { color:var(--ink); }
  table { width:100%; border-collapse:collapse; }
  thead { display:table-header-group; }
  th { white-space:nowrap; text-align:left; font-size:7.5pt; letter-spacing:.14em; text-transform:uppercase; color:var(--label); font-weight:600; padding:6px 6px; background:var(--paper); border-bottom:1px solid var(--rule); }
  td { padding:6px 6px; vertical-align:top; border-bottom:1px solid #f0e9d8; }
  tr { page-break-inside:avoid; }
  tr.group-start td { border-top:1px solid var(--rule); }
  tr.group-cont td { border-top:none; }
  .ref { font-weight:700; color:var(--gold); white-space:nowrap; font-size:8.5pt; }
  .name { font-weight:600; }
  .kind { font-size:7pt; letter-spacing:.12em; text-transform:uppercase; color:var(--label); }
  .sub { color:var(--soft); font-size:8pt; }
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
      <h1>Liste des réservations</h1>
    </div>
    <div class="meta">
      <div><strong>${escapeHtml(scopeLabel)}</strong> — ${reservationCount} réservation${reservationCount > 1 ? "s" : ""}, ${bookings.length} prestation${bookings.length > 1 ? "s" : ""}</div>
      <div>Générée le ${escapeHtml(new Date().toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" }))}</div>
    </div>
  </header>
  <table>
    <thead><tr>
      <th>Réf.</th><th>Client</th><th>Canal</th><th>Prestation</th><th>Dates</th>
      <th class="center">Voyageurs</th><th>Statut</th><th style="text-align:right">Montant</th><th>Reçue le</th>
    </tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="summary">
    <div><span>Total (hors annulées)</span><strong>${escapeHtml(totalsText)}</strong></div>
  </div>
</body></html>`;
}
