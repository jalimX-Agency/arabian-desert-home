import { Resend } from "resend";
import { db } from "@/lib/db";
import { LANG_LOCALE, RESERVATION_LANG_LABEL, type ReservationLang } from "@/lib/reservation-lang";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "Arabian Desert Home <noreply@arabiandeserthome.ma>";
const SITE_URL = "https://www.arabiandeserthome.ma";

/** The guest's private "manage my reservation" link — the token in it is the only auth. */
export function reservationManageUrl(accessToken: string): string {
  return `${SITE_URL}/mes-reservations/${accessToken}`;
}

function manageButton(manageUrl: string, color: string, lang: ReservationLang = "fr"): string {
  const t = BOOKING_I18N[lang].manage;
  return `
    <p style="text-align:center;margin:0 0 12px">
      <a href="${manageUrl}" style="display:inline-block;background:${color};color:#fff;text-decoration:none;padding:12px 28px;border-radius:6px;font-size:14px;font-weight:600">${t.button}</a>
    </p>
    <p style="text-align:center;color:#999;font-size:12px;line-height:1.6;margin:0 0 32px">${t.hint}</p>
  `;
}

/** Opens the "write a review" box of the Google Business Profile directly. */
export const GOOGLE_REVIEW_URL = "https://g.page/r/CXpKFCoECsr4EBM/review";

export type ReviewLang = "fr" | "en" | "es" | "it";

const REVIEW_I18N: Record<ReviewLang, {
  subject: string; hello: string; thanks: string; ask: string; button: string; signoff: string; team: string;
}> = {
  fr: {
    subject: "Merci pour votre séjour — Arabian Desert Home",
    hello: "Bonjour",
    thanks: "Merci d'avoir choisi Arabian Desert Home. Nous espérons que le désert d'Agafay vous a offert de beaux souvenirs.",
    ask: "Votre avis compte énormément pour notre petite équipe et aide d'autres voyageurs à nous découvrir. Auriez-vous une minute pour partager votre expérience sur Google ?",
    button: "Laisser un avis Google",
    signoff: "À très bientôt,",
    team: "L'équipe Arabian Desert Home",
  },
  en: {
    subject: "Thank you for your stay — Arabian Desert Home",
    hello: "Hello",
    thanks: "Thank you for choosing Arabian Desert Home. We hope the Agafay desert gave you wonderful memories.",
    ask: "Your review means a lot to our small team and helps other travellers find us. Could you spare a minute to share your experience on Google?",
    button: "Leave a Google review",
    signoff: "See you soon,",
    team: "The Arabian Desert Home team",
  },
  es: {
    subject: "Gracias por su estancia — Arabian Desert Home",
    hello: "Hola",
    thanks: "Gracias por elegir Arabian Desert Home. Esperamos que el desierto de Agafay le haya regalado bonitos recuerdos.",
    ask: "Su opinión es muy importante para nuestro pequeño equipo y ayuda a otros viajeros a descubrirnos. ¿Tendría un minuto para compartir su experiencia en Google?",
    button: "Dejar una reseña en Google",
    signoff: "¡Hasta pronto!",
    team: "El equipo de Arabian Desert Home",
  },
  it: {
    subject: "Grazie per il vostro soggiorno — Arabian Desert Home",
    hello: "Buongiorno",
    thanks: "Grazie per aver scelto Arabian Desert Home. Speriamo che il deserto di Agafay vi abbia regalato bei ricordi.",
    ask: "La vostra opinione conta moltissimo per il nostro piccolo team e aiuta altri viaggiatori a scoprirci. Avreste un minuto per condividere la vostra esperienza su Google?",
    button: "Lascia una recensione su Google",
    signoff: "A presto,",
    team: "Il team di Arabian Desert Home",
  },
};

/** Post-stay thank-you with a one-click Google review button, sent by the admin. */
export async function sendReviewRequestEmail(to: string, firstName: string, lang: ReviewLang) {
  const t = REVIEW_I18N[lang];
  await resend.emails.send({
    from: FROM,
    to,
    subject: t.subject,
    html: `
      <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#1a1a1a">
        <div style="background:#0f0f0f;padding:32px;text-align:center">
          <p style="color:#c8922a;letter-spacing:4px;font-size:11px;text-transform:uppercase;margin:0">Arabian Desert Home</p>
        </div>
        <div style="padding:40px 32px">
          <h1 style="font-size:24px;font-weight:400;margin:0 0 16px">${t.hello} ${firstName},</h1>
          <p style="color:#555;line-height:1.7;margin:0 0 16px">${t.thanks}</p>
          <p style="color:#555;line-height:1.7;margin:0 0 28px">${t.ask}</p>
          <p style="text-align:center;margin:0 0 8px">
            <a href="${GOOGLE_REVIEW_URL}" style="display:inline-block;background:#c8922a;color:#fff;text-decoration:none;padding:14px 32px;border-radius:6px;font-size:15px;font-weight:600">${t.button}</a>
          </p>
          <p style="text-align:center;color:#c8922a;font-size:20px;letter-spacing:4px;margin:0 0 32px">★★★★★</p>
          <p style="color:#555;line-height:1.7;margin:0">${t.signoff}<br/><strong>${t.team}</strong></p>
        </div>
        <div style="background:#f5f0e8;padding:20px 32px;text-align:center">
          <p style="color:#999;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0">Agafay · Marrakech · Maroc</p>
        </div>
      </div>
    `,
  });
}

async function getAdminEmail(): Promise<string> {
  const admin = await db.user.findFirst({ where: { role: "admin" } });
  return admin?.email ?? "info@arabiandeserthome.ma";
}

// ── Contact emails ──────────────────────────────────────────────────────────

