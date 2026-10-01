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
    body: "Nous utilisons Google Analytics pour mesurer l'audience du site et l'améliorer. Ces cookies ne sont déposés qu'avec votre accord, et vous pouvez changer d'avis à tout moment.",
    accept: "Accepter",
    refuse: "Refuser",
    more: "En savoir plus",
  },
  en: {
    title: "Your privacy",
    body: "We use Google Analytics to measure site traffic and improve the site. These cookies are only set with your consent, and you can change your mind at any time.",
    accept: "Accept",
    refuse: "Decline",
    more: "Learn more",
  },
  es: {
    title: "Su privacidad",
    body: "Utilizamos Google Analytics para medir la audiencia del sitio y mejorarlo. Estas cookies solo se instalan con su consentimiento y puede cambiar de opinión en cualquier momento.",
    accept: "Aceptar",
    refuse: "Rechazar",
    more: "Más información",
  },
  it: {
    title: "La vostra privacy",
    body: "Utilizziamo Google Analytics per misurare il traffico del sito e migliorarlo. Questi cookie vengono installati solo con il vostro consenso e potete cambiare idea in qualsiasi momento.",
    accept: "Accetta",
    refuse: "Rifiuta",
    more: "Maggiori informazioni",
  },
};

/**
 * Cookie consent banner. Nothing is loaded or stored for analytics until the
 * visitor clicks Accept, and Decline is exactly as easy as Accept. Not shown on
 * private pages, which run no analytics at all. The footer "Cookies" link
 * re-opens it so the choice can be changed.
 */
export function CookieBanner() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(readConsent() === null);
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_SETTINGS_EVENT, reopen);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, reopen);
  }, []);

  if (!open || isPrivatePath(pathname)) return null;

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
      className="fixed inset-x-3 bottom-3 z-[60] sm:inset-x-auto sm:left-6 sm:bottom-6 sm:max-w-sm rounded-2xl border border-amber/25 bg-background/95 backdrop-blur-md shadow-2xl p-5"
    >
      <p className="luxury-label text-amber text-[11px] mb-2">{c.title}</p>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
        {c.body}{" "}
        <Link href={privacyHref} className="text-amber underline underline-offset-2 hover:text-amber/80">
          {c.more}
        </Link>
      </p>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => choose(false)}
          className="cursor-pointer rounded-full border border-foreground/30 px-4 py-2.5 text-xs uppercase tracking-widest text-foreground hover:border-foreground transition-colors"
        >
          {c.refuse}
        </button>
        <button
          type="button"
          onClick={() => choose(true)}
          className="cursor-pointer rounded-full border border-amber bg-amber px-4 py-2.5 text-xs uppercase tracking-widest text-black hover:bg-amber/90 transition-colors"
        >
          {c.accept}
        </button>
      </div>
    </section>
  );
}
