const INDEXNOW_KEY = "b0847d520595e658348e7bdf680fc671";
const HOST = "www.arabiandeserthome.ma";

/**
 * Notifies IndexNow (Bing, Yandex, and other participating engines) that
 * the given URLs changed, so they can be crawled sooner than the next
 * scheduled visit. Best-effort — failures never block the caller.
 */
export async function notifyIndexNow(urls: string[]): Promise<void> {
  if (urls.length === 0) return;
  try {
    await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
        urlList: urls,
      }),
    });
  } catch {
    // Non-fatal — indexing is best-effort and should never break the admin action.
  }
}

/** Builds the FR + EN + ES + IT URLs for a given site-relative path (e.g. "/blog/my-post"). */
export function localizedUrls(path: string): string[] {
  return [
    `https://${HOST}${path}`,
    `https://${HOST}/en${path}`,
    `https://${HOST}/es${path}`,
    `https://${HOST}/it${path}`,
  ];
}