export async function sendContactConfirmation(to: string, name: string, subject: string) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: `Nous avons bien reçu votre message — ${subject}`,
    html: `
      <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#1a1a1a">
        <div style="background:#0f0f0f;padding:32px;text-align:center">
          <p style="color:#c8922a;letter-spacing:4px;font-size:11px;text-transform:uppercase;margin:0">Arabian Desert Home</p>
        </div>
        <div style="padding:40px 32px">
          <h1 style="font-size:24px;font-weight:400;margin:0 0 16px">Bonjour ${name},</h1>
          <p style="color:#555;line-height:1.7;margin:0 0 24px">
            Nous avons bien reçu votre message concernant <strong>${subject}</strong>.<br/>
            Notre équipe vous répondra dans les plus brefs délais, généralement sous 24h.
          </p>
          <p style="color:#555;line-height:1.7;margin:0 0 32px">
            En attendant, n'hésitez pas à nous contacter directement :
          </p>
          <div style="background:#faf8f5;border-left:3px solid #c8922a;padding:16px 20px;margin:0 0 32px">
            <p style="margin:0;color:#333;font-size:14px">📞 +212 667-370-206</p>
            <p style="margin:4px 0 0;color:#333;font-size:14px">📧 info@arabiandeserthome.ma</p>
          </div>
          <p style="color:#555;line-height:1.7;margin:0">Avec nos chaleureuses salutations,<br/><strong>L'équipe Arabian Desert Home</strong></p>
        </div>
        <div style="background:#f5f0e8;padding:20px 32px;text-align:center">
          <p style="color:#999;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0">Agafay · Marrakech · Maroc</p>
        </div>
      </div>
    `,
  });
}

export async function sendContactNotification(
  fromName: string,
  fromEmail: string,
  subject: string,
  message: string,
) {
  const adminEmail = await getAdminEmail();
  await resend.emails.send({
    from: FROM,
    to: adminEmail,
    subject: `[Contact] Nouveau message — ${subject}`,
    html: `
      <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#1a1a1a">
        <div style="background:#0f0f0f;padding:24px 32px">
          <p style="color:#c8922a;letter-spacing:4px;font-size:11px;text-transform:uppercase;margin:0">Nouveau message de contact</p>
        </div>
        <div style="padding:32px">
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:8px 0;color:#888;width:80px">De</td><td style="padding:8px 0;font-weight:600">${fromName}</td></tr>
            <tr><td style="padding:8px 0;color:#888">Email</td><td style="padding:8px 0"><a href="mailto:${fromEmail}" style="color:#c8922a">${fromEmail}</a></td></tr>
            <tr><td style="padding:8px 0;color:#888">Sujet</td><td style="padding:8px 0">${subject}</td></tr>
          </table>
          <hr style="border:none;border-top:1px solid #eee;margin:20px 0"/>
          <p style="white-space:pre-wrap;line-height:1.7;color:#333;font-size:15px">${message}</p>
        </div>
      </div>
    `,
  });
}

// ── Booking emails ──────────────────────────────────────────────────────────

type NamedRow = { name: string; nameEn?: string | null; nameEs?: string | null; nameIt?: string | null };

type BookingWithRelations = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  serviceType: string;
  quantity?: number;
  guests: number;
  children: number;
  totalAmount: number;
  currency: string;
  checkIn?: Date | null;
  checkOut?: Date | null;
  date?: Date | null;
  experiences?: string | null;
  specialReqs?: string | null;
  suite?: NamedRow | null;
  activity?: NamedRow | null;
  dayPass?: NamedRow | null;
};

// Every string a guest can read in the four client-facing booking emails.
interface BookingStrings {
  hello: (name: string) => string;
  questions: string;
  country: string;
  manage: { button: string; hint: string };
  item: {
    accommodation: string; activity: string; daypass: string;
    arrival: string; departure: string; duration: string; night: string; nights: string;
    date: string; adults: string; children: string; subtotal: string; experiences: string;
  };
  received: { subjectOne: (service: string) => string; subjectMany: (n: number) => string; intro: string; title: string; total: string };
  confirmed: { subject: string; banner: string; intro: string; recap: string; total: string; attachment: string };
  cancelled: { subject: string; banner: string; intro: string; title: string };
  modified: { subject: string; intro: string; title: string; oldDates: string; newDates: string; newTotal: string };
}

