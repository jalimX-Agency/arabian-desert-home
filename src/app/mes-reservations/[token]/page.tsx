import { db } from "@/lib/db";
import { LanguageProvider } from "@/lib/i18n/context";
import { parseReservationLang } from "@/lib/reservation-lang";
import { ManageReservation } from "./ManageReservation";

/**
 * The guest's private "manage my reservation" page. It opens in the language the
 * guest booked in (Reservation.lang), read here so the very first paint is already
 * in that language instead of flashing French.
 */
export default async function MyReservationPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const reservation = await db.reservation.findUnique({ where: { accessToken: token }, select: { lang: true } });

  return (
    <LanguageProvider initialLanguage={parseReservationLang(reservation?.lang)} locked>
      <ManageReservation />
    </LanguageProvider>
  );
}
