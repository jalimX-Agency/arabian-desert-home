import type { Language } from "@/lib/i18n/context";

interface MetaSnippet {
  title: string;
  description: string;
}

/**
 * Search-snippet rewrites for blog posts that get plenty of impressions but
 * almost no clicks (Search Console, Jul–Sep 2026). Each title is written for
 * the queries the page actually shows up for, and stays under ~60 characters
 * so Google doesn't truncate it.
 *
 * These only change the <title>/<meta description> — the article's own H1,
 * excerpt and card text still come from the database.
 */
const BLOG_META: Record<string, Partial<Record<Language, MetaSnippet>>> = {
  // Queries: agafay desert, agafay activities, activités agafay, things to do in agafay
  "6-activites-inoubliables-a-vivre-au-desert-dagafay-marrakech": {
    fr: {
      title: "Activités désert d'Agafay : les 6 incontournables (2026)",
      description:
        "Dromadaire, quad, dîner sous les étoiles, spa : les 6 activités à ne pas manquer au désert d'Agafay, à 30 min de Marrakech, avec prix, durées et conseils.",
    },
    en: {
      title: "Agafay Desert Activities: 6 Best Things to Do (2026)",
      description:
        "Camel rides, quad biking, sunset dinners and spa: the 6 best things to do in the Agafay desert, 30 min from Marrakech, with prices, durations and tips.",
    },
    es: {
      title: "Desierto de Agafay: 6 actividades imprescindibles (2026)",
      description:
        "Dromedario, quad, cena bajo las estrellas y spa: las 6 mejores actividades en el desierto de Agafay, a 30 min de Marrakech, con precios, duración y consejos.",
    },
    it: {
      title: "Deserto di Agafay: 6 attività da non perdere (2026)",
      description:
        "Cammello, quad, cena sotto le stelle e spa: le 6 migliori attività nel deserto di Agafay, a 30 minuti da Marrakech, con prezzi, durata e consigli pratici.",
    },
  },

  // ── Posts on a related topic that stay live: each gets its own angle so it
  // stops competing with the stronger post above for the same query. ──

  // Angle: a day planned hour by hour (the article is built as a timeline)
  "activites-a-agafay-le-guide-complet-pour-votre-sejour-glamping": {
    fr: {
      title: "Une journée au désert d'Agafay : programme du matin au soir",
      description:
        "Matinée au calme, piscine et déjeuner, chameau au coucher du soleil puis dîner sous les étoiles : le programme idéal d'une journée à Agafay, près de Marrakech.",
    },
    en: {
      title: "A Day in the Agafay Desert: Itinerary From Dawn to Dusk",
      description:
        "Quiet morning, pool and lunch, a sunset camel ride, then dinner under the stars: the ideal one-day itinerary in the Agafay desert, 30 min from Marrakech.",
    },
    es: {
      title: "Un día en el desierto de Agafay: plan de la mañana a la noche",
      description:
        "Mañana tranquila, piscina y almuerzo, camello al atardecer y cena bajo las estrellas: el plan ideal para un día en el desierto de Agafay, cerca de Marrakech.",
    },
    it: {
      title: "Una giornata ad Agafay: programma dall'alba alla sera",
      description:
        "Mattina tranquilla, piscina e pranzo, cammello al tramonto e cena sotto le stelle: il programma ideale per una giornata nel deserto di Agafay, vicino a Marrakech.",
    },
  },

  // Angle: horse riding + activity prices and bundles
  "guide-des-meilleures-activites-a-vivre-dans-le-desert-dagafay": {
    fr: {
      title: "Cheval, dromadaire et quad à Agafay : prix et formules",
      description:
        "Dromadaire dès 15 €, balade à cheval de 45 min, quad d'une heure et formules tout compris : les prix des activités du désert d'Agafay, à 30 min de Marrakech.",
    },
    en: {
      title: "Horse Riding, Camel & Quad in Agafay: Prices and Packages",
      description:
        "Camel rides from €15, a 45-minute horse ride, a one-hour quad trip and all-inclusive packages: activity prices in the Agafay desert, 30 min from Marrakech.",
    },
  },

  // Angle: an overnight stay at the camp
  "5-experiences-inoubliables-en-glamping-de-luxe-a-agafay": {
    fr: {
      title: "Nuit en glamping à Agafay : 5 expériences à vivre au camp",
      description:
        "Ciel étoilé, chameau au coucher du soleil, dîner gastronomique, hammam et lever du soleil : les 5 moments forts d'une nuit en glamping de luxe à Agafay.",
    },
    en: {
      title: "A Night of Glamping in Agafay: 5 Experiences at the Camp",
      description:
        "Starry skies, a sunset camel ride, a gourmet dinner, hammam and sunrise: the 5 highlights of a night of luxury glamping in the Agafay desert near Marrakech.",
    },
  },

  // Angle: a retreat — silence, mindful walking, digital detox
  "une-retraite-bien-etre-au-cur-du-desert-dagafay-marrakech-3": {
    fr: {
      title: "Retraite bien-être à Agafay : silence, yoga et détox digitale",
      description:
        "Marche consciente, yoga face aux dunes, cuisine saine et déconnexion digitale : comment vivre une vraie retraite bien-être au désert d'Agafay, près de Marrakech.",
    },
    en: {
      title: "Wellness Retreat in Agafay: Silence, Yoga & Digital Detox",
      description:
        "Mindful walks, yoga facing the dunes, healthy food and a digital detox: how to enjoy a genuine wellness retreat in the Agafay desert, near Marrakech.",
    },
  },

  // Angle: hammam and in-tent massage treatments
  "bien-etre-dans-le-desert-dagafay-rituels-de-serenite-au-camp": {
    fr: {
      title: "Hammam et massage au désert d'Agafay : rituels de détente",
      description:
        "Hammam traditionnel, massage à l'huile d'argan sous la tente, méditation face aux dunes : les rituels bien-être du camp Arabian Desert Home, près de Marrakech.",
    },
    en: {
      title: "Hammam and Massage in the Agafay Desert: Relaxation Rituals",
      description:
        "Traditional hammam, argan-oil massage in your tent and meditation facing the dunes: the wellness rituals of the Arabian Desert Home camp, near Marrakech.",
    },
  },

  // Angle: weddings and corporate seminars (vs. the general private-event post)
  "evenements-prives-a-agafay-celebrer-dans-le-desert-marocain": {
    fr: {
      title: "Mariage et séminaire au désert d'Agafay, près de Marrakech",
      description:
        "Mariage sous les étoiles, anniversaire ou séminaire d'entreprise : décor, gastronomie, décoration sur mesure et logistique pour votre événement à Agafay.",
    },
    en: {
      title: "Weddings and Corporate Retreats in the Agafay Desert",
      description:
        "A wedding under the stars, a birthday or a company seminar: setting, catering, bespoke decoration and logistics for your private event in Agafay.",
    },
    es: {
      title: "Bodas y seminarios en el desierto de Agafay (Marrakech)",
      description:
        "Boda bajo las estrellas, cumpleaños o seminario de empresa: entorno, gastronomía, decoración a medida y logística para su evento privado en Agafay.",
    },
    it: {
      title: "Matrimoni e seminari nel deserto di Agafay, vicino a Marrakech",
      description:
        "Matrimonio sotto le stelle, compleanno o seminario aziendale: location, gastronomia, allestimento su misura e logistica per il vostro evento ad Agafay.",
    },
  },

  // Queries: agafay prix (141 impressions, 0 clicks), agafay marrakech prix
  "prix-sejour-desert-agafay-guide-complet-budgets": {
    fr: {
      title: "Agafay prix 2026 : Day Pass dès 35 €, nuit dès 170 €",
      description:
        "Combien coûte le désert d'Agafay ? Day Pass dès 35 €, activités, dîner-spectacle et nuit en tente de luxe dès 170 € : tous les prix 2026 et nos conseils budget.",
    },
  },

  // Queries: desert agafay itineraire, agafay itinéraire, marrakech to agafay (desert)
  "comment-aller-desert-agafay-depuis-marrakech": {
    fr: {
      title: "Marrakech – Agafay : itinéraire, temps de trajet et prix",
      description:
        "Itinéraire Marrakech – désert d'Agafay en 30 à 45 min : taxi, transfert privé ou voiture de location, avec les prix 2026, la route à suivre et le retour.",
    },
    en: {
      title: "Marrakech to Agafay Desert: Route, Travel Time & Prices",
      description:
        "How to get from Marrakech to the Agafay desert in 30–45 minutes: taxi, private transfer or rental car, with 2026 prices, the route and tips for the way back.",
    },
    es: {
      title: "Marrakech – Agafay: cómo llegar, tiempo y precios (2026)",
      description:
        "Taxi, traslado privado o coche de alquiler: cómo llegar al desierto de Agafay desde Marrakech en 30 a 45 minutos, con itinerario, precios 2026 y el regreso.",
    },
    it: {
      title: "Marrakech – Agafay: come arrivare, tempi e prezzi (2026)",
      description:
        "Taxi, transfer privato o auto a noleggio: come raggiungere il deserto di Agafay da Marrakech in 30-45 minuti, con itinerario, prezzi 2026 e il ritorno.",
    },
  },

  // Queries: agafay (190 impressions at position 3.6), desert agafay, désert agafay avis
  "desert-agafay-vaut-il-le-detour-avis-honnete": {
    fr: {
      title: "Désert d'Agafay : notre avis honnête (vaut-il le détour ?)",
      description:
        "Agafay vaut-il le détour ? Pas de dunes, mais un désert de pierre face à l'Atlas à 30 min de Marrakech : ce qu'on y fait, les prix et pour qui c'est fait.",
    },
  },

  // Queries: météo agafay, température désert agafay (nuit)
  "meilleure-saison-pour-visiter-desert-agafay": {
    fr: {
      title: "Météo désert d'Agafay : la meilleure saison mois par mois",
      description:
        "Températures de jour et de nuit, pluie et vent mois par mois : quand partir au désert d'Agafay ? Printemps et automne idéaux, nuits fraîches en hiver.",
    },
  },
};

/** The rewritten snippet for this post in this language, if there is one. */
export function blogMetaOverride(slug: string, language: Language): MetaSnippet | undefined {
  return BLOG_META[slug]?.[language];
}
