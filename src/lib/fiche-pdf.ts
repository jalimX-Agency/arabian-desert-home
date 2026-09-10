import { readFileSync, existsSync } from "fs";
import path from "path";
import type { Booking, Suite, Activity, DayPass } from "@prisma/client";

export type FicheBooking = Booking & {
  suite?: Pick<Suite, "name"> | null;
  activity?: Pick<Activity, "name"> | null;
  dayPass?: Pick<DayPass, "name"> | null;
};

let cachedLogoDataUri: string | null = null;

function getLogoDataUri(): string {
  if (cachedLogoDataUri) return cachedLogoDataUri;
  const logoPath = path.join(process.cwd(), "src", "lib", "pdf-assets", "logo.png");
  const b64 = readFileSync(logoPath).toString("base64");
  cachedLogoDataUri = `data:image/png;base64,${b64}`;
  return cachedLogoDataUri;
}

function getServiceTypeLabel(serviceType: string): string {
  if (serviceType === "suite") return "Hébergement";
  if (serviceType === "activity") return "Activité";
  if (serviceType === "daypass") return "Day Pass";
  return serviceType;
}

function getServiceName(b: FicheBooking): string {
  const base =
    b.serviceType === "suite" ? b.suite?.name ?? "—" :
    b.serviceType === "activity" ? b.activity?.name ?? "—" :
    b.serviceType === "daypass" ? b.dayPass?.name ?? "—" : "—";
  return b.quantity > 1 ? `${base} × ${b.quantity}` : base;
}

function formatDateLong(d: Date): string {
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}

function formatDateShort(d: Date): string {
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "long" });
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** The overall stay window shown in the "Séjour" block — the accommodation dates when a
 *  tent is booked, or the earliest activity/day-pass date otherwise. */
function computeStayWindow(items: FicheBooking[]): {
  arrival?: Date; departure?: Date; nights?: number; singleDate?: Date;
} {
  const suiteItems = items.filter((i) => i.serviceType === "suite" && i.checkIn && i.checkOut);
  if (suiteItems.length > 0) {
    const arrival = new Date(Math.min(...suiteItems.map((i) => i.checkIn!.getTime())));
    const departure = new Date(Math.max(...suiteItems.map((i) => i.checkOut!.getTime())));
    const nights = Math.max(1, Math.round((departure.getTime() - arrival.getTime()) / 86_400_000));
    return { arrival, departure, nights };
  }
  const dated = items.filter((i) => i.date);
  if (dated.length > 0) {
    const singleDate = new Date(Math.min(...dated.map((i) => i.date!.getTime())));
    return { singleDate };
  }
  return {};
}

function buildPrestationRows(items: FicheBooking[]): string {
  return items
    .map((b) => {
      const dates =
        b.serviceType === "suite" && b.checkIn && b.checkOut
          ? `${formatDateShort(b.checkIn)} → ${formatDateShort(b.checkOut)}`
          : b.date
          ? formatDateLong(b.date)
          : "—";
      const sub =
        b.serviceType === "suite"
          ? `<span class="item-sub">${b.quantity > 1 ? `${b.quantity} tentes` : "1 tente"}</span>`
          : "";
      const pax = b.children > 0 ? `${b.guests} +${b.children}` : `${b.guests}`;
      return `
        <tr>
          <td>
            <span class="item-type">${escapeHtml(getServiceTypeLabel(b.serviceType))}</span>
            <span class="item-name">${escapeHtml(getServiceName(b))}</span>
            ${sub}
          </td>
          <td>${dates}</td>
          <td>${pax}</td>
          <td class="amount">${b.totalAmount.toLocaleString("fr-FR")} ${b.currency}</td>
        </tr>`;
    })
    .join("");
}

export interface FicheOptions {
  reservationRef: string;
  items: FicheBooking[];
  totalAmount: number;
  currency: string;
}

