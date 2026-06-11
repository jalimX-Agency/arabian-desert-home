"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { ImageUpload } from "./ImageUpload";
import { MultiImageUpload } from "./MultiImageUpload";
import { TagsInput } from "./TagsInput";

interface Field {
  key: string;
  label: string;
  type?: "text" | "number" | "textarea" | "checkbox" | "select" | "image" | "images" | "tags";
  options?: string[];
  required?: boolean;
  folder?: string;
}

interface Tab {
  label: string;
  fieldKeys: string[];
}

interface ResourceManagerProps {
  title: string;
  apiPath: string;
  fields: Field[];
  columns: { key: string; label: string; render?: (val: unknown, row: Record<string, unknown>) => React.ReactNode }[];
  tabs?: Tab[];
}

function FieldInput({ field, value, onChange }: {
  field: Field;
  value: unknown;
  onChange: (val: unknown) => void;
}) {
  const base = "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50";

  if (field.type === "image") {
    return <ImageUpload value={String(value ?? "")} onChange={onChange} folder={field.folder} />;
  }
  if (field.type === "images") {
    return <MultiImageUpload value={String(value ?? "")} onChange={onChange} folder={field.folder} />;
  }
  if (field.type === "tags") {
    return <TagsInput value={String(value ?? "")} onChange={onChange} />;
  }
  if (field.type === "textarea") {
    return (
      <textarea
        value={String(value ?? "")}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className={`${base} resize-none`}
      />
    );
  }
  if (field.type === "checkbox") {
    return (
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`flex items-center gap-2 text-sm ${value ? "text-amber-400" : "text-white/40"}`}
      >
        <div className={`w-5 h-5 rounded border flex items-center justify-center ${value ? "bg-amber-500 border-amber-500" : "border-white/20"}`}>
          {value && <Check className="w-3 h-3 text-black" />}
        </div>
        {value ? "Oui" : "Non"}
      </button>
    );
  }
  if (field.type === "select") {
    return (
      <select
        value={String(value ?? "")}
        onChange={(e) => onChange(e.target.value)}
        className={base}
      >
        {field.options?.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    );
  }
  return (
    <input
      type={field.type === "number" ? "number" : "text"}
      value={String(value ?? "")}
      onChange={(e) => onChange(field.type === "number" ? Number(e.target.value) : e.target.value)}
      className={base}
    />
  );
}

export function ResourceManager({ title, apiPath, fields, columns, tabs }: ResourceManagerProps) {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(apiPath);
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }, [apiPath]);

  useEffect(() => { load(); }, [load]);

  function openCreate() {
    const defaults: Record<string, unknown> = {};
    fields.forEach((f) => { defaults[f.key] = f.type === "checkbox" ? false : f.type === "number" ? 0 : ""; });
    setForm(defaults);
    setEditing(null);
    setModal("create");
    setActiveTab(0);
    setError("");
  }

  function openEdit(item: Record<string, unknown>) {
    setForm({ ...item });
    setEditing(item);
    setModal("edit");
    setActiveTab(0);
    setError("");
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      const url = modal === "edit" ? `${apiPath}/${(editing as Record<string, unknown>).id}` : apiPath;
      const method = modal === "edit" ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
    if (!confirm("Supprimer cet élément ?")) return;
    await fetch(`${apiPath}/${id}`, { method: "DELETE" });
    await load();
  }

  const activeFields = tabs
    ? fields.filter((f) => tabs[activeTab]?.fieldKeys.includes(f.key))
    : fields;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-white">{title}</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Ajouter
        </button>
      </div>

      {loading ? (
        <div className="text-white/30 text-sm">Chargement…</div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                {columns.map((col) => (
                  <th key={col.key} className="text-left px-5 py-3.5 text-white/40 font-medium text-xs uppercase tracking-widest">
                    {col.label}
                  </th>
                ))}
                <th className="px-5 py-3.5 text-right text-white/40 font-medium text-xs uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr><td colSpan={columns.length + 1} className="px-5 py-8 text-center text-white/30">Aucun élément</td></tr>
              )}
              {items.map((item) => (
                <tr key={String(item.id)} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="px-5 py-4 text-white/70">
                      {col.render ? col.render(item[col.key], item) : String(item[col.key] ?? "—")}
                    </td>
                  ))}
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(String(item.id))} className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-[#161616] border border-white/10 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 shrink-0">
              <h2 className="font-semibold text-white">{modal === "create" ? "Ajouter" : "Modifier"}</h2>
              <button onClick={() => setModal(null)} className="text-white/40 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            {tabs && (
              <div className="flex border-b border-white/10 shrink-0 px-2">
                {tabs.map((tab, i) => (
                  <button
                    key={tab.label}
                    onClick={() => setActiveTab(i)}
                    className={`px-4 py-3 text-xs font-medium uppercase tracking-widest transition-colors relative ${
                      activeTab === i
                        ? "text-amber-400"
                        : "text-white/30 hover:text-white/60"
                    }`}
                  >
                    {tab.label}
                    {activeTab === i && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-t" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Fields */}
            <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1">
              {activeFields.map((field) => (
                <div key={field.key}>
                  <label className="block text-xs text-white/50 uppercase tracking-widest mb-1.5">
                    {field.label}{field.required && " *"}
                  </label>
                  <FieldInput
                    field={field}
                    value={form[field.key]}
                    onChange={(val) => setForm((f) => ({ ...f, [field.key]: val }))}
                  />
                </div>
              ))}
              {error && <p className="text-red-400 text-sm">{error}</p>}
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-6 py-5 border-t border-white/10 shrink-0">
              {tabs && (
                <div className="flex gap-1 mr-auto">
                  {tabs.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveTab(i)}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${i === activeTab ? "bg-amber-500" : "bg-white/20"}`}
                    />
                  ))}
                </div>
              )}
              <button onClick={() => setModal(null)} className="px-4 py-2.5 rounded-lg border border-white/10 text-sm text-white/60 hover:text-white transition-colors">
                Annuler
              </button>
              {tabs && activeTab < tabs.length - 1 && (
                <button
                  onClick={() => setActiveTab((t) => t + 1)}
                  className="px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm font-medium transition-colors"
                >
                  Suivant →
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm transition-colors disabled:opacity-50"
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
