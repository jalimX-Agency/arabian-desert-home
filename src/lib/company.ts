import type { Language } from "@/lib/i18n/context";

/**
 * Legal identity of the company behind the site, from the commercial-court
 * registry extract (Tribunal de commerce de Marrakech, copy certified 10/11/2025).
 * Single source for the legal pages. Only company-level facts live here — no
 * personal data of individuals (the manager's name is deliberately left out).
 */
export const COMPANY = {
  legalName: "Société Nouvelle de Participations Touristique",
  tradeName: "Arabian Desert Home",
  capital: "100 000 MAD",
  rcNumber: "125927",
  rcCourt: "Marrakech",
  ice: "003090964000056",
  address: "Dr Ait Said Ichou, Agafay 40272, Marrakech, Maroc",
  email: "info@arabiandeserthome.ma",
  phone: "+212 667-370-206",
} as const;

export interface Fact {
  label: string;
  value: string;
}

const LABELS: Record<Language, {
  legalName: string; tradeName: string; legalForm: string; capital: string; rc: string; ice: string;
  address: string; contact: string;
  form: string; rcValue: (court: string, n: string) => string; country: string;
}> = {
  fr: {
    legalName: "Dénomination sociale", tradeName: "Enseigne", legalForm: "Forme juridique", capital: "Capital social",
    rc: "Registre du commerce", ice: "ICE (Identifiant Commun de l'Entreprise)", address: "Siège social", contact: "Contact",
    form: "Société à responsabilité limitée à associé unique (SARL AU)",
    rcValue: (court, n) => `Tribunal de commerce de ${court} — n° ${n}`,
    country: "Maroc",
  },
  en: {
    legalName: "Company name", tradeName: "Trading name", legalForm: "Legal form", capital: "Share capital",
    rc: "Trade register", ice: "ICE (Common Business Identifier)", address: "Registered office", contact: "Contact",
    form: "Single-member limited liability company (SARL AU)",
    rcValue: (court, n) => `Commercial Court of ${court} — no. ${n}`,
    country: "Morocco",
  },
  es: {
    legalName: "Razón social", tradeName: "Nombre comercial", legalForm: "Forma jurídica", capital: "Capital social",
    rc: "Registro mercantil", ice: "ICE (Identificador Común de la Empresa)", address: "Domicilio social", contact: "Contacto",
    form: "Sociedad de responsabilidad limitada unipersonal (SARL AU)",
    rcValue: (court, n) => `Tribunal de Comercio de ${court} — n.º ${n}`,
    country: "Marruecos",
  },
  it: {
    legalName: "Ragione sociale", tradeName: "Insegna", legalForm: "Forma giuridica", capital: "Capitale sociale",
    rc: "Registro delle imprese", ice: "ICE (Identificativo Comune dell'Impresa)", address: "Sede legale", contact: "Contatti",
    form: "Società a responsabilità limitata a socio unico (SARL AU)",
    rcValue: (court, n) => `Tribunale di commercio di ${court} — n. ${n}`,
    country: "Marocco",
  },
};

/** The identification block shown at the top of the legal pages, in the visitor's language. */
export function companyFacts(language: Language): Fact[] {
  const l = LABELS[language];
  // The registry spells the street "Dr Ait Said Ichou"; only the country name is localized.
  const address = COMPANY.address.replace(/Maroc$/, l.country);
  return [
    { label: l.legalName, value: COMPANY.legalName },
    { label: l.tradeName, value: COMPANY.tradeName },
    { label: l.legalForm, value: l.form },
    { label: l.capital, value: COMPANY.capital },
    { label: l.rc, value: l.rcValue(COMPANY.rcCourt, COMPANY.rcNumber) },
    { label: l.ice, value: COMPANY.ice },
    { label: l.address, value: address },
    { label: l.contact, value: `${COMPANY.email} · ${COMPANY.phone}` },
  ];
}
