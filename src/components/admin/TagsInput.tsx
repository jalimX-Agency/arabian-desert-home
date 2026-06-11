"use client";

import { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";

interface TagsInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export function TagsInput({ value, onChange, placeholder = "Ajouter…" }: TagsInputProps) {
  const [input, setInput] = useState("");
  const tags = value ? value.split(",").map((s) => s.trim()).filter(Boolean) : [];

  function addTag(raw: string) {
    const trimmed = raw.trim();
    if (!trimmed || tags.includes(trimmed)) return;
    onChange([...tags, trimmed].join(","));
    setInput("");
  }

  function removeTag(i: number) {
    const next = tags.filter((_, idx) => idx !== i);
    onChange(next.join(","));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && input === "" && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  }

  return (
    <div className="flex flex-wrap gap-2 min-h-[42px] w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus-within:border-amber-500/50 transition-colors">
      {tags.map((tag, i) => (
        <span
          key={i}
          className="flex items-center gap-1 bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs px-2.5 py-1 rounded-full"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(i)}
            className="hover:text-white transition-colors ml-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => { if (input.trim()) addTag(input); }}
        placeholder={tags.length === 0 ? placeholder : ""}
        className="flex-1 min-w-[120px] bg-transparent text-sm text-white outline-none placeholder:text-white/20"
      />
    </div>
  );
}
