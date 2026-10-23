"use client";

import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { BedDouble, Utensils, Coffee, Sparkles, Car, AlertTriangle, FileDown, Loader2, LogIn, LogOut, Home, ChevronDown } from "lucide-react";
import { addDaysISO, parseISODay, toISODay } from "@/lib/tent-stay";
import type { DayPlan, PlanLine, PlanStay } from "@/lib/day-plan";

const CHANNEL: Record<string, string> = { website: "Site", email: "Email", whatsapp: "WhatsApp", "booking.com": "Booking", expedia: "Expedia", "trip.com": "Trip.com" };
const people = (a: number, c: number) => `${a} ad.${c > 0 ? ` + ${c} enf.` : ""}`;

/**
 * "What do we prepare?" for one day — tomorrow by default: totals for the team (tents,
 * dinners, breakfasts, activities), the arrivals, extras and activities, and a PDF to print.
 */
export function DayPlanCard({ defaultOffset = 1, defaultOpen = true }: { defaultOffset?: number; defaultOpen?: boolean }) {
  const today = toISODay(new Date());
  const [date, setDate] = useState(() => addDaysISO(today, defaultOffset));
  const [plan, setPlan] = useState<DayPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [open, setOpen] = useState(defaultOpen);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/day-plan?date=${date}`);
      if (res.ok) setPlan(await res.json());
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => { load(); }, [load]);

  async function exportPdf() {
    setExporting(true);
    try {
      const res = await fetch(`/api/admin/day-plan/pdf?date=${date}`);
      if (!res.ok) return alert("La génération du PDF a échoué.");
      const url = URL.createObjectURL(await res.blob());
      const a = document.createElement("a");
      a.href = url;
      a.download = `planning-${date}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }

  const chips = [
    { label: "Aujourd'hui", value: today },
    { label: "Demain", value: addDaysISO(today, 1) },
    { label: "Après-demain", value: addDaysISO(today, 2) },
  ];
  const t = plan?.totals;
  const heading = format(parseISODay(date)!, "EEEE d MMMM", { locale: fr });
  const empty = plan && plan.arrivals.length + plan.staying.length + plan.departures.length + plan.activities.length + plan.dayPasses.length + plan.extras.length === 0;

  return (
    <section className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">À préparer — <span className="capitalize">{heading}</span></h2>
          <p className="text-xs text-gray-400">Arrivées, repas, activités et transferts du jour</p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {chips.map((c) => (
            <button
              key={c.value}
              onClick={() => setDate(c.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                date === c.value ? "bg-amber-500 text-white" : "bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white/70 hover:bg-gray-200 dark:hover:bg-white/15"
              }`}
            >
              {c.label}
            </button>
          ))}
          <input
            type="date"
            value={date}
            onChange={(e) => e.target.value && setDate(e.target.value)}
            className="rounded-lg border border-gray-200 dark:border-white/10 bg-transparent px-2 py-1 text-xs"
            aria-label="Choisir un jour"
          />
          <button
            onClick={exportPdf}
            disabled={exporting || !plan}
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-white text-xs font-semibold px-3 py-1.5 disabled:opacity-50 cursor-pointer"
          >
            {exporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileDown className="w-3.5 h-3.5" />} PDF
          </button>
          <button onClick={() => setOpen((o) => !o)} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer" aria-label={open ? "Replier" : "Déplier"}>
            <ChevronDown className={`w-4 h-4 transition-transform ${open ? "" : "-rotate-90"}`} />
          </button>
        </div>
      </div>

      {open && (
        <div className="p-5 space-y-5">
          {loading && !plan ? (
            <div className="h-24 rounded-xl bg-gray-100 dark:bg-white/5 animate-pulse" />
          ) : plan && t ? (
            <>
              <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 ${loading ? "opacity-60" : ""}`}>
                <Kpi icon={BedDouble} value={t.tentsToPrepare} label="Tentes à préparer" sub={`${t.tentsOccupied} occupée${t.tentsOccupied > 1 ? "s" : ""} le soir`} />
                <Kpi icon={Utensils} value={t.dinnerAdults + t.dinnerChildren} label="Dîners" sub={people(t.dinnerAdults, t.dinnerChildren)} />
                <Kpi icon={Coffee} value={t.breakfastAdults + t.breakfastChildren} label="Petits-déjeuners" sub={people(t.breakfastAdults, t.breakfastChildren)} />
                <Kpi icon={Sparkles} value={t.activityPeople} label="Pers. en activité" sub={`${plan.extras.length} prestation${plan.extras.length > 1 ? "s" : ""} / transfert${plan.extras.length > 1 ? "s" : ""}`} />
              </div>

              {t.pending > 0 && (
                <div className="flex items-center gap-2 rounded-xl border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 px-3 py-2 text-xs text-amber-800 dark:text-amber-300">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  {t.pending} réservation{t.pending > 1 ? "s" : ""} encore en attente ce jour-là : à confirmer avec le client.
                </div>
              )}

              {empty ? (
                <p className="text-sm text-gray-400 text-center py-4">Rien de prévu ce jour-là.</p>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <StayList icon={LogIn} title="Arrivées" list={plan.arrivals} kind="arrival" />
                  <LineList icon={Car} title="Prestations & transferts" list={plan.extras} />
                  <LineList icon={Sparkles} title="Activités" list={plan.activities} showLabel />
                  {plan.dayPasses.length > 0 && <LineList icon={Sparkles} title="Day Pass" list={plan.dayPasses} showLabel />}
                  <StayList icon={Home} title="Déjà sur place" list={plan.staying} kind="staying" />
                  <StayList icon={LogOut} title="Départs" list={plan.departures} kind="departure" />
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-red-500">Impossible de charger le planning.</p>
          )}
        </div>
      )}
    </section>
  );
}

