import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { join } from "path";

for (const line of readFileSync(join(process.cwd(), ".env"), "utf8").split("\n")) {
  const m = line.match(/^([^#=\s][^=]*)=(.*)$/);
  if (m) process.env[m[1].trim()] = m[2].trim();
}

const db = new PrismaClient();

// ── SUITES ───────────────────────────────────────────────────────────────────
await db.suite.update({
  where: { slug: "tente-junior" },
  data: {
    nameEn: "Junior Tent",
    taglineEn: "Comfort and intimacy in the desert",
    descriptionEn: "An elegant tent for an intimate stay at the heart of the Agafay desert, with every comfort you need.",
    longDescriptionEn: "The Junior Tent offers a warm space with authentic Moroccan décor, premium bedding, and breathtaking views over the desert landscapes. Perfect for couples seeking a romantic desert escape.",
    featuresEn: "Double Bed,Private Bathroom,Desert View,Private Terrace",
    amenitiesEn: "Air Conditioning,Breakfast Included,WiFi,Concierge 24h,Pool Access,Warm Shower",
  },
});
console.log("✓ Suite: Junior Tent");

await db.suite.update({
  where: { slug: "tente-familiale" },
  data: {
    nameEn: "Family Tent",
    taglineEn: "Family adventure in the desert",
    descriptionEn: "Ideal for families, this spacious tent welcomes up to 4 guests with all the comforts they desire.",
    longDescriptionEn: "The Family Tent features two separate sleeping areas, perfect for sharing the desert experience as a family while enjoying complete privacy. A large terrace opens onto the magical Agafay landscape.",
    featuresEn: "2 Sleeping Areas,Private Bathroom,Large Terrace,Mountain View",
    amenitiesEn: "Air Conditioning,Breakfast Included,WiFi,Pool Access,Concierge 24h,Warm Shower",
  },
});
console.log("✓ Suite: Family Tent");

await db.suite.update({
  where: { slug: "suite" },
  data: {
    nameEn: "Suite",
    taglineEn: "The ultimate luxury desert experience",
    descriptionEn: "Our signature suite — the pinnacle of luxury in the Agafay desert. Designed for discerning travellers who demand the very best.",
    longDescriptionEn: "The Suite is our most prestigious accommodation, featuring a king-size bed, a private lounge area, an outdoor terrace with panoramic views of the Atlas Mountains, and an en-suite bathroom with artisan tiles and rain shower. Every detail has been thoughtfully curated for an unforgettable stay.",
    featuresEn: "King-Size Bed,Private Lounge,Atlas Mountain View,Rain Shower,Outdoor Terrace",
    amenitiesEn: "Air Conditioning,Full Board,WiFi,Butler Service,Spa Access,Pool Access,Concierge 24h",
  },
});
console.log("✓ Suite: Suite");

// ── ACTIVITIES ────────────────────────────────────────────────────────────────
await db.activity.update({
  where: { slug: "sunset-experience" },
  data: {
    nameEn: "Sunset Experience – Dinner & Show under the Stars",
    descriptionEn: "Watch the sun set over the Agafay dunes, followed by a gourmet dinner under the stars.",
    longDescriptionEn: "A magical evening that begins with a camel ride at dusk, then continues around a campfire with live Gnawa music, traditional Moroccan cuisine, and a sky full of stars.",
    includesEn: "Transfer from Marrakech,Camel ride,Campfire,Traditional dinner,Live Gnawa music",
  },
});
console.log("✓ Activity: Sunset Experience");

await db.activity.update({
  where: { slug: "journee-authentique" },
  data: {
    nameEn: "Authentic Day – Cooking Class & Relaxation",
    descriptionEn: "A full day of authentic immersion in desert life — activities, gastronomy, and relaxation.",
    longDescriptionEn: "Enjoy a Moroccan cooking class with our chef, a gourmet lunch, pool time, and a sunset camel ride. The perfect day to connect with the soul of the Agafay desert.",
    includesEn: "Transfer from Marrakech,Cooking class,Gourmet lunch,Pool access,Camel ride",
  },
});
console.log("✓ Activity: Authentic Day");

await db.activity.update({
  where: { slug: "aventure-agafay" },
  data: {
    nameEn: "Agafay Adventure – Quads, Ride & Lunch",
    descriptionEn: "The ultimate adventure package: quad biking, horse riding, camel ride, and a starlit night in a luxury tent.",
    longDescriptionEn: "Experience everything the desert has to offer in one epic package. Quad biking in the morning, gourmet lunch, horse riding, camel ride, starlit dinner, and an overnight stay in a luxury tent.",
    includesEn: "Transfer from Marrakech,Quad biking,Horse riding,Camel ride,Dinner & breakfast,Overnight in tent",
  },
});
console.log("✓ Activity: Agafay Adventure");

await db.activity.update({
  where: { slug: "randonnee-equestre" },
  data: {
    nameEn: "Horse Riding Trek",
    descriptionEn: "Explore the lunar landscapes of the Agafay desert on horseback, guided by our experienced riders.",
    longDescriptionEn: "A horseback ride through stones and dunes with views over the snow-capped Atlas mountains. A truly unique perspective on one of Morocco's most stunning landscapes.",
    includesEn: "Experienced guide,Safety equipment,Insurance",
  },
});
console.log("✓ Activity: Horse Riding Trek");

await db.activity.update({
  where: { slug: "raid-quad" },
  data: {
    nameEn: "Quad Raid",
    descriptionEn: "Experience pure adrenaline on the Agafay desert tracks on a quad bike, led by our certified instructors.",
    longDescriptionEn: "Rocky ascents, dry riverbeds, and valley floors — set off on an adventure on varied tracks across the Agafay desert. Suitable for beginners and experienced riders alike.",
    includesEn: "Certified instructor,Quad bike,Helmet & protection gear,Insurance",
  },
});
console.log("✓ Activity: Quad Raid");

await db.activity.update({
  where: { slug: "promenade-dromadaire" },
  data: {
    nameEn: "Camel Ride",
    descriptionEn: "Sway gently through the Agafay desert on a camel, discovering the landscape at the pace of the ancient caravans.",
    longDescriptionEn: "Let yourself be carried by the gentle rhythm of the camel as you traverse the golden Agafay plains. An iconic desert experience not to be missed.",
    includesEn: "Trained camel,Experienced guide",
  },
});
console.log("✓ Activity: Camel Ride");

// ── DAY PASSES ────────────────────────────────────────────────────────────────
await db.dayPass.update({
  where: { slug: "daypass-piscine-dejeuner" },
  data: {
    nameEn: "Pool & Lunch Day Pass",
    descriptionEn: "Enjoy a sun-soaked day by the pool with a gourmet Moroccan lunch included.",
    includesEn: "Full day pool access,Pool towels,Gourmet lunch,Welcome mint tea",
  },
});
console.log("✓ Day Pass: Pool & Lunch");

await db.dayPass.update({
  where: { slug: "daypass-piscine-diner" },
  data: {
    nameEn: "Pool & Dinner with Entertainment",
    descriptionEn: "An unforgettable evening with pool access, dinner under the stars, and live Gnawa music.",
    includesEn: "Pool access,Starlit dinner,Gnawa music performance,Campfire,Mint tea",
  },
});
console.log("✓ Day Pass: Pool & Dinner");

await db.dayPass.update({
  where: { slug: "daypass-complet" },
  data: {
    nameEn: "Full Day Pass",
    descriptionEn: "The ultimate day pass experience: pool, lunch, an activity of your choice, and dinner with entertainment.",
    includesEn: "Pool access,Gourmet lunch,1 activity of your choice,Starlit dinner,Live music",
  },
});
console.log("✓ Day Pass: Full Day Pass");

await db.$disconnect();
console.log("\n✅ All English content seeded!");
