import { escapeHtml, getLogoDataUri } from "@/lib/fiche-pdf";

export type DevisLang = "fr" | "en" | "es";

export interface DevisPdfItem {
  kind: string;
  serviceType: string;
  label: string;
  description?: string | null;
  checkIn?: Date | null;
  checkOut?: Date | null;
  date?: Date | null;
  quantity: number;
  guests: number;
  children: number;
  totalAmount: number;
}

export interface DevisPdfOptions {
  reference: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string | null;
  title?: string | null;
  conditions?: string | null;
  items: DevisPdfItem[];
  totalAmount: number;
  currency: string;
  createdAt: Date;
  validUntil: Date;
  lang?: DevisLang;
  devisUrl?: string | null;
}

/** Shape of a Devis row loaded with its items — kept structural so routes can pass Prisma results. */
export interface DevisRecord {
  reference: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string | null;
  title: string | null;
  conditions: string | null;
  lang: string;
  currency: string;
  totalAmount: number;
  createdAt: Date;
  validUntil: Date;
  items: DevisPdfItem[];
}

export function devisRecordToPdfOptions(devis: DevisRecord, link: string | null, lang?: DevisLang): DevisPdfOptions {
  return {
    reference: devis.reference,
    firstName: devis.firstName,
    lastName: devis.lastName,
    email: devis.email,
    phone: devis.phone,
    company: devis.company,
    title: devis.title,
    conditions: devis.conditions,
    items: devis.items,
    totalAmount: devis.totalAmount,
    currency: devis.currency,
    createdAt: devis.createdAt,
    validUntil: devis.validUntil,
    lang: lang ?? (["fr", "en", "es"].includes(devis.lang) ? (devis.lang as DevisLang) : "fr"),
    devisUrl: link,
  };
}

const DATE_LOCALE: Record<DevisLang, string> = { fr: "fr-FR", en: "en-US", es: "es-ES" };

const I18N = {
  fr: {
    docTitle: "Devis",
    docSubtitle: "Proposition commerciale",
    ref: "Réf.",
    issuedOn: "Émis le",
    validUntil: "Valable jusqu'au",
    client: "Client",
    phone: "Téléphone",
    email: "Email",
    company: "Société",
    designation: "Désignation",
    dates: "Dates",
    people: "Pers.",
    qty: "Qté",
    amount: "Montant",
    total: "Total",
    nights: (n: number) => `${n} nuit${n > 1 ? "s" : ""}`,
    adults: "adultes",
    children: "enfants",
    conditions: "Conditions",
    respondPrompt: "Pour accepter ou refuser ce devis :",
    footer: "Ce devis ne constitue pas une réservation tant qu'il n'a pas été accepté et confirmé par nos équipes.",
    serviceLabel: { suite: "Hébergement", activity: "Activité", daypass: "Day Pass", custom: "Prestation" } as Record<string, string>,
  },
  en: {
    docTitle: "Quotation",
    docSubtitle: "Commercial proposal",
    ref: "Ref.",
    issuedOn: "Issued on",
    validUntil: "Valid until",
    client: "Client",
    phone: "Phone",
    email: "Email",
    company: "Company",
    designation: "Description",
    dates: "Dates",
    people: "Guests",
    qty: "Qty",
    amount: "Amount",
    total: "Total",
    nights: (n: number) => `${n} night${n > 1 ? "s" : ""}`,
    adults: "adults",
    children: "children",
    conditions: "Terms",
    respondPrompt: "To accept or decline this quotation:",
    footer: "This quotation is not a reservation until it has been accepted and confirmed by our team.",
    serviceLabel: { suite: "Accommodation", activity: "Activity", daypass: "Day Pass", custom: "Service" } as Record<string, string>,
  },
  es: {
    docTitle: "Presupuesto",
    docSubtitle: "Propuesta comercial",
    ref: "Ref.",
    issuedOn: "Emitido el",
    validUntil: "Válido hasta",
    client: "Cliente",
    phone: "Teléfono",
    email: "Email",
    company: "Empresa",
    designation: "Descripción",
    dates: "Fechas",
    people: "Pers.",
    qty: "Cant.",
    amount: "Importe",
    total: "Total",
    nights: (n: number) => `${n} noche${n > 1 ? "s" : ""}`,
    adults: "adultos",
    children: "niños",
    conditions: "Condiciones",
    respondPrompt: "Para aceptar o rechazar este presupuesto:",
    footer: "Este presupuesto no constituye una reserva hasta que haya sido aceptado y confirmado por nuestro equipo.",
    serviceLabel: { suite: "Alojamiento", activity: "Actividad", daypass: "Day Pass", custom: "Servicio" } as Record<string, string>,
  },
};

