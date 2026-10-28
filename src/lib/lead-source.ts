/**
 * Where a visitor came from, worked out from the page they first landed on and their
 * referrer. Nothing is stored on the visitor's device: the address of the page that opened
 * this browsing session is still available to the page (Navigation Timing), and it keeps
 * the ad click id and campaign tags even after the visitor moved around the site.
 */
export type LeadSource = "ads" | "organic" | "ai" | "social" | "direct" | "other";
export type LeadKind = "whatsapp" | "phone" | "form";

export const LEAD_SOURCES: LeadSource[] = ["ads", "organic", "ai", "social", "direct", "other"];
export const LEAD_KINDS: LeadKind[] = ["whatsapp", "phone", "form"];

const AI_HOST = /(^|\.)(chatgpt\.com|openai\.com|perplexity\.ai|claude\.ai|gemini\.google\.com|copilot\.microsoft\.com|you\.com|phind\.com|poe\.com|grok\.com)$/i;
const SEARCH_HOST = /(^|\.)(google|bing|duckduckgo|yahoo|ecosia|qwant|brave|yandex|baidu|startpage)\.[a-z.]+$/i;
const SOCIAL_HOST = /(^|\.)(facebook\.com|instagram\.com|l\.instagram\.com|t\.co|twitter\.com|x\.com|tiktok\.com|linkedin\.com|lnkd\.in|pinterest\.[a-z.]+|youtube\.com|youtu\.be|whatsapp\.com|wa\.me)$/i;

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return "";
  }
}

export function isLeadSource(value: unknown): value is LeadSource {
  return typeof value === "string" && (LEAD_SOURCES as string[]).includes(value);
}

export function isLeadKind(value: unknown): value is LeadKind {
  return typeof value === "string" && (LEAD_KINDS as string[]).includes(value);
}

/** `entryUrl` is the first page of this browsing session, `referrer` the site that sent the visitor. */
export function classifySource(entryUrl: string, referrer: string, ownHost: string): LeadSource {
  let params: URLSearchParams;
  try {
    params = new URL(entryUrl).searchParams;
  } catch {
    params = new URLSearchParams();
  }
  // A Google Ads click always carries a click id; other ad networks tag the medium.
  if (params.has("gclid") || params.has("gbraid") || params.has("wbraid")) return "ads";
  if (/^(cpc|ppc|paid|paidsearch|paid_search)$/i.test(params.get("utm_medium") ?? "")) return "ads";
  // AI assistants often add utm_source=chatgpt.com to the links they cite.
  if (AI_HOST.test(params.get("utm_source") ?? "") || /chatgpt|openai|perplexity|claude|gemini|copilot/i.test(params.get("utm_source") ?? "")) return "ai";

  const ref = hostOf(referrer);
  if (!ref || ref === ownHost.toLowerCase()) return "direct";
  if (AI_HOST.test(ref)) return "ai";
  if (SEARCH_HOST.test(ref)) return "organic";
  if (SOCIAL_HOST.test(ref)) return "social";
  return "other";
}

/** The source of the current visitor, in the browser. */
export function currentLeadSource(): LeadSource {
  if (typeof window === "undefined") return "direct";
  const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  return classifySource(nav?.name ?? window.location.href, document.referrer, window.location.hostname);
}