const BOOKING_I18N: Record<ReservationLang, BookingStrings> = {
  fr: {
    hello: (n) => `Bonjour ${n},`,
    questions: "Des questions ? Contactez-nous :",
    country: "Maroc",
    manage: { button: "Gérer ma réservation", hint: "Modifier vos dates ou annuler — ce lien est personnel, ne le partagez pas." },
    item: {
      accommodation: "Hébergement", activity: "Activité", daypass: "Day Pass",
      arrival: "Arrivée", departure: "Départ", duration: "Durée", night: "nuit", nights: "nuits",
      date: "Date", adults: "Adultes", children: "Enfants", subtotal: "Sous-total", experiences: "Expériences souhaitées",
    },
    received: {
      subjectOne: (service) => `Confirmation de réservation — ${service}`,
      subjectMany: (n) => `Confirmation de réservation — ${n} prestations`,
      intro: "Votre demande de réservation a bien été reçue. Nous vous contacterons sous 24h pour confirmer les détails.",
      title: "Détails de votre réservation",
      total: "Total estimé",
    },
    confirmed: {
      subject: "Votre réservation est confirmée — Arabian Desert Home",
      banner: "Réservation confirmée",
      intro: "Bonne nouvelle : votre réservation est confirmée ! Vous trouverez votre fiche de réservation en pièce jointe — merci de la présenter à votre arrivée au campement.",
      recap: "Récapitulatif",
      total: "Tarif total",
      attachment: "Fiche-de-reservation.pdf",
    },
    cancelled: {
      subject: "Votre réservation a été annulée — Arabian Desert Home",
      banner: "Réservation annulée",
      intro: "Votre réservation ci-dessous a été annulée par notre équipe. Si vous pensez qu'il s'agit d'une erreur, ou pour toute question, contactez-nous directement.",
      title: "Prestations annulées",
    },
    modified: {
      subject: "Modification de votre réservation reçue — Arabian Desert Home",
      intro: "Nous avons bien reçu la modification de votre réservation. Elle est maintenant <strong>en attente de confirmation</strong> : notre équipe vérifie les nouvelles dates et vous enverra une confirmation très vite.",
      title: "Modification",
      oldDates: "Anciennes dates",
      newDates: "Nouvelles dates",
      newTotal: "Nouveau total estimé",
    },
  },
  en: {
    hello: (n) => `Hello ${n},`,
    questions: "Any questions? Contact us:",
    country: "Morocco",
    manage: { button: "Manage my reservation", hint: "Change your dates or cancel — this link is personal, please don't share it." },
    item: {
      accommodation: "Accommodation", activity: "Activity", daypass: "Day Pass",
      arrival: "Check-in", departure: "Check-out", duration: "Duration", night: "night", nights: "nights",
      date: "Date", adults: "Adults", children: "Children", subtotal: "Subtotal", experiences: "Requested experiences",
    },
    received: {
      subjectOne: (service) => `Your reservation request — ${service}`,
      subjectMany: (n) => `Your reservation request — ${n} services`,
      intro: "Your reservation request has been received. We will contact you within 24 hours to confirm the details.",
      title: "Your reservation details",
      total: "Estimated total",
    },
    confirmed: {
      subject: "Your reservation is confirmed — Arabian Desert Home",
      banner: "Reservation confirmed",
      intro: "Good news: your reservation is confirmed! Your reservation voucher is attached — please present it on arrival at the camp.",
      recap: "Summary",
      total: "Total price",
      attachment: "Reservation-voucher.pdf",
    },
    cancelled: {
      subject: "Your reservation has been cancelled — Arabian Desert Home",
      banner: "Reservation cancelled",
      intro: "The reservation below has been cancelled by our team. If you think this is a mistake, or if you have any questions, please contact us directly.",
      title: "Cancelled services",
    },
    modified: {
      subject: "We received your reservation change — Arabian Desert Home",
      intro: "We have received the change to your reservation. It is now <strong>awaiting confirmation</strong>: our team is checking the new dates and will send you a confirmation very soon.",
      title: "Change",
      oldDates: "Previous dates",
      newDates: "New dates",
      newTotal: "New estimated total",
    },
  },
  es: {
    hello: (n) => `Hola ${n},`,
    questions: "¿Alguna pregunta? Contáctenos:",
    country: "Marruecos",
    manage: { button: "Gestionar mi reserva", hint: "Modifique sus fechas o cancele: este enlace es personal, no lo comparta." },
    item: {
      accommodation: "Alojamiento", activity: "Actividad", daypass: "Day Pass",
      arrival: "Llegada", departure: "Salida", duration: "Duración", night: "noche", nights: "noches",
      date: "Fecha", adults: "Adultos", children: "Niños", subtotal: "Subtotal", experiences: "Experiencias deseadas",
    },
    received: {
      subjectOne: (service) => `Su solicitud de reserva — ${service}`,
      subjectMany: (n) => `Su solicitud de reserva — ${n} servicios`,
      intro: "Hemos recibido su solicitud de reserva. Nos pondremos en contacto con usted en un plazo de 24 horas para confirmar los detalles.",
      title: "Detalles de su reserva",
      total: "Total estimado",
    },
    confirmed: {
      subject: "Su reserva está confirmada — Arabian Desert Home",
      banner: "Reserva confirmada",
      intro: "¡Buenas noticias: su reserva está confirmada! Encontrará su ficha de reserva adjunta; le rogamos que la presente a su llegada al campamento.",
      recap: "Resumen",
      total: "Precio total",
      attachment: "Ficha-de-reserva.pdf",
    },
    cancelled: {
      subject: "Su reserva ha sido cancelada — Arabian Desert Home",
      banner: "Reserva cancelada",
      intro: "La reserva que se indica a continuación ha sido cancelada por nuestro equipo. Si cree que se trata de un error, o para cualquier consulta, contáctenos directamente.",
      title: "Servicios cancelados",
    },
    modified: {
      subject: "Hemos recibido la modificación de su reserva — Arabian Desert Home",
      intro: "Hemos recibido la modificación de su reserva. Ahora está <strong>pendiente de confirmación</strong>: nuestro equipo revisa las nuevas fechas y le enviará una confirmación muy pronto.",
      title: "Modificación",
      oldDates: "Fechas anteriores",
      newDates: "Nuevas fechas",
      newTotal: "Nuevo total estimado",
    },
  },
  it: {
    hello: (n) => `Buongiorno ${n},`,
    questions: "Avete domande? Contattateci:",
    country: "Marocco",
    manage: { button: "Gestisci la mia prenotazione", hint: "Modificate le date o annullate: questo link è personale, non condividetelo." },
    item: {
      accommodation: "Alloggio", activity: "Attività", daypass: "Day Pass",
      arrival: "Arrivo", departure: "Partenza", duration: "Durata", night: "notte", nights: "notti",
      date: "Data", adults: "Adulti", children: "Bambini", subtotal: "Subtotale", experiences: "Esperienze desiderate",
    },
    received: {
      subjectOne: (service) => `La vostra richiesta di prenotazione — ${service}`,
      subjectMany: (n) => `La vostra richiesta di prenotazione — ${n} servizi`,
      intro: "Abbiamo ricevuto la vostra richiesta di prenotazione. Vi contatteremo entro 24 ore per confermare i dettagli.",
      title: "Dettagli della vostra prenotazione",
      total: "Totale stimato",
    },
    confirmed: {
      subject: "La vostra prenotazione è confermata — Arabian Desert Home",
      banner: "Prenotazione confermata",
      intro: "Buone notizie: la vostra prenotazione è confermata! In allegato trovate la scheda di prenotazione: vi preghiamo di presentarla al vostro arrivo al campo.",
      recap: "Riepilogo",
      total: "Prezzo totale",
      attachment: "Scheda-di-prenotazione.pdf",
    },
    cancelled: {
      subject: "La vostra prenotazione è stata annullata — Arabian Desert Home",
      banner: "Prenotazione annullata",
      intro: "La prenotazione qui sotto è stata annullata dal nostro team. Se pensate si tratti di un errore, o per qualsiasi domanda, contattateci direttamente.",
      title: "Servizi annullati",
    },
    modified: {
      subject: "Abbiamo ricevuto la modifica della vostra prenotazione — Arabian Desert Home",
      intro: "Abbiamo ricevuto la modifica della vostra prenotazione. È ora <strong>in attesa di conferma</strong>: il nostro team sta verificando le nuove date e vi invierà una conferma al più presto.",
      title: "Modifica",
      oldDates: "Date precedenti",
      newDates: "Nuove date",
      newTotal: "Nuovo totale stimato",
    },
  },
};

