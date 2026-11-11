"use client";

import { useEffect, useMemo, useState } from "react";
import { MessageCircle, Phone, FileText, Eye, MousePointerClick, Percent, Layers, Filter, X, ArrowUp, ArrowDown } from "lucide-react";

interface Row { key: string; visits: number; pageViews: number; whatsapp: number; phone: number; form: number }
interface Stats {
  range: { from: string; to: string; days: number };
  totals: { visits: number; pageViews: number; whatsapp: number; phone: number; form: number; leads: number };
  previous: { visits: number; pageViews: number; leads: number };
  bySource: Row[];
  byCountry: Row[];
  byLang: Row[];
  byDevice: Row[];
  byPage: Row[];
  series: { day: string; visits: number; pageViews: number; leads: number }[];
  options: { countries: { key: string; n: number }[]; pages: { key: string; n: number }[] };
  visitsSince: string | null;
}
interface Filters { source: string; country: string; lang: string; device: string; page: string }

const SOURCE_LABEL: Record<string, string> = {
  ads: "Google Ads",
  organic: "Recherche Google (gratuit)",
  ai: "ChatGPT / assistants IA",
  social: "Réseaux sociaux",
  direct: "Direct",
  other: "Autres sites",
};
const LANG_LABEL: Record<string, string> = { fr: "Français", en: "English", es: "Español", it: "Italiano" };
const DEVICE_LABEL: Record<string, string> = { mobile: "Mobile", tablet: "Tablette", desktop: "Ordinateur", unknown: "Inconnu" };
const EMPTY: Filters = { source: "", country: "", lang: "", device: "", page: "" };
const PRESETS: { id: string; label: string; days: number }[] = [
  { id: "1", label: "Aujourd’hui", days: 1 },
  { id: "7", label: "7 j", days: 7 },
  { id: "30", label: "30 j", days: 30 },
  { id: "90", label: "90 j", days: 90 },
];

const today = () => new Date().toISOString().slice(0, 10);
const nf = new Intl.NumberFormat("fr-FR");
const dayLabel = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString("fr-FR", { day: "numeric", month: "short", timeZone: "UTC" });

let regionNames: Intl.DisplayNames | null = null;
function countryLabel(code: string): string {
  if (code === "unknown") return "Inconnu";
  try {
    regionNames ??= new Intl.DisplayNames(["fr"], { type: "region" });
    return regionNames.of(code) ?? code;
  } catch {
    return code;
  }
}

