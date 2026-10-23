"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Loader2, Lock, Unlock, RotateCcw, Tag, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addDaysISO, parseISODay, toISODay } from "@/lib/tent-stay";

type ItemType = "suite" | "activity" | "dayPass";

interface Cell {
  price: number;
  season: string | null;
  closed: boolean;
  closure: string | null;
  taken: number;
}

interface Row {
  type: ItemType;
  id: string;
  name: string;
  currency: string;
  basePrice: number;
  units: number | null;
  cells: Cell[];
}

interface CalendarData {
  days: string[];
  rows: Row[];
}

const DAYS = 35;
const STEP = 14;
const GROUPS: { type: ItemType; label: string }[] = [
  { type: "suite", label: "Tentes" },
  { type: "activity", label: "Activités" },
  { type: "dayPass", label: "Day Pass" },
];

interface Selection {
  rowA: number;
  dayA: number;
  rowB: number;
  dayB: number;
}

const keyOf = (r: Pick<Row, "type" | "id">) => `${r.type}:${r.id}`;
const dayLabel = (iso: string, pattern: string) => format(parseISODay(iso)!, pattern, { locale: fr });

/**
 * Booking-style rates & availability grid. Drag across cells (or click a cell, then
 * shift-click another) to select dates for one or several items, then set a price, go
 * back to the base price, close or reopen them from the panel.
 */
