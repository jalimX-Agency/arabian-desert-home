/**
 * Helpers for the cookie-free visit counter. Nothing here identifies a visitor: the user agent
 * is only read to drop robots and to class the device (mobile / tablet / desktop), then thrown
 * away; the country comes from the hosting edge as a two-letter code.
 */
export type DeviceClass = "mobile" | "tablet" | "desktop";

const BOT_RE = /bot|crawl|spider|slurp|facebookexternalhit|preview|headless|lighthouse|pingdom|uptime|monitor|curl|wget|python|axios|node-fetch|go-http|java\/|httpclient|vercel|gtmetrix|semrush|ahrefs|mj12|dataprovider/i;

export function isBotUserAgent(ua: string | null): boolean {
  return !ua || BOT_RE.test(ua);
}

export function deviceFromUserAgent(ua: string | null): DeviceClass {
  const s = ua ?? "";
  if (/ipad|tablet|(android(?!.*mobile))/i.test(s)) return "tablet";
  if (/mobi|iphone|ipod|android|windows phone/i.test(s)) return "mobile";
  return "desktop";
}

/** Two-letter ISO country code from the edge header, or "" when missing or odd. */
export function countryFromHeader(value: string | null): string {
  const c = (value ?? "").trim().toUpperCase();
  return /^[A-Z]{2}$/.test(c) && c !== "XX" && c !== "T1" ? c : "";
}

/** True when the request carries the admin's login cookie: the owner browsing the public site
 *  must not inflate the numbers. */
export function hasAdminSessionCookie(cookieHeader: string | null): boolean {
  return /(^|;\s*)(__Secure-)?next-auth\.session-token/.test(cookieHeader ?? "");
}

export const VISIT_DEVICES: DeviceClass[] = ["mobile", "tablet", "desktop"];
