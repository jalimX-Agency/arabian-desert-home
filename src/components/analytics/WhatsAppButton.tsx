"use client";

import { usePathname } from "next/navigation";
import { WhatsAppIcon } from "@/components/arabian/WhatsAppIcon";
import { isPrivatePath, languageFromPath, type SiteLanguage } from "@/lib/analytics";

/** The camp's WhatsApp line, same number as the footer and the contact page. */
const WHATSAPP_NUMBER = "212667370206";

const COPY: Record<SiteLanguage, { label: string; message: string }> = {
  fr: {
    label: "Écrire sur WhatsApp",
    message: "Bonjour, je souhaite des informations pour séjourner à Arabian Desert Home.",
  },
  en: {
    label: "Chat on WhatsApp",
    message: "Hello, I would like some information about staying at Arabian Desert Home.",
  },
  es: {
    label: "Escribir por WhatsApp",
    message: "Hola, me gustaría información para alojarme en Arabian Desert Home.",
  },
  it: {
    label: "Scrivici su WhatsApp",
    message: "Buongiorno, vorrei informazioni per soggiornare ad Arabian Desert Home.",
  },
};

/**
 * Floating WhatsApp shortcut on the public pages, with a ready-to-send message in
 * the visitor's language. Visitors from abroad usually prefer a message to an
 * international call. Clicks are reported as `whatsapp_click` by the delegated
 * listener in GoogleAnalytics, because the link points at wa.me.
 *
 * While the cookie banner is open on a phone it sits above it instead of under it
 * (CookieBanner flags that on <html data-cookie-banner="open">).
 */
export function WhatsAppButton() {
  const pathname = usePathname();
  if (isPrivatePath(pathname)) return null;

  const c = COPY[languageFromPath(pathname)];
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(c.message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={c.label}
      title={c.label}
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[55] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl ring-1 ring-black/10 transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#25D366] max-sm:[html[data-cookie-banner=open]_&]:bottom-40 cursor-pointer"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
