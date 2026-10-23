import type { PrismaClient } from "@prisma/client";
import { calendarDay, dayKey, DAY_MS, nightsBetweenDays } from "@/lib/calendar-day";
import { escapeHtml, getLogoDataUri } from "@/lib/fiche-pdf";
import { realContact, refOf, type TableBooking } from "@/lib/reservations-table-pdf";

/**
 * What the team needs for one day: who arrives, who stays, who leaves, the activities and
 * extras (transfers, meals) booked for that day, and the totals to prepare (tents, dinners,
 * breakfasts). Cancelled lines are left out; pending ones are flagged so they can be
 * confirmed before the guests arrive.
 */

export interface PlanGuest {
  ref: string;
  name: string;
  phone: string | null;
  channel: string;
  pending: boolean;
  notes: string | null;
}

export interface PlanStay extends PlanGuest {
  tent: string;
  quantity: number;
  adults: number;
  children: number;
  checkIn: string;
  checkOut: string;
  nights: number;
}

export interface PlanLine extends PlanGuest {
  label: string;
  adults: number;
  children: number;
  quantity: number;
}

export interface DayPlan {
  date: string;
  arrivals: PlanStay[];
  staying: PlanStay[];
  departures: PlanStay[];
  activities: PlanLine[];
  dayPasses: PlanLine[];
  extras: PlanLine[];
  totals: {
    tentsToPrepare: number;
    tentsOccupied: number;
    tentsToClean: number;
    dinnerAdults: number;
    dinnerChildren: number;
    breakfastAdults: number;
    breakfastChildren: number;
    activityPeople: number;
    pending: number;
  };
}

type PlanBooking = TableBooking;

function guestOf(b: PlanBooking): PlanGuest {
  const name = [realContact(b.firstName), realContact(b.lastName)].filter(Boolean).join(" ") || "—";
  return {
    ref: refOf(b),
    name,
    phone: realContact(b.phone),
    channel: b.reservation?.channel ?? "website",
    pending: b.status === "pending",
    notes: realContact(b.reservation?.specialReqs ?? b.specialReqs),
  };
}

function stayOf(b: PlanBooking): PlanStay {
  return {
    ...guestOf(b),
    tent: b.suite?.name ?? "Tente",
    quantity: b.quantity,
    adults: b.guests,
    children: b.children,
    checkIn: dayKey(b.checkIn!),
    checkOut: dayKey(b.checkOut!),
    nights: Math.max(1, nightsBetweenDays(b.checkIn!, b.checkOut!)),
  };
}

function lineOf(b: PlanBooking): PlanLine {
  return {
    ...guestOf(b),
    label: b.serviceType === "custom" ? b.label || "Prestation" : b.activity?.name ?? b.dayPass?.name ?? "—",
    adults: b.guests,
    children: b.children,
    quantity: b.quantity,
  };
}

export async function buildDayPlan(db: PrismaClient, day: Date): Promise<DayPlan> {
  const d = calendarDay(day).getTime();
  const include = {
    suite: { select: { name: true } },
    activity: { select: { name: true } },
    dayPass: { select: { name: true } },
    reservation: { select: { id: true, channel: true, specialReqs: true } },
  } as const;

  // A day of margin on each side: older rows sit a few hours off UTC midnight.
  const around = { gte: new Date(d - 2 * DAY_MS), lte: new Date(d + 2 * DAY_MS) };
  const rows = (await db.booking.findMany({
    where: {
      status: { not: "cancelled" },
      OR: [
        { serviceType: "suite", checkIn: { lte: around.lte }, checkOut: { gte: around.gte } },
        { date: around },
      ],
    },
    include,
  })) as PlanBooking[];

  const sameDay = (x: Date | null) => !!x && calendarDay(x).getTime() === d;
  const stays = rows.filter((b) => b.serviceType === "suite" && b.checkIn && b.checkOut);
  const arrivals = stays.filter((b) => sameDay(b.checkIn));
  const staying = stays.filter((b) => calendarDay(b.checkIn!).getTime() < d && d < calendarDay(b.checkOut!).getTime());
  const departures = stays.filter((b) => sameDay(b.checkOut));
  const dated = rows.filter((b) => b.serviceType !== "suite" && sameDay(b.date));

  // Undated extras (transfer, lunch… added by hand) belong to their reservation's first day.
  const arrivingReservations = [...new Set(arrivals.map((b) => b.reservationId).filter((id): id is string => !!id))];
  const undated = arrivingReservations.length
    ? ((await db.booking.findMany({
        where: { reservationId: { in: arrivingReservations }, serviceType: "custom", date: null, status: { not: "cancelled" } },
        include,
      })) as PlanBooking[])
    : [];

  const sum = (list: PlanBooking[], f: (b: PlanBooking) => number) => list.reduce((n, b) => n + f(b), 0);
  const night = [...arrivals, ...staying];
  const morning = [...staying, ...departures];
  const activities = dated.filter((b) => b.serviceType === "activity");
  const dayPasses = dated.filter((b) => b.serviceType === "daypass");
  const extras = [...dated.filter((b) => b.serviceType === "custom"), ...undated];

  const byName = (a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name);
  const lists = {
    arrivals: arrivals.map(stayOf).sort(byName),
    extras: extras.map(lineOf).sort(byName),
    activities: activities.map(lineOf).sort((a, b) => a.label.localeCompare(b.label) || a.name.localeCompare(b.name)),
    dayPasses: dayPasses.map(lineOf).sort(byName),
    staying: staying.map(stayOf).sort(byName),
    departures: departures.map(stayOf).sort(byName),
  };
  // A reservation's note is shown once, on its first line in reading order.
  const noted = new Set<string>();
  for (const g of Object.values(lists).flat()) {
    if (noted.has(g.ref)) g.notes = null;
    else if (g.notes) noted.add(g.ref);
  }
  return {
    date: dayKey(d),
    ...lists,
    totals: {
      tentsToPrepare: sum(arrivals, (b) => b.quantity),
      tentsOccupied: sum(night, (b) => b.quantity),
      tentsToClean: sum(departures, (b) => b.quantity),
      dinnerAdults: sum(night, (b) => b.guests),
      dinnerChildren: sum(night, (b) => b.children),
      breakfastAdults: sum(morning, (b) => b.guests),
      breakfastChildren: sum(morning, (b) => b.children),
      activityPeople: sum([...activities, ...dayPasses], (b) => b.guests + b.children),
      pending: new Set([...arrivals, ...dated, ...undated].filter((b) => b.status === "pending").map((b) => refOf(b))).size,
    },
  };
}

