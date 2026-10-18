const PRICING = ["forfait", "vehicule", "personne"];
const TEXT = ["name", "nameEn", "nameEs", "nameIt", "description", "descriptionEn", "descriptionEs", "descriptionIt"] as const;

/** Keeps only the editable columns of a transport option, with sane values. */
export function transportData(body: Record<string, unknown>) {
  const data: Record<string, unknown> = {};
  for (const k of TEXT) if (typeof body[k] === "string") data[k] = (body[k] as string).trim();
  if (body.price !== undefined) data.price = Math.max(0, Math.round(Number(body.price) || 0));
  if (body.capacity !== undefined) data.capacity = Math.max(1, Math.round(Number(body.capacity) || 1));
  if (body.order !== undefined) data.order = Math.round(Number(body.order) || 0);
  if (typeof body.currency === "string" && ["EUR", "MAD"].includes(body.currency)) data.currency = body.currency;
  if (typeof body.pricing === "string" && PRICING.includes(body.pricing)) data.pricing = body.pricing;
  if (typeof body.active === "boolean") data.active = body.active;
  return data;
}
