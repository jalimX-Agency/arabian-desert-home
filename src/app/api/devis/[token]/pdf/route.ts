import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { DEVIS_INCLUDE } from "@/lib/devis";
import { generateFichePdf } from "@/lib/fiche-pdf";
import { buildDevisHtml, devisRecordToPdfOptions } from "@/lib/devis-pdf";
import { devisUrl } from "@/lib/email";

export const maxDuration = 60;

/** The client's own copy of their quote — token-gated, same as the page. */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const devis = await db.devis.findUnique({ where: { accessToken: token }, include: DEVIS_INCLUDE });
  if (!devis || devis.status === "draft") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const pdf = await generateFichePdf(
    buildDevisHtml(devisRecordToPdfOptions(devis, devisUrl(devis.accessToken)))
  );

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${devis.reference}.pdf"`,
    },
  });
}
