import type { Metadata } from "next";
import { alternatesFor, type Locale } from "@/lib/seo/hreflang";
import { REVEILLON_PATH, SOIREE_PRICE_EUR, type ReveillonOffer } from "@/lib/reveillon";

const BASE = "https://www.arabiandeserthome.ma";
const OG_IMAGE = "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/night.png";

const META: Record<Locale, { title: string; description: string; og: string; name: string; keywords: string[] }> = {
  fr: {
    title: "Réveillon 31 décembre 2026 au désert d'Agafay | Arabian Desert Home",
    description: "Réveillon sous les étoiles à 30 min de Marrakech : dîner 4 services, gnawa, DJ, cracheurs de feu et bûche. Soirée dès 84 € (900 MAD) ou soirée + nuit en tente. Places limitées.",
    og: "fr_FR",
    name: "Réveillon sous les étoiles · Nouvel An 2027 au désert d'Agafay",
    keywords: ["réveillon marrakech", "réveillon désert agafay", "nouvel an marrakech 2027", "soirée 31 décembre marrakech", "réveillon désert maroc", "nouvel an désert agafay"],
  },
  en: {
    title: "New Year's Eve 2026 in the Agafay Desert | Arabian Desert Home",
    description: "New Year's Eve under the stars, 30 min from Marrakech: 4-course dinner, gnawa, DJ, fire performers and Yule log. Evening from €84 or evening + night in a tent. Limited places.",
    og: "en_US",
    name: "New Year's Eve under the stars · Agafay desert",
    keywords: ["new year's eve marrakech", "new year agafay desert", "marrakech new year 2027", "desert new year's eve morocco"],
  },
  es: {
    title: "Nochevieja 2026 en el desierto de Agafay | Arabian Desert Home",
    description: "Nochevieja bajo las estrellas a 30 min de Marrakech: cena de 4 platos, gnawa, DJ, escupefuegos y tronco. Velada desde 84 € o velada + noche en tienda. Plazas limitadas.",
    og: "es_ES",
    name: "Nochevieja bajo las estrellas · Desierto de Agafay",
    keywords: ["nochevieja marrakech", "nochevieja desierto agafay", "año nuevo marrakech 2027", "nochevieja desierto marruecos"],
  },
  it: {
    title: "Capodanno 2026 nel deserto di Agafay | Arabian Desert Home",
    description: "Capodanno sotto le stelle a 30 min da Marrakech: cena di 4 portate, gnawa, DJ, mangiafuoco e tronchetto. Serata da 84 € o serata + notte in tenda. Posti limitati.",
    og: "it_IT",
    name: "Capodanno sotto le stelle · Deserto di Agafay",
    keywords: ["capodanno marrakech", "capodanno deserto agafay", "capodanno marrakech 2027", "capodanno deserto marocco"],
  },
};

function pageUrl(lang: Locale): string {
  return lang === "fr" ? `${BASE}${REVEILLON_PATH}` : `${BASE}/${lang}${REVEILLON_PATH}`;
}

export function reveillonMetadata(lang: Locale): Metadata {
  const m = META[lang];
  return {
    title: m.title,
    description: m.description,
    keywords: m.keywords,
    openGraph: { locale: m.og, title: m.title, description: m.description, url: pageUrl(lang), type: "website", images: [{ url: OG_IMAGE, width: 1344, height: 768, alt: m.name }] },
    twitter: { card: "summary_large_image", title: m.title, description: m.description, images: [OG_IMAGE] },
    alternates: alternatesFor(lang, REVEILLON_PATH),
  };
}

/** schema.org Event, so the night can show in Google with its date, place and price. */
export function reveillonJsonLd(lang: Locale, offer: ReveillonOffer): string {
  const m = META[lang];
  const offers = [
    { name: "Soirée", price: SOIREE_PRICE_EUR, available: offer.soiree.seatsLeft > 0 },
    ...offer.tents.map((t) => ({ name: `Soirée + ${t.name}`, price: t.priceEur, available: t.left > 0 })),
  ];
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Event",
    name: m.name,
    description: m.description,
    startDate: "2026-12-31T17:30:00+01:00",
    endDate: "2027-01-01T02:00:00+01:00",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    image: [OG_IMAGE],
    url: pageUrl(lang),
    location: {
      "@type": "Place",
      name: "Arabian Desert Home",
      address: { "@type": "PostalAddress", addressLocality: "Agafay, Marrakech", addressCountry: "MA" },
    },
    organizer: { "@type": "Organization", name: "Arabian Desert Home", url: BASE },
    offers: offers.map((o) => ({
      "@type": "Offer",
      name: o.name,
      price: o.price,
      priceCurrency: "EUR",
      availability: o.available ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
      url: `${pageUrl(lang)}#reserver`,
      validFrom: "2026-11-26T00:00:00+01:00",
    })),
  }).replace(/</g, "\\u003c");
}
