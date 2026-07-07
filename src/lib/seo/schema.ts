const HERO_IMAGE = "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png";

export const faqSchemaFr = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Où se trouve Arabian Desert Home ?", acceptedAnswer: { "@type": "Answer", text: "Arabian Desert Home se situe dans le désert d'Agafay, à 30 km de Marrakech (environ 45 minutes de route), dans la région Marrakech-Safi au Maroc." } },
    { "@type": "Question", name: "Quel est le prix d'une nuit dans une tente de luxe ?", acceptedAnswer: { "@type": "Answer", text: "Les tentes commencent à partir de 170 EUR par nuit pour la tente entière, quel que soit le nombre de personnes. Le petit-déjeuner est inclus." } },
    { "@type": "Question", name: "Qu'est-ce qu'un Day Pass au désert d'Agafay ?", acceptedAnswer: { "@type": "Answer", text: "Le Day Pass donne accès à la piscine, au déjeuner traditionnel marocain et aux activités du camp. Les tarifs démarrent à 35 EUR par personne." } },
    { "@type": "Question", name: "Quelles activités sont disponibles dans le désert d'Agafay ?", acceptedAnswer: { "@type": "Answer", text: "Arabian Desert Home propose des balades à dromadaire, des tours en quad, de l'équitation, des randonnées dans le désert et des couchers de soleil panoramiques sur les 6 hectares du domaine." } },
    { "@type": "Question", name: "Y a-t-il un restaurant sur place ?", acceptedAnswer: { "@type": "Answer", text: "Oui, le restaurant propose une cuisine marocaine et méditerranéenne préparée avec des produits locaux, dans un cadre désertique unique avec vue sur les montagnes de l'Atlas." } },
    { "@type": "Question", name: "Quelle est la meilleure saison pour visiter le désert d'Agafay ?", acceptedAnswer: { "@type": "Answer", text: "Le désert d'Agafay est accessible toute l'année. Le printemps (mars-mai) et l'automne (septembre-novembre) offrent des températures idéales (20-28 degrés C)." } },
    { "@type": "Question", name: "Comment réserver à Arabian Desert Home ?", acceptedAnswer: { "@type": "Answer", text: "La réservation se fait directement via le formulaire en ligne sur arabiandeserthome.ma, ou par téléphone au +212 667-370-206. Une confirmation est envoyée par email sous 24 heures." } },
  ],
};

export const faqSchemaEn = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Where is Arabian Desert Home located?", acceptedAnswer: { "@type": "Answer", text: "Arabian Desert Home is located in the Agafay desert, 30 km from Marrakech (about 45 minutes by road), in the Marrakech-Safi region of Morocco." } },
    { "@type": "Question", name: "What is the price of a night in a luxury tent?", acceptedAnswer: { "@type": "Answer", text: "Tents start from 170 EUR per night for the whole tent, regardless of the number of guests. Breakfast is included." } },
    { "@type": "Question", name: "What is a Day Pass at the Agafay desert?", acceptedAnswer: { "@type": "Answer", text: "The Day Pass gives access to the pool, a traditional Moroccan lunch and the camp's activities. Rates start from 35 EUR per person." } },
    { "@type": "Question", name: "What activities are available in the Agafay desert?", acceptedAnswer: { "@type": "Answer", text: "Arabian Desert Home offers camel rides, quad tours, horseback riding, desert hikes and panoramic sunsets across the 6-hectare estate." } },
    { "@type": "Question", name: "Is there a restaurant on site?", acceptedAnswer: { "@type": "Answer", text: "Yes, the restaurant serves Moroccan and Mediterranean cuisine prepared with local produce, in a unique desert setting with views of the Atlas mountains." } },
    { "@type": "Question", name: "What is the best season to visit the Agafay desert?", acceptedAnswer: { "@type": "Answer", text: "The Agafay desert is accessible year-round. Spring (March-May) and autumn (September-November) offer ideal temperatures (20-28°C)." } },
    { "@type": "Question", name: "How do I book at Arabian Desert Home?", acceptedAnswer: { "@type": "Answer", text: "Booking is done directly via the online form at arabiandeserthome.ma, or by phone at +212 667-370-206. A confirmation is sent by email within 24 hours." } },
  ],
};

export const lodgingSchemaFr = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: "Arabian Desert Home",
  description: "Bivouac de luxe dans le désert d'Agafay à 30 minutes de Marrakech. Six hectares de pur désert, suites-tentes exclusives, restaurant gastronomique et activités sur mesure.",
  url: "https://www.arabiandeserthome.ma",
  image: HERO_IMAGE,
  telephone: "+212667370206",
  email: "info@arabiandeserthome.ma",
  address: { "@type": "PostalAddress", streetAddress: "Douar Ait Said Lchou", addressLocality: "Agafay", addressRegion: "Marrakech-Safi", addressCountry: "MA" },
  geo: { "@type": "GeoCoordinates", latitude: 31.45, longitude: -8.15 },
  openingHours: "Mo-Su 00:00-23:59",
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "00:00",
    closes: "23:59",
  },
  aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "5", bestRating: "5", worstRating: "1" },
  priceRange: "$$$$",
  starRating: { "@type": "Rating", ratingValue: "5" },
  sameAs: ["https://www.instagram.com/arabian_desert_home", "https://www.facebook.com/arabian_desert_home"],
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Piscine" },
    { "@type": "LocationFeatureSpecification", name: "Suites-tentes de luxe" },
    { "@type": "LocationFeatureSpecification", name: "Restaurant gastronomique" },
    { "@type": "LocationFeatureSpecification", name: "Promenade en dromadaire" },
    { "@type": "LocationFeatureSpecification", name: "Randonnée équestre" },
    { "@type": "LocationFeatureSpecification", name: "Day Pass" },
    { "@type": "LocationFeatureSpecification", name: "Evenements et Mariages" },
  ],
};

export const lodgingSchemaEn = {
  ...lodgingSchemaFr,
  description: "Luxury bivouac in the Agafay desert, 30 minutes from Marrakech. Six hectares of pure desert, exclusive tent suites, a gourmet restaurant and bespoke activities.",
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Swimming Pool" },
    { "@type": "LocationFeatureSpecification", name: "Luxury Tent Suites" },
    { "@type": "LocationFeatureSpecification", name: "Gourmet Restaurant" },
    { "@type": "LocationFeatureSpecification", name: "Camel Rides" },
    { "@type": "LocationFeatureSpecification", name: "Horseback Riding" },
    { "@type": "LocationFeatureSpecification", name: "Day Pass" },
    { "@type": "LocationFeatureSpecification", name: "Events & Weddings" },
  ],
};
