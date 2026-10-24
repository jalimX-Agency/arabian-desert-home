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

const COPY: Record<SiteLanguage, { title: string; body: string; short: string; accept: string; refuse: string; more: string }> = {
  fr: {
    title: "Votre vie privée",
    short: "Cookies Google (audience et annonces), seulement avec votre accord.",
    body: "Avec votre accord, Google mesure l'audience du site (Analytics) et l'efficacité de nos annonces, et personnalise leur affichage (Ads). Modifiable à tout moment.",
    accept: "Accepter",
    refuse: "Refuser",
    more: "En savoir plus",
  },
  en: {
    title: "Your privacy",
    short: "Google cookies (traffic and ads), only with your consent.",
    body: "With your consent, Google measures site traffic (Analytics) and how well our ads perform, and personalises how they are shown (Ads). You can change this at any time.",
    accept: "Accept",
    refuse: "Decline",
    more: "Learn more",
  },
  es: {
    title: "Su privacidad",
    short: "Cookies de Google (audiencia y anuncios), solo con su consentimiento.",
    body: "Con su consentimiento, Google mide la audiencia del sitio (Analytics) y la eficacia de nuestros anuncios, y personaliza su visualización (Ads). Puede cambiarlo en cualquier momento.",
    accept: "Aceptar",
    refuse: "Rechazar",
    more: "Más información",
  },
  it: {
    title: "La vostra privacy",
    short: "Cookie Google (traffico e annunci), solo con il vostro consenso.",
    body: "Con il vostro consenso, Google misura il traffico del sito (Analytics) e l'efficacia dei nostri annunci, e ne personalizza la visualizzazione (Ads). Potete cambiarlo in qualsiasi momento.",
    accept: "Accetta",
    refuse: "Rifiuta",
    more: "Maggiori informazioni",
  },
};

/**
 * Cookie consent banner. No analytics or advertising cookie is stored or read until the
 * visitor clicks Accept (the tags only send cookieless pings before that — Consent Mode
 * advanced), and Decline is exactly as easy as Accept. Kept
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
      className="fixed inset-x-2 bottom-2 z-[60] sm:inset-x-auto sm:left-6 sm:bottom-6 sm:max-w-sm rounded-2xl border border-amber/25 bg-background/95 backdrop-blur-md shadow-2xl p-2.5 sm:p-4"
    >
      {/* On a phone a one-line notice, so the page (and its call to action) stays visible. */}
      <p className="text-[11px] sm:text-xs leading-snug sm:leading-relaxed text-muted-foreground mb-2 sm:mb-3">
        <span className="sm:hidden">{c.short}</span>
        <span className="hidden sm:inline">{c.body}</span>{" "}
        <Link href={privacyHref} className="text-amber underline underline-offset-2 hover:text-amber/80">
          {c.more}
        </Link>
      </p>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => choose(false)}
          className="cursor-pointer rounded-full border border-foreground/30 px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs uppercase tracking-widest text-foreground hover:border-foreground transition-colors"
        >
          {c.refuse}
        </button>
        <button
          type="button"
          onClick={() => choose(true)}
          className="cursor-pointer rounded-full border border-amber bg-amber px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs uppercase tracking-widest text-black hover:bg-amber/90 transition-colors"
        >
          {c.accept}
        </button>
      </div>
    </section>
  );
}