/** Builds the print-ready "Fiche de Réservation" HTML sent as a PDF once a reservation is confirmed. */
export function buildFicheHtml({ reservationRef, items, totalAmount, currency }: FicheOptions): string {
  const first = items[0];
  const stay = computeStayWindow(items);
  const paxTotal = items.reduce((max, i) => Math.max(max, i.guests), 0);
  const remarks = first.specialReqs?.trim() || "—";

  const sejourFields = stay.arrival && stay.departure
    ? `
      <div class="field"><label>Arrivée</label><div class="v">${formatDateLong(stay.arrival)}</div></div>
      <div class="field"><label>Départ</label><div class="v">${formatDateLong(stay.departure)}</div></div>
      <div class="field"><label>Durée</label><div class="v">${stay.nights} nuit${stay.nights! > 1 ? "s" : ""}</div></div>
      <div class="field"><label>Voyageurs</label><div class="v">${paxTotal} adulte${paxTotal > 1 ? "s" : ""}</div></div>`
    : stay.singleDate
    ? `
      <div class="field"><label>Date</label><div class="v">${formatDateLong(stay.singleDate)}</div></div>
      <div class="field"><label>Voyageurs</label><div class="v">${paxTotal} adulte${paxTotal > 1 ? "s" : ""}</div></div>`
    : `<div class="field"><label>Voyageurs</label><div class="v">${paxTotal} adulte${paxTotal > 1 ? "s" : ""}</div></div>`;

  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600&family=Josefin+Sans:wght@400;500;600;700&display=swap">
<style>
  :root{
    --paper:#fbf7ee;
    --paper-edge:#f2ead4;
    --ink:#221c14;
    --ink-soft:#5c5344;
    --label:#9c8e72;
    --gold:#b07f2c;
    --gold-deep:#8f6520;
    --gold-soft:#dcb977;
    --rule:#e3d6b2;
  }
  *{box-sizing:border-box;}
  @page{ size:A4; margin:0; }
  html,body{ margin:0; padding:0; }
  p{ margin:0; }
  body{
    background:var(--paper);
    color:var(--ink);
    font-family:"Josefin Sans", "Segoe UI", sans-serif;
  }
  .page{
    background:var(--paper);
    position:relative;
    width:210mm;
    min-height:1080px;
    padding:18px 60px 0;
  }
  .page::after{
    content:"";
    position:absolute; inset:14px;
    border:1px solid rgba(176,127,44,0.25);
    pointer-events:none;
  }
  .letterhead{
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:24px;
    padding-bottom:10px;
  }
  .brand-logo{ display:block; height:42px; width:auto; }
  .letterhead-contact{
    text-align:right;
    font-size:11.5px;
    color:var(--ink-soft);
    line-height:1.7;
  }
  .letterhead-contact span{ color:var(--label); letter-spacing:0.04em; }
  .gold-rule{
    height:2px;
    background:linear-gradient(90deg, transparent, var(--gold-soft) 12%, var(--gold) 50%, var(--gold-soft) 88%, transparent);
  }
  .title-row{
    display:flex;
    align-items:flex-end;
    justify-content:space-between;
    gap:24px;
    margin:24px 0 22px;
  }
  .doc-title{
    font-family:"Cinzel", serif;
    font-weight:600;
    font-size:26px;
    letter-spacing:0.09em;
    color:var(--ink);
  }
  .doc-title small{
    display:block;
    font-family:"Josefin Sans", sans-serif;
    font-weight:500;
    font-size:11px;
    letter-spacing:0.32em;
    text-transform:uppercase;
    color:var(--gold-deep);
    margin-bottom:8px;
  }
  .doc-meta{
    text-align:right;
    font-size:12px;
    color:var(--ink-soft);
    line-height:1.9;
    font-variant-numeric:tabular-nums;
    white-space:nowrap;
  }
  .doc-meta .k{
    color:var(--label);
    letter-spacing:0.08em;
    text-transform:uppercase;
    font-size:9.5px;
    margin-right:8px;
  }
  .section-label{
    font-size:10.5px;
    letter-spacing:0.26em;
    text-transform:uppercase;
    color:var(--gold-deep);
    margin:0 0 14px;
    display:flex;
    align-items:center;
    gap:10px;
  }
  .section-label::after{ content:""; flex:1; height:1px; background:var(--rule); }
  .info-grid{
    display:grid;
    grid-template-columns:repeat(4, 1fr);
    gap:20px 18px;
    margin-bottom:26px;
  }
  .info-grid.guest{ grid-template-columns:1.3fr 1fr 1fr; }
  .field label{
    display:block;
    font-size:9.5px;
    letter-spacing:0.14em;
    text-transform:uppercase;
    color:var(--label);
    margin-bottom:5px;
  }
  .field .v{
    font-size:14.5px;
    font-weight:500;
    color:var(--ink);
    font-variant-numeric:tabular-nums;
  }
  .field .v.big{ font-family:"Cinzel", serif; font-weight:600; font-size:16px; }
  table.prestations{ width:100%; border-collapse:collapse; margin-bottom:6px; }
  table.prestations thead th{
    text-align:left;
    font-size:9.5px;
    letter-spacing:0.14em;
    text-transform:uppercase;
    color:var(--label);
    font-weight:500;
    padding:0 10px 10px 0;
    border-bottom:1.5px solid var(--gold-soft);
  }
  table.prestations thead th:last-child{ text-align:right; padding-right:0; }
  table.prestations tbody td{
    padding:13px 10px 13px 0;
    border-bottom:1px solid var(--rule);
    font-size:13.5px;
    vertical-align:top;
  }
  table.prestations tbody td:last-child{ text-align:right; padding-right:0; font-variant-numeric:tabular-nums; }
  table.prestations tbody tr:last-child td{ border-bottom:1.5px solid var(--gold-soft); }
  .item-type{ font-size:9px; letter-spacing:0.1em; text-transform:uppercase; color:var(--gold-deep); display:block; margin-bottom:3px; }
  .item-name{ font-weight:600; color:var(--ink); }
  .item-sub{ display:block; color:var(--ink-soft); font-size:12px; margin-top:2px; }
  .amount{ font-weight:600; color:var(--ink); }
  .total-row{ display:flex; justify-content:flex-end; align-items:baseline; gap:16px; padding:12px 0 22px; }
  .total-row .lbl{ font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color:var(--ink-soft); }
  .total-row .val{ font-family:"Cinzel", serif; font-weight:600; font-size:22px; color:var(--gold-deep); font-variant-numeric:tabular-nums; }
  .two-col{ display:grid; grid-template-columns:1fr 1fr; gap:28px; padding:18px 0 20px; border-top:1px solid var(--rule); }
  .two-col .field .v{ font-size:13.5px; line-height:1.6; font-weight:400; }
  .confirm-strip{
    display:flex; align-items:center; justify-content:space-between; gap:20px;
    background:var(--paper-edge); border:1px solid var(--rule); border-radius:3px;
    padding:14px 20px; margin-bottom:22px;
  }
  .confirm-strip .txt{ font-size:12px; color:var(--ink-soft); line-height:1.6; }
  .confirm-strip .txt strong{ color:var(--ink); }
  .stamp{
    flex-shrink:0; font-family:"Cinzel", serif; font-size:10px; letter-spacing:0.12em; text-transform:uppercase;
    color:var(--gold-deep); border:1.5px solid var(--gold); border-radius:50%;
    width:70px; height:70px; display:flex; align-items:center; justify-content:center;
    text-align:center; line-height:1.4; transform:rotate(-8deg); padding:6px;
  }
  .page-footer{ text-align:center; padding:0 0 18px; font-size:10.5px; letter-spacing:0.2em; text-transform:uppercase; color:var(--label); }
  .page-footer .sep{ margin:0 10px; color:var(--gold-soft); }
  .fine-print{ text-align:center; font-size:10px; color:var(--label); padding-bottom:16px; }
</style>
</head>
<body>
  <div class="page">
    <div class="letterhead">
      <img class="brand-logo" src="${getLogoDataUri()}" alt="Arabian Desert Home">
      <div class="letterhead-contact">
        <span>Tél.</span> +212 667-370-206<br>
        <span>Email</span> info@arabiandeserthome.ma
      </div>
    </div>

    <div class="gold-rule"></div>

    <div class="title-row">
      <div class="doc-title">
        <small>Document de séjour</small>
        Fiche de Réservation
      </div>
      <div class="doc-meta">
        <div><span class="k">Réf.</span>${escapeHtml(reservationRef)}</div>
        <div><span class="k">Émise le</span>${formatDateLong(new Date())}</div>
      </div>
    </div>

    <p class="section-label">Client</p>
    <div class="info-grid guest">
      <div class="field">
        <label>Nom du client</label>
        <div class="v big">${escapeHtml(first.firstName)} ${escapeHtml(first.lastName)}</div>
      </div>
      <div class="field">
        <label>Téléphone</label>
        <div class="v">${escapeHtml(first.phone || "—")}</div>
      </div>
      <div class="field">
        <label>Email</label>
        <div class="v">${escapeHtml(first.email)}</div>
      </div>
    </div>

    <p class="section-label">Séjour</p>
    <div class="info-grid">
      ${sejourFields}
    </div>

    <p class="section-label">Prestations réservées</p>
    <table class="prestations">
      <thead>
        <tr>
          <th style="width:52%">Prestation</th>
          <th style="width:23%">Dates</th>
          <th style="width:10%">Pers.</th>
          <th style="width:15%">Montant</th>
        </tr>
      </thead>
      <tbody>
        ${buildPrestationRows(items)}
      </tbody>
    </table>
    <div class="total-row">
      <span class="lbl">Tarif total</span>
      <span class="val">${totalAmount.toLocaleString("fr-FR")} ${currency}</span>
    </div>

    <div class="two-col">
      <div class="field">
        <label>Méthode de paiement</label>
        <div class="v">À régler sur place, en espèces</div>
      </div>
      <div class="field">
        <label>Remarques</label>
        <div class="v">${escapeHtml(remarks)}</div>
      </div>
    </div>

    <div class="confirm-strip">
      <div class="txt">
        <strong>Réservation confirmée.</strong><br>
        Merci de présenter cette fiche à votre arrivée au campement.
      </div>
      <div class="stamp">Confirmé<br>ADH</div>
    </div>

    <p class="page-footer">Arabian Desert Home<span class="sep">·</span>Agafay, Marrakech<span class="sep">·</span>+212 667-370-206</p>
    <p class="fine-print">Ce document atteste d'une réservation confirmée auprès d'Arabian Desert Home.</p>
  </div>
</body>
</html>`;
}

function findLocalChrome(): string | undefined {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const candidates = [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium-browser",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ];
  return candidates.find((p) => existsSync(p));
}

/** Renders the fiche HTML to a PDF buffer via headless Chromium (Sparticuz build in production, a local browser in dev). */
export async function generateFichePdf(html: string): Promise<Buffer> {
  const puppeteer = await import("puppeteer-core");
  const isServerless = !!process.env.VERCEL || !!process.env.AWS_LAMBDA_FUNCTION_NAME;

  const browser = isServerless
    ? await (async () => {
        const chromium = (await import("@sparticuz/chromium")).default;
        return puppeteer.launch({
          args: chromium.args,
          executablePath: await chromium.executablePath(),
          headless: true,
        });
      })()
    : await (async () => {
        const localPath = findLocalChrome();
        if (!localPath) {
          throw new Error(
            "No local Chrome/Edge found for PDF generation. Set the CHROME_PATH env var to a browser executable, or test this in production."
          );
        }
        return puppeteer.launch({ executablePath: localPath, headless: true });
      })();

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.evaluateHandle("document.fonts.ready");
    await page.emulateMediaType("print");
    const pdf = await page.pdf({ printBackground: true, preferCSSPageSize: true });
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}