export function AvailabilityCalendar() {
  const [from, setFrom] = useState(() => toISODay(new Date()));
  const [data, setData] = useState<CalendarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ItemType | "all">("all");
  const [sel, setSel] = useState<Selection | null>(null);
  const dragging = useRef(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/calendar?from=${from}&days=${DAYS}`);
      if (res.ok) setData(await res.json());
    } finally {
      setLoading(false);
    }
  }, [from]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const stop = () => { dragging.current = false; };
    window.addEventListener("pointerup", stop);
    return () => window.removeEventListener("pointerup", stop);
  }, []);

  const rows = useMemo(() => (data?.rows ?? []).filter((r) => filter === "all" || r.type === filter), [data, filter]);
  const today = toISODay(new Date());

  function move(days: number) {
    setSel(null);
    setFrom((f) => addDaysISO(f, days));
  }

  function onCellDown(e: React.PointerEvent, rowIdx: number, dayIdx: number) {
    e.preventDefault();
    if (e.shiftKey && sel) {
      setSel({ ...sel, rowB: rowIdx, dayB: dayIdx });
      return;
    }
    dragging.current = true;
    setSel({ rowA: rowIdx, dayA: dayIdx, rowB: rowIdx, dayB: dayIdx });
  }

  function onCellEnter(rowIdx: number, dayIdx: number) {
    if (!dragging.current) return;
    setSel((s) => (s ? { ...s, rowB: rowIdx, dayB: dayIdx } : s));
  }

  const bounds = sel && {
    r0: Math.min(sel.rowA, sel.rowB),
    r1: Math.max(sel.rowA, sel.rowB),
    d0: Math.min(sel.dayA, sel.dayB),
    d1: Math.max(sel.dayA, sel.dayB),
  };
  const isSelected = (r: number, d: number) => !!bounds && r >= bounds.r0 && r <= bounds.r1 && d >= bounds.d0 && d <= bounds.d1;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button onClick={() => move(-STEP)} className="p-2 rounded-lg border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer" aria-label="Période précédente">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => { setSel(null); setFrom(toISODay(new Date())); }} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 text-sm hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer">
            Aujourd&apos;hui
          </button>
          <button onClick={() => move(STEP)} className="p-2 rounded-lg border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer" aria-label="Période suivante">
            <ChevronRight className="w-4 h-4" />
          </button>
          <input
            type="date"
            value={from}
            onChange={(e) => { if (e.target.value) { setSel(null); setFrom(e.target.value); } }}
            className="ml-1 rounded-lg border border-gray-200 dark:border-white/10 bg-transparent px-2 py-1.5 text-sm"
            aria-label="Aller à la date"
          />
          {loading && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {([{ type: "all", label: "Tout" }, ...GROUPS] as { type: ItemType | "all"; label: string }[]).map((g) => (
            <button
              key={g.type}
              onClick={() => { setSel(null); setFilter(g.type); }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                filter === g.type ? "bg-amber-500 text-white" : "bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white/70 hover:bg-gray-200 dark:hover:bg-white/15"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-500 dark:text-white/50">
        Glissez sur les cases pour choisir des dates (sur plusieurs lignes si besoin), ou cliquez une case puis Maj + clic sur une autre.
        <span className="inline-flex items-center gap-3 ml-3">
          <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-100 dark:bg-amber-500/20 border border-amber-300" /> Tarif saisonnier</span>
          <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-100 dark:bg-red-500/20 border border-red-300" /> Fermé</span>
        </span>
      </p>

      <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.02] overflow-x-auto select-none">
        {data && (
          <table className="border-collapse text-xs">
            <thead>
              <tr>
                <th className="sticky left-0 z-20 bg-white dark:bg-[#141414] min-w-[170px] px-3 py-2 text-left font-medium text-gray-500 border-b border-r border-gray-200 dark:border-white/10">
                  {dayLabel(data.days[0], "MMMM yyyy")}
                </th>
                {data.days.map((d) => {
                  const date = parseISODay(d)!;
                  const weekend = date.getDay() === 0 || date.getDay() === 6;
                  return (
                    <th
                      key={d}
                      className={`min-w-[62px] px-1 py-1.5 font-normal border-b border-gray-200 dark:border-white/10 ${
                        d === today ? "bg-amber-500 text-white" : weekend ? "bg-gray-50 dark:bg-white/[0.04] text-gray-600 dark:text-white/70" : "text-gray-500 dark:text-white/60"
                      }`}
                    >
                      <div className="capitalize">{dayLabel(d, "EEE")}</div>
                      <div className="text-sm font-semibold">{dayLabel(d, "d")}</div>
                      {(date.getDate() === 1) && <div className="text-[10px] uppercase">{dayLabel(d, "MMM")}</div>}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {GROUPS.filter((g) => rows.some((r) => r.type === g.type)).map((g) => (
                <GroupRows
                  key={g.type}
                  label={g.label}
                  colSpan={data.days.length}
                  rows={rows}
                  type={g.type}
                  days={data.days}
                  isSelected={isSelected}
                  onCellDown={onCellDown}
                  onCellEnter={onCellEnter}
                />
              ))}
            </tbody>
          </table>
        )}
        {!data && <div className="p-10 text-center text-sm text-gray-400">Chargement du calendrier…</div>}
      </div>

      {data && bounds && (
        <EditPanel
          key={`${bounds.r0}-${bounds.r1}-${bounds.d0}-${bounds.d1}-${from}`}
          rows={rows.slice(bounds.r0, bounds.r1 + 1)}
          fromDay={data.days[bounds.d0]}
          toDay={data.days[bounds.d1]}
          firstCell={rows[bounds.r0].cells[bounds.d0]}
          booked={rows.slice(bounds.r0, bounds.r1 + 1).some((r) => r.cells.slice(bounds.d0, bounds.d1 + 1).some((c) => c.taken > 0))}
          onClose={() => setSel(null)}
          onSaved={() => { setSel(null); load(); }}
        />
      )}
    </div>
  );
}

function GroupRows({
  label, colSpan, rows, type, days, isSelected, onCellDown, onCellEnter,
}: {
  label: string;
  colSpan: number;
  rows: Row[];
  type: ItemType;
  days: string[];
  isSelected: (r: number, d: number) => boolean;
  onCellDown: (e: React.PointerEvent, r: number, d: number) => void;
  onCellEnter: (r: number, d: number) => void;
}) {
  return (
    <>
      <tr>
        <td className="sticky left-0 z-10 bg-gray-50 dark:bg-[#1a1a1a] px-3 py-1.5 text-[11px] uppercase tracking-widest text-gray-500 font-semibold border-b border-gray-200 dark:border-white/10">
          {label}
        </td>
        <td colSpan={colSpan} className="bg-gray-50 dark:bg-white/[0.03] border-b border-gray-200 dark:border-white/10" />
      </tr>
      {rows.map((row, rowIdx) => row.type !== type ? null : (
        <tr key={keyOf(row)}>
          <td className="sticky left-0 z-10 bg-white dark:bg-[#141414] px-3 py-2 border-b border-r border-gray-200 dark:border-white/10 align-top">
            <div className="font-medium text-gray-900 dark:text-white text-[13px] leading-tight max-w-[170px] truncate" title={row.name}>{row.name}</div>
            <div className="text-[11px] text-gray-400">
              Base {row.basePrice} {row.currency}{row.units !== null ? ` · ${row.units} tente${row.units > 1 ? "s" : ""}` : ""}
            </div>
          </td>
          {row.cells.map((c, dayIdx) => {
            const selected = isSelected(rowIdx, dayIdx);
            const left = row.units !== null ? row.units - c.taken : null;
            const tone = c.closed
              ? "bg-red-50 dark:bg-red-500/10"
              : c.season
              ? "bg-amber-50 dark:bg-amber-500/10"
              : "";
            return (
              <td
                key={days[dayIdx]}
                onPointerDown={(e) => onCellDown(e, rowIdx, dayIdx)}
                onPointerEnter={() => onCellEnter(rowIdx, dayIdx)}
                title={[
                  c.closed ? `Fermé${c.closure ? ` — ${c.closure}` : ""}` : null,
                  c.season ? `Tarif « ${c.season} »` : "Prix de base",
                  row.units !== null ? `${c.taken}/${row.units} tente(s) réservée(s)` : c.taken > 0 ? `${c.taken} personne(s) réservée(s)` : null,
                ].filter(Boolean).join("\n")}
                className={`relative h-[54px] px-1 text-center border-b border-r border-gray-100 dark:border-white/5 cursor-pointer ${tone} ${
                  selected ? "outline outline-2 -outline-offset-2 outline-blue-500 bg-blue-50 dark:bg-blue-500/20" : "hover:bg-gray-50 dark:hover:bg-white/5"
                }`}
              >
                {c.closed ? (
                  <div className="text-red-600 dark:text-red-400 font-semibold text-[11px] flex flex-col items-center gap-0.5">
                    <Lock className="w-3 h-3" />Fermé
                  </div>
                ) : (
                  <div className={`font-semibold ${c.season ? "text-amber-700 dark:text-amber-400" : "text-gray-800 dark:text-white/85"}`}>
                    {c.price}
                  </div>
                )}
                {left !== null ? (
                  <div className={`text-[10px] ${left <= 0 ? "text-red-500 font-semibold" : c.taken > 0 ? "text-blue-600 dark:text-blue-400" : "text-gray-400"}`}>
                    {left <= 0 ? "complet" : `${left} libre${left > 1 ? "s" : ""}`}
                  </div>
                ) : c.taken > 0 ? (
                  <div className="text-[10px] text-blue-600 dark:text-blue-400">{c.taken} pers.</div>
                ) : null}
              </td>
            );
          })}
        </tr>
      ))}
    </>
  );
}

function EditPanel({
  rows, fromDay, toDay, firstCell, booked, onClose, onSaved,
}: {
  rows: Row[];
  fromDay: string;
  toDay: string;
  firstCell: Cell;
  booked: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [start, setStart] = useState(fromDay);
  const [end, setEnd] = useState(toDay);
  const [price, setPrice] = useState(String(firstCell.price));
  const [priceLabel, setPriceLabel] = useState(firstCell.season ?? "");
  const [closeLabel, setCloseLabel] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");

  const currencies = [...new Set(rows.map((r) => r.currency))];
  const dayCount = Math.round((parseISODay(end)!.getTime() - parseISODay(start)!.getTime()) / 86_400_000) + 1;

  async function send(action: "price" | "reset" | "close" | "open") {
    setError("");
    if (end < start) return setError("La date de fin est avant la date de début.");
    if (action === "price" && !(Number(price) > 0)) return setError("Indiquez un prix.");
    setBusy(action);
    try {
      const res = await fetch("/api/admin/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          from: start,
          to: end,
          targets: rows.map((r) => ({ type: r.type, id: r.id })),
          price: Number(price),
          label: action === "close" ? closeLabel : priceLabel,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "L'enregistrement a échoué.");
        return;
      }
      onSaved();
    } catch {
      setError("Erreur réseau.");
    } finally {
      setBusy(null);
    }
  }

  const btn = "inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer";

  return (
    <div className="sticky bottom-3 z-30 rounded-2xl border border-blue-200 dark:border-blue-500/30 bg-white dark:bg-[#141414] shadow-xl p-4 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {rows.length === 1 ? rows[0].name : `${rows.length} éléments`} · {dayCount} jour{dayCount > 1 ? "s" : ""}
          </p>
          {rows.length > 1 && <p className="text-xs text-gray-500 truncate max-w-[60ch]">{rows.map((r) => r.name).join(", ")}</p>}
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer" aria-label="Annuler la sélection">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <Label className="text-xs text-gray-400 mb-1 block">Du</Label>
          <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
        </div>
        <div>
          <Label className="text-xs text-gray-400 mb-1 block">Au (inclus)</Label>
          <Input type="date" value={end} min={start} onChange={(e) => setEnd(e.target.value)} />
        </div>
        <div>
          <Label className="text-xs text-gray-400 mb-1 block">Prix {currencies.length === 1 ? `(${currencies[0]})` : ""}{rows[0]?.type === "suite" ? " / nuit" : " / pers."}</Label>
          <Input type="number" min={1} value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        <div>
          <Label className="text-xs text-gray-400 mb-1 block">Nom du tarif (facultatif)</Label>
          <Input value={priceLabel} onChange={(e) => setPriceLabel(e.target.value)} placeholder="Haute saison, Noël…" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => send("price")} disabled={!!busy} className={`${btn} bg-amber-500 hover:bg-amber-400 text-white`}>
          {busy === "price" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Tag className="w-4 h-4" />} Appliquer ce prix
        </button>
        <button onClick={() => send("reset")} disabled={!!busy} className={`${btn} border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5`}>
          {busy === "reset" ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />} Revenir au prix de base
        </button>
      </div>

      <div className="flex flex-wrap items-end gap-2 pt-3 border-t border-gray-100 dark:border-white/10">
        <div className="flex-1 min-w-[180px]">
          <Label className="text-xs text-gray-400 mb-1 block">Motif de fermeture (facultatif)</Label>
          <Input value={closeLabel} onChange={(e) => setCloseLabel(e.target.value)} placeholder="Travaux, complet, privatisation…" />
        </div>
        <button onClick={() => send("close")} disabled={!!busy} className={`${btn} bg-red-600 hover:bg-red-500 text-white`}>
          {busy === "close" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />} Fermer ces dates
        </button>
        <button onClick={() => send("open")} disabled={!!busy} className={`${btn} border border-green-300 dark:border-green-500/40 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-500/10`}>
          {busy === "open" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Unlock className="w-4 h-4" />} Ouvrir ces dates
        </button>
      </div>

      {booked && (
        <p className="text-xs text-amber-700 dark:text-amber-400">
          Des réservations existent déjà sur ces dates : un nouveau prix ne les change pas, et une fermeture ne les annule pas.
        </p>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
