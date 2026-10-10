/**
 * Google Analytics 4 + Google Ads + consent. Both IDs are public (they ship in the
 * page source of every site using them), so they live in code; the env variables
 * can override them per environment.
 */
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-B2HNNGN22V";
export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ?? "AW-18270149902";

/** localStorage key holding the visitor's cookie choice. */
export const CONSENT_KEY = "adh-cookie-consent";
/** Bumped when the banner starts asking for more: version 1 covered analytics only,
 *  version 2 covers analytics + advertising, so earlier answers are asked again. */
const CONSENT_VERSION = 2;
/** Dispatched on `window` whenever the stored choice changes. */
export const CONSENT_EVENT = "adh:consent-change";
/** Dispatched on `window` to re-open the cookie banner (footer "Cookies" link). */
export const OPEN_SETTINGS_EVENT = "adh:open-cookie-settings";

/** A choice is asked again after 6 months, as regulators recommend. */
const CONSENT_TTL_MS = 180 * 24 * 60 * 60 * 1000;

export type ConsentChoice = "granted" | "denied" | null;

export function readConsent(): ConsentChoice {
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const { analytics, ts, v } = JSON.parse(raw) as { analytics?: boolean; ts?: number; v?: number };
    if (typeof analytics !== "boolean" || typeof ts !== "number" || Date.now() - ts > CONSENT_TTL_MS) return null;
    // An "accept" given before advertising was added doesn't cover it: ask again.
    if (v !== CONSENT_VERSION) return null;
    return analytics ? "granted" : "denied";
  } catch {
    return null; // storage blocked or corrupt → treat as "not asked yet" (nothing loads)
  }
}

export function saveConsent(analytics: boolean): void {
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify({ analytics, ts: Date.now(), v: CONSENT_VERSION }));
  } catch {
    // Private mode / blocked storage: the choice just won't persist.
  }
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

/**
 * Pages that are private or internal. Analytics never loads here: the guest and
 * quote pages carry their access token in the URL (which must not be sent to a
 * third party), and the admin panel is the owner's own browsing.
 */
export function isPrivatePath(pathname: string | null): boolean {
  if (!pathname) return false;
  return /^\/(admin|mes-reservations|devis)(\/|$)/.test(pathname);
}

export type SiteLanguage = "fr" | "en" | "es" | "it";

/** Which language version of the site a path belongs to. */
export function languageFromPath(pathname: string | null): SiteLanguage {
  const p = pathname ?? "";
  if (/^\/en(\/|$)/.test(p)) return "en";
  if (/^\/es(\/|$)/.test(p)) return "es";
  if (/^\/it(\/|$)/.test(p)) return "it";
  return "fr";
}

type Gtag = (...args: unknown[]) => void;
/** The globals gtag.js and this module read and write on `window`. */
type GaGlobals = { dataLayer?: unknown[]; gtag?: Gtag; __adhGaLoaded?: boolean } & Record<string, unknown>;
const ga = () => window as unknown as GaGlobals;
const disableKey = () => `ga-disable-${GA_MEASUREMENT_ID}`;

/** Every consent signal the banner covers, all granted or all denied together. */
const consentState = (value: "granted" | "denied") => ({
  analytics_storage: value,
  ad_storage: value,
  ad_user_data: value,
  ad_personalization: value,
});

/** True once gtag.js was loaded *with consent* on this page view. */
export function isAnalyticsActive(): boolean {
  const w = ga();
  return Boolean(w.__adhGaLoaded && w.gtag && !w[disableKey()]);
}

/**
 * Google Ads conversion actions, by site event. The labels come from the account's
 * conversion settings and are public (they ship in the page source of any site that
 * uses them). Each is sent next to the GA4 event, under the same consent.
 */
const ADS_CONVERSION_LABELS: Record<string, string> = {
  booking_form_submit: "5RGZCNvHgpgdEI668YdE",
  whatsapp_click: "jr_3CN7HgpgdEI668YdE",
  phone_click: "DfpaCOHHgpgdEI668YdE",
};

/** Sends a GA4 event (and the matching Google Ads conversion) — a silent no-op unless the
 *  visitor consented and GA is loaded. */
export function trackEvent(name: string, params: Record<string, unknown> = {}): void {
  if (typeof window === "undefined" || !isAnalyticsActive()) return;
  ga().gtag!("event", name, { language: languageFromPath(window.location.pathname), ...params });

  const label = ADS_CONVERSION_LABELS[name];
  if (label) {
    const value = typeof params.value === "number" && Number.isFinite(params.value) && params.value > 0 ? params.value : undefined;
    ga().gtag!("event", "conversion", {
      send_to: `${GOOGLE_ADS_ID}/${label}`,
      // Only the booking carries an amount; the account's default value applies otherwise.
      ...(value !== undefined ? { value, currency: typeof params.currency === "string" ? params.currency : "MAD" } : {}),
    });
  }
}

/** Hard switch: while true, gtag.js sends nothing (Google's documented opt-out flag),
 *  for analytics and for the Ads tag alike. */
export function setAnalyticsDisabled(disabled: boolean): void {
  ga()[disableKey()] = disabled;
  ga()[`ga-disable-${GOOGLE_ADS_ID}`] = disabled;
}

/**
 * Loads gtag.js — only ever called after the visitor accepted. Consent Mode v2
 * defaults are declared first (everything denied), then updated to what the
 * banner asked for: audience measurement and advertising (Google Ads conversions
 * and remarketing). One gtag.js serves both GA4 and the Ads tag.
 */
export function loadAnalytics(): void {
  const w = ga();
  if (w.__adhGaLoaded) {
    w.gtag?.("consent", "update", consentState("granted"));
    return;
  }
  w.dataLayer = w.dataLayer || [];
  // gtag.js needs the real `arguments` object pushed, not an array.
  w.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer!.push(arguments);
  } as Gtag;

  w.gtag("consent", "default", consentState("denied"));
  w.gtag("consent", "update", consentState("granted"));
  w.gtag("js", new Date());
  w.gtag("config", GA_MEASUREMENT_ID);
  w.gtag("config", GOOGLE_ADS_ID);

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
  w.__adhGaLoaded = true;
}

/** Withdrawal of consent: stop sending and remove the analytics and ads cookies. */
export function unloadAnalytics(): void {
  const w = ga();
  setAnalyticsDisabled(true);
  w.gtag?.("consent", "update", consentState("denied"));
  const host = window.location.hostname;
  const domains = [host, `.${host}`, `.${host.replace(/^www\./, "")}`];
  for (const name of document.cookie.split(";").map((c) => c.split("=")[0].trim())) {
    if (name === "_ga" || name.startsWith("_ga_") || name === "_gid" || name.startsWith("_gcl_")) {
      for (const domain of domains) document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${domain}`;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    }
  }
}
