import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { parseISODay } from "@/lib/tent-stay";
import { generateFichePdf } from "@/lib/fiche-pdf";
import { TABLE_PDF_FOOTER } from "@/lib/reservations-table-pdf";
import { buildDayPlan, buildDayPlanHtml } from "@/lib/day-plan";

export const maxDuration = 60;

/** GET ?date=YYYY-MM-DD — the day's planning as an A4 PDF for the team. */
export async function GET(req: NextRequest) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const day = parseISODay(req.nextUrl.searchParams.get("date")) ?? new Date(Date.now() + 86_400_000);
  const plan = await buildDayPlan(db, day);
  const pdf = await generateFichePdf(buildDayPlanHtml(plan), { footerTemplate: TABLE_PDF_FOOTER });
  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="planning-${plan.date}.pdf"`,
    },
  });
}
