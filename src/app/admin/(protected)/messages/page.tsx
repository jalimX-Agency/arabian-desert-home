"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Eye, EyeOff, Trash2 } from "lucide-react";

interface Message {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/admin/messages");
    if (res.ok) setMessages(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function toggleRead(id: string, read: boolean) {
    await fetch(`/api/admin/messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read }),
    });
    await load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce message ?")) return;
    await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
    await load();
  }

  function handleExpand(id: string) {
    setExpanded(expanded === id ? null : id);
    const msg = messages.find((m) => m.id === id);
    if (msg && !msg.read) toggleRead(id, true);
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Messages</h1>
        <span className="text-sm text-white/30">{messages.filter((m) => !m.read).length} non lus</span>
      </div>

      {loading ? (
        <p className="text-sm text-white/30">Chargement…</p>
      ) : (
        <div className="space-y-2">
          {messages.length === 0 && <p className="text-sm text-white/30 text-center py-8">Aucun message</p>}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`bg-white/5 border rounded-2xl overflow-hidden transition-colors ${
                !msg.read ? "border-amber-500/20" : "border-white/10"
              }`}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-white/[0.02]"
                onClick={() => handleExpand(msg.id)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {!msg.read && <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />}
                  <div className="min-w-0">
                    <p className={`text-sm ${msg.read ? "text-white/60" : "text-white font-medium"}`}>{msg.name}</p>
                    <p className="text-xs text-white/40 truncate">{msg.subject}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-xs text-white/30">{format(new Date(msg.createdAt), "d MMM yyyy", { locale: fr })}</span>
                  <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => toggleRead(msg.id, !msg.read)}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-white/30 hover:text-white transition-colors"
                      title={msg.read ? "Marquer non lu" : "Marquer lu"}
                    >
                      {msg.read ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleDelete(msg.id)}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded body */}
              {expanded === msg.id && (
                <div className="px-5 pb-5 border-t border-white/5 pt-4">
                  <div className="grid grid-cols-2 gap-3 mb-4 text-xs text-white/40">
                    <span>Email : <a href={`mailto:${msg.email}`} className="text-amber-400">{msg.email}</a></span>
                    {msg.phone && <span>Tél : {msg.phone}</span>}
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
