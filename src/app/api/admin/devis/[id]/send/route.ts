import { NextRequest, NextResponse, after } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { DEVIS_INCLUDE } from "@/lib/devis";
import { generateFichePdf } from "@/lib/fiche-pdf";
import { buildDevisHtml, devisRecordToPdfOptions } from "@/lib/devis-pdf";
import { devisUrl, sendDevisToClient, type DevisEmailLang } from "@/lib/email";

export const maxDuration = 60;

/** Emails the quote to the client with its PDF attached and marks it as sent.
 *  Re-sending a quote the client already answered needs ?force=1. */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;

  const devis = await db.devis.findUnique({ where: { id }, include: DEVIS_INCLUDE });
  if (!devis) return NextResponse.json({ error: "Devis introuvable" }, { status: 404 });
  if (devis.status === "converted") {
    return NextResponse.json({ error: "Ce devis est déjà converti en réservation" }, { status: 409 });
  }
  const force = req.nextUrl.searchParams.get("force") === "1";
  if (devis.answeredAt && !force) {
    return NextResponse.json(
      { error: "Ce devis a déjà reçu une réponse du client. Renvoyez-le avec « forcer » pour rouvrir la réponse." },
      { status: 409 }
    );
  }
  if (devis.validUntil.getTime() < Date.now()) {
    return NextResponse.json(
      { error: "La date de validité est dépassée — prolongez-la avant d'envoyer le devis." },
      { status: 400 }
    );
  }

  const link = devisUrl(devis.accessToken);
  const pdf = await generateFichePdf(buildDevisHtml(devisRecordToPdfOptions(devis, link)));

  const updated = await db.devis.update({
    where: { id },
    data: {
      status: "sent",
      sentAt: new Date(),
      ...(force ? { answeredAt: null, answeredBy: null, clientMessage: null } : {}),
    },
    include: DEVIS_INCLUDE,
  });

  const lang = (["fr", "en", "es"].includes(devis.lang) ? devis.lang : "fr") as DevisEmailLang;
  after(async () => {
    try {
      await sendDevisToClient(
        devis.email, devis.firstName, devis.reference, devis.totalAmount,
        devis.currency, devis.validUntil, link, pdf, lang,
      );
    } catch (err) {
      console.error("Failed to send devis email:", err);
    }
  });

  return NextResponse.json({ success: true, devis: updated });
}