function Delta({ now, before }: { now: number; before: number }) {
  if (before === 0 && now === 0) return <span className="text-xs text-gray-400">= période précédente</span>;
  if (before === 0) return <span className="text-xs text-gray-400">nouveau</span>;
  const pct = Math.round(((now - before) / before) * 100);
  if (pct === 0) return <span className="text-xs text-gray-400">stable vs précédente</span>;
  const up = pct > 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs ${up ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
      {up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
      {Math.abs(pct)} % vs précédente
    </span>
  );
}

function Bars({ data, color, title }: { data: { day: string; n: number }[]; color: string; title: string }) {
  const max = Math.max(1, ...data.map((d) => d.n));
  return (
    <div>
      <p className="text-[11px] uppercase tracking-widest text-gray-400 mb-1.5">{title}</p>
      <div className="flex items-end gap-px h-20" role="img" aria-label={title}>
        {data.map((d) => (
          <div key={d.day} className="flex-1 min-w-px h-full flex items-end" title={`${dayLabel(d.day)} : ${d.n}`}>
            <div className={`w-full rounded-t-sm ${color}`} style={{ height: d.n === 0 ? "2px" : `${Math.max(4, (d.n / max) * 100)}%`, opacity: d.n === 0 ? 0.25 : 1 }} />
          </div>
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-gray-400 mt-1">
        <span>{data.length ? dayLabel(data[0].day) : ""}</span>
        <span>{data.length ? dayLabel(data[data.length - 1].day) : ""}</span>
      </div>
    </div>
  );
}

function BreakTable({
  title, rows, label, active, onPick, mono,
}: {
  title: string;
  rows: Row[];
  label: (key: string) => string;
  active: string;
  onPick: (key: string) => void;
  mono?: boolean;
}) {
  const shown = rows.slice(0, 15);
  return (
    <section className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
        <span className="text-[11px] text-gray-400">clic sur une ligne = filtrer</span>
      </div>
      {shown.length === 0 ? (
        <p className="px-5 py-6 text-sm text-gray-400 text-center">Aucune donnée sur cette période</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-widest text-gray-400 border-b border-gray-100 dark:border-white/10">
                <th className="text-left font-medium px-5 py-2">&nbsp;</th>
                <th className="font-medium px-2 py-2" title="Visites (première page d’une venue)"><Eye className="w-3.5 h-3.5 inline" /></th>
                <th className="font-medium px-2 py-2" title="Pages vues"><Layers className="w-3.5 h-3.5 inline" /></th>
                <th className="font-medium px-2 py-2" title="Clics WhatsApp"><MessageCircle className="w-3.5 h-3.5 inline" /></th>
                <th className="font-medium px-2 py-2" title="Appels"><Phone className="w-3.5 h-3.5 inline" /></th>
                <th className="font-medium px-2 py-2" title="Formulaires de réservation"><FileText className="w-3.5 h-3.5 inline" /></th>
                <th className="font-medium px-2 py-2" title="Demandes au total">Dem.</th>
                <th className="font-medium px-4 py-2" title="Demandes ÷ visites"><Percent className="w-3.5 h-3.5 inline" /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {shown.map((r) => {
                const leads = r.whatsapp + r.phone + r.form;
                const rate = r.visits > 0 ? `${Math.round((leads / r.visits) * 1000) / 10} %` : "—";
                const on = active === r.key;
                return (
                  <tr
                    key={r.key}
                    onClick={() => onPick(on ? "" : r.key)}
                    className={`cursor-pointer transition-colors ${on ? "bg-amber-50 dark:bg-amber-500/10" : "hover:bg-gray-50 dark:hover:bg-white/5"}`}
                  >
                    <td className={`px-5 py-2 text-gray-900 dark:text-white max-w-[260px] truncate ${mono ? "font-mono text-xs" : ""}`} title={label(r.key)}>{label(r.key)}</td>
                    <td className="px-2 py-2 text-center tabular-nums">{nf.format(r.visits)}</td>
                    <td className="px-2 py-2 text-center tabular-nums text-gray-500 dark:text-white/60">{nf.format(r.pageViews)}</td>
                    <td className="px-2 py-2 text-center tabular-nums">{r.whatsapp}</td>
                    <td className="px-2 py-2 text-center tabular-nums">{r.phone}</td>
                    <td className="px-2 py-2 text-center tabular-nums">{r.form}</td>
                    <td className="px-2 py-2 text-center font-semibold tabular-nums text-amber-600 dark:text-amber-400">{leads}</td>
                    <td className="px-4 py-2 text-center tabular-nums text-gray-500 dark:text-white/60">{rate}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

const selectCls = "w-full rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-2.5 py-1.5 text-sm text-gray-900 dark:text-white";

/**
 * Visits and requests by where the visitor came from, with filters (period, source, country,
 * language, device, page). Counted by the site itself, with no cookie, so it includes visitors
 * who refused or ignored the cookie banner (Google Analytics and Google Ads cannot see them).
 */
export function LeadSourcesCard() {
  const [preset, setPreset] = useState("30");
  const [from, setFrom] = useState(today());
  const [to, setTo] = useState(today());
  const [filters, setFilters] = useState<Filters>(EMPTY);
  const [pageInput, setPageInput] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [failed, setFailed] = useState(false);

  const query = useMemo(() => {
    const q = new URLSearchParams();
    if (preset === "custom") {
      q.set("from", from);
      q.set("to", to);
    } else {
      q.set("days", preset);
    }
    for (const [k, v] of Object.entries(filters)) if (v) q.set(k, v);
    return q.toString();
  }, [preset, from, to, filters]);

  useEffect(() => {
    let live = true;
    setFailed(false);
    fetch(`/api/admin/lead-stats?${query}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: Stats) => { if (live) setStats(d); })
      .catch(() => { if (live) setFailed(true); });
    return () => { live = false; };
  }, [query]);

  // The page filter is typed: apply it after a short pause rather than on every key.
  useEffect(() => {
    const t = setTimeout(() => setFilters((f) => (f.page === pageInput.trim() ? f : { ...f, page: pageInput.trim() })), 400);
    return () => clearTimeout(t);
  }, [pageInput]);

  const set = (k: keyof Filters) => (v: string) => setFilters((f) => ({ ...f, [k]: v }));
  const activeCount = Object.values(filters).filter(Boolean).length;
  const clear = () => { setFilters(EMPTY); setPageInput(""); };

  const t = stats?.totals;
  const rate = t && t.visits > 0 ? `${Math.round((t.leads / t.visits) * 1000) / 10} %` : "—";
  const startedAfter = stats?.visitsSince && stats.range.from < stats.visitsSince.slice(0, 10);

  return (
    <section className="space-y-4">
      <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Visites et demandes par source</h2>
            <p className="text-xs text-gray-400">Visites, clics WhatsApp, appels et formulaires, comptés sans cookie · dates en UTC</p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => setPreset(p.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                  preset === p.id ? "bg-amber-500 text-white" : "bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white/70 hover:bg-gray-200 dark:hover:bg-white/15"
                }`}
              >
                {p.label}
              </button>
            ))}
            <button
              onClick={() => setPreset("custom")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                preset === "custom" ? "bg-amber-500 text-white" : "bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white/70 hover:bg-gray-200 dark:hover:bg-white/15"
              }`}
            >
              Dates…
            </button>
            <button
              onClick={() => setShowFilters((s) => !s)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                showFilters || activeCount > 0 ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900" : "bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white/70 hover:bg-gray-200 dark:hover:bg-white/15"
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              Filtres{activeCount > 0 ? ` (${activeCount})` : ""}
            </button>
          </div>
        </div>

        {preset === "custom" && (
          <div className="px-5 py-3 border-b border-gray-100 dark:border-white/10 flex flex-wrap items-center gap-3 text-sm">
            <label className="flex items-center gap-2 text-gray-500 dark:text-white/60">
              Du
              <input type="date" value={from} max={to} onChange={(e) => e.target.value && setFrom(e.target.value)} className={`${selectCls} w-auto`} />
            </label>
            <label className="flex items-center gap-2 text-gray-500 dark:text-white/60">
              au
              <input type="date" value={to} min={from} max={today()} onChange={(e) => e.target.value && setTo(e.target.value)} className={`${selectCls} w-auto`} />
            </label>
          </div>
        )}

        {showFilters && (
          <div className="px-5 py-4 border-b border-gray-100 dark:border-white/10 grid grid-cols-2 lg:grid-cols-5 gap-3">
            <label className="text-xs text-gray-500 dark:text-white/60 space-y-1">
              Source
              <select value={filters.source} onChange={(e) => set("source")(e.target.value)} className={selectCls}>
                <option value="">Toutes</option>
                {Object.entries(SOURCE_LABEL).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
              </select>
            </label>
            <label className="text-xs text-gray-500 dark:text-white/60 space-y-1">
              Pays
              <select value={filters.country} onChange={(e) => set("country")(e.target.value)} className={selectCls}>
                <option value="">Tous</option>
                {(stats?.options.countries ?? []).map((c) => <option key={c.key} value={c.key}>{countryLabel(c.key)}</option>)}
              </select>
            </label>
            <label className="text-xs text-gray-500 dark:text-white/60 space-y-1">
              Langue du site
              <select value={filters.lang} onChange={(e) => set("lang")(e.target.value)} className={selectCls}>
                <option value="">Toutes</option>
                {Object.entries(LANG_LABEL).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
              </select>
            </label>
            <label className="text-xs text-gray-500 dark:text-white/60 space-y-1">
              Appareil
              <select value={filters.device} onChange={(e) => set("device")(e.target.value)} className={selectCls}>
                <option value="">Tous</option>
                {["mobile", "tablet", "desktop"].map((k) => <option key={k} value={k}>{DEVICE_LABEL[k]}</option>)}
              </select>
            </label>
            <label className="text-xs text-gray-500 dark:text-white/60 space-y-1">
              Page contient
              <input value={pageInput} onChange={(e) => setPageInput(e.target.value)} placeholder="/les-tentes" className={selectCls} />
            </label>
            {activeCount > 0 && (
              <div className="col-span-2 lg:col-span-5">
                <button onClick={clear} className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 cursor-pointer hover:underline">
                  <X className="w-3.5 h-3.5" /> Effacer les filtres
                </button>
              </div>
            )}
          </div>
        )}

        {failed ? (
          <p className="px-5 py-8 text-sm text-red-500 text-center">Impossible de charger les statistiques. Réessayez dans un instant.</p>
        ) : !stats || !t ? (
          <div className="p-5"><div className="h-28 rounded-xl bg-gray-100 dark:bg-white/5 animate-pulse" /></div>
        ) : (
          <div className="p-5 space-y-5">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: "Visites", value: nf.format(t.visits), icon: Eye, sub: <Delta now={t.visits} before={stats.previous.visits} /> },
                { label: "Pages vues", value: nf.format(t.pageViews), icon: Layers, sub: <Delta now={t.pageViews} before={stats.previous.pageViews} /> },
                { label: "Demandes", value: nf.format(t.leads), icon: MousePointerClick, sub: <Delta now={t.leads} before={stats.previous.leads} /> },
                { label: "Demandes ÷ visites", value: rate, icon: Percent, sub: <span className="text-xs text-gray-400">{t.whatsapp} WhatsApp · {t.phone} appels · {t.form} formulaires</span> },
              ].map((k) => (
                <div key={k.label} className="rounded-xl border border-gray-100 dark:border-white/10 p-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] uppercase tracking-widest text-gray-400">{k.label}</span>
                    <k.icon className="w-4 h-4 text-amber-500 dark:text-amber-400/60" />
                  </div>
                  <div className="text-2xl font-semibold text-gray-900 dark:text-white tabular-nums">{k.value}</div>
                  <div className="mt-0.5">{k.sub}</div>
                </div>
              ))}
            </div>

            {!stats.visitsSince ? (
              <p className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 rounded-lg px-3 py-2">
                Le comptage des visites démarre avec cette mise à jour : les premières visites apparaîtront ici. Les demandes (WhatsApp, appels, formulaires) sont comptées depuis le 28 octobre.
              </p>
            ) : startedAfter ? (
              <p className="text-xs text-gray-500 dark:text-white/60 bg-gray-50 dark:bg-white/5 rounded-lg px-3 py-2">
                Les visites sont comptées depuis le {new Date(stats.visitsSince).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })} : avant cette date, seules les demandes sont comptées.
              </p>
            ) : null}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <Bars title="Visites par jour" color="bg-amber-500" data={stats.series.map((d) => ({ day: d.day, n: d.visits }))} />
              <Bars title="Demandes par jour" color="bg-emerald-500" data={stats.series.map((d) => ({ day: d.day, n: d.leads }))} />
            </div>
          </div>
        )}
      </div>

      {stats && (
        <>
          <BreakTable title="Par source" rows={stats.bySource} label={(k) => SOURCE_LABEL[k] ?? k} active={filters.source} onPick={set("source")} />
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <BreakTable title="Par pays" rows={stats.byCountry} label={countryLabel} active={filters.country} onPick={set("country")} />
            <BreakTable
              title="Pages d’arrivée et pages vues"
              rows={stats.byPage}
              label={(k) => k}
              active={filters.page}
              onPick={(k) => { setPageInput(k); setShowFilters(true); }}
              mono
            />
            <BreakTable title="Par langue du site" rows={stats.byLang} label={(k) => LANG_LABEL[k] ?? k} active={filters.lang} onPick={set("lang")} />
            <BreakTable title="Par appareil" rows={stats.byDevice} label={(k) => DEVICE_LABEL[k] ?? k} active={filters.device} onPick={set("device")} />
          </div>
          <p className="text-[11px] text-gray-400 px-1">
            Légende : <Eye className="w-3 h-3 inline" /> visites (première page d’une venue) · <Layers className="w-3 h-3 inline" /> pages vues · <MessageCircle className="w-3 h-3 inline" /> WhatsApp · <Phone className="w-3 h-3 inline" /> appels · <FileText className="w-3 h-3 inline" /> formulaires · Dem. = total des demandes · <Percent className="w-3 h-3 inline" /> demandes ÷ visites. Les demandes d’avant la mise à jour n’ont ni pays ni appareil (« Inconnu »). Vos propres visites, connecté à l’admin, ne sont pas comptées.
          </p>
        </>
      )}
    </section>
  );
}
