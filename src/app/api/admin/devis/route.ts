import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { DEVIS_INCLUDE, defaultValidUntil, nextDevisReference, priceDevisItems, type DevisItemInput } from "@/lib/devis";

export async function GET() {
  const deny = await requireAdmin();
  if (deny) return deny;
  const devis = await db.devis.findMany({ orderBy: { createdAt: "desc" }, include: DEVIS_INCLUDE });
  return NextResponse.json(devis);
}

export async function POST(req: NextRequest) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const body = await req.json();
  const {
    firstName, lastName, email, phone, company, channel, title, notes, conditions,
    lang, currency, validUntil, items,
  } = body as {
    firstName?: string; lastName?: string; email?: string; phone?: string;
    company?: string; channel?: string; title?: string; notes?: string; conditions?: string;
    lang?: string; currency?: string; validUntil?: string; items?: DevisItemInput[];
  };

  if (!firstName || !lastName || !email || !phone) {
    return NextResponse.json({ error: "Nom, email et téléphone sont obligatoires" }, { status: 400 });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Au moins une ligne est requise" }, { status: 400 });
  }

  const devisCurrency = currency ?? "EUR";
  let priced;
  try {
    priced = await priceDevisItems(items, devisCurrency);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Ligne invalide" }, { status: 400 });
  }

  const devis = await db.devis.create({
    data: {
      reference: await nextDevisReference(),
      firstName, lastName, email, phone,
      company: company || null,
      channel: channel || "email",
      title: title || null,
      notes: notes || null,
      conditions: conditions || null,
      lang: lang || "fr",
      currency: devisCurrency,
      validUntil: validUntil ? new Date(validUntil) : defaultValidUntil(),
      totalAmount: priced.totalAmount,
      items: { create: priced.items },
    },
    include: DEVIS_INCLUDE,
  });

  return NextResponse.json({ success: true, devis }, { status: 201 });
}
