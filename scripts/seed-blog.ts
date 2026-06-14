import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  await db.blogPost.upsert({
    where: { slug: "5-raisons-visiter-desert-agafay-marrakech" },
    update: {},
    create: {
      title: "5 raisons de visiter le désert d'Agafay depuis Marrakech",
      slug: "5-raisons-visiter-desert-agafay-marrakech",
      category: "Désert & Nature",
      author: "Arabian Desert Home",
      featured: true,
      order: 1,
      excerpt:
        "À seulement 30 km de Marrakech, le désert d'Agafay vous offre une escapade hors du temps. Paysages lunaires, silence absolu et ciel étoilé : voici 5 raisons de fuir la ville pour une nuit dans le désert.",
      content: `<p>À seulement 30 kilomètres de Marrakech, le <strong>désert d'Agafay</strong> est l'un des secrets les mieux gardés du Maroc. Contrairement au Sahara, ce désert de pierres et d'argile offre une accessibilité exceptionnelle sans sacrifier la magie du grand espace. Voici cinq raisons de planifier votre escapade dès aujourd'hui.</p>

<h2>1. Un paysage lunaire à couper le souffle</h2>
<p>Le désert d'Agafay n'est pas un désert de sable comme on l'imagine souvent. C'est un vaste plateau minéral aux teintes ocre et dorées, ponctué de collines arrondies et de vallées silencieuses. La lumière du coucher de soleil y peint des nuances impossibles — de l'ambre au bordeaux — que même les meilleures photographies peinent à restituer. Ce paysage unique, souvent comparé à la surface de la Lune, est le décor idéal pour une déconnexion totale.</p>

<h2>2. À 30 minutes seulement de la médina</h2>
<p>L'un des atouts majeurs d'Agafay est sa proximité avec <strong>Marrakech</strong>. En à peine 30 minutes de route depuis la Place Jemaa el-Fna, vous basculez dans un autre monde. Pas besoin de prendre l'avion ni de traverser le pays : une simple soirée ou un week-end suffit pour vivre une expérience authentique du désert. C'est l'échappée belle idéale pour les voyageurs en escale ou les résidents de Marrakech en quête de dépaysement.</p>

<h2>3. Un ciel étoilé d'une pureté rare</h2>
<p>Loin de la pollution lumineuse de la ville, le désert d'Agafay dévoile l'un des ciels les plus purs d'Afrique du Nord. Allongé sur une dune ou assis autour d'un feu de camp, observer la <strong>Voie Lactée</strong> à l'œil nu est une expérience qui marque à jamais. À Arabian Desert Home, nous organisons des sessions d'astronomie privées pour vous aider à identifier les constellations et comprendre les récits que les Berbères lisaient autrefois dans les étoiles.</p>

<h2>4. Des activités pour tous les goûts</h2>
<p>Le désert ne rime pas avec immobilité. À Agafay, les aventuriers peuvent s'adonner au <strong>quad</strong>, au <strong>chameau</strong>, au <strong>buggy</strong> ou au <strong>sandboard</strong>. Les plus contemplatifs préféreront une randonnée au lever du soleil, un bain dans la piscine à débordement face aux collines, ou un soin de hammam traditionnel. Pour les familles, le Day Pass d'Arabian Desert Home propose une journée complète d'activités adaptées à tous les âges, de 9h à 18h.</p>

<h2>5. Une gastronomie ancrée dans le terroir</h2>
<p>Séjourner dans le désert, c'est aussi découvrir la <strong>cuisine marocaine authentique</strong> loin des restaurants touristiques. Chez Arabian Desert Home, chaque repas est une célébration du terroir : tajine d'agneau aux pruneaux, couscous royal aux sept légumes, pastilla au pigeon et briouates au miel. Le tout préparé par nos cuisiniers avec des produits locaux, servi sous une tente berbère au son du oud. Un dîner dans le désert, à la lueur des bougies et sous les étoiles, reste l'un des souvenirs les plus forts que nos hôtes emportent avec eux.</p>

<h2>Comment réserver votre séjour à Agafay ?</h2>
<p>Arabian Desert Home propose plusieurs formules adaptées à vos envies : nuit en tente de luxe, Day Pass à la journée, ou séjour privatisé pour événements et escapades en amoureux. Situé au cœur du désert d'Agafay, à 30 km de Marrakech, notre camp vous accueille toute l'année. Contactez-nous pour vérifier les disponibilités et obtenir un devis personnalisé.</p>`,

      titleEn: "5 Reasons to Visit the Agafay Desert from Marrakech",
      excerptEn:
        "Just 30 km from Marrakech, the Agafay Desert offers a timeless escape. Lunar landscapes, absolute silence and a starlit sky: here are 5 reasons to leave the city for a night in the desert.",
      contentEn: `<p>Just 30 kilometres from Marrakech, the <strong>Agafay Desert</strong> is one of Morocco's best-kept secrets. Unlike the Sahara, this rocky mineral plateau offers exceptional accessibility without sacrificing the magic of wide open space. Here are five reasons to plan your escape today.</p>

<h2>1. A Breathtaking Lunar Landscape</h2>
<p>The Agafay Desert is not a sandy desert as often imagined. It is a vast mineral plateau in ochre and golden hues, dotted with rounded hills and silent valleys. The light at sunset paints impossible shades — from amber to burgundy — that even the best photographs struggle to capture. This unique landscape, often compared to the surface of the Moon, is the perfect backdrop for total disconnection.</p>

<h2>2. Just 30 Minutes from the Medina</h2>
<p>One of Agafay's greatest assets is its proximity to <strong>Marrakech</strong>. In barely 30 minutes from Jemaa el-Fna Square, you step into another world. No need for flights or cross-country travel: a single evening or weekend is enough to experience an authentic desert adventure. It's the ideal getaway for travellers in transit or Marrakech residents craving a change of scenery.</p>

<h2>3. A Starlit Sky of Rare Purity</h2>
<p>Far from the city's light pollution, the Agafay Desert reveals one of North Africa's clearest skies. Lying on a dune or sitting around a campfire, watching the <strong>Milky Way</strong> with the naked eye is a life-changing experience. At Arabian Desert Home, we organise private stargazing sessions to help you identify constellations and discover the stories Berber people once read in the stars.</p>

<h2>4. Activities for Every Taste</h2>
<p>The desert doesn't mean stillness. In Agafay, adventurers can enjoy <strong>quad biking</strong>, <strong>camel rides</strong>, <strong>buggies</strong> or <strong>sandboarding</strong>. The more contemplative will prefer a sunrise hike, a dip in the infinity pool overlooking the hills, or a traditional hammam treatment. For families, the Arabian Desert Home Day Pass offers a full day of activities suited to all ages, from 9am to 6pm.</p>

<h2>5. Gastronomy Rooted in Local Terroir</h2>
<p>Staying in the desert also means discovering <strong>authentic Moroccan cuisine</strong> far from tourist restaurants. At Arabian Desert Home, every meal is a celebration of local produce: lamb tagine with prunes, royal couscous with seven vegetables, pigeon pastilla and honey briouates. All prepared by our chefs using local ingredients, served under a Berber tent to the sound of the oud. A candlelit dinner in the desert under the stars is one of the strongest memories our guests take home.</p>

<h2>How to Book Your Agafay Stay?</h2>
<p>Arabian Desert Home offers several packages to suit your desires: luxury tent stay, day pass, or privatised retreat for events and romantic escapes. Located in the heart of the Agafay Desert, 30 km from Marrakech, our camp welcomes guests year-round. Contact us to check availability and get a personalised quote.</p>`,
    },
  });

  console.log("✓ Blog article inserted");
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
