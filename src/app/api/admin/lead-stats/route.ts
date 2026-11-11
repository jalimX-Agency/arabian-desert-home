import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { isLeadSource } from "@/lib/lead-source";
import { VISIT_DEVICES } from "@/lib/visit";

const DAY = 86_400_000;
const KINDS = ["whatsapp", "phone", "form"] as const;

type Row = { key: string; visits: number; pageViews: number; whatsapp: number; phone: number; form: number };

function parseDay(value: string | null): Date | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const d = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Joins a visits breakdown and a lead-actions breakdown on the same key. */
function merge(
  visits: { key: string; entry: boolean; n: number }[],
  leads: { key: string; kind: string; n: number }[],
): Row[] {
  const rows = new Map<string, Row>();
  const get = (key: string) => {
    let r = rows.get(key);
    if (!r) rows.set(key, (r = { key, visits: 0, pageViews: 0, whatsapp: 0, phone: 0, form: 0 }));
    return r;
  };
  for (const v of visits) {
    const r = get(v.key);
    r.pageViews += v.n;
    if (v.entry) r.visits += v.n;
  }
  for (const l of leads) {
    if ((KINDS as readonly string[]).includes(l.kind)) get(l.key)[l.kind as (typeof KINDS)[number]] += l.n;
  }
  return [...rows.values()].sort(
    (a, b) => b.visits - a.visits || b.whatsapp + b.phone + b.form - (a.whatsapp + a.phone + a.form) || b.pageViews - a.pageViews,
  );
}

/**
 * GET ?from=YYYY-MM-DD&to=YYYY-MM-DD (or ?days=30) and optional filters source, country
 * ("unknown" for rows without one), lang, device, page (path contains). Visits, page views and
 * lead actions (WhatsApp, calls, form) with breakdowns, a daily series and the previous period
 * for comparison. Everything is counted by the site itself, without cookies.
 */
