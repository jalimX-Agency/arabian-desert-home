"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  OPEN_SETTINGS_EVENT,
  isPrivatePath,
  languageFromPath,
  readConsent,
  saveConsent,
  type SiteLanguage,
} from "@/lib/analytics";

const COPY: Record<SiteLanguage, { title: string; body: string; accept: string; refuse: string; more: string }> = {
  fr: {
    title: "Votre vie privée",
    body: "Avec votre accord, Google mesure l'audience du site (Analytics) et l'efficacité de nos annonces, et personnalise leur affichage (Ads). Modifiable à tout moment.",
    accept: "Accepter",
    refuse: "Refuser",
    more: "En savoir plus",
  },
  en: {
    title: "Your privacy",
    body: "With your consent, Google measures site traffic (Analytics) and how well our ads perform, and personalises how they are shown (Ads). You can change this at any time.",
    accept: "Accept",
    refuse: "Decline",
    more: "Learn more",
  },
  es: {
    title: "Su privacidad",
    body: "Con su consentimiento, Google mide la audiencia del sitio (Analytics) y la eficacia de nuestros anuncios, y personaliza su visualización (Ads). Puede cambiarlo en cualquier momento.",
    accept: "Aceptar",
    refuse: "Rechazar",
    more: "Más información",
  },
  it: {
    title: "La vostra privacy",
    body: "Con il vostro consenso, Google misura il traffico del sito (Analytics) e l'efficacia dei nostri annunci, e ne personalizza la visualizzazione (Ads). Potete cambiarlo in qualsiasi momento.",
    accept: "Accetta",
    refuse: "Rifiuta",
    more: "Maggiori informazioni",
  },
};

/**
 * Cookie consent banner. Nothing is loaded or stored for analytics or advertising
 * until the visitor clicks Accept, and Decline is exactly as easy as Accept. Kept
 * to a few lines so it never hides the page's call to action on a phone. Not shown
 * on private pages, which run no analytics at all. The footer "Cookies" link
 * re-opens it so the choice can be changed.
 */
export function CookieBanner() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const visible = open && !isPrivatePath(pathname);

  useEffect(() => {
    setOpen(readConsent() === null);
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_SETTINGS_EVENT, reopen);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, reopen);
  }, []);

  // Lets other fixed elements (the WhatsApp button) make room while the banner is up.
  useEffect(() => {
    const root = document.documentElement;
    if (visible) root.dataset.cookieBanner = "open";
    else delete root.dataset.cookieBanner;
    return () => {
      delete root.dataset.cookieBanner;
    };
  }, [visible]);

  if (!visible) return null;

  const lang = languageFromPath(pathname);
  const c = COPY[lang];
  const privacyHref = `${lang === "fr" ? "" : `/${lang}`}/politique-de-confidentialite`;

  function choose(analytics: boolean) {
    saveConsent(analytics);
    setOpen(false);
  }

  return (
    <section
      aria-label={c.title}
      className="fixed inset-x-3 bottom-3 z-[60] sm:inset-x-auto sm:left-6 sm:bottom-6 sm:max-w-sm rounded-2xl border border-amber/25 bg-background/95 backdrop-blur-md shadow-2xl p-3.5 sm:p-4"
    >
      <p className="text-xs leading-relaxed text-muted-foreground mb-3">
        {c.body}{" "}
        <Link href={privacyHref} className="text-amber underline underline-offset-2 hover:text-amber/80">
          {c.more}
        </Link>
      </p>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => choose(false)}
          className="cursor-pointer rounded-full border border-foreground/30 px-4 py-2 text-xs uppercase tracking-widest text-foreground hover:border-foreground transition-colors"
        >
          {c.refuse}
        </button>
        <button
          type="button"
          onClick={() => choose(true)}
          className="cursor-pointer rounded-full border border-amber bg-amber px-4 py-2 text-xs uppercase tracking-widest text-black hover:bg-amber/90 transition-colors"
        >
          {c.accept}
        </button>
      </div>
    </section>
  );
}