/** Localized display name: the guest sees the camp's own translated names. */
function localizedName(row: NamedRow | null | undefined, lang: ReservationLang): string {
  if (!row) return "—";
  if (lang === "en" && row.nameEn) return row.nameEn;
  if (lang === "es" && row.nameEs) return row.nameEs;
  if (lang === "it" && row.nameIt) return row.nameIt;
  return row.name;
}

function getServiceName(booking: BookingWithRelations, lang: ReservationLang = "fr"): string {
  const base =
    booking.serviceType === "suite" ? localizedName(booking.suite, lang) :
    booking.serviceType === "activity" ? localizedName(booking.activity, lang) :
    booking.serviceType === "daypass" ? localizedName(booking.dayPass, lang) : "—";
  return booking.quantity && booking.quantity > 1 ? `${base} × ${booking.quantity}` : base;
}

function getServiceTypeLabel(serviceType: string, lang: ReservationLang = "fr"): string {
  const t = BOOKING_I18N[lang].item;
  if (serviceType === "suite") return t.accommodation;
  if (serviceType === "activity") return t.activity;
  if (serviceType === "daypass") return t.daypass;
  return serviceType;
}

function formatDate(d: Date, lang: ReservationLang = "fr"): string {
  return d.toLocaleDateString(LANG_LOCALE[lang], { day: "2-digit", month: "long", year: "numeric" });
}

function formatMoney(amount: number, lang: ReservationLang = "fr"): string {
  return amount.toLocaleString(LANG_LOCALE[lang]);
}

/** Footer line shared by the client-facing booking emails. */
function bookingFooter(lang: ReservationLang): string {
  return `
        <div style="background:#f5f0e8;padding:20px 32px;text-align:center">
          <p style="color:#999;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0">Agafay · Marrakech · ${BOOKING_I18N[lang].country}</p>
        </div>`;
}

function buildDateRows(booking: BookingWithRelations, lang: ReservationLang = "fr"): string {
  const t = BOOKING_I18N[lang].item;
  if (booking.serviceType === "suite" && booking.checkIn && booking.checkOut) {
    const nights = Math.max(1, Math.round((booking.checkOut.getTime() - booking.checkIn.getTime()) / 86_400_000));
    return `
      <tr><td style="padding:6px 0;color:#888;width:120px">${t.arrival}</td><td style="padding:6px 0">${formatDate(booking.checkIn, lang)}</td></tr>
      <tr><td style="padding:6px 0;color:#888">${t.departure}</td><td style="padding:6px 0">${formatDate(booking.checkOut, lang)}</td></tr>
      <tr><td style="padding:6px 0;color:#888">${t.duration}</td><td style="padding:6px 0">${nights} ${nights > 1 ? t.nights : t.night}</td></tr>
    `;
  }
  if (booking.date) {
    return `<tr><td style="padding:6px 0;color:#888;width:120px">${t.date}</td><td style="padding:6px 0">${formatDate(booking.date, lang)}</td></tr>`;
  }
  return "";
}

function buildItemBlock(booking: BookingWithRelations, index: number, lang: ReservationLang = "fr"): string {
  const t = BOOKING_I18N[lang].item;
  const serviceName = getServiceName(booking, lang);
  const serviceLabel = getServiceTypeLabel(booking.serviceType, lang);
  return `
    <div style="${index > 0 ? "border-top:1px solid #e8dfc8;margin-top:16px;padding-top:16px" : ""}">
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="padding:6px 0;color:#888;width:120px">${serviceLabel}</td><td style="padding:6px 0;font-weight:600">${serviceName}</td></tr>
        ${buildDateRows(booking, lang)}
        <tr><td style="padding:6px 0;color:#888">${t.adults}</td><td style="padding:6px 0">${booking.guests}</td></tr>
        ${booking.children > 0 ? `<tr><td style="padding:6px 0;color:#888">${t.children}</td><td style="padding:6px 0">${booking.children}</td></tr>` : ""}
        <tr><td style="padding:6px 0;color:#888">${t.subtotal}</td><td style="padding:6px 0;font-weight:600">${formatMoney(booking.totalAmount, lang)} ${booking.currency}</td></tr>
      </table>
      ${booking.experiences ? `<p style="color:#888;font-size:12px;margin:8px 0 2px">${t.experiences}</p><p style="font-size:13px;margin:0">${booking.experiences}</p>` : ""}
    </div>
  `;
}

