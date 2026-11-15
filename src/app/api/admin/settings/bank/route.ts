import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { EMPTY_BANK_DETAILS, cleanBankDetails, getBankDetails, saveBankDetails } from "@/lib/bank-details";

/** The bank account shown to guests asked for an advance. */
export async function GET() {
  const deny = await requireAdmin();
  if (deny) return deny;
  return NextResponse.json((await getBankDetails()) ?? EMPTY_BANK_DETAILS);
}

export async function PUT(req: NextRequest) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const body = await req.json().catch(() => ({}));
  return NextResponse.json(await saveBankDetails(cleanBankDetails(body)));
}
