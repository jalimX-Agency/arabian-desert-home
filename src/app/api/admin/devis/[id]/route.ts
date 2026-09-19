import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { DEVIS_INCLUDE, DEVIS_STATUSES, priceDevisItems, type DevisItemInput } from "@/lib/devis";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  const devis = await db.devis.findUnique({ where: { id }, include: DEVIS_INCLUDE });
  if (!devis) return NextResponse.json({ error: "Devis introuvable" }, { status: 404 });
  return NextResponse.json(devis);
}

/** Two shapes: `{ status }` alone records an answer the admin took by phone or WhatsApp;
 *  anything else is a full edit of the quote. A converted quote is frozen. */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;

  const existing = await db.devis.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Devis introuvable" }, { status: 404 });
  if (existing.status === "converted") {
    return NextResponse.json({ error: "Ce devis est déjà converti en réservation" }, { status: 409 });
  }

  const body = await req.json();
  const keys = Object.keys(body);

  if (keys.length === 1 && keys[0] === "status") {
    const { status } = body as { status: string };
    if (!DEVIS_STATUSES.includes(status as (typeof DEVIS_STATUSES)[number])) {
      return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
    }
    const answered = status === "accepted" || status === "refused";
    const devis = await db.devis.update({
      where: { id },
      data: {
        status,
        answeredAt: answered ? existing.answeredAt ?? new Date() : null,
        answeredBy: answered ? existing.answeredBy ?? "admin" : null,
      },
      include: DEVIS_INCLUDE,
    });
    return NextResponse.json(devis);
  }

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

  const devisCurrency = currency ?? existing.currency;
  let priced;
  try {
    priced = await priceDevisItems(items, devisCurrency);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Ligne invalide" }, { status: 400 });
  }

  // Extending the validity of an expired or answered quote puts it back in play.
  const reopened = existing.status === "expired" && validUntil && new Date(validUntil).getTime() > Date.now();

  await db.$transaction([
    db.devisItem.deleteMany({ where: { devisId: id } }),
    db.devis.update({
      where: { id },
      data: {
        firstName, lastName, email, phone,
        company: company || null,
        channel: channel || existing.channel,
        title: title || null,
        notes: notes || null,
        conditions: conditions || null,
        lang: lang || existing.lang,
        currency: devisCurrency,
        validUntil: validUntil ? new Date(validUntil) : existing.validUntil,
        totalAmount: priced.totalAmount,
        status: reopened ? "sent" : existing.status,
        items: { create: priced.items },
      },
    }),
  ]);

  return NextResponse.json(await db.devis.findUnique({ where: { id }, include: DEVIS_INCLUDE }));
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;

  const existing = await db.devis.findUnique({ where: { id }, select: { status: true } });
  if (!existing) return NextResponse.json({ error: "Devis introuvable" }, { status: 404 });
  if (existing.status === "converted") {
    return NextResponse.json({ error: "Impossible de supprimer un devis converti en réservation" }, { status: 409 });
  }

  await db.devis.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
