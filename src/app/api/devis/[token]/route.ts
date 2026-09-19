import { NextRequest, NextResponse, after } from "next/server";
import { db } from "@/lib/db";
import { DEVIS_INCLUDE } from "@/lib/devis";
import { sendDevisAnsweredNotification } from "@/lib/email";

// Token-gated, not admin-gated: the access token in the URL IS the auth — this is the
// client's own copy of their quote, reached from the link in their email.

async function loadDevis(token: string) {
  return db.devis.findUnique({ where: { accessToken: token }, include: DEVIS_INCLUDE });
}

/** What the client is allowed to see — never the admin's internal notes. */
function publicView(devis: NonNullable<Awaited<ReturnType<typeof loadDevis>>>) {
  return {
    reference: devis.reference,
    status: devis.status,
    firstName: devis.firstName,
    lastName: devis.lastName,
    email: devis.email,
    phone: devis.phone,
    company: devis.company,
    title: devis.title,
    conditions: devis.conditions,
    lang: devis.lang,
    currency: devis.currency,
    totalAmount: devis.totalAmount,
    validUntil: devis.validUntil,
    createdAt: devis.createdAt,
    sentAt: devis.sentAt,
    answeredAt: devis.answeredAt,
    clientMessage: devis.clientMessage,
    expired: devis.validUntil.getTime() < Date.now(),
    items: devis.items.map((i) => ({
      id: i.id,
      kind: i.kind,
      serviceType: i.serviceType,
      label: i.label,
      description: i.description,
      checkIn: i.checkIn,
      checkOut: i.checkOut,
      date: i.date,
      quantity: i.quantity,
      guests: i.guests,
      children: i.children,
      totalAmount: i.totalAmount,
      currency: i.currency,
    })),
  };
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const devis = await loadDevis(token);
  if (!devis || devis.status === "draft") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(publicView(devis));
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const devis = await loadDevis(token);
  if (!devis || devis.status === "draft") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { action, message } = (await req.json()) as { action?: string; message?: string };
  if (action !== "accept" && action !== "refuse") {
    return NextResponse.json({ error: "Action invalide" }, { status: 400 });
  }

  if (devis.status === "converted") {
    return NextResponse.json({ error: "Ce devis a déjà été confirmé en réservation." }, { status: 409 });
  }
  if (devis.status === "cancelled") {
    return NextResponse.json({ error: "Ce devis a été annulé par notre équipe." }, { status: 409 });
  }
  if (devis.answeredAt) {
    return NextResponse.json({ error: "Vous avez déjà répondu à ce devis." }, { status: 409 });
  }
  if (devis.validUntil.getTime() < Date.now()) {
    if (devis.status !== "expired") {
      await db.devis.update({ where: { id: devis.id }, data: { status: "expired" } });
    }
    return NextResponse.json(
      { error: "La validité de ce devis est dépassée. Contactez-nous pour en recevoir un nouveau." },
      { status: 410 }
    );
  }
  if (devis.status !== "sent") {
    return NextResponse.json({ error: "Ce devis n'est pas disponible pour une réponse." }, { status: 409 });
  }

  const status = action === "accept" ? "accepted" : "refused";
  const updated = await db.devis.update({
    where: { id: devis.id },
    data: {
      status,
      answeredAt: new Date(),
      answeredBy: "client",
      clientMessage: message?.trim() || null,
    },
    include: DEVIS_INCLUDE,
  });

  after(async () => {
    try {
      await sendDevisAnsweredNotification(
        devis.reference,
        `${devis.firstName} ${devis.lastName}`,
        status as "accepted" | "refused",
        devis.totalAmount,
        devis.currency,
        message?.trim() || null,
      );
    } catch (err) {
      console.error("Failed to notify admin of devis answer:", err);
    }
  });

  return NextResponse.json(publicView(updated));
}
