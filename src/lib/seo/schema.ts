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

export const faqSchemaEs = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "¿Dónde se encuentra Arabian Desert Home?", acceptedAnswer: { "@type": "Answer", text: "Arabian Desert Home se encuentra en el desierto de Agafay, a 30 km de Marrakech (unos 45 minutos en coche), en la región de Marrakech-Safi, Marruecos." } },
    { "@type": "Question", name: "¿Cuál es el precio de una noche en una tienda de lujo?", acceptedAnswer: { "@type": "Answer", text: "Las tiendas empiezan desde 170 EUR por noche para la tienda entera, independientemente del número de huéspedes. El desayuno está incluido." } },
    { "@type": "Question", name: "¿Qué es un Day Pass en el desierto de Agafay?", acceptedAnswer: { "@type": "Answer", text: "El Day Pass da acceso a la piscina, un almuerzo marroquí tradicional y las actividades del campamento. Las tarifas empiezan desde 35 EUR por persona." } },
    { "@type": "Question", name: "¿Qué actividades hay disponibles en el desierto de Agafay?", acceptedAnswer: { "@type": "Answer", text: "Arabian Desert Home ofrece paseos en camello, tours en quad, equitación, senderismo en el desierto y puestas de sol panorámicas en la finca de 6 hectáreas." } },
    { "@type": "Question", name: "¿Hay un restaurante en el lugar?", acceptedAnswer: { "@type": "Answer", text: "Sí, el restaurante sirve cocina marroquí y mediterránea preparada con productos locales, en un entorno desértico único con vistas a las montañas del Atlas." } },
    { "@type": "Question", name: "¿Cuál es la mejor temporada para visitar el desierto de Agafay?", acceptedAnswer: { "@type": "Answer", text: "El desierto de Agafay es accesible todo el año. La primavera (marzo-mayo) y el otoño (septiembre-noviembre) ofrecen temperaturas ideales (20-28°C)." } },
    { "@type": "Question", name: "¿Cómo reservo en Arabian Desert Home?", acceptedAnswer: { "@type": "Answer", text: "La reserva se hace directamente a través del formulario en línea en arabiandeserthome.ma, o por teléfono al +212 667-370-206. Se envía una confirmación por correo electrónico en 24 horas." } },
  ],
};

export const faqSchemaIt = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Dove si trova Arabian Desert Home?", acceptedAnswer: { "@type": "Answer", text: "Arabian Desert Home si trova nel deserto di Agafay, a 30 km da Marrakech (circa 45 minuti in auto), nella regione di Marrakech-Safi, Marocco." } },
    { "@type": "Question", name: "Qual è il prezzo di una notte in una tenda di lusso?", acceptedAnswer: { "@type": "Answer", text: "Le tende partono da 170 EUR a notte per l'intera tenda, indipendentemente dal numero di ospiti. La colazione è inclusa." } },
    { "@type": "Question", name: "Cos'è un Day Pass nel deserto di Agafay?", acceptedAnswer: { "@type": "Answer", text: "Il Day Pass dà accesso alla piscina, a un pranzo marocchino tradizionale e alle attività del campo. Le tariffe partono da 35 EUR a persona." } },
    { "@type": "Question", name: "Quali attività sono disponibili nel deserto di Agafay?", acceptedAnswer: { "@type": "Answer", text: "Arabian Desert Home offre passeggiate in cammello, tour in quad, equitazione, escursioni nel deserto e tramonti panoramici sulla tenuta di 6 ettari." } },
    { "@type": "Question", name: "C'è un ristorante sul posto?", acceptedAnswer: { "@type": "Answer", text: "Sì, il ristorante propone una cucina marocchina e mediterranea preparata con prodotti locali, in una cornice desertica unica con vista sulle montagne dell'Atlante." } },
    { "@type": "Question", name: "Qual è la stagione migliore per visitare il deserto di Agafay?", acceptedAnswer: { "@type": "Answer", text: "Il deserto di Agafay è accessibile tutto l'anno. La primavera (marzo-maggio) e l'autunno (settembre-novembre) offrono temperature ideali (20-28°C)." } },
    { "@type": "Question", name: "Come si prenota a Arabian Desert Home?", acceptedAnswer: { "@type": "Answer", text: "La prenotazione avviene direttamente tramite il modulo online su arabiandeserthome.ma, o per telefono al +212 667-370-206. Una conferma viene inviata via email entro 24 ore." } },
  ],
};

export const lodgingSchemaEs = {
  ...lodgingSchemaFr,
  description: "Vivac de lujo en el desierto de Agafay, a 30 minutos de Marrakech. Seis hectáreas de puro desierto, suites-tienda exclusivas, restaurante gastronómico y actividades a medida.",
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Piscina" },
    { "@type": "LocationFeatureSpecification", name: "Suites-tienda de lujo" },
    { "@type": "LocationFeatureSpecification", name: "Restaurante gastronómico" },
    { "@type": "LocationFeatureSpecification", name: "Paseo en camello" },
    { "@type": "LocationFeatureSpecification", name: "Equitación" },
    { "@type": "LocationFeatureSpecification", name: "Day Pass" },
    { "@type": "LocationFeatureSpecification", name: "Eventos y Bodas" },
  ],
};

export const lodgingSchemaIt = {
  ...lodgingSchemaFr,
  description: "Bivacco di lusso nel deserto di Agafay, a 30 minuti da Marrakech. Sei ettari di puro deserto, tende-suite esclusive, ristorante gourmet e attività su misura.",
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Piscina" },
    { "@type": "LocationFeatureSpecification", name: "Tende-suite di lusso" },
    { "@type": "LocationFeatureSpecification", name: "Ristorante gourmet" },
    { "@type": "LocationFeatureSpecification", name: "Passeggiata in cammello" },
    { "@type": "LocationFeatureSpecification", name: "Equitazione" },
    { "@type": "LocationFeatureSpecification", name: "Day Pass" },
    { "@type": "LocationFeatureSpecification", name: "Eventi e Matrimoni" },
  ],
};
