/**
 * Google Analytics 4 + Google Ads + consent. Both IDs are public (they ship in the
 * page source of every site using them), so they live in code; the env variables
 * can override them per environment.
 */
import { classifySource } from "@/lib/lead-source";

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-B2HNNGN22V";
export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ?? "AW-18270149902";

/** localStorage key holding the visitor's cookie choice. */
export const CONSENT_KEY = "adh-cookie-consent";
/** Bumped when the banner starts asking for more: version 1 covered analytics only,
 *  version 2 covers analytics + advertising, so earlier answers are asked again. */
export const CONSENT_VERSION = 2;
/** Dispatched on `window` whenever the stored choice changes. */
export const CONSENT_EVENT = "adh:consent-change";
/** Dispatched on `window` to re-open the cookie banner (footer "Cookies" link). */
export const OPEN_SETTINGS_EVENT = "adh:open-cookie-settings";

/** A choice is asked again after 6 months, as regulators recommend. */
export const CONSENT_TTL_MS = 180 * 24 * 60 * 60 * 1000;

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

/** True once gtag.js is loaded on this page view and not hard-disabled (private pages). */
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

/** Sends a GA4 event (and the matching Google Ads conversion). Without consent, gtag.js sends
 *  it as a cookieless ping (Consent Mode); a silent no-op on private pages or before load. */
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

/** Hard switch: while true, gtag.js sends nothing at all (Google's documented opt-out flag),
 *  for analytics and for the Ads tag alike. Used on private pages. */
export function setAnalyticsDisabled(disabled: boolean): void {
  ga()[disableKey()] = disabled;
  ga()[`ga-disable-${GOOGLE_ADS_ID}`] = disabled;
}

/**
 * Loads gtag.js in Consent Mode v2 "advanced": the tag is always present on public pages,
 * starting with every signal denied. Until the visitor accepts, it stores and reads NO
 * cookie and only sends anonymous, cookieless pings, which let Google Ads and GA4 model the
 * visits and conversions of people who never answer the banner (about 4 in 10 here).
 * Accepting switches the signals to granted: cookies, full measurement and remarketing.
 * One gtag.js serves both GA4 and the Ads tag.
 */
export function loadAnalytics(choice: "granted" | "denied"): void {
  const w = ga();
  if (w.__adhGaLoaded) {
    w.gtag?.("consent", "update", consentState(choice));
    return;
  }
  w.dataLayer = w.dataLayer || [];
  // gtag.js needs the real `arguments` object pushed, not an array.
  w.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer!.push(arguments);
  } as Gtag;

  w.gtag("consent", "default", consentState("denied"));
  if (choice === "granted") w.gtag("consent", "update", consentState("granted"));
  // While denied: no ad identifiers in requests, and the ad click id travels in the URL
  // instead of a cookie so a later conversion can still be attributed.
  w.gtag("set", "ads_data_redaction", true);
  w.gtag("set", "url_passthrough", true);
  w.gtag("js", new Date());
  w.gtag("config", GA_MEASUREMENT_ID);
  w.gtag("config", GOOGLE_ADS_ID);

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
  w.__adhGaLoaded = true;
}

/** Refusal or withdrawal of consent: signals back to denied and the analytics and ads
 *  cookies removed. The tag keeps sending cookieless pings only. */
export function withdrawConsent(): void {
  const w = ga();
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

/**
 * The tag as an inline script for the page <head>. It runs while the page is still
 * loading, so a visitor who leaves within a couple of seconds is still counted; waiting
 * for React to start (as before) lost them. Same rules as loadAnalytics: every consent
 * signal denied unless the visitor already accepted, and never on private pages.
 */
export function earlyTagScript(): string {
  const privateRe = "^\/(admin|mes-reservations|devis)(\/|$)";
  return `(function(){try{
var w=window,l=location;
if(new RegExp(${JSON.stringify(privateRe)}).test(l.pathname))return;
var ok=false;
try{var r=w.localStorage.getItem(${JSON.stringify(CONSENT_KEY)});if(r){var c=JSON.parse(r);ok=c&&c.analytics===true&&typeof c.ts==="number"&&Date.now()-c.ts<=${CONSENT_TTL_MS}&&c.v===${CONSENT_VERSION};}}catch(e){}
w.dataLayer=w.dataLayer||[];
w.gtag=function(){w.dataLayer.push(arguments);};
var g=function(v){return{analytics_storage:v,ad_storage:v,ad_user_data:v,ad_personalization:v};};
w.gtag("consent","default",g("denied"));
if(ok)w.gtag("consent","update",g("granted"));
w.gtag("set","ads_data_redaction",true);
w.gtag("set","url_passthrough",true);
w.gtag("js",new Date());
w.gtag("config",${JSON.stringify(GA_MEASUREMENT_ID)});
w.gtag("config",${JSON.stringify(GOOGLE_ADS_ID)});
var s=document.createElement("script");s.async=true;
s.src="https://www.googletagmanager.com/gtag/js?id="+${JSON.stringify(GA_MEASUREMENT_ID)};
document.head.appendChild(s);
w.__adhGaLoaded=true;
}catch(e){}})();`;
}

/** Anonymous count of a lead action (no cookie, no identifier) so requests can be counted by
 *  source even for visitors who refused or ignored the cookie banner. Silent on failure. */
export function reportLead(kind: "whatsapp" | "phone"): void {
  if (typeof window === "undefined" || isPrivatePath(window.location.pathname)) return;
  const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  const body = JSON.stringify({
    kind,
    source: classifySource(nav?.name ?? window.location.href, document.referrer, window.location.hostname),
    page: window.location.pathname,
    lang: languageFromPath(window.location.pathname),
  });
  try {
    if (navigator.sendBeacon) navigator.sendBeacon("/api/lead-event", new Blob([body], { type: "application/json" }));
    else void fetch("/api/lead-event", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true });
  } catch {
    // Never let counting get in the way of the tap.
  }
}
