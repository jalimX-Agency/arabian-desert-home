import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const data = [
  {
    slug: "le-dar-agafay",
    nameEn: "Le Dar Agafay",
    descriptionEn: "The camp's main restaurant — refined cuisine with fresh local produce",
    longDescriptionEn:
      "Le Dar Agafay is the gastronomic heart of the camp. With 80 indoor covers and two outdoor pergolas for dining under the stars, the chef offers refined cuisine crafted from fresh, local produce. In the evening, oriental dance performances and light shows projected onto the dunes turn every dinner into an unforgettable experience. Adult rate: 200-250 DH depending on the menu.",
    nameEs: "Le Dar Agafay",
    descriptionEs: "Restaurante principal del campamento — cocina refinada con productos frescos y locales",
    longDescriptionEs:
      "Le Dar Agafay es el corazón gastronómico del campamento. Con 80 cubiertos en interior y dos pérgolas exteriores para cenar bajo las estrellas, el chef propone una cocina refinada elaborada con productos frescos y locales. Por la noche, espectáculos de danza oriental y juegos de luces proyectados sobre las dunas convierten cada cena en una experiencia inolvidable. Tarifa adulto: 200-250 DH según el menú.",
    nameIt: "Le Dar Agafay",
    descriptionIt: "Ristorante principale del campo — cucina raffinata con prodotti freschi e locali",
    longDescriptionIt:
      "Le Dar Agafay è il cuore gastronomico del campo. Con 80 coperti al chiuso e due pergolati esterni per cenare sotto le stelle, lo chef propone una cucina raffinata elaborata con prodotti freschi e locali. La sera, spettacoli di danza orientale e giochi di luce proiettati sulle dune trasformano ogni cena in un'esperienza indimenticabile. Tariffa adulto: 200-250 DH a seconda del menu.",
  },
  {
    slug: "le-desert-rose-bar",
    nameEn: "Le Desert Rose Bar",
    descriptionEn: "Lounge bar with panoramic desert views — cocktails and a cozy atmosphere",
    longDescriptionEn:
      "Le Desert Rose Bar is the perfect spot to sip a cocktail while watching the sunset over the desert. Its cozy, refined atmosphere, blending Moroccan tradition with contemporary design, makes it the go-to gathering place at the end of the day. The menu features a selection of signature cocktails, Moroccan wines and refreshing drinks.",
    nameEs: "Le Desert Rose Bar",
    descriptionEs: "Bar lounge con vistas panorámicas al desierto — cócteles y ambiente acogedor",
    longDescriptionEs:
      "Le Desert Rose Bar es el lugar ideal para disfrutar de un cóctel mientras se admira la puesta de sol sobre el desierto. Su ambiente acogedor y refinado, entre la tradición marroquí y el diseño contemporáneo, lo convierte en el punto de encuentro al final del día. La carta ofrece una selección de cócteles de autor, vinos marroquíes y bebidas refrescantes.",
    nameIt: "Le Desert Rose Bar",
    descriptionIt: "Bar lounge con vista panoramica sul deserto — cocktail e atmosfera accogliente",
    longDescriptionIt:
      "Le Desert Rose Bar è il luogo ideale per sorseggiare un cocktail ammirando il tramonto sul deserto. La sua atmosfera accogliente e raffinata, tra tradizione marocchina e design contemporaneo, lo rende il punto d'incontro a fine giornata. Il menu propone una selezione di cocktail signature, vini marocchini e bevande rinfrescanti.",
  },
  {
    slug: "el-kheyma",
    nameEn: "El Kheyma",
    descriptionEn: "Traditional tent for authentic meals in the heart of the desert",
    longDescriptionEn:
      "El Kheyma offers an authentic culinary experience inside a traditional Berber tent. Seated on floor cushions around brass trays, you'll savor tagines, méchoui, couscous and grills prepared the traditional way. On activity days, hearty lunches rooted in the region's traditions are served in an intimate, transporting setting.",
    nameEs: "El Kheyma",
    descriptionEs: "Tienda tradicional para comidas auténticas en pleno corazón del desierto",
    longDescriptionEs:
      "El Kheyma ofrece una experiencia culinaria auténtica en una tienda tradicional bereber. Sentados en cojines en el suelo, alrededor de bandejas de latón, degustará tajines, méchoui, cuscús y parrilladas preparados según la tradición. En los días de actividades, se sirven sabrosos almuerzos siguiendo la tradición de la región en un entorno íntimo y evocador.",
    nameIt: "El Kheyma",
    descriptionIt: "Tenda tradizionale per pasti autentici nel cuore del deserto",
    longDescriptionIt:
      "El Kheyma offre un'esperienza culinaria autentica in una tenda tradizionale berbera. Seduti su cuscini a terra, attorno a vassoi di ottone, gusterete tajine, méchoui, couscous e grigliate preparati secondo la tradizione. Nei giorni di attività, vengono serviti gustosi pranzi legati alla tradizione della regione in un'atmosfera intima e suggestiva.",
  },
];

async function main() {
  for (const { slug, ...fields } of data) {
    await db.diningVenue.update({ where: { slug }, data: fields });
    console.log("dining venue:", slug);
  }
  console.log(`\nDone: ${data.length} dining venues translated.`);
}

main().catch(console.error).finally(() => db.$disconnect());
