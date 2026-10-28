"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  CONSENT_EVENT,
  isPrivatePath,
  loadAnalytics,
  readConsent,
  reportLead,
  setAnalyticsDisabled,
  trackEvent,
  withdrawConsent,
  type ConsentChoice,
} from "@/lib/analytics";

/**
 * Loads Google Analytics 4 and the Google Ads tag in Consent Mode "advanced": present on
 * every public page, cookieless until the visitor accepts the banner. Never on private pages
 * (guest/quote links carry an access token; admin is the owner). Also reports the phone and
 * WhatsApp conversion clicks site-wide. Renders nothing.
 */
export function GoogleAnalytics() {
  const pathname = usePathname();
  // `undefined` until the stored choice has been read, so the tag starts in the right state.
  const [choice, setChoice] = useState<ConsentChoice | undefined>(undefined);
  const priv = isPrivatePath(pathname);

  // Follow the cookie banner's choice (and a later change of mind).
  useEffect(() => {
    const sync = () => setChoice(readConsent());
    sync();
    window.addEventListener(CONSENT_EVENT, sync);
    return () => window.removeEventListener(CONSENT_EVENT, sync);
  }, []);

  useEffect(() => {
    if (choice === undefined) return;
    if (priv) {
      // A private page (possibly reached by client-side navigation): block every hit.
      setAnalyticsDisabled(true);
      return;
    }
    setAnalyticsDisabled(false);
    loadAnalytics(choice === "granted" ? "granted" : "denied");
    if (choice === "denied") withdrawConsent();
  }, [choice, priv]);

  // Conversion clicks. One delegated listener instead of editing every link on the site.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const link = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!link) return;
      const href = link.getAttribute("href") ?? "";
      const params = { link_url: href, link_text: (link.textContent ?? "").trim().slice(0, 80) };
      if (href.startsWith("tel:")) {
        trackEvent("phone_click", params);
        reportLead("phone");
      } else if (/^(https?:)?\/\/(wa\.me|api\.whatsapp\.com|chat\.whatsapp\.com)\//i.test(href) || href.startsWith("whatsapp:")) {
        trackEvent("whatsapp_click", params);
        reportLead("whatsapp");
      }
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