function fmtDate(d: Date, lang: DevisLang): string {
  return d.toLocaleDateString(DATE_LOCALE[lang], { day: "2-digit", month: "long", year: "numeric" });
}

function fmtMoney(amount: number, currency: string, lang: DevisLang): string {
  return `${amount.toLocaleString(DATE_LOCALE[lang])} ${currency}`;
}

function datesCell(item: DevisPdfItem, lang: DevisLang, t: (typeof I18N)["fr"]): string {
  if (item.checkIn && item.checkOut) {
    const nights = Math.max(1, Math.round((item.checkOut.getTime() - item.checkIn.getTime()) / 86_400_000));
    return `${fmtDate(item.checkIn, lang)}<br>${fmtDate(item.checkOut, lang)}<div class="sub">${t.nights(nights)}</div>`;
  }
  return item.date ? fmtDate(item.date, lang) : "—";
}

function peopleCell(item: DevisPdfItem, t: (typeof I18N)["fr"]): string {
  if (item.kind === "custom") return "—";
  const parts = [`${item.guests} ${t.adults}`];
  if (item.children > 0) parts.push(`${item.children} ${t.children}`);
  return parts.join("<br>");
}

export function buildDevisHtml(opts: DevisPdfOptions): string {
  const lang = opts.lang ?? "fr";
  const t = I18N[lang];

  const rows = opts.items
    .map((item) => {
      const kindLabel = item.kind === "custom" ? t.serviceLabel.custom : t.serviceLabel[item.serviceType] ?? item.serviceType;
      const negative = item.totalAmount < 0;
      return `
        <tr>
          <td>
            <div class="kind">${escapeHtml(kindLabel)}</div>
            <div class="label">${escapeHtml(item.label)}</div>
            ${item.description ? `<div class="sub">${escapeHtml(item.description)}</div>` : ""}
          </td>
          <td class="nowrap">${datesCell(item, lang, t)}</td>
          <td class="center">${peopleCell(item, t)}</td>
          <td class="center">${item.quantity}</td>
          <td class="amount${negative ? " negative" : ""}">${escapeHtml(fmtMoney(item.totalAmount, opts.currency, lang))}</td>
        </tr>`;
    })
    .join("");

  const clientName = `${opts.firstName} ${opts.lastName}`;

  return `<!doctype html>
<html lang="${lang}"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600&family=Josefin+Sans:wght@300;400;600;700&display=swap">
<style>
  @page { size: A4; margin: 14mm 12mm; }
  :root { --ink:#221c14; --soft:#5c5344; --label:#9c8e72; --gold:#b07f2c; --rule:#e3d6b2; --paper:#fbf7ee; }
  * { box-sizing:border-box; }
  body { margin:0; color:var(--ink); font-family:"Josefin Sans","Segoe UI",sans-serif; font-size:10pt; }
  header { display:flex; align-items:flex-start; justify-content:space-between; padding-bottom:12px; border-bottom:1.5px solid var(--gold); }
  header img { height:44px; }
  .doc-title { font-family:"Cinzel",serif; font-weight:600; font-size:22pt; letter-spacing:.1em; margin:0; text-align:right; }
  .doc-sub { color:var(--label); letter-spacing:.2em; text-transform:uppercase; font-size:7.5pt; text-align:right; margin:2px 0 0; }
  .meta { display:flex; gap:40px; margin:16px 0 22px; }
  .meta .block { flex:1; }
  .meta .block h2 { font-size:7.5pt; letter-spacing:.18em; text-transform:uppercase; color:var(--label); font-weight:600; margin:0 0 6px; }
  .meta .row { display:flex; gap:8px; font-size:9.5pt; line-height:1.6; }
  .meta .row span { color:var(--soft); min-width:88px; }
  .meta .row strong { font-weight:600; }
  .title-line { font-family:"Cinzel",serif; font-size:13pt; margin:0 0 14px; }
  table { width:100%; border-collapse:collapse; }
  thead { display:table-header-group; }
  th { text-align:left; font-size:7.5pt; letter-spacing:.14em; text-transform:uppercase; color:var(--label); font-weight:600; padding:8px 8px; background:var(--paper); border-top:1px solid var(--rule); border-bottom:1px solid var(--rule); white-space:nowrap; }
  td { padding:10px 8px; vertical-align:top; border-bottom:1px solid #f0e9d8; }
  tr { page-break-inside:avoid; }
  .kind { font-size:7pt; letter-spacing:.12em; text-transform:uppercase; color:var(--label); }
  .label { font-weight:600; }
  .sub { color:var(--soft); font-size:8.5pt; font-weight:300; }
  .nowrap { white-space:nowrap; }
  .center { text-align:center; }
  .amount { text-align:right; white-space:nowrap; font-weight:600; }
  .amount.negative { color:#a3423a; }
  .total { display:flex; justify-content:flex-end; align-items:baseline; gap:18px; margin-top:14px; padding-top:12px; border-top:1.5px solid var(--gold); }
  .total span { font-size:8pt; letter-spacing:.18em; text-transform:uppercase; color:var(--label); }
  .total strong { font-family:"Cinzel",serif; font-size:16pt; color:var(--gold); }
  .conditions { margin-top:26px; background:var(--paper); border:1px solid var(--rule); border-radius:6px; padding:14px 16px; }
  .conditions h2 { font-size:7.5pt; letter-spacing:.18em; text-transform:uppercase; color:var(--label); font-weight:600; margin:0 0 6px; }
  .conditions p { margin:0; white-space:pre-wrap; font-size:9pt; line-height:1.65; color:var(--soft); }
  .respond { margin-top:20px; text-align:center; font-size:9pt; color:var(--soft); }
  .respond a { color:var(--gold); word-break:break-all; }
  footer { margin-top:26px; padding-top:10px; border-top:1px solid var(--rule); text-align:center; color:var(--label); font-size:8pt; line-height:1.6; }
</style></head>
<body>
  <header>
    <img src="${getLogoDataUri()}" alt="Arabian Desert Home">
    <div>
      <h1 class="doc-title">${escapeHtml(t.docTitle)}</h1>
      <p class="doc-sub">${escapeHtml(t.docSubtitle)}</p>
    </div>
  </header>

  <div class="meta">
    <div class="block">
      <h2>${escapeHtml(t.client)}</h2>
      <div class="row"><strong>${escapeHtml(clientName)}</strong></div>
      ${opts.company ? `<div class="row"><span>${escapeHtml(t.company)}</span>${escapeHtml(opts.company)}</div>` : ""}
      <div class="row"><span>${escapeHtml(t.email)}</span>${escapeHtml(opts.email)}</div>
      <div class="row"><span>${escapeHtml(t.phone)}</span>${escapeHtml(opts.phone)}</div>
    </div>
    <div class="block">
      <h2>${escapeHtml(t.docTitle)}</h2>
      <div class="row"><span>${escapeHtml(t.ref)}</span><strong>${escapeHtml(opts.reference)}</strong></div>
      <div class="row"><span>${escapeHtml(t.issuedOn)}</span>${escapeHtml(fmtDate(opts.createdAt, lang))}</div>
      <div class="row"><span>${escapeHtml(t.validUntil)}</span><strong>${escapeHtml(fmtDate(opts.validUntil, lang))}</strong></div>
    </div>
  </div>

  ${opts.title ? `<p class="title-line">${escapeHtml(opts.title)}</p>` : ""}

  <table>
    <thead><tr>
      <th>${escapeHtml(t.designation)}</th>
      <th>${escapeHtml(t.dates)}</th>
      <th class="center">${escapeHtml(t.people)}</th>
      <th class="center">${escapeHtml(t.qty)}</th>
      <th style="text-align:right">${escapeHtml(t.amount)}</th>
    </tr></thead>
    <tbody>${rows}</tbody>
  </table>

  <div class="total">
    <span>${escapeHtml(t.total)}</span>
    <strong>${escapeHtml(fmtMoney(opts.totalAmount, opts.currency, lang))}</strong>
  </div>

  ${opts.conditions ? `<div class="conditions"><h2>${escapeHtml(t.conditions)}</h2><p>${escapeHtml(opts.conditions)}</p></div>` : ""}

  ${opts.devisUrl ? `<p class="respond">${escapeHtml(t.respondPrompt)}<br><a href="${escapeHtml(opts.devisUrl)}">${escapeHtml(opts.devisUrl)}</a></p>` : ""}

  <footer>
    ${escapeHtml(t.footer)}<br>
    Arabian Desert Home · Agafay · Marrakech · Maroc · +212 667-370-206 · info@arabiandeserthome.ma
  </footer>
</body></html>`;
}
