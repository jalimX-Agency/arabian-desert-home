import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { calendarDay } from "@/lib/calendar-day";
import { peopleTotal } from "@/lib/devis-pricing";
import { priceCartItem, type PricedItem } from "@/lib/reservation-item";
import { parseReservationLang } from "@/lib/reservation-lang";
import { createGuestReservation } from "@/lib/create-reservation";
import { getReveillonOffer } from "@/lib/reveillon-offer";
import {
  REVEILLON_CHECKOUT, REVEILLON_DATE, REVEILLON_PATH, SOIREE_CHILD_PERCENT, SOIREE_LABEL, SOIREE_PRICE_EUR,
  isReveillonOpen,
} from "@/lib/reveillon";

export const dynamic = "force-dynamic";

/** Live availability for the page: soirée seats left, tents left and their price that night. */
export async function GET() {
  return NextResponse.json(await getReveillonOffer());
}

interface Body {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  notes?: string;
  lang?: string;
  source?: string;
  acceptTerms?: boolean;
  soiree?: { adults?: number; children?: number };
  tents?: { suiteId?: string; adults?: number; children?: number }[];
  transport?: { transportId?: string; pickup?: string } | null;
}

/** A guest-facing error: `code` lets the page show it in the guest's language. */
function fail(code: string, error: string, status = 400) {
  return NextResponse.json({ code, error }, { status });
}

// Capped well above any real request: a too-large number must be refused, never silently trimmed.
const count = (n: unknown, max = 500) => Math.max(0, Math.min(max, Math.floor(Number(n) || 0)));

/** Books the New Year's Eve: soirée seats and/or tents for the night (soirée included), optional transfer. */
export async function POST(req: NextRequest) {
  if (!isReveillonOpen()) return fail("closed", "Les réservations du réveillon sont closes.");
  const b = (await req.json().catch(() => ({}))) as Body;

  const firstName = String(b.firstName ?? "").trim().slice(0, 80);
  const lastName = String(b.lastName ?? "").trim().slice(0, 80);
  const email = String(b.email ?? "").trim().slice(0, 160);
  const phone = String(b.phone ?? "").trim().slice(0, 40);
  if (!firstName || !lastName || !phone || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return fail("contact", "Coordonnées incomplètes.");
  }
  if (b.acceptTerms !== true) return fail("terms", "Conditions non acceptées.");

  const soireeAdults = count(b.soiree?.adults);
  const soireeChildren = count(b.soiree?.children);
  const tents = (Array.isArray(b.tents) ? b.tents : []).slice(0, 6).map((t) => ({
    suiteId: String(t.suiteId ?? ""),
    adults: count(t.adults),
    children: count(t.children),
  }));
  if (soireeAdults + soireeChildren === 0 && tents.length === 0) return fail("empty", "Choisissez au moins une formule.");
  // Children of any age are welcome, but always with an adult of the same booking.
  if (soireeChildren > 0 && soireeAdults === 0) return fail("child_alone", "Un enfant doit être accompagné d'un adulte.");
  if (tents.some((t) => t.adults === 0)) return fail("child_alone", "Chaque tente doit compter au moins un adulte.");

  const night = calendarDay(REVEILLON_DATE);
  const priced: PricedItem[] = [];

  // Tents: the regular engine checks the free tents and prices the night of 31 Dec (soirée included).
  const offer = await getReveillonOffer();
  const perSuite = new Map<string, number>();
  for (const t of tents) {
    const tent = offer.tents.find((x) => x.suiteId === t.suiteId);
    if (!tent) return fail("tent", "Tente inconnue.");
    if (t.adults + t.children > tent.maxGuests) return fail("tent_capacity", `${tent.name} : ${tent.maxGuests} personnes maximum.`);
    perSuite.set(t.suiteId, (perSuite.get(t.suiteId) ?? 0) + 1);
    if ((perSuite.get(t.suiteId) ?? 0) > tent.left) return fail("tent_full", `${tent.name} est complète pour le 31 décembre.`);
    try {
      const p = await priceCartItem({
        serviceType: "suite", suiteId: t.suiteId, checkIn: REVEILLON_DATE, checkOut: REVEILLON_CHECKOUT,
        quantity: 1, guests: t.adults, children: t.children, experiences: "Réveillon du 31 décembre inclus",
      });
      priced.push(p);
    } catch {
      return fail("tent_full", `${tent.name} est complète pour le 31 décembre.`);
    }
  }

  // Soirée alone: a fixed-price line, within the seats left.
  if (soireeAdults + soireeChildren > 0) {
    if (soireeAdults + soireeChildren > offer.soiree.seatsLeft) {
      return NextResponse.json({ code: "seats", error: `Il reste ${offer.soiree.seatsLeft} places pour la soirée.`, seatsLeft: offer.soiree.seatsLeft }, { status: 400 });
    }
    priced.push({
      serviceType: "custom", suiteId: null, activityId: null, dayPassId: null,
      checkIn: null, checkOut: null, date: night, quantity: 1,
      guests: soireeAdults, children: soireeChildren, experiences: null,
      totalAmount: peopleTotal(SOIREE_PRICE_EUR, soireeAdults, soireeChildren, SOIREE_CHILD_PERCENT),
      currency: "EUR",
      label: SOIREE_LABEL,
    });
  }

  // Transfer from Marrakech, for everyone on the booking.
  if (b.transport?.transportId) {
    const passengers = tents.reduce((s, t) => s + t.adults + t.children, 0) + soireeAdults + soireeChildren;
    const opt = await db.transportOption.findUnique({ where: { id: b.transport.transportId } });
    if (!opt || !opt.active) return fail("transport", "Transfert indisponible.");
    priced.push(await priceCartItem({
      serviceType: "transport", transportId: opt.id, date: REVEILLON_DATE, pickup: b.transport.pickup,
      guests: passengers, children: 0,
    }));
  }

  // Everything in EUR: the reservation keeps one currency.
  if (priced.some((p) => p.currency !== "EUR")) return fail("generic", "Devise inattendue.");

  const notes = String(b.notes ?? "").trim().slice(0, 1000);
  const specialReqs = [
    "[Réveillon 31/12] Le client a accepté : acompte de 50 % pour confirmer, non remboursable en cas d'annulation.",
    notes,
  ].filter(Boolean).join("\n");

  const { manageUrl } = await createGuestReservation({
    firstName, lastName, email, phone, specialReqs,
    lang: parseReservationLang(b.lang),
    source: b.source,
    page: REVEILLON_PATH,
    priced,
  }, req.headers);

  return NextResponse.json({ ok: true, manageUrl }, { status: 201 });
}