function Kpi({ icon: Icon, value, label, sub }: { icon: React.ElementType; value: number; label: string; sub: string }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-white/10 p-3">
      <div className="flex items-center justify-between text-gray-400 mb-1">
        <span className="text-[11px] uppercase tracking-widest">{label}</span>
        <Icon className="w-4 h-4 text-amber-500" />
      </div>
      <div className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</div>
      <div className="text-[11px] text-gray-400">{sub}</div>
    </div>
  );
}

function Header({ icon: Icon, title, count }: { icon: React.ElementType; title: string; count: number }) {
  return (
    <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
      <Icon className="w-3.5 h-3.5 text-amber-500" /> {title} <span className="text-gray-400 font-normal">({count})</span>
    </h3>
  );
}

function Guest({ g }: { g: PlanStay | PlanLine }) {
  return (
    <div className="min-w-0">
      <p className="text-sm text-gray-900 dark:text-white truncate">
        {g.name}
        {g.pending && <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400">à confirmer</span>}
      </p>
      <p className="text-[11px] text-gray-400 truncate">{g.ref} · {CHANNEL[g.channel] ?? g.channel}{g.phone ? ` · ${g.phone}` : ""}</p>
      {g.notes && <p className="text-[11px] text-amber-700 dark:text-amber-400 line-clamp-2">{g.notes}</p>}
    </div>
  );
}

function StayList({ icon, title, list, kind }: { icon: React.ElementType; title: string; list: PlanStay[]; kind: "arrival" | "staying" | "departure" }) {
  return (
    <div>
      <Header icon={icon} title={title} count={list.length} />
      {list.length === 0 ? <p className="text-xs text-gray-400">Aucune</p> : (
        <ul className="divide-y divide-gray-100 dark:divide-white/5">
          {list.map((s, i) => (
            <li key={`${s.ref}-${i}`} className="py-2 flex items-start justify-between gap-3">
              <Guest g={s} />
              <div className="text-right shrink-0">
                <p className="text-xs text-gray-700 dark:text-white/80">{s.tent}{s.quantity > 1 ? ` × ${s.quantity}` : ""}</p>
                <p className="text-[11px] text-gray-400">
                  {people(s.adults, s.children)}
                  {kind !== "departure" && ` · départ ${format(parseISODay(s.checkOut)!, "d MMM", { locale: fr })}`}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function LineList({ icon, title, list, showLabel = false }: { icon: React.ElementType; title: string; list: PlanLine[]; showLabel?: boolean }) {
  return (
    <div>
      <Header icon={icon} title={title} count={list.length} />
      {list.length === 0 ? <p className="text-xs text-gray-400">Aucune</p> : (
        <ul className="divide-y divide-gray-100 dark:divide-white/5">
          {list.map((l, i) => (
            <li key={`${l.ref}-${i}`} className="py-2 flex items-start justify-between gap-3">
              <div className="min-w-0">
                {(showLabel || l.label) && <p className="text-xs font-medium text-amber-700 dark:text-amber-400 truncate">{l.label}{l.quantity > 1 ? ` × ${l.quantity}` : ""}</p>}
                <Guest g={l} />
              </div>
              {l.adults + l.children > 0 && <p className="text-[11px] text-gray-400 shrink-0">{people(l.adults, l.children)}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
