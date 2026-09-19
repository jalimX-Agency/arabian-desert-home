import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { DEVIS_INCLUDE } from "@/lib/devis";
import { generateFichePdf } from "@/lib/fiche-pdf";
import { buildDevisHtml, devisRecordToPdfOptions, type DevisLang } from "@/lib/devis-pdf";
import { devisUrl } from "@/lib/email";

export const maxDuration = 60;

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;

  const devis = await db.devis.findUnique({ where: { id }, include: DEVIS_INCLUDE });
  if (!devis) return NextResponse.json({ error: "Devis introuvable" }, { status: 404 });

  const langParam = req.nextUrl.searchParams.get("lang");
  const lang = (["fr", "en", "es"].includes(langParam ?? "") ? langParam : undefined) as DevisLang | undefined;

  const pdf = await generateFichePdf(
    buildDevisHtml(devisRecordToPdfOptions(devis, devisUrl(devis.accessToken), lang))
  );

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${devis.reference}.pdf"`,
    },
  });
}