/** Groups activity lines by activity name: what each guide or team needs to know. */
export function groupByLabel(lines: PlanLine[]): { label: string; people: number; lines: PlanLine[] }[] {
  const map = new Map<string, PlanLine[]>();
  for (const l of lines) map.set(l.label, [...(map.get(l.label) ?? []), l]);
  return [...map.entries()].map(([label, ls]) => ({ label, people: ls.reduce((n, l) => n + l.adults + l.children, 0), lines: ls }));
}

const CHANNEL: Record<string, string> = { website: "Site", email: "Email", whatsapp: "WhatsApp", "booking.com": "Booking", expedia: "Expedia", "trip.com": "Trip.com" };

function fmtDay(iso: string, opts: Intl.DateTimeFormatOptions): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("fr-FR", { ...opts, timeZone: "UTC" });
}

function people(adults: number, children: number): string {
  return `${adults} ad.${children > 0 ? ` + ${children} enf.` : ""}`;
}

/** One-page (or more) A4 sheet for the team: the day's totals first, then each list. */
export function buildDayPlanHtml(plan: DayPlan): string {
  const e = escapeHtml;
  const title = fmtDay(plan.date, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const t = plan.totals;
  const guestCell = (g: PlanGuest) =>
    `<strong>${e(g.name)}</strong>${g.pending ? ' <span class="pending">À CONFIRMER</span>' : ""}<div class="sub">${e(g.ref)} · ${e(CHANNEL[g.channel] ?? g.channel)}${g.phone ? ` · ${e(g.phone)}` : ""}</div>${g.notes ? `<div class="note">${e(g.notes)}</div>` : ""}`;

  const stayTable = (list: PlanStay[], kind: "arrival" | "staying" | "departure") => list.length === 0 ? '<p class="empty">Aucune</p>' : `
    <table><thead><tr><th>Client</th><th>Tente</th><th class="c">Pers.</th><th>${kind === "departure" ? "Arrivé le" : "Départ"}</th><th class="c">✓</th></tr></thead><tbody>
    ${list.map((s) => `<tr><td>${guestCell(s)}</td><td>${e(s.tent)}${s.quantity > 1 ? ` × ${s.quantity}` : ""}</td><td class="c">${people(s.adults, s.children)}</td><td>${kind === "departure" ? fmtDay(s.checkIn, { day: "2-digit", month: "short" }) : `${fmtDay(s.checkOut, { day: "2-digit", month: "short" })} <span class="sub">(${s.nights} nuit${s.nights > 1 ? "s" : ""})</span>`}</td><td class="c box"></td></tr>`).join("")}
    </tbody></table>`;

  const lineTable = (list: PlanLine[]) => list.length === 0 ? '<p class="empty">Aucune</p>' : `
    <table><thead><tr><th>Prestation</th><th>Client</th><th class="c">Pers.</th><th class="c">✓</th></tr></thead><tbody>
    ${list.map((l) => `<tr><td><strong>${e(l.label)}</strong>${l.quantity > 1 ? ` × ${l.quantity}` : ""}</td><td>${guestCell(l)}</td><td class="c">${l.adults + l.children > 0 ? people(l.adults, l.children) : "—"}</td><td class="c box"></td></tr>`).join("")}
    </tbody></table>`;

  const groups = groupByLabel(plan.activities);
  const kpi = (n: number | string, label: string, sub = "") => `<div class="kpi"><div class="n">${n}</div><div class="l">${label}</div>${sub ? `<div class="s">${sub}</div>` : ""}</div>`;

  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><style>
    @page { size: A4; margin: 12mm 10mm 14mm; }
    * { box-sizing: border-box; }
    body { font-family: "Segoe UI", Arial, sans-serif; color: #2b2418; font-size: 10.5px; margin: 0; }
    header { display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #b8893b; padding-bottom: 8px; margin-bottom: 12px; }
    header img { height: 42px; }
    h1 { font-size: 18px; margin: 0; color: #6b4e1f; }
    h1 small { display: block; font-size: 11px; color: #8a7a5c; font-weight: normal; margin-top: 2px; }
    h2 { font-size: 12.5px; color: #6b4e1f; margin: 16px 0 6px; padding-bottom: 3px; border-bottom: 1px solid #e8dcc4; text-transform: uppercase; letter-spacing: .05em; }
    h2 .count { color: #8a7a5c; font-weight: normal; }
    .kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }
    .kpi { border: 1px solid #e8dcc4; border-radius: 6px; padding: 7px 8px; background: #fbf7ef; }
    .kpi .n { font-size: 18px; font-weight: 700; color: #6b4e1f; }
    .kpi .l { font-size: 10px; color: #5c5040; }
    .kpi .s { font-size: 9px; color: #8a7a5c; margin-top: 1px; }
    .alert { margin-top: 8px; padding: 6px 9px; background: #fff4e0; border: 1px solid #f0c27a; border-radius: 6px; color: #8a5300; font-weight: 600; }
    table { width: 100%; border-collapse: collapse; page-break-inside: auto; }
    tr { page-break-inside: avoid; }
    th { text-align: left; font-size: 9px; text-transform: uppercase; color: #8a7a5c; border-bottom: 1px solid #d9c9a8; padding: 4px 5px; }
    td { border-bottom: 1px solid #efe6d4; padding: 5px; vertical-align: top; }
    .c { text-align: center; }
    .box { width: 24px; }
    .box::after { content: ""; display: inline-block; width: 11px; height: 11px; border: 1px solid #9c8e72; border-radius: 2px; }
    .sub { color: #8a7a5c; font-size: 9px; }
    .note { margin-top: 2px; font-size: 9.5px; color: #6b4e1f; background: #fbf3e2; padding: 2px 5px; border-radius: 3px; }
    .pending { font-size: 8px; color: #b45309; border: 1px solid #f0c27a; border-radius: 3px; padding: 0 3px; }
    .empty { color: #a89a7c; font-style: italic; margin: 2px 0 0; }
    .group { margin: 8px 0 2px; font-weight: 600; }
  </style></head><body>
    <header>
      <div><h1>Planning du ${e(title)}<small>Ce qu'il faut préparer · généré le ${new Date().toLocaleString("fr-FR", { timeZone: "Africa/Casablanca", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}</small></h1></div>
      <img src="${getLogoDataUri()}" alt="Arabian Desert Home">
    </header>
    <div class="kpis">
      ${kpi(t.tentsToPrepare, "Tentes à préparer", "arrivées du jour")}
      ${kpi(t.tentsOccupied, "Tentes occupées ce soir")}
      ${kpi(`${t.dinnerAdults + t.dinnerChildren}`, "Dîners ce soir", people(t.dinnerAdults, t.dinnerChildren))}
      ${kpi(`${t.breakfastAdults + t.breakfastChildren}`, "Petits-déjeuners le matin", people(t.breakfastAdults, t.breakfastChildren))}
      ${kpi(t.tentsToClean, "Tentes à nettoyer", "départs du jour")}
      ${kpi(t.activityPeople, "Personnes en activité", "activités + Day Pass")}
      ${kpi(plan.extras.length, "Prestations / transferts")}
      ${kpi(t.pending, "Réservations à confirmer")}
    </div>
    ${t.pending > 0 ? `<div class="alert">${t.pending} réservation${t.pending > 1 ? "s" : ""} encore en attente pour ce jour : à confirmer avec le client.</div>` : ""}
    <h2>Arrivées <span class="count">(${plan.arrivals.length})</span></h2>${stayTable(plan.arrivals, "arrival")}
    <h2>Prestations &amp; transferts <span class="count">(${plan.extras.length})</span></h2>${lineTable(plan.extras)}
    <h2>Activités <span class="count">(${groups.reduce((n, g) => n + g.people, 0)} pers.)</span></h2>
    ${groups.length === 0 ? '<p class="empty">Aucune</p>' : groups.map((g) => `<div class="group">${e(g.label)} — ${g.people} pers.</div>${lineTable(g.lines)}`).join("")}
    <h2>Day Pass <span class="count">(${plan.dayPasses.length})</span></h2>${lineTable(plan.dayPasses)}
    <h2>Clients déjà sur place <span class="count">(${plan.staying.length})</span></h2>${stayTable(plan.staying, "staying")}
    <h2>Départs <span class="count">(${plan.departures.length})</span></h2>${stayTable(plan.departures, "departure")}
  </body></html>`;
}
