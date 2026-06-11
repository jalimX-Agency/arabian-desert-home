import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

async function seed() {
  // ==========================================
  // ADMIN USER
  // ==========================================
  const hashedPassword = await bcrypt.hash("123456", 12);
  await db.user.upsert({
    where: { email: "arabiandesertadh@gmail.com" },
    update: {},
    create: {
      email: "arabiandesertadh@gmail.com",
      password: hashedPassword,
      name: "Admin",
      role: "admin",
    },
  });

  // ==========================================
  // SUITES
  // ==========================================
  const suites = [
    {
      name: "Suite Chorfa",
      slug: "suite-chorfa",
      tagline: "L'élégance au cœur du désert",
      description: "Suite double avec lit king-size et vue imprenable sur les montagnes de l'Atlas",
      longDescription: "La Suite Chorfa incarne le raffinement à la marocaine. Dotée d'un grand lit double, d'une salle de bain privative avec douche chaude, et d'une vue spectaculaire sur les montagnes, elle offre un havre de sérénité après une journée dans le désert. La climatisation vous garantit un confort optimal, été comme hiver. Le décor mêle savoir-faire artisanal berbère et prestations haut de gamme pour une expérience authentique et luxueuse.",
      price: 300,
      currency: "EUR",
      features: "Lit King Size,Vue Montagne,Salle de Bain Privative,Petit Déjeuner Inclus",
      amenities: "Climatisation,Conciergerie 24h,Espace Lodge,Piscine,Restaurant,Douche Chaude",
      image: "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/suites/suite-royal.png",
      images: "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/suites/suite-royal.png,/images/suite-interior.png,/images/suite-detail1.png",
      maxGuests: 2,
      bedType: "1 très grand lit double",
      size: "45m²",
      hasAC: true,
      order: 1,
      featured: true,
      type: "suite",
    },
    {
      name: "Suite Junior",
      slug: "suite-junior",
      tagline: "Intimité et confort au désert",
      description: "Suite junior avec lit double et aménagements premium pour un séjour inoubliable",
      longDescription: "La Suite Junior est un cocon de douceur au cœur du camp. Avec son grand lit double, ses touches de design marocain contemporain et sa salle de bain privative, elle est parfaite pour les couples en quête d'intimité. La climatisation assure un repos parfait, tandis que la vue sur le désert depuis votre terrasse privée transforme chaque réveil en moment magique. Le concierge est disponible 24h/24 pour sublimer votre séjour.",
      price: 300,
      currency: "EUR",
      features: "Lit Double,Salle de Bain Privative,Terrasse Privée,Petit Déjeuner Inclus",
      amenities: "Climatisation,Conciergerie 24h,Espace Lodge,Piscine,Restaurant,Douche Chaude",
      image: "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/suites/suite-sultan.png",
      images: "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/suites/suite-sultan.png,/images/suite-interior.png,/images/suite-detail2.png",
      maxGuests: 2,
      bedType: "1 très grand lit double",
      size: "40m²",
      hasAC: true,
      order: 2,
      featured: true,
      type: "suite",
    },
    {
      name: "Suite Familiale",
      slug: "suite-familiale",
      tagline: "Le désert en famille, le luxe en partage",
      description: "Suite familiale avec lit double et lit simple, idéale pour les familles",
      longDescription: "La Suite Familiale a été pensée pour ceux qui souhaitent partager l'émerveillement du désert en famille. Avec un très grand lit double et un lit simple, elle accueille jusqu'à 4 personnes dans un confort absolu. La climatisation, la salle de bain privative et la vue imprenable sur les montagnes en font un véritable cocon. Les enfants de moins de 6 ans séjournent gratuitement, et une réduction de 50% est appliquée pour les moins de 10 ans.",
      price: 300,
      currency: "EUR",
      features: "Lit Double + Lit Simple,Vue Montagne,Salle de Bain Privative,Petit Déjeuner Inclus",
      amenities: "Climatisation,Conciergerie 24h,Espace Lodge,Piscine,Restaurant,Douche Chaude",
      image: "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/suites/suite-oasis.png",
      images: "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/suites/suite-oasis.png,/images/suite-detail1.png,/images/suite-detail2.png",
      maxGuests: 4,
      bedType: "1 très grand lit double + 1 lit simple",
      size: "55m²",
      hasAC: true,
      order: 3,
      featured: true,
      type: "suite",
    },
    {
      name: "Chambre Chorfa Double",
      slug: "chambre-chorfa",
      tagline: "Charme et authenticité",
      description: "Chambre double en pension complète avec vue sur la montagne",
      longDescription: "La Chambre Chorfa Double offre une expérience authentique du désert dans un confort raffiné. Avec son grand lit double et sa vue imprenable sur la montagne, cette chambre est le point de départ idéal pour votre aventure désertique. Le petit-déjeuner est inclus, et la salle de bain privative avec douche chaude vous garantit un séjour agréable. Lit supplémentaire disponible pour 35€.",
      price: 2400,
      currency: "MAD",
      features: "Lit Double,Vue Montagne,Salle de Bain Privative,Petit Déjeuner Inclus",
      amenities: "Douche Chaude,Restaurant,Piscine,Parking",
      image: "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/suites/suite-royal.png",
      images: "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/suites/suite-royal.png,/images/about.png",
      maxGuests: 2,
      bedType: "1 très grand lit double",
      size: "30m²",
      hasAC: false,
      order: 4,
      featured: false,
      type: "chambre",
    },
    {
      name: "Chambre Triple",
      slug: "chambre-triple",
      tagline: "Espace et convivialité",
      description: "Chambre triple en pension complète, parfaite pour les petits groupes",
      longDescription: "La Chambre Triple est conçue pour les petits groupes ou les familles souhaitant séjourner ensemble. Avec ses trois lits confortables et sa vue sur la montagne, elle offre un espace convivial au cœur du désert. Le petit-déjeuner est inclus, et la salle de bain privative avec douche chaude complète cette offre de qualité. Lit supplémentaire disponible pour 35€.",
      price: 3200,
      currency: "MAD",
      features: "3 Lits,Vue Montagne,Salle de Bain Privative,Petit Déjeuner Inclus",
      amenities: "Douche Chaude,Restaurant,Piscine,Parking",
      image: "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/suites/suite-sultan.png",
      images: "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/suites/suite-sultan.png,/images/about.png",
      maxGuests: 3,
      bedType: "3 lits",
      size: "35m²",
      hasAC: false,
      order: 5,
      featured: false,
      type: "chambre",
    },
    {
      name: "Chambre Familiale Quadruple",
      slug: "chambre-familiale",
      tagline: "Le désert en tribu",
      description: "Chambre familiale quadruple en pension complète pour des vacances inoubliables",
      longDescription: "La Chambre Familiale Quadruple est la solution idéale pour les familles souhaitant vivre l'expérience du désert ensemble. Avec ses quatre lits confortables et sa vue imprenable sur la montagne, elle accueille toute la famille dans un cadre enchanteur. Le petit-déjeuner est inclus, et la salle de bain privative avec douche chaude assure un confort optimal. Les enfants de moins de 6 ans séjournent gratuitement.",
      price: 3800,
      currency: "MAD",
      features: "4 Lits,Vue Montagne,Salle de Bain Privative,Petit Déjeuner Inclus",
      amenities: "Douche Chaude,Restaurant,Piscine,Parking",
      image: "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/suites/suite-oasis.png",
      images: "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/suites/suite-oasis.png,/images/about.png",
      maxGuests: 4,
      bedType: "4 lits",
      size: "45m²",
      hasAC: false,
      order: 6,
      featured: false,
      type: "chambre",
    },
  ];

  for (const suite of suites) {
    await db.suite.create({ data: suite });
  }

  // ==========================================
  // ACTIVITIES
  // ==========================================
  const activities = [
    {
      name: "Sunset Experience – Dîner & Spectacle sous les Étoiles",
      slug: "sunset-experience",
      description: "Vivez un coucher de soleil magique suivi d'un dîner et spectacle sous les étoiles",
      longDescription: "L'expérience la plus envoûtante du désert. Commencez par une balade à cheval ou dromadaire de 20 minutes au coucher du soleil, puis savourez un dîner 3 plats au restaurant du camp. La soirée se poursuit autour du feu de camp avec musique live et l'ambiance unique du désert. Transport aller-retour depuis Marrakech inclus dans le prix.",
      duration: "6 heures",
      price: 700,
      currency: "MAD",
      image: "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/activities/activity-camel.png",
      category: "Expérience",
      includes: "Balade cheval/dromadaire 20min,Dîner 3 plats,Feu de camp & musique live,Transport A/R Marrakech",
      schedule: "Départ 17h00 de Marrakech, Retour ~23h00",
      transportIncluded: true,
      order: 1,
      featured: true,
    },
    {
      name: "Journée Authentique – Cours de Cuisine & Détente",
      slug: "journee-authentique",
      description: "Apprenez l'art de la cuisine marocaine et détendez-vous au cœur du désert",
      longDescription: "Une journée immersive dans la culture marocaine. Le matin, participez à un cours de cuisine traditionnelle où vous apprendrez à préparer un tajine, une salade marocaine et un couscous. Déjeunez avec les plats que vous avez préparés, puis profitez de l'accès à la piscine avec vue sur le désert. Thé à la menthe et détente sur la terrasse panoramique l'après-midi. Option balade à cheval ou dromadaire disponible.",
      duration: "6 heures",
      price: 550,
      currency: "MAD",
      image: "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/activities/activity-cooking.png",
      category: "Expérience",
      includes: "Cours de cuisine marocaine,Déjeuner inclus,Accès piscine,Thé & détente,Transport A/R Marrakech",
      schedule: "Départ 10h00, Retour 16h00",
      transportIncluded: true,
      order: 2,
      featured: true,
    },
    {
      name: "Aventure Agafay – Quads, Balade & Déjeuner",
      slug: "aventure-agafay",
      description: "Sensations fortes et traditions au programme de cette journée d'aventure",
      longDescription: "Pour les amateurs de sensations fortes, cette aventure combine 1 heure de quad à travers les dunes d'Agafay, une balade à cheval ou dromadaire de 30 minutes, et un déjeuner traditionnel au camp. L'après-midi est dédié à la détente avec accès à la piscine et vue panoramique sur le désert. Une journée complète d'émotions et de découverte.",
      duration: "7 heures",
      price: 850,
      currency: "MAD",
      image: "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/activities/activity-quad.png",
      category: "Aventure",
      includes: "1h de quad,Balade cheval/dromadaire 30min,Déjeuner traditionnel,Accès piscine,Transport A/R Marrakech",
      schedule: "Départ 09h30, Retour ~16h30",
      transportIncluded: true,
      order: 3,
      featured: true,
    },
    {
      name: "Randonnée Équestre",
      slug: "randonnee-equestre",
      description: "Explorez le désert à dos de cheval, une expérience intime avec la nature",
      longDescription: "Nos chevaux arabes vous invitent à découvrir le désert d'Agafay à leur rythme. Encadrés par des cavaliers expérimentés, vous traverserez des paysages lunaires, des oueds asséchés et des plateaux rocheux avec vue sur les montagnes de l'Atlas. Une expérience intime et authentique qui vous connecte à l'âme du désert.",
      duration: "45 min",
      price: 200,
      currency: "MAD",
      image: "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/activities/activity-horse.png",
      category: "Activité",
      includes: "Encadrement professionnel,Équipement fourni",
      schedule: "Sur réservation",
      transportIncluded: false,
      order: 4,
      featured: false,
    },
    {
      name: "Raid Quad",
      slug: "raid-quad",
      description: "Pilotez votre quad à travers les dunes pour une aventure inoubliable",
      longDescription: "Prenez les commandes de votre quad et partez à la conquête des dunes d'Agafay. Un parcours palpitant à travers le désert rocheux, avec des vues spectaculaires sur les montagnes. Les guides expérimentés vous mèneront à travers les meilleurs chemins pour une aventure en toute sécurité.",
      duration: "1 heure",
      price: 400,
      currency: "MAD",
      image: "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/activities/activity-quad.png",
      category: "Activité",
      includes: "Quad et équipement,Guide professionnel,Initiation conduite",
      schedule: "Sur réservation",
      transportIncluded: false,
      order: 5,
      featured: false,
    },
    {
      name: "Promenade en Dromadaire",
      slug: "promenade-dromadaire",
      description: "Vivez l'expérience traditionnelle du désert à bord du vaisseau du désert",
      longDescription: "Embarquez pour une promenade paisible à dos de dromadaire, le mode de transport ancestral du désert. Cette balade de 30 minutes vous permettra de contempler le paysage à un rythme contemplatif, bercé par le pas régulier de l'animal. Un moment de sérénité et de connexion avec les traditions nomades.",
      duration: "30 min",
      price: 150,
      currency: "MAD",
      image: "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/activities/activity-camel.png",
      category: "Activité",
      includes: "Guide,Équipement",
      schedule: "Sur réservation",
      transportIncluded: false,
      order: 6,
      featured: false,
    },
  ];

  for (const activity of activities) {
    await db.activity.create({ data: activity });
  }

  // ==========================================
  // DAY PASSES
  // ==========================================
  const dayPasses = [
    {
      name: "Day Pass Piscine & Déjeuner",
      slug: "daypass-piscine-dejeuner",
      description: "Accès piscine avec vue désert et déjeuner traditionnel inclus",
      price: 350,
      currency: "MAD",
      includes: "Accès piscine,Déjeuner traditionnel,Serviettes fournies",
      order: 1,
    },
    {
      name: "Day Pass Piscine & Dîner avec Animation",
      slug: "daypass-piscine-diner",
      description: "Journée piscine suivie d'un dîner avec spectacle et animation en soirée",
      price: 500,
      currency: "MAD",
      includes: "Accès piscine,Dîner avec animation,Spectacle,Serviettes fournies",
      order: 2,
    },
    {
      name: "Pass Journée Complète",
      slug: "daypass-complet",
      description: "Une journée complète avec déjeuner, dîner et animation — l'expérience intégrale",
      price: 750,
      currency: "MAD",
      includes: "Accès piscine,Déjeuner,Dîner avec animation,Spectacle,Serviettes fournies",
      order: 3,
    },
  ];

  for (const pass of dayPasses) {
    await db.dayPass.create({ data: pass });
  }

  // ==========================================
  // DINING VENUES
  // ==========================================
  const venues = [
    {
      name: "Le Dar Agafay",
      slug: "le-dar-agafay",
      description: "Restaurant principal du camp — cuisine raffinée et produits frais locaux",
      longDescription: "Le Dar Agafay est le cœur gastronomique du camp. Avec 80 couverts en intérieur et deux pergolas extérieures pour dîner sous les étoiles, le chef propose une cuisine raffinée élaborée à partir de produits frais et locaux. Le soir, des spectacles de danse orientale et des jeux de lumières projetés sur les dunes transforment chaque dîner en expérience inoubliable. Tarif adulte : 200-250 DH selon le menu.",
      image: "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/dining/restaurant-interior.png",
      capacity: "80 couverts + 2 pergolas",
      order: 1,
    },
    {
      name: "Le Desert Rose Bar",
      slug: "le-desert-rose-bar",
      description: "Bar lounge avec vue panoramique sur le désert — cocktails et ambiance cosy",
      longDescription: "Le Desert Rose Bar est l'endroit idéal pour siroter un cocktail tout en admirant le coucher du soleil sur le désert. L'ambiance cosy et raffinée, entre tradition marocaine et design contemporain, en fait le lieu de rendez-vous des convives en fin de journée. La carte propose une sélection de cocktails signature, de vins marocains et de boissons rafraîchissantes.",
      image: "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/dining/bar-desert-rose.png",
      capacity: "30 places",
      order: 2,
    },
    {
      name: "El Kheyma",
      slug: "el-kheyma",
      description: "Tente traditionnelle pour des repas authentiques au cœur du désert",
      longDescription: "El Kheyma offre une expérience culinaire authentique dans une tente traditionnelle berbère. Assis sur des coussins au sol, autour de plateaux en laiton, vous dégusterez des tagines, méchouis, couscous et grillades préparés selon la tradition. Pour les journées d'activités, des savoureux déjeuners à la tradition de la région sont proposés dans un cadre intimiste et dépaysant.",
      image: "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/dining/el-kheyma.png",
      capacity: "20 couverts",
      order: 3,
    },
  ];

  for (const venue of venues) {
    await db.diningVenue.create({ data: venue });
  }

  // ==========================================
  // SPA TREATMENTS
  // ==========================================
  const treatments = [
    {
      name: "Hammam Traditionnel",
      slug: "hammam-traditionnel",
      description: "Rituel ancestral de purification au savon noir et argile rhassoul",
      duration: "45 min",
      price: 400,
      currency: "MAD",
      image: "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/spa/spa-treatment.png",
      order: 1,
    },
    {
      name: "Massage aux Huiles d'Argan",
      slug: "massage-argan",
      description: "Massage relaxant aux huiles d'argan bio — un voyage sensoriel",
      duration: "60 min",
      price: 500,
      currency: "MAD",
      image: "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/spa/spa-treatment.png",
      order: 2,
    },
    {
      name: "Soin Visage à l'Eau de Rose",
      slug: "soin-visage-rose",
      description: "Soin hydratant et éclat à l'eau de rose de Kelaat M'gouna",
      duration: "30 min",
      price: 300,
      currency: "MAD",
      image: "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/spa/spa-treatment.png",
      order: 3,
    },
    {
      name: "Rituel Complet Désert",
      slug: "rituel-complet",
      description: "Hammam + massage + soin visage — l'expérience spa intégrale",
      duration: "2h",
      price: 900,
      currency: "MAD",
      image: "https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/spa/exp-spa.png",
      order: 4,
    },
  ];

  for (const treatment of treatments) {
    await db.spaTreatment.create({ data: treatment });
  }

  // ==========================================
  // TESTIMONIALS
  // ==========================================
  const testimonials = [
    {
      quote: "Nous avons passé un séjour incroyable dans ce lieu magique. Les paysages du désert sont époustouflants et le personnel était aux petits soins. Une expérience inoubliable que nous recommandons vivement !",
      author: "ZeKo",
      location: "Maroc",
      rating: 5,
      source: "general",
      order: 1,
    },
    {
      quote: "Un véritable havre de paix ! L'atmosphère est incroyablement calme et chaleureuse. L'accueil très attentionné et les paysages magnifiques en font un endroit unique pour se ressourcer.",
      author: "Ouiame",
      location: "Maroc",
      rating: 5,
      source: "general",
      order: 2,
    },
    {
      quote: "L'hospitalité locale est chaleureuse et authentique. Les excursions à dos de dromadaire sont des moments inoubliables. Ce séjour nous a permis de nous reconnecter avec la nature dans un cadre exceptionnel.",
      author: "Basma",
      location: "Maroc",
      rating: 5,
      source: "general",
      order: 3,
    },
    {
      quote: "Une expérience relaxante et revigorante au spa. Un vrai moment de détente !",
      author: "Claire M.",
      location: "Paris, France",
      rating: 5,
      source: "spa",
      order: 4,
    },
    {
      quote: "Des soins exceptionnels et un service chaleureux. Je recommande vivement cet endroit !",
      author: "Youssef K.",
      location: "Marrakech, Maroc",
      rating: 5,
      source: "spa",
      order: 5,
    },
  ];

  for (const t of testimonials) {
    await db.testimonial.create({ data: t });
  }

  console.log("✅ Seed complete: admin user + 6 suites + 6 activities + 3 day passes + 3 dining venues + 4 spa treatments + 5 testimonials");
}

seed()
  .catch(console.error)
  .finally(() => process.exit());
