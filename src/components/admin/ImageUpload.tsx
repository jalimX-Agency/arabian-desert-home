"use client";

import { useRef, useState } from "react";
import { Upload, X, ImageIcon } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
}

export function ImageUpload({ value, onChange, folder = "gallery" }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  async function deleteOld(url: string) {
    try {
      await fetch("/api/admin/upload", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) });
    } catch {}
  }

  async function upload(file: File) {
    setUploading(true);
    setError("");
    try {
      const oldUrl = value;
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload échoué");
      if (oldUrl) deleteOld(oldUrl);
      onChange(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur upload");
    }
    setUploading(false);
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) upload(file);
    e.target.value = "";
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) upload(file);
  }

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-white/10 bg-white/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="preview" className="w-full h-40 object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              Remplacer
            </button>
            <button
              type="button"
              onClick={() => { deleteOld(value); onChange(""); }}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-2 rounded-lg transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Supprimer
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`w-full h-36 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
            dragging
              ? "border-amber-500 bg-amber-500/5"
              : "border-gray-300 dark:border-white/10 hover:border-amber-400 dark:hover:border-white/25 bg-gray-50 dark:bg-white/[0.02] hover:bg-gray-100 dark:hover:bg-white/[0.04]"
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-gray-400 dark:text-white/40">Upload en cours…</span>
            </div>
          ) : (
            <>
              <ImageIcon className="w-7 h-7 text-gray-300 dark:text-white/20" />
              <span className="text-xs text-gray-400 dark:text-white/40">Glissez une image ou cliquez pour choisir</span>
              <span className="text-[10px] text-gray-300 dark:text-white/20">JPG, PNG, WebP — max 2MB</span>
            </>
          )}
        </div>
      )}

      {error && <p className="text-red-400 text-xs">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={onFileChange}
        className="hidden"
      />
    </div>
  );
}