export async function GET(req: NextRequest) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const sp = req.nextUrl.searchParams;

  const today = new Date(new Date().toISOString().slice(0, 10) + "T00:00:00.000Z");
  let to = parseDay(sp.get("to")) ?? today;
  if (to.getTime() > today.getTime()) to = today;
  let from = parseDay(sp.get("from"));
  if (!from) {
    const days = Math.min(365, Math.max(1, Number(sp.get("days")) || 30));
    from = new Date(to.getTime() - (days - 1) * DAY);
  }
  if (from.getTime() > to.getTime()) from = to;
  if (to.getTime() - from.getTime() > 400 * DAY) from = new Date(to.getTime() - 400 * DAY);
  const start = from;
  const end = new Date(to.getTime() + DAY); // exclusive
  const length = end.getTime() - start.getTime();
  const prevStart = new Date(start.getTime() - length);

  const source = sp.get("source");
  const country = sp.get("country");
  const lang = sp.get("lang");
  const device = sp.get("device");
  const page = sp.get("page")?.trim().slice(0, 80);

  const fields: { source?: string; country?: string; lang?: string; device?: string; page?: { contains: string; mode: "insensitive" } } = {};
  if (source && isLeadSource(source)) fields.source = source;
  if (country) fields.country = country === "unknown" ? "" : country.toUpperCase().slice(0, 2);
  if (lang && ["fr", "en", "es", "it"].includes(lang)) fields.lang = lang;
  if (device && (VISIT_DEVICES as string[]).includes(device)) fields.device = device;
  if (page) fields.page = { contains: page, mode: "insensitive" };

  const visitWhere = (gte: Date, lt: Date): Prisma.SiteVisitWhereInput => ({ createdAt: { gte, lt }, ...fields });
  const leadWhere = (gte: Date, lt: Date): Prisma.LeadEventWhereInput => ({ createdAt: { gte, lt }, ...fields });
  const vw = visitWhere(start, end);
  const lw = leadWhere(start, end);

  const vGroup = (by: "source" | "country" | "lang" | "device" | "page") =>
    db.siteVisit.groupBy({ by: [by, "entry"], where: vw, _count: { _all: true } });
  const lGroup = (by: "source" | "country" | "lang" | "device" | "page") =>
    db.leadEvent.groupBy({ by: [by, "kind"], where: lw, _count: { _all: true } });

  const [
    vSource, vCountry, vLang, vDevice, vPage,
    lSource, lCountry, lLang, lDevice, lPage,
    visitRows, leadRows,
    prevVisits, prevViews, prevLeads,
    optionCountries, optionPages, firstVisit,
  ] = await Promise.all([
    vGroup("source"), vGroup("country"), vGroup("lang"), vGroup("device"), vGroup("page"),
    lGroup("source"), lGroup("country"), lGroup("lang"), lGroup("device"), lGroup("page"),
    db.siteVisit.findMany({ where: vw, select: { createdAt: true, entry: true }, take: 150_000 }),
    db.leadEvent.findMany({ where: lw, select: { createdAt: true }, take: 50_000 }),
    db.siteVisit.count({ where: { ...visitWhere(prevStart, start), entry: true } }),
    db.siteVisit.count({ where: visitWhere(prevStart, start) }),
    db.leadEvent.count({ where: leadWhere(prevStart, start) }),
    db.siteVisit.groupBy({ by: ["country"], where: { createdAt: { gte: start, lt: end } }, _count: { _all: true } }),
    db.siteVisit.groupBy({ by: ["page"], where: { createdAt: { gte: start, lt: end }, entry: true }, _count: { _all: true } }),
    db.siteVisit.aggregate({ _min: { createdAt: true } }),
  ]);

  const vRows = <T extends { entry: boolean; _count: { _all: number } }>(rows: T[], key: (r: T) => string) =>
    rows.map((r) => ({ key: key(r), entry: r.entry, n: r._count._all }));
  const lRows = <T extends { kind: string; _count: { _all: number } }>(rows: T[], key: (r: T) => string) =>
    rows.map((r) => ({ key: key(r), kind: r.kind, n: r._count._all }));

  const bySource = merge(vRows(vSource, (r) => r.source), lRows(lSource, (r) => r.source));
  const byCountry = merge(vRows(vCountry, (r) => r.country || "unknown"), lRows(lCountry, (r) => r.country || "unknown"));
  const byLang = merge(vRows(vLang, (r) => r.lang), lRows(lLang, (r) => r.lang));
  const byDevice = merge(vRows(vDevice, (r) => r.device || "unknown"), lRows(lDevice, (r) => r.device || "unknown"));
  const byPage = merge(vRows(vPage, (r) => r.page), lRows(lPage, (r) => r.page)).slice(0, 25);

  const sum = (rows: Row[], k: keyof Omit<Row, "key">) => rows.reduce((n, r) => n + r[k], 0);
  const whatsapp = sum(bySource, "whatsapp"), phone = sum(bySource, "phone"), form = sum(bySource, "form");
  const visits = sum(bySource, "visits"), pageViews = sum(bySource, "pageViews");

  const series = new Map<string, { day: string; visits: number; pageViews: number; leads: number }>();
  for (let t = start.getTime(); t < end.getTime(); t += DAY) {
    const day = new Date(t).toISOString().slice(0, 10);
    series.set(day, { day, visits: 0, pageViews: 0, leads: 0 });
  }
  for (const v of visitRows) {
    const s = series.get(v.createdAt.toISOString().slice(0, 10));
    if (s) { s.pageViews++; if (v.entry) s.visits++; }
  }
  for (const l of leadRows) {
    const s = series.get(l.createdAt.toISOString().slice(0, 10));
    if (s) s.leads++;
  }

  return NextResponse.json({
    range: { from: start.toISOString().slice(0, 10), to: to.toISOString().slice(0, 10), days: Math.round(length / DAY) },
    totals: { visits, pageViews, whatsapp, phone, form, leads: whatsapp + phone + form },
    previous: { visits: prevVisits, pageViews: prevViews, leads: prevLeads },
    bySource, byCountry, byLang, byDevice, byPage,
    series: [...series.values()],
    options: {
      countries: optionCountries.map((c) => ({ key: c.country || "unknown", n: c._count._all })).sort((a, b) => b.n - a.n).slice(0, 80),
      pages: optionPages.map((p) => ({ key: p.page, n: p._count._all })).sort((a, b) => b.n - a.n).slice(0, 60),
    },
    visitsSince: firstVisit._min.createdAt?.toISOString() ?? null,
  });
}
