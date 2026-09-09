"use client";

import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Plus, Pencil, Trash2, X } from "lucide-react";

type TargetType = "suite" | "activity" | "dayPass";

interface EntityOption {
  id: string;
  name: string;
  price?: number;
}

interface SeasonalPrice {
  id: string;
  label: string;
  startDate: string;
  endDate: string;
  price: number;
  suiteId: string | null;
  activityId: string | null;
  dayPassId: string | null;
  suite: { name: string } | null;
  activity: { name: string } | null;
  dayPass: { name: string } | null;
}

const TARGET_LABEL: Record<TargetType, string> = {
  suite: "Tente & Suite",
  activity: "Activité",
  dayPass: "Day Pass",
};

const TARGET_API: Record<TargetType, string> = {
  suite: "/api/admin/suites",
  activity: "/api/admin/activities",
  dayPass: "/api/admin/day-passes",
};

function targetTypeOf(sp: SeasonalPrice): TargetType {
  if (sp.suiteId) return "suite";
  if (sp.activityId) return "activity";
  return "dayPass";
}

function targetName(sp: SeasonalPrice): string {
  return sp.suite?.name ?? sp.activity?.name ?? sp.dayPass?.name ?? "—";
}

function prefillPrice(id: string, options: EntityOption[]): string {
  return String(options.find((o) => o.id === id)?.price ?? "");
}

