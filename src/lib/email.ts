import { Resend } from "resend";
import { db } from "@/lib/db";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "Arabian Desert Home <noreply@arabiandeserthome.ma>";

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
  suite?: { name: string } | null;
  activity?: { name: string } | null;
  dayPass?: { name: string } | null;
};

function getServiceName(booking: BookingWithRelations): string {
  const base =
    booking.serviceType === "suite" ? booking.suite?.name ?? "—" :
    booking.serviceType === "activity" ? booking.activity?.name ?? "—" :
    booking.serviceType === "daypass" ? booking.dayPass?.name ?? "—" : "—";
  return booking.quantity && booking.quantity > 1 ? `${base} × ${booking.quantity}` : base;
}

function getServiceTypeLabel(serviceType: string): string {
  if (serviceType === "suite") return "Hébergement";
  if (serviceType === "activity") return "Activité";
  if (serviceType === "daypass") return "Day Pass";
  return serviceType;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}

function buildDateRows(booking: BookingWithRelations): string {
  if (booking.serviceType === "suite" && booking.checkIn && booking.checkOut) {
    const nights = Math.max(1, Math.round((booking.checkOut.getTime() - booking.checkIn.getTime()) / 86_400_000));
    return `
      <tr><td style="padding:6px 0;color:#888;width:120px">Arrivée</td><td style="padding:6px 0">${formatDate(booking.checkIn)}</td></tr>
      <tr><td style="padding:6px 0;color:#888">Départ</td><td style="padding:6px 0">${formatDate(booking.checkOut)}</td></tr>
      <tr><td style="padding:6px 0;color:#888">Durée</td><td style="padding:6px 0">${nights} nuit${nights > 1 ? "s" : ""}</td></tr>
    `;
  }
  if (booking.date) {
    return `<tr><td style="padding:6px 0;color:#888;width:120px">Date</td><td style="padding:6px 0">${formatDate(booking.date)}</td></tr>`;
  }
  return "";
}

