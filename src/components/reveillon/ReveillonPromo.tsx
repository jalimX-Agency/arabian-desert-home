"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, X } from "lucide-react";
import { isPrivatePath, languageFromPath, type SiteLanguage } from "@/lib/analytics";
import { REVEILLON_PATH, isReveillonOpen } from "@/lib/reveillon";

const COPY: Record<SiteLanguage, { title: string; sub: string; close: string }> = {
  fr: { title: "Réveillon sous les étoiles", sub: "31 décembre · Places limitées", close: "Fermer" },
  en: { title: "New Year's Eve under the stars", sub: "31 December · Limited places", close: "Close" },
  es: { title: "Nochevieja bajo las estrellas", sub: "31 de diciembre · Plazas limitadas", close: "Cerrar" },
  it: { title: "Capodanno sotto le stelle", sub: "31 dicembre · Posti limitati", close: "Chiudi" },
};
const DISMISS_KEY = "adh-reveillon-promo-closed";

/** Small floating card on the public pages pointing to the New Year's Eve page, until the night starts. */
export function ReveillonPromo() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let closed = false;
    try { closed = sessionStorage.getItem(DISMISS_KEY) === "1"; } catch { /* storage blocked: show it */ }
    // Shown after a moment so it never competes with the first paint of the page.
    const t = setTimeout(() => setVisible(!closed && isReveillonOpen()), 2500);
    return () => clearTimeout(t);
  }, []);

  if (!visible || isPrivatePath(pathname) || pathname?.includes(REVEILLON_PATH) || pathname?.includes("reservez-votre-sejour")) return null;

  const lang = languageFromPath(pathname);
  const c = COPY[lang];
  const href = lang === "fr" ? REVEILLON_PATH : `/${lang}${REVEILLON_PATH}`;

  return (
    <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-[54] max-w-[calc(100vw-6.5rem)] sm:max-w-xs max-sm:[html[data-cookie-banner=open]_&]:hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="relative flex items-center gap-3 rounded-2xl bg-[#1a1209]/95 text-white shadow-2xl ring-1 ring-amber/30 pl-4 pr-10 py-3 backdrop-blur">
        <Sparkles className="w-5 h-5 text-amber shrink-0" />
        <Link href={href} className="min-w-0 after:absolute after:inset-0">
          <p className="text-sm font-medium truncate">{c.title}</p>
          <p className="text-[11px] text-white/70 truncate">{c.sub}</p>
        </Link>
        <button
          type="button"
          onClick={() => { setVisible(false); try { sessionStorage.setItem(DISMISS_KEY, "1"); } catch { /* ignore */ } }}
          aria-label={c.close}
          className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center text-white/60 hover:text-white cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