export async function sendReservationConfirmation(
  to: string,
  firstName: string,
  items: BookingWithRelations[],
  totalAmount: number,
  currency: string,
  manageUrl: string,
  lang: ReservationLang = "fr",
) {
  const t = BOOKING_I18N[lang];
  await resend.emails.send({
    from: FROM,
    to,
    subject: items.length > 1 ? t.received.subjectMany(items.length) : t.received.subjectOne(getServiceName(items[0], lang)),
    html: `
      <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#1a1a1a">
        <div style="background:#0f0f0f;padding:32px;text-align:center">
          <p style="color:#c8922a;letter-spacing:4px;font-size:11px;text-transform:uppercase;margin:0">Arabian Desert Home</p>
        </div>
        <div style="padding:40px 32px">
          <h1 style="font-size:24px;font-weight:400;margin:0 0 8px">${t.hello(firstName)}</h1>
          <p style="color:#555;line-height:1.7;margin:0 0 32px">${t.received.intro}</p>
          <div style="background:#faf8f5;border:1px solid #e8dfc8;border-radius:8px;padding:24px;margin:0 0 24px">
            <p style="color:#c8922a;letter-spacing:3px;font-size:10px;text-transform:uppercase;margin:0 0 16px">${t.received.title}</p>
            ${items.map((item, i) => buildItemBlock(item, i, lang)).join("")}
            <table style="width:100%;border-collapse:collapse;font-size:14px">
              <tr style="border-top:1px solid #e8dfc8"><td style="padding:12px 0 0;color:#888;font-weight:600">${t.received.total}</td><td style="padding:12px 0 0;font-weight:700;font-size:16px;color:#c8922a;text-align:right">${formatMoney(totalAmount, lang)} ${currency}</td></tr>
            </table>
          </div>
          ${manageButton(manageUrl, "#c8922a", lang)}
          <p style="color:#555;line-height:1.7;margin:0 0 8px">${t.questions}</p>
          <p style="margin:0;color:#333;font-size:14px">📞 +212 667-370-206 &nbsp;·&nbsp; 📧 info@arabiandeserthome.ma</p>
        </div>${bookingFooter(lang)}
      </div>
    `,
  });
}

export async function sendReservationConfirmedEmail(
  to: string,
  firstName: string,
  items: BookingWithRelations[],
  totalAmount: number,
  currency: string,
  pdfBuffer: Buffer,
  manageUrl: string | null,
  lang: ReservationLang = "fr",
) {
  const t = BOOKING_I18N[lang];
  await resend.emails.send({
    from: FROM,
    to,
    subject: t.confirmed.subject,
    html: `
      <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#1a1a1a">
        <div style="background:#1e6b3f;padding:32px;text-align:center">
          <div style="width:48px;height:48px;border-radius:50%;background:rgba(255,255,255,0.15);margin:0 auto 12px;text-align:center;font-size:0">
            <span style="color:#fff;font-size:24px;line-height:48px">✓</span>
          </div>
          <p style="color:#fff;font-size:18px;font-weight:600;margin:0 0 4px">${t.confirmed.banner}</p>
          <p style="color:rgba(255,255,255,0.75);letter-spacing:3px;font-size:10px;text-transform:uppercase;margin:0">Arabian Desert Home</p>
        </div>
        <div style="padding:40px 32px">
          <h1 style="font-size:24px;font-weight:400;margin:0 0 8px">${t.hello(firstName)}</h1>
          <p style="color:#555;line-height:1.7;margin:0 0 24px">${t.confirmed.intro}</p>
          <div style="background:#f4faf6;border:1px solid #cde8d6;border-radius:8px;padding:24px;margin:0 0 24px">
            <p style="color:#1e6b3f;letter-spacing:3px;font-size:10px;text-transform:uppercase;margin:0 0 16px">${t.confirmed.recap}</p>
            ${items.map((item, i) => buildItemBlock(item, i, lang)).join("")}
            <table style="width:100%;border-collapse:collapse;font-size:14px">
              <tr style="border-top:1px solid #cde8d6"><td style="padding:12px 0 0;color:#888;font-weight:600">${t.confirmed.total}</td><td style="padding:12px 0 0;font-weight:700;font-size:16px;color:#1e6b3f;text-align:right">${formatMoney(totalAmount, lang)} ${currency}</td></tr>
            </table>
          </div>
          ${manageUrl ? manageButton(manageUrl, "#1e6b3f", lang) : ""}
          <p style="color:#555;line-height:1.7;margin:0 0 8px">${t.questions}</p>
          <p style="margin:0;color:#333;font-size:14px">📞 +212 667-370-206 &nbsp;·&nbsp; 📧 info@arabiandeserthome.ma</p>
        </div>${bookingFooter(lang)}
      </div>
    `,
    attachments: [
      {
        filename: t.confirmed.attachment,
        content: pdfBuffer,
      },
    ],
  });
}

export async function sendReservationCancelledByAdminEmail(
  to: string,
  firstName: string,
  items: BookingWithRelations[],
  currency: string,
  lang: ReservationLang = "fr",
) {
  const t = BOOKING_I18N[lang];
  await resend.emails.send({
    from: FROM,
    to,
    subject: t.cancelled.subject,
    html: `
      <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#1a1a1a">
        <div style="background:#7a3b3b;padding:32px;text-align:center">
          <div style="width:48px;height:48px;border-radius:50%;background:rgba(255,255,255,0.15);margin:0 auto 12px;text-align:center;font-size:0">
            <span style="color:#fff;font-size:22px;line-height:48px">✕</span>
          </div>
          <p style="color:#fff;font-size:18px;font-weight:600;margin:0 0 4px">${t.cancelled.banner}</p>
          <p style="color:rgba(255,255,255,0.75);letter-spacing:3px;font-size:10px;text-transform:uppercase;margin:0">Arabian Desert Home</p>
        </div>
        <div style="padding:40px 32px">
          <h1 style="font-size:24px;font-weight:400;margin:0 0 8px">${t.hello(firstName)}</h1>
          <p style="color:#555;line-height:1.7;margin:0 0 24px">${t.cancelled.intro}</p>
          <div style="background:#faf5f5;border:1px solid #e8d0d0;border-radius:8px;padding:24px;margin:0 0 24px">
            <p style="color:#7a3b3b;letter-spacing:3px;font-size:10px;text-transform:uppercase;margin:0 0 16px">${t.cancelled.title}</p>
            ${items.map((item, i) => buildItemBlock(item, i, lang)).join("")}
          </div>
          <p style="color:#555;line-height:1.7;margin:0 0 8px">${t.questions}</p>
          <p style="margin:0;color:#333;font-size:14px">📞 +212 667-370-206 &nbsp;·&nbsp; 📧 info@arabiandeserthome.ma</p>
        </div>${bookingFooter(lang)}
      </div>
    `,
  });
}