function buildItemBlock(booking: BookingWithRelations, index: number): string {
  const serviceName = getServiceName(booking);
  const serviceLabel = getServiceTypeLabel(booking.serviceType);
  return `
    <div style="${index > 0 ? "border-top:1px solid #e8dfc8;margin-top:16px;padding-top:16px" : ""}">
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="padding:6px 0;color:#888;width:120px">${serviceLabel}</td><td style="padding:6px 0;font-weight:600">${serviceName}</td></tr>
        ${buildDateRows(booking)}
        <tr><td style="padding:6px 0;color:#888">Adultes</td><td style="padding:6px 0">${booking.guests}</td></tr>
        ${booking.children > 0 ? `<tr><td style="padding:6px 0;color:#888">Enfants</td><td style="padding:6px 0">${booking.children}</td></tr>` : ""}
        <tr><td style="padding:6px 0;color:#888">Sous-total</td><td style="padding:6px 0;font-weight:600">${booking.totalAmount.toLocaleString("fr-FR")} ${booking.currency}</td></tr>
      </table>
      ${booking.experiences ? `<p style="color:#888;font-size:12px;margin:8px 0 2px">Expériences souhaitées</p><p style="font-size:13px;margin:0">${booking.experiences}</p>` : ""}
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
) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: items.length > 1
      ? `Confirmation de réservation — ${items.length} prestations`
      : `Confirmation de réservation — ${getServiceName(items[0])}`,
    html: `
      <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#1a1a1a">
        <div style="background:#0f0f0f;padding:32px;text-align:center">
          <p style="color:#c8922a;letter-spacing:4px;font-size:11px;text-transform:uppercase;margin:0">Arabian Desert Home</p>
        </div>
        <div style="padding:40px 32px">
          <h1 style="font-size:24px;font-weight:400;margin:0 0 8px">Bonjour ${firstName},</h1>
          <p style="color:#555;line-height:1.7;margin:0 0 32px">Votre demande de réservation a bien été reçue. Nous vous contacterons sous 24h pour confirmer les détails.</p>
          <div style="background:#faf8f5;border:1px solid #e8dfc8;border-radius:8px;padding:24px;margin:0 0 24px">
            <p style="color:#c8922a;letter-spacing:3px;font-size:10px;text-transform:uppercase;margin:0 0 16px">Détails de votre réservation</p>
            ${items.map((item, i) => buildItemBlock(item, i)).join("")}
            <table style="width:100%;border-collapse:collapse;font-size:14px">
              <tr style="border-top:1px solid #e8dfc8"><td style="padding:12px 0 0;color:#888;font-weight:600">Total estimé</td><td style="padding:12px 0 0;font-weight:700;font-size:16px;color:#c8922a;text-align:right">${totalAmount.toLocaleString("fr-FR")} ${currency}</td></tr>
            </table>
          </div>
          <p style="text-align:center;margin:0 0 32px">
            <a href="${manageUrl}" style="display:inline-block;background:#c8922a;color:#fff;text-decoration:none;padding:12px 28px;border-radius:6px;font-size:14px;font-weight:600">Gérer ma réservation</a>
          </p>
          <p style="color:#555;line-height:1.7;margin:0 0 8px">Des questions ? Contactez-nous :</p>
          <p style="margin:0;color:#333;font-size:14px">📞 +212 667-370-206 &nbsp;·&nbsp; 📧 info@arabiandeserthome.ma</p>
        </div>
        <div style="background:#f5f0e8;padding:20px 32px;text-align:center">
          <p style="color:#999;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0">Agafay · Marrakech · Maroc</p>
        </div>
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
) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: "Votre réservation est confirmée — Arabian Desert Home",
    html: `
      <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#1a1a1a">
        <div style="background:#0f0f0f;padding:32px;text-align:center">
          <p style="color:#c8922a;letter-spacing:4px;font-size:11px;text-transform:uppercase;margin:0">Arabian Desert Home</p>
        </div>
        <div style="padding:40px 32px">
          <h1 style="font-size:24px;font-weight:400;margin:0 0 8px">Bonjour ${firstName},</h1>
          <p style="color:#555;line-height:1.7;margin:0 0 24px">Bonne nouvelle : votre réservation est confirmée ! Vous trouverez votre fiche de réservation en pièce jointe — merci de la présenter à votre arrivée au campement.</p>
          <div style="background:#faf8f5;border:1px solid #e8dfc8;border-radius:8px;padding:24px;margin:0 0 24px">
            <p style="color:#c8922a;letter-spacing:3px;font-size:10px;text-transform:uppercase;margin:0 0 16px">Récapitulatif</p>
            ${items.map((item, i) => buildItemBlock(item, i)).join("")}
            <table style="width:100%;border-collapse:collapse;font-size:14px">
              <tr style="border-top:1px solid #e8dfc8"><td style="padding:12px 0 0;color:#888;font-weight:600">Tarif total</td><td style="padding:12px 0 0;font-weight:700;font-size:16px;color:#c8922a;text-align:right">${totalAmount.toLocaleString("fr-FR")} ${currency}</td></tr>
            </table>
          </div>
          <p style="color:#555;line-height:1.7;margin:0 0 8px">Des questions ? Contactez-nous :</p>
          <p style="margin:0;color:#333;font-size:14px">📞 +212 667-370-206 &nbsp;·&nbsp; 📧 info@arabiandeserthome.ma</p>
        </div>
        <div style="background:#f5f0e8;padding:20px 32px;text-align:center">
          <p style="color:#999;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0">Agafay · Marrakech · Maroc</p>
        </div>
      </div>
    `,
    attachments: [
      {
        filename: "Fiche-de-reservation.pdf",
        content: pdfBuffer,
      },
    ],
  });
}

export async function sendReservationNotification(
  items: BookingWithRelations[],
  totalAmount: number,
  currency: string,
  specialReqs?: string | null,
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
