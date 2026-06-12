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
  const base = "w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-amber-500/70 focus:ring-1 focus:ring-amber-500/30";

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
        className={`flex items-center gap-2 text-sm ${value ? "text-amber-600" : "text-gray-400"}`}
      >
        <div className={`w-5 h-5 rounded border flex items-center justify-center ${value ? "bg-amber-500 border-amber-500" : "border-gray-300 bg-white"}`}>
          {value && <Check className="w-3 h-3 text-white" />}
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
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{title}</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Ajouter
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              {columns.map((col) => (
                <th key={col.key} className="text-left px-5 py-3.5 text-gray-400 dark:text-gray-500 font-medium text-xs uppercase tracking-widest">
                  {col.label}
                </th>
              ))}
              <th className="px-5 py-3.5 text-right text-gray-400 dark:text-gray-500 font-medium text-xs uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          {loading ? (
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-gray-100 dark:border-gray-800">
                  {columns.map((col) => (
                    <td key={col.key} className="px-5 py-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
                    </td>
                  ))}
                  <td className="px-5 py-4 text-right">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16 ml-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              {items.length === 0 && (
                <tr><td colSpan={columns.length + 1} className="px-5 py-8 text-center text-gray-400">Aucun élément</td></tr>
              )}
              {items.map((item) => (
                <tr key={String(item.id)} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="px-5 py-4 text-gray-600 dark:text-gray-400">
                      {col.render ? col.render(item[col.key], item) : String(item[col.key] ?? "—")}
                    </td>
                  ))}
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(String(item.id))} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
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
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-gray-800 shrink-0">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">{modal === "create" ? "Ajouter" : "Modifier"}</h2>
              <button onClick={() => setModal(null)} className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            {tabs && (
              <div className="flex border-b border-gray-200 dark:border-gray-800 shrink-0 px-2">
                {tabs.map((tab, i) => (
                  <button
                    key={tab.label}
                    onClick={() => setActiveTab(i)}
                    className={`px-4 py-3 text-xs font-medium uppercase tracking-widest transition-colors relative ${
                      activeTab === i
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
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
                  <label className="block text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">
                    {field.label}{field.required && " *"}
                  </label>
                  <FieldInput
                    field={field}
                    value={form[field.key]}
                    onChange={(val) => setForm((f) => ({ ...f, [field.key]: val }))}
                  />
                </div>
              ))}
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-6 py-5 border-t border-gray-200 dark:border-gray-800 shrink-0">
              {tabs && (
                <div className="flex gap-1 mr-auto">
                  {tabs.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveTab(i)}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${i === activeTab ? "bg-amber-500" : "bg-gray-300"}`}
                    />
                  ))}
                </div>
              )}
              <button onClick={() => setModal(null)} className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
                Annuler
              </button>
              {tabs && activeTab < tabs.length - 1 && (
                <button
                  onClick={() => setActiveTab((t) => t + 1)}
                  className="px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium transition-colors"
                >
                  Suivant →
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-white font-semibold text-sm transition-colors disabled:opacity-50"
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