export async function sendClientCancellationNotification(
  contact: { firstName: string; lastName: string; email: string; phone?: string | null },
  cancelledItems: BookingWithRelations[],
  allCancelled: boolean,
) {
  const adminEmail = await getAdminEmail();
  await resend.emails.send({
    from: FROM,
    to: adminEmail,
    subject: allCancelled
      ? `[Annulation] ${contact.firstName} ${contact.lastName} a annulé sa réservation`
      : `[Annulation partielle] ${contact.firstName} ${contact.lastName} — ${cancelledItems.length} prestation${cancelledItems.length > 1 ? "s" : ""} annulée${cancelledItems.length > 1 ? "s" : ""}`,
    html: `
      <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#1a1a1a">
        <div style="background:#7a3b3b;padding:24px 32px">
          <p style="color:#fff;letter-spacing:2px;font-size:12px;text-transform:uppercase;margin:0">${allCancelled ? "Réservation annulée par le client" : "Annulation partielle par le client"}</p>
        </div>
        <div style="padding:32px">
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:7px 0;color:#888;width:120px">Client</td><td style="padding:7px 0;font-weight:600">${contact.firstName} ${contact.lastName}</td></tr>
            <tr><td style="padding:7px 0;color:#888">Email</td><td style="padding:7px 0"><a href="mailto:${contact.email}" style="color:#c8922a">${contact.email}</a></td></tr>
            ${contact.phone ? `<tr><td style="padding:7px 0;color:#888">Téléphone</td><td style="padding:7px 0">${contact.phone}</td></tr>` : ""}
          </table>
          <hr style="border:none;border-top:1px solid #eee;margin:16px 0"/>
          <p style="color:#7a3b3b;letter-spacing:2px;font-size:11px;text-transform:uppercase;margin:0 0 12px">
            ${allCancelled ? "Toutes les prestations ont été annulées" : "Prestations annulées"}
          </p>
          ${cancelledItems.map((item, i) => buildItemBlock(item, i)).join("")}
          ${!allCancelled ? `<p style="color:#888;font-size:12px;margin:16px 0 0">Le reste de la réservation n'est pas affecté. Ouvrez la fiche dans le panneau d'administration pour retirer la prestation annulée si besoin.</p>` : ""}
        </div>
      </div>
    `,
  });
}

function buildDateChangeRow(
  before: { checkIn?: Date | null; checkOut?: Date | null; date?: Date | null },
  after: BookingWithRelations,
  lang: ReservationLang = "fr",
): string {
  // Admin-facing callers keep the French labels; the guest email passes the guest's language.
  const labels = lang === "fr"
    ? { old: "Anciennes dates", neu: "Nouvelles dates", sub: "Sous-total" }
    : { old: BOOKING_I18N[lang].modified.oldDates, neu: BOOKING_I18N[lang].modified.newDates, sub: BOOKING_I18N[lang].item.subtotal };
  const fmt = (b: { checkIn?: Date | null; checkOut?: Date | null; date?: Date | null }) =>
    b.checkIn && b.checkOut ? `${formatDate(b.checkIn, lang)} → ${formatDate(b.checkOut, lang)}` : b.date ? formatDate(b.date, lang) : "—";
  return `
    <p style="font-weight:600;margin:0 0 6px">${getServiceName(after, lang)}</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      <tr><td style="padding:4px 0;color:#888;width:120px">${labels.old}</td><td style="padding:4px 0;text-decoration:line-through;color:#999">${fmt(before)}</td></tr>
      <tr><td style="padding:4px 0;color:#888">${labels.neu}</td><td style="padding:4px 0;font-weight:600">${fmt(after)}</td></tr>
      <tr><td style="padding:4px 0;color:#888">${labels.sub}</td><td style="padding:4px 0">${formatMoney(after.totalAmount, lang)} ${after.currency}</td></tr>
    </table>
  `;
}

/** To the guest, after they change their dates from the manage page. */
export async function sendReservationModifiedEmail(
  to: string,
  firstName: string,
  before: { checkIn?: Date | null; checkOut?: Date | null; date?: Date | null },
  modified: BookingWithRelations,
  totalAmount: number,
  currency: string,
  manageUrl: string,
  lang: ReservationLang = "fr",
) {
  const t = BOOKING_I18N[lang];
  await resend.emails.send({
    from: FROM,
    to,
    subject: t.modified.subject,
    html: `
      <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#1a1a1a">
        <div style="background:#0f0f0f;padding:32px;text-align:center">
          <p style="color:#c8922a;letter-spacing:4px;font-size:11px;text-transform:uppercase;margin:0">Arabian Desert Home</p>
        </div>
        <div style="padding:40px 32px">
          <h1 style="font-size:24px;font-weight:400;margin:0 0 8px">${t.hello(firstName)}</h1>
          <p style="color:#555;line-height:1.7;margin:0 0 24px">${t.modified.intro}</p>
          <div style="background:#faf8f5;border:1px solid #e8dfc8;border-radius:8px;padding:24px;margin:0 0 24px">
            <p style="color:#c8922a;letter-spacing:3px;font-size:10px;text-transform:uppercase;margin:0 0 16px">${t.modified.title}</p>
            ${buildDateChangeRow(before, modified, lang)}
            <table style="width:100%;border-collapse:collapse;font-size:14px;margin-top:12px">
              <tr style="border-top:1px solid #e8dfc8"><td style="padding:12px 0 0;color:#888;font-weight:600">${t.modified.newTotal}</td><td style="padding:12px 0 0;font-weight:700;font-size:16px;color:#c8922a;text-align:right">${formatMoney(totalAmount, lang)} ${currency}</td></tr>
            </table>
          </div>
          ${manageButton(manageUrl, "#c8922a", lang)}
          <p style="color:#555;line-height:1.7;margin:0 0 8px">${t.questions}</p>
          <p style="margin:0;color:#333;font-size:14px">📞 +212 667-370-206 &nbsp;·&nbsp; 📧 info@arabiandeserthome.ma</p>
        </div>${bookingFooter(lang)}
      </div>
    `,
  });
}

