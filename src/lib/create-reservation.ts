import { after } from "next/server";
import { db } from "@/lib/db";
import { sendReservationConfirmation, sendReservationNotification, reservationManageUrl } from "@/lib/email";
import type { PricedItem } from "@/lib/reservation-item";
import type { ReservationLang } from "@/lib/reservation-lang";
import { isLeadSource } from "@/lib/lead-source";
import { countryFromHeader, deviceFromUserAgent } from "@/lib/visit";
import { sumMoney } from "@/lib/money";

export interface NewReservation {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialReqs: string | null;
  lang: ReservationLang;
  source: unknown;
  /** Page the request was sent from, for the anonymous lead count. */
  page: string;
  priced: PricedItem[];
}

/**
 * Saves a guest's request from the public site (one reservation, its lines all "pending"),
 * counts it as a lead by source, and emails the guest and the admin. Shared by the general
 * booking form and the New Year's Eve page.
 */
export async function createGuestReservation(o: NewReservation, headers: Headers) {
  const totalAmount = sumMoney(o.priced.map((p) => p.totalAmount));
  const currency = o.priced[0].currency;
  const source = isLeadSource(o.source) ? o.source : null;

  const reservation = await db.reservation.create({
    data: {
      firstName: o.firstName, lastName: o.lastName, email: o.email, phone: o.phone,
      specialReqs: o.specialReqs,
      totalAmount,
      currency,
      lang: o.lang,
      source,
      items: {
        create: o.priced.map((p) => ({
          firstName: o.firstName, lastName: o.lastName, email: o.email, phone: o.phone,
          serviceType: p.serviceType,
          suiteId: p.suiteId,
          activityId: p.activityId,
          dayPassId: p.dayPassId,
          checkIn: p.checkIn,
          checkOut: p.checkOut,
          date: p.date,
          quantity: p.quantity,
          guests: p.guests,
          children: p.children,
          experiences: p.experiences,
          label: p.label ?? null,
          transportId: p.transportId ?? null,
          specialReqs: o.specialReqs,
          totalAmount: p.totalAmount,
          currency: p.currency,
          status: "pending",
        })),
      },
    },
    include: { items: { include: { suite: true, activity: true, dayPass: true } } },
  });

  // Anonymous count of the request by source, whatever the visitor's cookie choice.
  await db.leadEvent
    .create({
      data: {
        kind: "form",
        source: source ?? "direct",
        page: o.page,
        lang: o.lang,
        country: countryFromHeader(headers.get("x-vercel-ip-country")),
        device: deviceFromUserAgent(headers.get("user-agent")),
      },
    })
    .catch(() => {});

  const manageUrl = reservationManageUrl(reservation.accessToken);
  // Sent once the response is out, so the guest never waits on the mail provider.
  after(() => Promise.allSettled([
    sendReservationConfirmation(o.email, o.firstName, reservation.items, totalAmount, currency, manageUrl, o.lang),
    sendReservationNotification(reservation.items, totalAmount, currency, o.specialReqs, o.lang),
  ]).then(() => undefined));

  return { reservation, manageUrl };
}
