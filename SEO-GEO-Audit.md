# SEO & GEO Audit — arabiandeserthome.com

**Date:** June 12, 2026  
**Site:** https://arabiandeserthome.com  
**Framework:** Next.js 15 (App Router)

---

## Overall Score

| Category | Status | Score |
|---|---|---|
| Meta Tags | ✅ Excellent | 9/10 |
| Schema / Structured Data | ⚠️ Good with gaps | 7/10 |
| AI Bot Access (GEO) | ✅ Excellent | 10/10 |
| Sitemap | ⚠️ Good with gaps | 7/10 |
| Robots.txt | ✅ Excellent | 10/10 |
| Duplicate Content Risk | ❌ Issues found | 4/10 |
| GEO Optimization | ✅ Good | 8/10 |

---

## ✅ What's Working Well

### Meta Tags — All Pages
Every page has a unique, keyword-rich `<title>` and `<meta description>`. The root layout sets `metadataBase` correctly so all relative URLs resolve to `https://arabiandeserthome.com`. Canonical URLs are set on every static and dynamic page.

### Open Graph & Twitter Cards
All pages export complete OG and Twitter Card metadata with proper image dimensions (1344×768, close to the recommended 1200×630 ratio) and locale set to `fr_FR` with `en_US` as alternate.

### AI Bot Access ✅ GEO Critical
Your `robots.ts` explicitly allows every major AI crawler — this is excellent and many sites miss it:
- `PerplexityBot` ✅
- `GPTBot` / `ChatGPT-User` ✅
- `ClaudeBot` / `anthropic-ai` ✅
- `Googlebot` / `Bingbot` ✅

### FAQPage Schema (+40% AI Citation Boost)
You have a 7-question FAQPage schema in the root layout. This is one of the highest-impact GEO optimizations — AI engines heavily cite pages with FAQ schema. The questions are well-written and include statistics (prices in EUR/MAD, distances in km, temperatures).

### LodgingBusiness Schema
Comprehensive structured data including address, geo-coordinates, telephone, priceRange, starRating, social media sameAs links, and a full amenityFeature list.

### Dynamic Metadata on Suites & Activities
Each suite and activity detail page generates its own unique `<title>`, `<meta description>`, OG tags, canonical URL, and a `Product` schema with pricing — correctly using `generateMetadata()`.

### Bilingual Keywords
Keywords are mixed French/English across all pages (e.g., "bivouac luxe Agafay" + "luxury desert camp Agafay Marrakech"), which captures both francophone and anglophone search traffic.

---

## ❌ Issues to Fix

### 1. Duplicate Content Risk — Legacy Suite Routes
**Priority: HIGH**

You have three old route folders alongside the new `/les-tentes/[slug]` system:
- `/src/app/suite-chorfa/`
- `/src/app/suite-familiale/`
- `/src/app/suite-junior/`

These are `"use client"` pages with **no metadata** and they're **not in the sitemap** — but they're live URLs. Google may index them as thin, duplicate content competing with your canonical `/les-tentes/[slug]` pages.

**Fix:** Add redirects in `next.config.ts` pointing these to the canonical slug URLs:
```ts
// next.config.ts
async redirects() {
  return [
    { source: '/suite-chorfa', destination: '/les-tentes/suite-chorfa', permanent: true },
    { source: '/suite-familiale', destination: '/les-tentes/suite-familiale', permanent: true },
    { source: '/suite-junior', destination: '/les-tentes/suite-junior', permanent: true },
  ];
}
```

---

### 2. `/spa` Page Has No Metadata
**Priority: HIGH**

`/src/app/spa/page.tsx` is a `"use client"` component with no metadata export. This page is invisible to search engines — no title, description, or schema. It's also absent from the sitemap.

**Fix:** Create a `layout.tsx` alongside it:
```ts
// src/app/spa/layout.tsx
export const metadata = {
  title: "Spa & Bien-être au Désert | Arabian Desert Home — Agafay",
  description: "Soins et massages traditionnels dans le cadre unique du désert d'Agafay. Hammam, soins aromatiques et rituels berbères à 30 km de Marrakech.",
  alternates: { canonical: "https://arabiandeserthome.com/spa" },
};
```
Also add `/spa` to your `sitemap.ts` with `priority: 0.7`.

---