/** To the admin: a guest changed dates, so the reservation is back to pending review. */
export async function sendClientModificationNotification(
  contact: { firstName: string; lastName: string; email: string; phone?: string | null },
  before: { checkIn?: Date | null; checkOut?: Date | null; date?: Date | null },
  modified: BookingWithRelations,
) {
  const adminEmail = await getAdminEmail();
  await resend.emails.send({
    from: FROM,
    to: adminEmail,
    subject: `[Modification] ${contact.firstName} ${contact.lastName} a changé ses dates — à reconfirmer`,
    html: `
      <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#1a1a1a">
        <div style="background:#8a6414;padding:24px 32px">
          <p style="color:#fff;letter-spacing:2px;font-size:12px;text-transform:uppercase;margin:0">Modification par le client — réservation en attente</p>
        </div>
        <div style="padding:32px">
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:7px 0;color:#888;width:120px">Client</td><td style="padding:7px 0;font-weight:600">${contact.firstName} ${contact.lastName}</td></tr>
            <tr><td style="padding:7px 0;color:#888">Email</td><td style="padding:7px 0"><a href="mailto:${contact.email}" style="color:#c8922a">${contact.email}</a></td></tr>
            ${contact.phone ? `<tr><td style="padding:7px 0;color:#888">Téléphone</td><td style="padding:7px 0">${contact.phone}</td></tr>` : ""}
          </table>
          <hr style="border:none;border-top:1px solid #eee;margin:16px 0"/>
          ${buildDateChangeRow(before, modified)}
          <p style="color:#888;font-size:12px;margin:16px 0 0">La réservation est repassée en « pending ». Vérifiez les nouvelles dates puis confirmez-la depuis le panneau d'administration.</p>
        </div>
      </div>
    `,
  });
}

// ── Devis emails ────────────────────────────────────────────────────────────

export type DevisEmailLang = "fr" | "en" | "es";

/** The client's private link to read and answer a quote — the token in it is the only auth. */
export function devisUrl(accessToken: string): string {
  return `${SITE_URL}/devis/${accessToken}`;
}

const DEVIS_I18N: Record<DevisEmailLang, {
  subject: (ref: string) => string;
  hello: (name: string) => string;
  intro: string;
  totalLabel: string;
  validLabel: string;
  cta: string;
  ctaHint: string;
  questions: string;
  dateLocale: string;
}> = {
  fr: {
    subject: (ref) => `Votre devis ${ref} — Arabian Desert Home`,
    hello: (name) => `Bonjour ${name},`,
    intro: "Veuillez trouver ci-joint le devis que vous avez demandé. Vous pouvez l'accepter ou le refuser en un clic depuis le lien ci-dessous.",
    totalLabel: "Montant total",
    validLabel: "Valable jusqu'au",
    cta: "Voir et répondre au devis",
    ctaHint: "Ce lien vous est personnel, ne le partagez pas.",
    questions: "Des questions ? Contactez-nous :",
    dateLocale: "fr-FR",
  },
  en: {
    subject: (ref) => `Your quotation ${ref} — Arabian Desert Home`,
    hello: (name) => `Hello ${name},`,
    intro: "Please find attached the quotation you requested. You can accept or decline it in one click from the link below.",
    totalLabel: "Total amount",
    validLabel: "Valid until",
    cta: "View and answer the quotation",
    ctaHint: "This link is personal to you, please do not share it.",
    questions: "Any questions? Contact us:",
    dateLocale: "en-US",
  },
  es: {
    subject: (ref) => `Su presupuesto ${ref} — Arabian Desert Home`,
    hello: (name) => `Hola ${name},`,
    intro: "Adjuntamos el presupuesto que ha solicitado. Puede aceptarlo o rechazarlo con un clic desde el enlace siguiente.",
    totalLabel: "Importe total",
    validLabel: "Válido hasta",
    cta: "Ver y responder al presupuesto",
    ctaHint: "Este enlace es personal, no lo comparta.",
    questions: "¿Preguntas? Contáctenos:",
    dateLocale: "es-ES",
  },
};

