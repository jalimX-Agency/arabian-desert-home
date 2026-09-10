"use client";

import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Plus, Pencil, Trash2, X } from "lucide-react";

interface SuiteOption {
  id: string;
  name: string;
}

interface TentClosure {
  id: string;
  label: string;
  startDate: string;
  endDate: string;
  suiteId: string;
  suite: { name: string };
}

export function FermeturesTab() {
  const [closures, setClosures] = useState<TentClosure[]>([]);
  const [suites, setSuites] = useState<SuiteOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [editing, setEditing] = useState<TentClosure | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [suiteIds, setSuiteIds] = useState<string[]>([]);
  const [label, setLabel] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/tent-closures");
    if (res.ok) setClosures(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    fetch("/api/admin/suites").then((r) => r.json()).then(setSuites).catch(() => {});
  }, []);

  function toggleSuite(id: string) {
    setSuiteIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function toggleAllSuites() {
    setSuiteIds((prev) => (prev.length === suites.length ? [] : suites.map((s) => s.id)));
  }

  function openCreate() {
    setEditing(null);
    setSuiteIds([]);
    setLabel("");
    setStartDate("");
    setEndDate("");
    setError("");
    setModal("create");
  }

  function openEdit(c: TentClosure) {
    setEditing(c);
    setSuiteIds([c.suiteId]);
    setLabel(c.label);
    setStartDate(c.startDate.slice(0, 10));
    setEndDate(c.endDate.slice(0, 10));
    setError("");
    setModal("edit");
  }

  async function handleSave() {
    if (!label || !startDate || !endDate || suiteIds.length === 0) {
      setError("Tous les champs sont requis, et au moins une tente doit être sélectionnée.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const url = modal === "edit" ? `/api/admin/tent-closures/${editing!.id}` : "/api/admin/tent-closures";
      const method = modal === "edit" ? "PUT" : "POST";
      const body = modal === "edit"
        ? { label, startDate, endDate }
        : { label, startDate, endDate, suiteIds };
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
    if (!confirm("Supprimer cette fermeture ? La tente redeviendra réservable sur cette période.")) return;
    await fetch(`/api/admin/tent-closures/${id}`, { method: "DELETE" });
    await load();
  }

  const inputClass = "w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/30";

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div />
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Ajouter
        </button>
      </div>
      <p className="text-sm text-gray-400 mb-8">
        Fermez une ou plusieurs tentes sur une période précise (entretien, événement privé, usage personnel...).
        Ces dates deviennent indisponibles à la réservation sur le site — les demandes qui les chevauchent sont refusées automatiquement.
      </p>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              <th className="text-left px-5 py-3.5 text-gray-400 dark:text-gray-500 font-medium text-xs uppercase tracking-widest">Motif</th>
              <th className="text-left px-5 py-3.5 text-gray-400 dark:text-gray-500 font-medium text-xs uppercase tracking-widest">Tente</th>
              <th className="text-left px-5 py-3.5 text-gray-400 dark:text-gray-500 font-medium text-xs uppercase tracking-widest">Dates</th>
              <th className="px-5 py-3.5 text-right text-gray-400 dark:text-gray-500 font-medium text-xs uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          {loading ? (
            <tbody>
              {Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="border-b border-gray-100 dark:border-gray-800">
                  <td colSpan={4} className="px-5 py-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              {closures.length === 0 && (
                <tr><td colSpan={4} className="px-5 py-8 text-center text-gray-400">Aucune fermeture programmée</td></tr>
              )}
              {closures.map((c) => (
                <tr key={c.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-5 py-4 text-gray-900 dark:text-gray-100">{c.label}</td>
                  <td className="px-5 py-4 text-gray-600 dark:text-gray-400">
                    <span className="inline-block text-xs px-2 py-0.5 rounded-full font-medium bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400">
                      {c.suite.name}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-600 dark:text-gray-400 text-xs">
                    {format(new Date(c.startDate), "d MMM yyyy", { locale: fr })}
                    {" → "}
                    {format(new Date(c.endDate), "d MMM yyyy", { locale: fr })}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors cursor-pointer">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
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
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">{modal === "create" ? "Fermer une tente" : "Modifier la fermeture"}</h2>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                    {modal === "create"
                      ? `Tentes${suiteIds.length > 0 ? ` (${suiteIds.length} sélectionnée${suiteIds.length > 1 ? "s" : ""})` : ""}`
                      : "Tente"}
                  </label>
                  {modal === "create" && suites.length > 1 && (
                    <button
                      type="button"
                      onClick={toggleAllSuites}
                      className="text-xs text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                    >
                      {suiteIds.length === suites.length ? "Tout désélectionner" : "Tout sélectionner"}
                    </button>
                  )}
                </div>
                <div className="max-h-56 overflow-y-auto border border-gray-300 dark:border-gray-700 rounded-lg divide-y divide-gray-100 dark:divide-gray-800">
                  {suites.length === 0 && (
                    <p className="px-3 py-2.5 text-sm text-gray-400">Aucune tente disponible</p>
                  )}
                  {suites.map((s) => {
                    const checked = suiteIds.includes(s.id);
                    return (
                      <div
                        key={s.id}
                        className={`flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 ${
                          modal === "edit" ? "opacity-50" : "hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={modal === "edit"}
                          onChange={() => toggleSuite(s.id)}
                          className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-amber-500 focus:ring-amber-500 disabled:cursor-not-allowed cursor-pointer"
                        />
                        <span
                          onClick={() => modal === "create" && toggleSuite(s.id)}
                          className={`flex-1 ${modal === "create" ? "cursor-pointer" : ""}`}
                        >
                          {s.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Motif *</label>
                <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="ex: Entretien annuel" className={inputClass} />
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
