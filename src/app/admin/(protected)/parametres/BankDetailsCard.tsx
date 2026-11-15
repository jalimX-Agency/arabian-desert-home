"use client";

import { useEffect, useState } from "react";

type Bank = { holder: string; bank: string; iban: string; rib: string; swift: string; note: string };

const FIELDS: { key: keyof Bank; label: string; placeholder?: string }[] = [
  { key: "holder", label: "Titulaire du compte", placeholder: "Arabian Desert Home SARL" },
  { key: "bank", label: "Banque", placeholder: "Nom de la banque" },
  { key: "iban", label: "IBAN", placeholder: "MA64 …" },
  { key: "rib", label: "RIB (24 chiffres)" },
  { key: "swift", label: "Code SWIFT / BIC" },
];

/** Bank details shown on the guest's reservation page when an advance is requested. */
export function BankDetailsCard({ inputClass, labelClass }: { inputClass: string; labelClass: string }) {
  const [bank, setBank] = useState<Bank | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings/bank").then((r) => (r.ok ? r.json() : null)).then(setBank).catch(() => setBank(null));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!bank) return;
    setSaving(true);
    setMessage(null);
    const res = await fetch("/api/admin/settings/bank", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bank),
    });
    setSaving(false);
    if (res.ok) {
      setBank(await res.json());
      setMessage({ ok: true, text: "Coordonnées bancaires enregistrées." });
    } else {
      setMessage({ ok: false, text: "L'enregistrement a échoué." });
    }
  }

  return (
    <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 mb-6">
      <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Coordonnées bancaires (acompte)</h2>
      <p className="text-xs text-gray-400 mb-6">
        Affichées au client sur sa page de réservation quand vous passez une demande en « Paiement en attente ».
      </p>
      {!bank ? (
        <p className="text-sm text-gray-400">Chargement…</p>
      ) : (
        <form onSubmit={save} className="space-y-4">
          {FIELDS.map((f) => (
            <div key={f.key}>
              <label className={labelClass}>{f.label}</label>
              <input
                value={bank[f.key]}
                onChange={(e) => setBank({ ...bank, [f.key]: e.target.value })}
                placeholder={f.placeholder}
                className={inputClass}
              />
            </div>
          ))}
          <div>
            <label className={labelClass}>Note pour le client (facultatif)</label>
            <textarea
              value={bank.note}
              onChange={(e) => setBank({ ...bank, note: e.target.value })}
              rows={2}
              maxLength={500}
              placeholder="Ex. Merci d'indiquer la référence de réservation dans le motif du virement."
              className={inputClass}
            />
          </div>
          {message && <p className={`text-sm ${message.ok ? "text-green-500" : "text-red-500"}`}>{message.text}</p>}
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-amber-500 hover:bg-amber-400 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50 cursor-pointer"
          >
            {saving ? "Enregistrement…" : "Enregistrer"}
          </button>
        </form>
      )}
    </div>
  );
}