export default function TarifsSaisonniersPage() {
  const [prices, setPrices] = useState<SeasonalPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [editing, setEditing] = useState<SeasonalPrice | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [targetType, setTargetType] = useState<TargetType>("suite");
  const [targetIds, setTargetIds] = useState<string[]>([]);
  const [itemPrices, setItemPrices] = useState<Record<string, string>>({});
  const [options, setOptions] = useState<EntityOption[]>([]);
  const [label, setLabel] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [price, setPrice] = useState(""); // edit mode only — one row, one price

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/seasonal-prices");
    if (res.ok) setPrices(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    fetch(TARGET_API[targetType])
      .then((r) => r.json())
      .then((data: EntityOption[]) => {
        setOptions(data);
        if (modal === "create") setTargetIds([]);
      })
      .catch(() => setOptions([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetType]);

  function toggleTarget(id: string) {
    setTargetIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      setItemPrices((ip) => (ip[id] !== undefined ? ip : { ...ip, [id]: prefillPrice(id, options) }));
      return [...prev, id];
    });
  }

  function toggleAllTargets() {
    setTargetIds((prev) => {
      if (prev.length === options.length) return [];
      setItemPrices((ip) => {
        const next = { ...ip };
        options.forEach((o) => { if (next[o.id] === undefined) next[o.id] = String(o.price ?? ""); });
        return next;
      });
      return options.map((o) => o.id);
    });
  }

  function openCreate() {
    setEditing(null);
    setTargetType("suite");
    setTargetIds([]);
    setItemPrices({});
    setLabel("");
    setStartDate("");
    setEndDate("");
    setPrice("");
    setError("");
    setModal("create");
  }

  function openEdit(sp: SeasonalPrice) {
    setEditing(sp);
    setTargetType(targetTypeOf(sp));
    setTargetIds([sp.suiteId ?? sp.activityId ?? sp.dayPassId ?? ""]);
    setItemPrices({});
    setLabel(sp.label);
    setStartDate(sp.startDate.slice(0, 10));
    setEndDate(sp.endDate.slice(0, 10));
    setPrice(String(sp.price));
    setError("");
    setModal("edit");
  }

  async function handleSave() {
    if (!label || !startDate || !endDate || targetIds.length === 0) {
      setError("Tous les champs sont requis, et au moins un élément doit être sélectionné.");
      return;
    }
    if (modal === "edit" && !price) {
      setError("Le prix est requis.");
      return;
    }
    if (modal === "create" && targetIds.some((id) => !itemPrices[id] || Number(itemPrices[id]) <= 0)) {
      setError("Indiquez un prix pour chaque élément sélectionné.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const body: Record<string, unknown> = { label, startDate, endDate };
      if (modal === "create") {
        body.targetType = targetType;
        body.items = targetIds.map((id) => ({ id, price: Number(itemPrices[id]) }));
      } else {
        body.price = Number(price);
      }
      const url = modal === "edit" ? `/api/admin/seasonal-prices/${editing!.id}` : "/api/admin/seasonal-prices";
      const method = modal === "edit" ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setError((err as { error?: string }).error ?? "Erreur lors de la sauvegarde.");
      } else {
        setModal(null);
        await load();
      }
    } catch {
      setError("Erreur réseau.");
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce tarif saisonnier ?")) return;
    await fetch(`/api/admin/seasonal-prices/${id}`, { method: "DELETE" });
    await load();
  }

  const inputClass = "w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/30";

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Tarifs Saisonniers</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Ajouter
        </button>
      </div>
      <p className="text-sm text-gray-400 mb-8">
        Définissez un prix différent pour une ou plusieurs tentes, activités ou Day Pass durant une période précise
        (Nouvel An, fêtes, haute saison...). Le tarif s&apos;applique automatiquement aux réservations dont
        la date tombe dans la période — en dehors, le prix normal reste en vigueur.
      </p>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <th className="text-left px-5 py-3.5 text-gray-400 dark:text-gray-500 font-medium text-xs uppercase tracking-widest">Période</th>
              <th className="text-left px-5 py-3.5 text-gray-400 dark:text-gray-500 font-medium text-xs uppercase tracking-widest">Concerne</th>
              <th className="text-left px-5 py-3.5 text-gray-400 dark:text-gray-500 font-medium text-xs uppercase tracking-widest">Dates</th>
              <th className="text-left px-5 py-3.5 text-gray-400 dark:text-gray-500 font-medium text-xs uppercase tracking-widest">Prix</th>
              <th className="px-5 py-3.5 text-right text-gray-400 dark:text-gray-500 font-medium text-xs uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          {loading ? (
            <tbody>
              {Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="border-b border-gray-100 dark:border-gray-800">
                  <td colSpan={5} className="px-5 py-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              {prices.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-400">Aucun tarif saisonnier</td></tr>
              )}
              {prices.map((sp) => (
                <tr key={sp.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-5 py-4 text-gray-900 dark:text-gray-100">{sp.label}</td>
                  <td className="px-5 py-4 text-gray-600 dark:text-gray-400">
                    <span className="inline-block text-xs px-2 py-0.5 rounded-full font-medium bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 mb-1">
                      {TARGET_LABEL[targetTypeOf(sp)]}
                    </span>
                    <p>{targetName(sp)}</p>
                  </td>
                  <td className="px-5 py-4 text-gray-600 dark:text-gray-400 text-xs">
                    {format(new Date(sp.startDate), "d MMM yyyy", { locale: fr })}
                    {" → "}
                    {format(new Date(sp.endDate), "d MMM yyyy", { locale: fr })}
                  </td>
                  <td className="px-5 py-4 text-amber-600 dark:text-amber-400">{sp.price.toLocaleString("fr-FR")}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(sp)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors cursor-pointer">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(sp.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-gray-800 shrink-0">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">{modal === "create" ? "Ajouter un tarif saisonnier" : "Modifier le tarif"}</h2>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Concerne</label>
                <select
                  value={targetType}
                  onChange={(e) => setTargetType(e.target.value as TargetType)}
                  disabled={modal === "edit"}
                  className={`${inputClass} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <option value="suite">Tente & Suite</option>
                  <option value="activity">Activité</option>
                  <option value="dayPass">Day Pass</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                    {modal === "create"
                      ? `Éléments${targetIds.length > 0 ? ` (${targetIds.length} sélectionné${targetIds.length > 1 ? "s" : ""})` : ""}`
                      : "Élément"}
                  </label>
                  {modal === "create" && options.length > 1 && (
                    <button
                      type="button"
                      onClick={toggleAllTargets}
                      className="text-xs text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                    >
                      {targetIds.length === options.length ? "Tout désélectionner" : "Tout sélectionner"}
                    </button>
                  )}
                </div>
                <div className="max-h-56 overflow-y-auto border border-gray-300 dark:border-gray-700 rounded-lg divide-y divide-gray-100 dark:divide-gray-800">
                  {options.length === 0 && (
                    <p className="px-3 py-2.5 text-sm text-gray-400">Aucun élément disponible</p>
                  )}
                  {options.map((o) => {
                    const checked = targetIds.includes(o.id);
                    return (
                      <div
                        key={o.id}
                        className={`flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 ${
                          modal === "edit" ? "opacity-50" : "hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={modal === "edit"}
                          onChange={() => toggleTarget(o.id)}
                          className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-amber-500 focus:ring-amber-500 disabled:cursor-not-allowed cursor-pointer"
                        />
                        <span
                          onClick={() => modal === "create" && toggleTarget(o.id)}
                          className={`flex-1 ${modal === "create" ? "cursor-pointer" : ""}`}
                        >
                          {o.name}
                        </span>
                        {modal === "create" && checked && (
                          <input
                            type="number"
                            value={itemPrices[o.id] ?? ""}
                            onChange={(e) => setItemPrices((ip) => ({ ...ip, [o.id]: e.target.value }))}
                            placeholder="Prix"
                            className="w-24 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1.5 text-xs text-gray-900 dark:text-gray-100 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/30"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
                {modal === "create" && (
                  <p className="text-xs text-gray-400 mt-1.5">
                    Le prix est pré-rempli avec le tarif actuel de chaque élément — ajustez-le pour cette période.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Nom de la période *</label>
                <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="ex: Nouvel An 2027" className={inputClass} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Du *</label>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Au *</label>
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inputClass} />
                </div>
              </div>

              {modal === "edit" && (
                <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Prix pour cette période *</label>
                  <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="ex: 250" className={inputClass} />
                </div>
              )}

              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>

            <div className="flex gap-3 px-6 py-5 border-t border-gray-200 dark:border-gray-800 shrink-0">
              <button onClick={() => setModal(null)} className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors cursor-pointer">
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="ml-auto px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-white font-semibold text-sm transition-colors disabled:opacity-50 cursor-pointer"
              >
                {saving ? "Sauvegarde…" : "Sauvegarder"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
