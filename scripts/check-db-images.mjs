import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
const suites = await db.suite.findMany({ select: { id: true, name: true, image: true, images: true } });
const activities = await db.activity.findMany({ select: { id: true, name: true, image: true } });
const dining = await db.diningVenue.findMany({ select: { id: true, name: true, image: true } });
console.log("SUITES:", JSON.stringify(suites, null, 2));
console.log("ACTIVITIES:", JSON.stringify(activities, null, 2));
console.log("DINING:", JSON.stringify(dining, null, 2));
await db.$disconnect();
