"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  CONSENT_EVENT,
  isPrivatePath,
  loadAnalytics,
  readConsent,
  setAnalyticsDisabled,
  trackEvent,
  unloadAnalytics,
} from "@/lib/analytics";

/**
 * Loads Google Analytics 4 — but only after the visitor accepted cookies, and
 * never on private pages (guest/quote links carry an access token; admin is the
 * owner). Also reports the phone and WhatsApp conversion clicks site-wide.
 * Renders nothing.
 */
export function GoogleAnalytics() {
  const pathname = usePathname();
  const [consented, setConsented] = useState(false);
  const priv = isPrivatePath(pathname);

  // Follow the cookie banner's choice (and a later change of mind).
  useEffect(() => {
    const sync = () => setConsented(readConsent() === "granted");
    sync();
    window.addEventListener(CONSENT_EVENT, sync);
    return () => window.removeEventListener(CONSENT_EVENT, sync);
  }, []);

  useEffect(() => {
    if (consented && !priv) {
      setAnalyticsDisabled(false);
      loadAnalytics();
    } else {
      // No consent, or a private page reached by client-side navigation: block every hit.
      if ((window as { __adhGaLoaded?: boolean }).__adhGaLoaded) {
        if (!consented) unloadAnalytics();
        else setAnalyticsDisabled(true);
      }
    }
  }, [consented, priv]);

  // Conversion clicks. One delegated listener instead of editing every link on the site.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const link = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!link) return;
      const href = link.getAttribute("href") ?? "";
      const params = { link_url: href, link_text: (link.textContent ?? "").trim().slice(0, 80) };
      if (href.startsWith("tel:")) {
        trackEvent("phone_click", params);
      } else if (/^(https?:)?\/\/(wa\.me|api\.whatsapp\.com|chat\.whatsapp\.com)\//i.test(href) || href.startsWith("whatsapp:")) {
        trackEvent("whatsapp_click", params);
      }
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
