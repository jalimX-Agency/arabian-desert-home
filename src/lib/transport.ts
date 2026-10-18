// Pricing of a transport option, shared by the booking form (preview) and the server
// (the amount actually saved). Pure: safe to import from client components.

export type TransportPricing = "forfait" | "vehicule" | "personne";

export interface TransportPriceInput {
  price: number;
  pricing: string;
  capacity: number;
}

/** How many units are billed: 1 for a flat rate, vehicles needed, or passengers. */
export function transportUnits(opt: TransportPriceInput, passengers: number): number {
  const people = Math.max(1, passengers);
  if (opt.pricing === "personne") return people;
  if (opt.pricing === "vehicule") return Math.max(1, Math.ceil(people / Math.max(1, opt.capacity)));
  return 1;
}

export function transportTotal(opt: TransportPriceInput, passengers: number): number {
  return Math.round(opt.price * transportUnits(opt, passengers) * 100) / 100;
}

const UNIT_COPY = {
  fr: { forfait: "le transfert", vehicule: (c: number) => `par véhicule (jusqu'à ${c} pers.)`, personne: "par personne" },
  en: { forfait: "per transfer", vehicule: (c: number) => `per vehicle (up to ${c} people)`, personne: "per person" },
  es: { forfait: "el traslado", vehicule: (c: number) => `por vehículo (hasta ${c} pers.)`, personne: "por persona" },
  it: { forfait: "il transfer", vehicule: (c: number) => `per veicolo (fino a ${c} pers.)`, personne: "a persona" },
} as const;

/** "par véhicule (jusqu'à 4 pers.)" — what the price is for, in the visitor's language. */
export function transportUnitLabel(opt: TransportPriceInput, lang: keyof typeof UNIT_COPY): string {
  const c = UNIT_COPY[lang] ?? UNIT_COPY.fr;
  if (opt.pricing === "personne") return c.personne;
  if (opt.pricing === "vehicule") return c.vehicule(opt.capacity);
  return c.forfait;
}
