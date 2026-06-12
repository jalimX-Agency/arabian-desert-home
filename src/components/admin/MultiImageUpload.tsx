"use client";

import { useRef, useState } from "react";
import { Plus, X, ImageIcon } from "lucide-react";

interface MultiImageUploadProps {
  value: string;
  onChange: (val: string) => void;
  folder?: string;
}

export function MultiImageUpload({ value, onChange, folder = "gallery" }: MultiImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  const urls = value ? value.split(",").map((u) => u.trim()).filter(Boolean) : [];

  async function upload(file: File) {
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload échoué");
      const newUrls = [...urls, data.url];
      onChange(newUrls.join(","));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur upload");
    }
    setUploading(false);
  }

  async function remove(idx: number) {
    const urlToDelete = urls[idx];
    const newUrls = urls.filter((_, i) => i !== idx);
    onChange(newUrls.join(","));
    try {
      await fetch("/api/admin/upload", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: urlToDelete }) });
    } catch {}
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    files.forEach(upload);
    e.target.value = "";
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    files.forEach(upload);
  }

  return (
    <div className="space-y-3">
      {urls.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {urls.map((url, i) => (
            <div key={i} className="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-white/10 aspect-square">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`image ${i + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute top-1 right-1 w-6 h-6 bg-black/60 hover:bg-red-500/80 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`w-full h-24 flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
          dragging
            ? "border-amber-500 bg-amber-500/5"
            : "border-gray-300 dark:border-white/10 hover:border-amber-400 dark:hover:border-white/25 bg-gray-50 dark:bg-white/[0.02] hover:bg-gray-100 dark:hover:bg-white/[0.04]"
        }`}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-gray-400 dark:text-white/40">Upload en cours…</span>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-1.5 text-gray-300 dark:text-white/30">
              <Plus className="w-4 h-4" />
              <ImageIcon className="w-4 h-4" />
            </div>
            <span className="text-xs text-gray-400 dark:text-white/40">Ajouter des images</span>
          </>
        )}
      </div>

      {error && <p className="text-red-400 text-xs">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        onChange={onFileChange}
        className="hidden"
      />
    </div>
  );
}
