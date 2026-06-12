"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

export default function ParametresPage() {
  const { data: session } = useSession();
  const [current, setCurrent] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const inputClass = "w-full bg-gray-50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-amber-500/50";
  const labelClass = "block text-xs text-gray-500 dark:text-white/50 uppercase tracking-widest mb-1.5";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setSuccess("");
    if (newPwd !== confirm) return setError("Les mots de passe ne correspondent pas.");
    if (newPwd.length < 6) return setError("Le mot de passe doit contenir au moins 6 caractères.");

    setLoading(true);
    const res = await fetch("/api/admin/auth/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: current, newPassword: newPwd }),
    });
    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setSuccess("Mot de passe mis à jour avec succès.");
      setCurrent(""); setNewPwd(""); setConfirm("");
    } else {
      setError(data.error ?? "Une erreur est survenue.");
    }
  }

  return (
    <div className="p-8 max-w-lg">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">Paramètres</h1>

      <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Compte admin</h2>
        <p className="text-sm text-gray-400">{session?.user?.email}</p>
      </div>

      <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-6">Changer le mot de passe</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Mot de passe actuel</label>
            <input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Nouveau mot de passe</label>
            <input type="password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Confirmer le mot de passe</label>
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required className={inputClass} />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50"
          >
            {loading ? "Mise à jour…" : "Mettre à jour"}
          </button>
        </form>
      </div>
    </div>
  );
}
