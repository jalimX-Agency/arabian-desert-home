import type { Language } from "@/lib/i18n/context";

/** Text of the redesigned page (countdown, marquee) and of the booking wizard. */
export interface ReveillonUiCopy {
  countdown: { title: string; days: string; hours: string; minutes: string; seconds: string; done: string };
  marquee: string[];
  programmeFrom: string;
  galleryTitle: string;
  featured: string;
  steps: string[];
  stepOf: (n: number, total: number) => string;
  next: string;
  back: string;
  formulaTitle: string;
  formulaSoireeTitle: string;
  formulaSoireeText: string;
  formulaNightTitle: string;
  formulaNightText: string;
  from: string;
  tentsQuestion: string;
  tentsNone: string;
  guestsTitle: string;
  extraGuests: string;
  extraGuestsHint: string;
  transportTitle: string;
  transportYes: string;
  transportNo: string;
  contactTitle: string;
  summaryTitle: string;
  summarySoiree: (adults: number, children: number) => string;
  summaryTent: (name: string, adults: number, children: number) => string;
  summaryTransport: string;
  edit: string;
  needTent: string;
  needGuests: string;
  needContact: string;
}

export const REVEILLON_UI: Record<Language, ReveillonUiCopy> = {
  fr: {
    countdown: { title: "Minuit dans", days: "jours", hours: "heures", minutes: "minutes", seconds: "secondes", done: "Bonne année 2027 !" },
    marquee: ["Dîner 4 services", "Gnawa", "Troupe folklorique", "Danseuses", "DJ", "Cracheurs de feu", "Bûche du réveillon", "Minuit sous les étoiles"],
    programmeFrom: "De 17h30 à minuit",
    galleryTitle: "Une nuit à vivre",
    featured: "Le plus demandé",
    steps: ["Formule", "Voyageurs", "Transfert", "Coordonnées", "Récapitulatif"],
    stepOf: (n, t) => `Étape ${n} / ${t}`,
    next: "Continuer",
    back: "Retour",
    formulaTitle: "Comment souhaitez-vous fêter le Nouvel An ?",
    formulaSoireeTitle: "Soirée seule",
    formulaSoireeText: "Dîner, animation et minuit au camp, sans nuitée.",
    formulaNightTitle: "Soirée + nuit en tente",
    formulaNightText: "Toute la soirée, la nuit sous tente et le petit-déjeuner du 1er janvier.",
    from: "dès",
    tentsQuestion: "Choisissez votre ou vos tentes",
    tentsNone: "Toutes les tentes sont réservées pour le 31 décembre. La soirée seule reste disponible.",
    guestsTitle: "Qui vient fêter le Nouvel An ?",
    extraGuests: "Invités en soirée seule (sans nuitée)",
    extraGuestsHint: "Des amis vous rejoignent pour la soirée ? Ajoutez-les ici.",
    transportTitle: "Souhaitez-vous un transfert depuis Marrakech ?",
    transportYes: "Oui, avec transfert aller-retour",
    transportNo: "Non, nous venons par nos propres moyens",
    contactTitle: "Vos coordonnées",
    summaryTitle: "Votre réveillon",
    summarySoiree: (a, c) => `Soirée seule · ${a} adulte${a > 1 ? "s" : ""}${c ? ` · ${c} enfant${c > 1 ? "s" : ""}` : ""}`,
    summaryTent: (n, a, c) => `Soirée + ${n} · ${a} adulte${a > 1 ? "s" : ""}${c ? ` · ${c} enfant${c > 1 ? "s" : ""}` : ""}`,
    summaryTransport: "Transfert aller-retour depuis Marrakech",
    edit: "Modifier",
    needTent: "Choisissez au moins une tente.",
    needGuests: "Ajoutez au moins un adulte.",
    needContact: "Merci de compléter vos coordonnées.",
  },
  en: {
    countdown: { title: "Midnight in", days: "days", hours: "hours", minutes: "minutes", seconds: "seconds", done: "Happy New Year 2027!" },
    marquee: ["4-course dinner", "Gnawa", "Folk troupe", "Dancers", "DJ", "Fire-breathers", "Yule log", "Midnight under the stars"],
    programmeFrom: "From 5:30 pm to midnight",
    galleryTitle: "A night to remember",
    featured: "Most popular",
    steps: ["Package", "Guests", "Transfer", "Details", "Summary"],
    stepOf: (n, t) => `Step ${n} / ${t}`,
    next: "Continue",
    back: "Back",
    formulaTitle: "How would you like to celebrate New Year?",
    formulaSoireeTitle: "Evening only",
    formulaSoireeText: "Dinner, entertainment and midnight at the camp, no overnight stay.",
    formulaNightTitle: "Evening + night in a tent",
    formulaNightText: "The whole evening, the night in a tent and breakfast on 1 January.",
    from: "from",
    tentsQuestion: "Choose your tent(s)",
    tentsNone: "All tents are booked for 31 December. The evening-only package is still available.",
    guestsTitle: "Who is coming to celebrate?",
    extraGuests: "Evening-only guests (no overnight stay)",
    extraGuestsHint: "Friends joining you for the evening? Add them here.",
    transportTitle: "Would you like a transfer from Marrakech?",
    transportYes: "Yes, with a return transfer",
    transportNo: "No, we will come on our own",
    contactTitle: "Your details",
    summaryTitle: "Your New Year's Eve",
    summarySoiree: (a, c) => `Evening only · ${a} adult${a > 1 ? "s" : ""}${c ? ` · ${c} child${c > 1 ? "ren" : ""}` : ""}`,
    summaryTent: (n, a, c) => `Evening + ${n} · ${a} adult${a > 1 ? "s" : ""}${c ? ` · ${c} child${c > 1 ? "ren" : ""}` : ""}`,
    summaryTransport: "Return transfer from Marrakech",
    edit: "Edit",
    needTent: "Choose at least one tent.",
    needGuests: "Add at least one adult.",
    needContact: "Please fill in your details.",
  },
  es: {
    countdown: { title: "Medianoche en", days: "días", hours: "horas", minutes: "minutos", seconds: "segundos", done: "¡Feliz Año Nuevo 2027!" },
    marquee: ["Cena de 4 platos", "Gnawa", "Grupo folclórico", "Bailarinas", "DJ", "Escupefuegos", "Tronco de Navidad", "Medianoche bajo las estrellas"],
    programmeFrom: "De las 17:30 a medianoche",
    galleryTitle: "Una noche para vivir",
    featured: "El más pedido",
    steps: ["Fórmula", "Viajeros", "Traslado", "Datos", "Resumen"],
    stepOf: (n, t) => `Paso ${n} / ${t}`,
    next: "Continuar",
    back: "Atrás",
    formulaTitle: "¿Cómo quiere celebrar el Año Nuevo?",
    formulaSoireeTitle: "Solo la velada",
    formulaSoireeText: "Cena, animación y medianoche en el campamento, sin alojamiento.",
    formulaNightTitle: "Velada + noche en tienda",
    formulaNightText: "Toda la velada, la noche en tienda y el desayuno del 1 de enero.",
    from: "desde",
    tentsQuestion: "Elija su tienda o tiendas",
    tentsNone: "Todas las tiendas están reservadas para el 31 de diciembre. La velada sigue disponible.",
    guestsTitle: "¿Quién viene a celebrar?",
    extraGuests: "Invitados solo para la velada (sin alojamiento)",
    extraGuestsHint: "¿Amigos que se unen para la velada? Añádalos aquí.",
    transportTitle: "¿Desea un traslado desde Marrakech?",
    transportYes: "Sí, con traslado ida y vuelta",
    transportNo: "No, iremos por nuestra cuenta",
    contactTitle: "Sus datos",
    summaryTitle: "Su Nochevieja",
    summarySoiree: (a, c) => `Solo velada · ${a} adulto${a > 1 ? "s" : ""}${c ? ` · ${c} niño${c > 1 ? "s" : ""}` : ""}`,
    summaryTent: (n, a, c) => `Velada + ${n} · ${a} adulto${a > 1 ? "s" : ""}${c ? ` · ${c} niño${c > 1 ? "s" : ""}` : ""}`,
    summaryTransport: "Traslado ida y vuelta desde Marrakech",
    edit: "Modificar",
    needTent: "Elija al menos una tienda.",
    needGuests: "Añada al menos un adulto.",
    needContact: "Complete sus datos.",
  },
  it: {
    countdown: { title: "Mezzanotte tra", days: "giorni", hours: "ore", minutes: "minuti", seconds: "secondi", done: "Buon anno 2027!" },
    marquee: ["Cena di 4 portate", "Gnawa", "Gruppo folkloristico", "Ballerine", "DJ", "Mangiafuoco", "Tronchetto", "Mezzanotte sotto le stelle"],
    programmeFrom: "Dalle 17:30 a mezzanotte",
    galleryTitle: "Una notte da vivere",
    featured: "Il più richiesto",
    steps: ["Formula", "Ospiti", "Transfer", "Dati", "Riepilogo"],
    stepOf: (n, t) => `Passo ${n} / ${t}`,
    next: "Continua",
    back: "Indietro",
    formulaTitle: "Come vuoi festeggiare il Capodanno?",
    formulaSoireeTitle: "Solo serata",
    formulaSoireeText: "Cena, intrattenimento e mezzanotte al campo, senza pernottamento.",
    formulaNightTitle: "Serata + notte in tenda",
    formulaNightText: "Tutta la serata, la notte in tenda e la colazione del 1° gennaio.",
    from: "da",
    tentsQuestion: "Scegli la tua tenda o le tue tende",
    tentsNone: "Tutte le tende sono prenotate per il 31 dicembre. La sola serata è ancora disponibile.",
    guestsTitle: "Chi viene a festeggiare?",
    extraGuests: "Ospiti solo per la serata (senza pernottamento)",
    extraGuestsHint: "Amici che vi raggiungono per la serata? Aggiungili qui.",
    transportTitle: "Desideri un transfer da Marrakech?",
    transportYes: "Sì, con transfer andata e ritorno",
    transportNo: "No, arriviamo con mezzi nostri",
    contactTitle: "I tuoi dati",
    summaryTitle: "Il tuo Capodanno",
    summarySoiree: (a, c) => `Solo serata · ${a} adult${a > 1 ? "i" : "o"}${c ? ` · ${c} bambin${c > 1 ? "i" : "o"}` : ""}`,
    summaryTent: (n, a, c) => `Serata + ${n} · ${a} adult${a > 1 ? "i" : "o"}${c ? ` · ${c} bambin${c > 1 ? "i" : "o"}` : ""}`,
    summaryTransport: "Transfer andata e ritorno da Marrakech",
    edit: "Modifica",
    needTent: "Scegli almeno una tenda.",
    needGuests: "Aggiungi almeno un adulto.",
    needContact: "Completa i tuoi dati.",
  },
};
