import { db } from "@/lib/db";

async function seed() {
  // Seed Suites
  const suites = [
    {
      name: "The Royal Tent",
      slug: "royal-tent",
      description: "Where desert grandeur meets intimate luxury",
      longDescription:
        "Step into a realm of understated opulence. The Royal Tent redefines desert living with its expansive interior, hand-carved cedar furnishings, and a private terrace that stretches toward the horizon. Each sunset becomes a private performance, viewed from the comfort of your king-sized sanctuary adorned with the finest Berber textiles.",
      price: 1200,
      features: "King Bed,Private Terrace,Berber Textiles,Butler Service,Mini Bar,AC & Heating",
      image: "/images/suite-royal.png",
      maxGuests: 2,
      size: "65m²",
      order: 1,
      featured: true,
    },
    {
      name: "The Sultan Suite",
      slug: "sultan-suite",
      description: "An oasis of palatial sophistication",
      longDescription:
        "The Sultan Suite is our most opulent offering—a private kingdom within the desert. Featuring a private plunge pool, hand-hammered copper bath, and an entrance hall adorned with zellige tilework, this suite embodies the spirit of Moroccan royalty. The separate living area and panoramic desert views create an experience beyond comparison.",
      price: 2200,
      features: "King Bed,Private Plunge Pool,Copper Bath,Zellige Entrance,Separate Living,Butler Service",
      image: "/images/suite-sultan.png",
      maxGuests: 3,
      size: "95m²",
      order: 2,
      featured: true,
    },
    {
      name: "The Oasis Pavilion",
      slug: "oasis-pavilion",
      description: "Where the desert meets the sky",
      longDescription:
        "An architectural poem of light and space. The Oasis Pavilion features retractable walls that dissolve the boundary between interior and landscape. By day, the desert is your living room; by night, the cosmos your ceiling. Complete with an outdoor soaking tub and a daybed suspended between earth and sky.",
      price: 1800,
      features: "King Bed,Retractable Walls,Outdoor Tub,Daybed,Panoramic View,Star Ceiling",
      image: "/images/suite-oasis.png",
      maxGuests: 2,
      size: "80m²",
      order: 3,
      featured: true,
    },
  ];

  for (const suite of suites) {
    await db.suite.upsert({
      where: { slug: suite.slug },
      update: suite,
      create: suite,
    });
  }

  // Seed Experiences
  const experiences = [
    {
      name: "Golden Hour Camel Trek",
      slug: "camel-trek",
      description: "Journey through time aboard the ship of the desert",
      longDescription:
        "As the sun paints the Agafay in shades of amber and rose, embark on a timeless journey aboard our gentle camels. Led by nomadic guides whose families have traversed these paths for generations, this is not merely a ride—it is a passage into the soul of the Sahara. The trek culminates at a private ridge where champagne and canapés await the sunset.",
      duration: "3 hours",
      price: 250,
      image: "/images/exp-camel.png",
      category: "Adventure",
      order: 1,
      featured: true,
    },
    {
      name: "Desert Hammam Ritual",
      slug: "desert-hammam",
      description: "Ancient wellness reborn in sacred stillness",
      longDescription:
        "Surrender to a centuries-old ritual beneath the open sky. Our desert hammam uses black soap from Marrakech, rhassoul clay from the Atlas Mountains, and rose water from Kelaat M'gouna. Each treatment is a meditation—a return to elemental simplicity. The experience concludes with mint tea and silence, the most precious luxury of all.",
      duration: "2.5 hours",
      price: 350,
      image: "/images/exp-spa.png",
      category: "Wellness",
      order: 2,
      featured: true,
    },
    {
      name: "Dawn Balloon Voyage",
      slug: "balloon-voyage",
      description: "Rise above the earth as the desert awakens",
      longDescription:
        "Before the world stirs, ascend into the crystalline morning air. Our private balloon carries you over the lunar landscape of Agafay, the terracotta walls of distant kasbahs, and the snow-capped Atlas Mountains piercing the horizon. Upon landing, a berber breakfast awaits in a tent that appears like a mirage in the vastness.",
      duration: "4 hours",
      price: 550,
      image: "/images/exp-balloon.png",
      category: "Adventure",
      order: 3,
      featured: true,
    },
  ];

  for (const exp of experiences) {
    await db.experience.upsert({
      where: { slug: exp.slug },
      update: exp,
      create: exp,
    });
  }

  console.log("✅ Seed complete: 3 suites + 3 experiences");
}

seed()
  .catch(console.error)
  .finally(() => process.exit());