### 3. `LodgingBusiness` Schema — Broken Image URL
**Priority: MEDIUM**

In your root `layout.tsx`, the `LodgingBusiness` schema references:
```
"image": "https://arabiandeserthome.com/images/hero.png"
```
But your actual OG image is served from R2 CDN:
```
https://pub-1d9eafXXX.r2.dev/gallery/hero.png
```
If `/images/hero.png` doesn't exist on your domain, Google's Rich Results Test will flag a broken image on your structured data.

**Fix:** Update the schema image URL to match your actual R2 CDN URL.

---

### 4. No `AggregateRating` Schema
**Priority: MEDIUM**

For a luxury hospitality business, an `AggregateRating` on your `LodgingBusiness` schema unlocks star ratings in Google SERPs — a significant CTR boost. You need a mechanism to collect/store a rating value.

```json
"aggregateRating": {
  "@type": "AggregateRating",
  "ratingValue": "4.9",
  "reviewCount": "87",
  "bestRating": "5"
}
```

---

### 5. No `Event` Schema on `/les-evenements`
**Priority: MEDIUM**

The events page describes weddings, seminars, and team-building — these qualify for `Event` structured data, which can generate rich results in Google. The layout exports OG/Twitter metadata but no JSON-LD.

**Fix:** Add a JSON-LD script in the layout or page with `@type: "Event"` (or at minimum an `Organization` offering events).

---

### 6. Product Schema on Suite Pages — Use `Accommodation` Instead
**Priority: LOW**

Individual suite pages use `@type: "Product"` with an `Offer`. While this works, Schema.org has a more specific type for accommodation:

```json
{
  "@type": "Accommodation",
  "accommodationCategory": "Suite",
  "numberOfRooms": 1,
  "occupancy": { "@type": "QuantitativeValue", "maxValue": 4 },
  "amenityFeature": [...],
  "offers": { "@type": "Offer", "price": 170, "priceCurrency": "EUR" }
}
```
This gives Google more semantic context and can improve AI citation accuracy.

---

### 7. `hreflang` — Both Languages Point to Same URL
**Priority: LOW**

In `layout.tsx` alternates:
```ts
languages: {
  fr: "https://arabiandeserthome.com",
  en: "https://arabiandeserthome.com",
}
```
If you don't have separate `/en/...` URLs, this is acceptable — but it signals to Google that both languages live at the same URL, which may reduce English-language search visibility. Consider either creating `/en/` routes or removing the `en` alternate to avoid confusing Googlebot.

---

### 8. No Image Sitemap
**Priority: LOW**

For a luxury visual property, an image sitemap helps Google Images index your gallery, suite photos, and activity shots — which drives additional organic traffic. Your current sitemap includes page URLs only.

---

## GEO-Specific Recommendations (AI Search Engines)

| Action | AI Visibility Boost | Status |
|---|---|---|
| FAQPage schema | +40% | ✅ Done |
| Allow all AI bots in robots.txt | Critical | ✅ Done |
| Statistics in content (prices, distances, °C) | +37% | ✅ In schema, verify in visible text |
| Authoritative tone + expert language | +25% | ✅ Appears present |
| Fix duplicate content (suite routes) | Prevents dilution | ❌ Fix needed |
| Add spa page metadata | Unlocks indexing | ❌ Fix needed |
| AggregateRating schema | Boosts citations | ❌ Missing |
| Brave Search indexing (for Claude AI citations) | Medium | ⚠️ Unknown — submit via Brave Webmaster Tools |

### Note on Brave Search
Claude AI primarily cites sources discovered via Brave Search. Submit your sitemap at https://search.brave.com/webmaster to ensure indexing.

---

## Priority Action List

1. **Add 301 redirects** for `/suite-chorfa`, `/suite-familiale`, `/suite-junior` → canonical slug URLs
2. **Add metadata + sitemap entry** for `/spa`
3. **Fix schema image URL** in `LodgingBusiness` (R2 CDN URL vs `/images/hero.png`)
4. **Add `AggregateRating`** to `LodgingBusiness` schema
5. **Add Event schema** to `/les-evenements`
6. **Submit sitemap to Brave Webmaster Tools** for Claude AI citation visibility
7. **Consider `/en/` routes** or remove the `en` hreflang alternate

---

*Report generated from source code analysis of `C:\projects\client projects\Arabian Desert Home`*