/** Sends the quote to the client with its PDF attached and the private answer link. */
export async function sendDevisToClient(
  to: string,
  firstName: string,
  reference: string,
  totalAmount: number,
  currency: string,
  validUntil: Date,
  link: string,
  pdfBuffer: Buffer,
  lang: DevisEmailLang = "fr",
) {
  const t = DEVIS_I18N[lang];
  await resend.emails.send({
    from: FROM,
    to,
    subject: t.subject(reference),
    html: `
      <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#1a1a1a">
        <div style="background:#0f0f0f;padding:32px;text-align:center">
          <p style="color:#c8922a;letter-spacing:4px;font-size:11px;text-transform:uppercase;margin:0">Arabian Desert Home</p>
        </div>
        <div style="padding:40px 32px">
          <h1 style="font-size:24px;font-weight:400;margin:0 0 8px">${t.hello(firstName)}</h1>
          <p style="color:#555;line-height:1.7;margin:0 0 28px">${t.intro}</p>
          <div style="background:#faf8f5;border:1px solid #e8dfc8;border-radius:8px;padding:24px;margin:0 0 24px">
            <table style="width:100%;border-collapse:collapse;font-size:14px">
              <tr><td style="padding:6px 0;color:#888;width:140px">${reference}</td><td style="padding:6px 0"></td></tr>
              <tr><td style="padding:6px 0;color:#888">${t.validLabel}</td><td style="padding:6px 0;font-weight:600">${validUntil.toLocaleDateString(t.dateLocale, { day: "2-digit", month: "long", year: "numeric" })}</td></tr>
              <tr style="border-top:1px solid #e8dfc8"><td style="padding:12px 0 0;color:#888;font-weight:600">${t.totalLabel}</td><td style="padding:12px 0 0;font-weight:700;font-size:16px;color:#c8922a;text-align:right">${totalAmount.toLocaleString(t.dateLocale)} ${currency}</td></tr>
            </table>
          </div>
          <p style="text-align:center;margin:0 0 12px">
            <a href="${link}" style="display:inline-block;background:#c8922a;color:#fff;text-decoration:none;padding:12px 28px;border-radius:6px;font-size:14px;font-weight:600">${t.cta}</a>
          </p>
          <p style="text-align:center;color:#999;font-size:12px;line-height:1.6;margin:0 0 32px">${t.ctaHint}</p>
          <p style="color:#555;line-height:1.7;margin:0 0 8px">${t.questions}</p>
          <p style="margin:0;color:#333;font-size:14px">📞 +212 667-370-206 &nbsp;·&nbsp; 📧 info@arabiandeserthome.ma</p>
        </div>
        <div style="background:#f5f0e8;padding:20px 32px;text-align:center">
          <p style="color:#999;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0">Agafay · Marrakech · Maroc</p>
        </div>
      </div>
    `,
    attachments: [{ filename: `${reference}.pdf`, content: pdfBuffer }],
  });
}

/** Tells the admin that the client accepted or refused a quote from their private link. */
export async function sendDevisAnsweredNotification(
  reference: string,
  clientName: string,
  answer: "accepted" | "refused",
  totalAmount: number,
  currency: string,
  clientMessage?: string | null,
) {
  const adminEmail = await getAdminEmail();
  const accepted = answer === "accepted";
  await resend.emails.send({
    from: FROM,
    to: adminEmail,
    subject: accepted
      ? `[Devis accepté] ${reference} — ${clientName}`
      : `[Devis refusé] ${reference} — ${clientName}`,
    html: `
      <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#1a1a1a">
        <div style="background:${accepted ? "#1e6b3f" : "#7a3b3b"};padding:24px 32px">
          <p style="color:#fff;letter-spacing:2px;font-size:12px;text-transform:uppercase;margin:0">
            ${accepted ? "Devis accepté par le client" : "Devis refusé par le client"}
          </p>
        </div>
        <div style="padding:32px">
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:7px 0;color:#888;width:120px">Référence</td><td style="padding:7px 0;font-weight:600">${reference}</td></tr>
            <tr><td style="padding:7px 0;color:#888">Client</td><td style="padding:7px 0;font-weight:600">${clientName}</td></tr>
            <tr><td style="padding:7px 0;color:#888">Montant</td><td style="padding:7px 0;font-weight:700;color:#c8922a">${totalAmount.toLocaleString("fr-FR")} ${currency}</td></tr>
          </table>
          ${clientMessage ? `<p style="color:#888;font-size:12px;margin:16px 0 4px">Message du client</p><p style="font-size:14px;margin:0;white-space:pre-wrap">${clientMessage}</p>` : ""}
          <p style="color:#888;font-size:12px;margin:20px 0 0">
            ${accepted
              ? "Ouvrez le devis dans le panneau d'administration puis cliquez sur « Convertir en réservation »."
              : "Le devis reste dans la liste avec le statut « Refusé »."}
          </p>
        </div>
      </div>
    `,
  });
}

export async function sendReservationNotification(
  items: BookingWithRelations[],
  totalAmount: number,
  currency: string,
  specialReqs?: string | null,
  guestLang?: ReservationLang,
) {
  const adminEmail = await getAdminEmail();
  const first = items[0];

  await resend.emails.send({
    from: FROM,
    to: adminEmail,
    subject: `[Réservation] ${first.firstName} ${first.lastName} — ${items.length > 1 ? `${items.length} prestations` : getServiceName(first)}`,
    html: `
      <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#1a1a1a">
        <div style="background:#0f0f0f;padding:24px 32px">
          <p style="color:#c8922a;letter-spacing:4px;font-size:11px;text-transform:uppercase;margin:0">Nouvelle demande de réservation</p>
        </div>
        <div style="padding:32px">
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:7px 0;color:#888;width:120px">Client</td><td style="padding:7px 0;font-weight:600">${first.firstName} ${first.lastName}</td></tr>
            <tr><td style="padding:7px 0;color:#888">Email</td><td style="padding:7px 0"><a href="mailto:${first.email}" style="color:#c8922a">${first.email}</a></td></tr>
            <tr><td style="padding:7px 0;color:#888">Téléphone</td><td style="padding:7px 0">${first.phone ?? "—"}</td></tr>
            ${guestLang ? `<tr><td style="padding:7px 0;color:#888">Langue</td><td style="padding:7px 0">${RESERVATION_LANG_LABEL[guestLang]} — les emails et la fiche partiront dans cette langue</td></tr>` : ""}
          </table>
          <hr style="border:none;border-top:1px solid #eee;margin:16px 0"/>
          ${items.map((item, i) => buildItemBlock(item, i)).join("")}
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr style="border-top:1px solid #e8dfc8"><td style="padding:12px 0 0;color:#888;font-weight:600">Total</td><td style="padding:12px 0 0;font-weight:700;color:#c8922a;text-align:right">${totalAmount.toLocaleString("fr-FR")} ${currency}</td></tr>
          </table>
          ${specialReqs ? `<p style="color:#888;font-size:12px;margin:16px 0 4px">Demandes spéciales</p><p style="font-size:14px;margin:0">${specialReqs}</p>` : ""}
        </div>
      </div>
    `,
  });
}
