import type { Language } from "@/lib/i18n/context";
import { REVEILLON_WHATSAPP_MESSAGE as WA } from "@/lib/reveillon";

export interface ReveillonCopy {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaBook: string;
  ctaWhatsApp: string;
  limited: (n: number) => string;
  soldOutSoiree: string;
  introTitle: string;
  intro: string;
  programmeLabel: string;
  programmeTitle: string;
  programme: { time: string; text: string }[];
  indicative: string;
  offersLabel: string;
  offersTitle: string;
  soiree: string;
  soireeFor: string;
  perPerson: string;
  forPersons: (n: number) => string;
  packageNote: string;
  childHalf: string;
  includes: string[];
  nightIncluded: string;
  breakfastIncluded: string;
  left: (n: number) => string;
  full: string;
  choose: string;
  galleryLabel: string;
  formLabel: string;
  formTitle: string;
  formIntro: string;
  soireeOnly: string;
  adults: string;
  children: string;
  childrenHint: string;
  seatsLeft: (n: number) => string;
  tentsTitle: string;
  addTent: (name: string) => string;
  tentLine: (name: string) => string;
  remove: string;
  maxPersons: (n: number) => string;
  transport: (price: string) => string;
  pickup: string;
  pickupPlaceholder: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes: string;
  notesPlaceholder: string;
  total: string;
  deposit: string;
  terms: string;
  submit: string;
  sending: string;
  successTitle: string;
  successBody: string;
  successLink: string;
  infoLabel: string;
  infoTitle: string;
  faq: { q: string; a: string }[];
  finalTitle: string;
  finalBody: string;
  closed: string;
  whatsappMessage: string;
  errors: Record<string, string>;
}

export const REVEILLON_COPY: Record<Language, ReveillonCopy> = {
  fr: {
    eyebrow: "Réveillon · 31 décembre 2026",
    title: "Réveillon sous les étoiles",
    subtitle: "Dîner servi à table, animation gnawa et folklorique, DJ et cracheurs de feu au cœur du désert d'Agafay, à 30 minutes de Marrakech.",
    ctaBook: "Réserver ma soirée",
    ctaWhatsApp: "Réserver sur WhatsApp",
    limited: (n) => `Places limitées · plus que ${n} places pour la soirée`,
    soldOutSoiree: "Soirée complète",
    introTitle: "Le Nouvel An au cœur du désert",
    intro: "Le 31 décembre, Arabian Desert Home vous invite à passer le Nouvel An au cœur du désert d'Agafay : dîner servi à table, animation en alternance (troupe folklorique, gnawa, danseuses, DJ et séances de cracheur de feu) et bûche du réveillon. Pour prolonger la fête, passez la nuit dans l'une de nos tentes.",
    programmeLabel: "Programme",
    programmeTitle: "La soirée du 31 décembre",
    programme: [
      { time: "17h30", text: "Accueil, thé à la menthe et coucher de soleil sur le désert" },
      { time: "19h00", text: "Apéritif et ambiance autour du feu" },
      { time: "20h00", text: "Dîner en quatre services, servi à table" },
      { time: "21h30", text: "Animation en alternance : troupe folklorique, gnawa, danseuses et DJ, avec des séances de cracheur de feu" },
      { time: "22h00", text: "Boissons sans alcool servies" },
      { time: "23h00", text: "La bûche, le dessert du réveillon" },
      { time: "00h00", text: "Minuit : compte à rebours et célébration du Nouvel An" },
    ],
    indicative: "Horaires indicatifs.",
    offersLabel: "Nos formules",
    offersTitle: "Soirée seule ou soirée et nuit au camp",
    soiree: "Soirée",
    soireeFor: "Sans nuit au camp",
    perPerson: "par personne",
    forPersons: (n) => `pour ${n} personne${n > 1 ? "s" : ""}`,
    packageNote: "soirée + nuit + petit-déjeuner",
    childHalf: "Enfants : -50 %",
    includes: ["Dîner 4 services à table", "Animation : troupe folklorique, gnawa, danseuses, DJ, cracheur de feu", "Boissons sans alcool", "Bûche du réveillon (23h)"],
    nightIncluded: "Nuit en tente",
    breakfastIncluded: "Petit-déjeuner du 1er janvier",
    left: (n) => `Plus que ${n}`,
    full: "Complet",
    choose: "Choisir",
    galleryLabel: "La soirée en images",
    formLabel: "Réservation",
    formTitle: "Réservez votre nuit du 31 décembre",
    formIntro: "Composez votre réservation : nous vous répondons rapidement pour la confirmer.",
    soireeOnly: "Soirée seule (sans nuit au camp)",
    adults: "Adultes",
    children: "Enfants",
    childrenHint: "Enfants de tout âge bienvenus, -50 % sur la soirée. Les moins de 12 ans doivent être accompagnés d'un adulte.",
    seatsLeft: (n) => `${n} places restantes`,
    tentsTitle: "Soirée + nuit en tente",
    addTent: (name) => `Ajouter une ${name}`,
    tentLine: (name) => name,
    remove: "Retirer",
    maxPersons: (n) => `${n} personnes max.`,
    transport: (price) => `Transfert aller-retour depuis Marrakech (${price})`,
    pickup: "Lieu de prise en charge",
    pickupPlaceholder: "Hôtel, riad, adresse…",
    firstName: "Prénom",
    lastName: "Nom",
    email: "Email",
    phone: "Téléphone (WhatsApp)",
    notes: "Message (facultatif)",
    notesPlaceholder: "Allergies, occasion particulière…",
    total: "Total",
    deposit: "Acompte de 50 % à verser pour confirmer",
    terms: "J'ai bien noté que la réservation est confirmée après le versement d'un acompte de 50 %, et que cet acompte n'est pas remboursable en cas d'annulation.",
    submit: "Envoyer ma demande",
    sending: "Envoi…",
    successTitle: "Demande envoyée, merci !",
    successBody: "Vous allez recevoir un email de confirmation de votre demande. Nous revenons vers vous très vite avec les informations pour verser l'acompte et confirmer votre réservation.",
    successLink: "Voir ma réservation",
    infoLabel: "Informations pratiques",
    infoTitle: "Bon à savoir",
    faq: [
      { q: "Comment confirmer ma réservation ?", a: "Après votre demande, nous vous envoyons par email le lien de votre réservation avec nos coordonnées bancaires. La réservation est confirmée dès réception d'un acompte de 50 %." },
      { q: "Puis-je annuler ?", a: "Vous pouvez annuler à tout moment, mais l'acompte versé n'est pas remboursable." },
      { q: "Les enfants sont-ils acceptés ?", a: "Oui, à tout âge. Ils bénéficient de -50 % sur la soirée seule. Les enfants de moins de 12 ans doivent être accompagnés d'un adulte." },
      { q: "Y a-t-il un transfert depuis Marrakech ?", a: "Oui, un transfert aller-retour depuis votre hôtel ou riad à Marrakech est proposé lors de la réservation." },
      { q: "L'alcool est-il servi ?", a: "Les boissons sans alcool sont incluses dans la soirée." },
      { q: "Que comprend la formule avec nuit ?", a: "La soirée complète, la nuit dans votre tente et le petit-déjeuner du 1er janvier. Le restaurant, la piscine et la conciergerie 24h sont à disposition des hôtes du camp." },
    ],
    finalTitle: "Les places sont limitées",
    finalBody: "Réservez dès maintenant votre réveillon dans le désert d'Agafay.",
    closed: "Les réservations pour le réveillon sont closes. Contactez-nous sur WhatsApp pour toute question.",
    whatsappMessage: WA.fr,
    errors: {
      contact: "Merci de compléter vos coordonnées (prénom, nom, email et téléphone).",
      terms: "Merci d'accepter les conditions de l'acompte.",
      empty: "Choisissez au moins une formule : soirée seule ou tente.",
      child_alone: "Un enfant doit être accompagné d'au moins un adulte.",
      tent_capacity: "Trop de personnes pour cette tente.",
      tent_full: "Cette tente vient d'être réservée, elle n'est plus disponible.",
      seats: "Il ne reste plus assez de places pour la soirée.",
      closed: "Les réservations pour le réveillon sont closes.",
      generic: "Une erreur est survenue. Réessayez ou contactez-nous sur WhatsApp.",
    },
  },
  en: {
    eyebrow: "New Year's Eve · 31 December 2026",
    title: "New Year's Eve under the stars",
    subtitle: "Dinner served at the table, gnawa and folk shows, DJ and fire performers in the heart of the Agafay desert, 30 minutes from Marrakech.",
    ctaBook: "Book my evening",
    ctaWhatsApp: "Book on WhatsApp",
    limited: (n) => `Limited places · only ${n} seats left for the evening`,
    soldOutSoiree: "Evening sold out",
    introTitle: "New Year in the heart of the desert",
    intro: "On 31 December, Arabian Desert Home invites you to celebrate the New Year in the heart of the Agafay desert: dinner served at the table, alternating entertainment (folk troupe, gnawa, dancers, DJ and fire-breathing shows) and the traditional Yule log dessert. To keep the party going, spend the night in one of our tents.",
    programmeLabel: "Programme",
    programmeTitle: "The evening of 31 December",
    programme: [
      { time: "5:30 pm", text: "Welcome, mint tea and sunset over the desert" },
      { time: "7:00 pm", text: "Aperitif and fireside atmosphere" },
      { time: "8:00 pm", text: "Four-course dinner served at the table" },
      { time: "9:30 pm", text: "Alternating entertainment: folk troupe, gnawa, dancers and DJ, with fire-breathing shows" },
      { time: "10:00 pm", text: "Soft drinks served" },
      { time: "11:00 pm", text: "The Yule log, New Year's Eve dessert" },
      { time: "Midnight", text: "Countdown and New Year celebration" },
    ],
    indicative: "Times are indicative.",
    offersLabel: "Our packages",
    offersTitle: "Evening only, or evening and a night at the camp",
    soiree: "Evening",
    soireeFor: "Without a night at the camp",
    perPerson: "per person",
    forPersons: (n) => `for ${n} ${n > 1 ? "people" : "person"}`,
    packageNote: "evening + night + breakfast",
    childHalf: "Children: -50%",
    includes: ["Four-course dinner at the table", "Entertainment: folk troupe, gnawa, dancers, DJ, fire-breather", "Soft drinks", "Yule log dessert (11 pm)"],
    nightIncluded: "Night in a tent",
    breakfastIncluded: "Breakfast on 1 January",
    left: (n) => `Only ${n} left`,
    full: "Sold out",
    choose: "Choose",
    galleryLabel: "The evening in pictures",
    formLabel: "Booking",
    formTitle: "Book your night of 31 December",
    formIntro: "Build your booking: we will reply quickly to confirm it.",
    soireeOnly: "Evening only (no night at the camp)",
    adults: "Adults",
    children: "Children",
    childrenHint: "Children of all ages welcome, -50% on the evening. Under-12s must be accompanied by an adult.",
    seatsLeft: (n) => `${n} seats left`,
    tentsTitle: "Evening + night in a tent",
    addTent: (name) => `Add a ${name}`,
    tentLine: (name) => name,
    remove: "Remove",
    maxPersons: (n) => `${n} people max.`,
    transport: (price) => `Return transfer from Marrakech (${price})`,
    pickup: "Pick-up location",
    pickupPlaceholder: "Hotel, riad, address…",
    firstName: "First name",
    lastName: "Last name",
    email: "Email",
    phone: "Phone (WhatsApp)",
    notes: "Message (optional)",
    notesPlaceholder: "Allergies, special occasion…",
    total: "Total",
    deposit: "50% advance to pay to confirm",
    terms: "I understand that the booking is confirmed once a 50% advance is paid, and that this advance is non-refundable in case of cancellation.",
    submit: "Send my request",
    sending: "Sending…",
    successTitle: "Request sent, thank you!",
    successBody: "You will receive an email confirming your request. We will get back to you very soon with the details to pay the advance and confirm your booking.",
    successLink: "View my booking",
    infoLabel: "Practical information",
    infoTitle: "Good to know",
    faq: [
      { q: "How do I confirm my booking?", a: "After your request, we email you the link to your booking with our bank details. The booking is confirmed once we receive a 50% advance." },
      { q: "Can I cancel?", a: "You can cancel at any time, but the advance paid is non-refundable." },
      { q: "Are children welcome?", a: "Yes, of any age. They get -50% on the evening-only package. Children under 12 must be accompanied by an adult." },
      { q: "Is there a transfer from Marrakech?", a: "Yes, a return transfer from your hotel or riad in Marrakech can be added to your booking." },
      { q: "Is alcohol served?", a: "Soft drinks are included in the evening." },
      { q: "What does the package with a night include?", a: "The full evening, the night in your tent and breakfast on 1 January. The restaurant, pool and 24h concierge are available to camp guests." },
    ],
    finalTitle: "Places are limited",
    finalBody: "Book your New Year's Eve in the Agafay desert now.",
    closed: "Bookings for New Year's Eve are closed. Contact us on WhatsApp with any question.",
    whatsappMessage: WA.en,
    errors: {
      contact: "Please fill in your details (first name, last name, email and phone).",
      terms: "Please accept the advance payment conditions.",
      empty: "Choose at least one package: evening only or a tent.",
      child_alone: "A child must be accompanied by at least one adult.",
      tent_capacity: "Too many people for this tent.",
      tent_full: "This tent has just been booked and is no longer available.",
      seats: "There are not enough seats left for the evening.",
      closed: "Bookings for New Year's Eve are closed.",
      generic: "Something went wrong. Please try again or contact us on WhatsApp.",
    },
  },
  es: {
    eyebrow: "Nochevieja · 31 de diciembre de 2026",
    title: "Nochevieja bajo las estrellas",
    subtitle: "Cena servida en la mesa, espectáculo gnawa y folclórico, DJ y escupefuegos en pleno desierto de Agafay, a 30 minutos de Marrakech.",
    ctaBook: "Reservar mi velada",
    ctaWhatsApp: "Reservar por WhatsApp",
    limited: (n) => `Plazas limitadas · solo quedan ${n} plazas para la velada`,
    soldOutSoiree: "Velada completa",
    introTitle: "Año Nuevo en pleno desierto",
    intro: "El 31 de diciembre, Arabian Desert Home le invita a celebrar el Año Nuevo en el corazón del desierto de Agafay: cena servida en la mesa, animación alterna (grupo folclórico, gnawa, bailarinas, DJ y espectáculos de escupefuegos) y el tronco de Navidad. Para prolongar la fiesta, pase la noche en una de nuestras tiendas.",
    programmeLabel: "Programa",
    programmeTitle: "La velada del 31 de diciembre",
    programme: [
      { time: "17:30", text: "Bienvenida, té a la menta y puesta de sol sobre el desierto" },
      { time: "19:00", text: "Aperitivo y ambiente junto al fuego" },
      { time: "20:00", text: "Cena de cuatro platos servida en la mesa" },
      { time: "21:30", text: "Animación alterna: grupo folclórico, gnawa, bailarinas y DJ, con espectáculos de escupefuegos" },
      { time: "22:00", text: "Bebidas sin alcohol" },
      { time: "23:00", text: "El tronco de Navidad, postre de Nochevieja" },
      { time: "00:00", text: "Medianoche: cuenta atrás y celebración del Año Nuevo" },
    ],
    indicative: "Horarios orientativos.",
    offersLabel: "Nuestras fórmulas",
    offersTitle: "Solo la velada, o velada y noche en el campamento",
    soiree: "Velada",
    soireeFor: "Sin noche en el campamento",
    perPerson: "por persona",
    forPersons: (n) => `para ${n} persona${n > 1 ? "s" : ""}`,
    packageNote: "velada + noche + desayuno",
    childHalf: "Niños: -50 %",
    includes: ["Cena de 4 platos en la mesa", "Animación: grupo folclórico, gnawa, bailarinas, DJ, escupefuegos", "Bebidas sin alcohol", "Tronco de Navidad (23 h)"],
    nightIncluded: "Noche en tienda",
    breakfastIncluded: "Desayuno del 1 de enero",
    left: (n) => `Quedan ${n}`,
    full: "Completo",
    choose: "Elegir",
    galleryLabel: "La velada en imágenes",
    formLabel: "Reserva",
    formTitle: "Reserve su noche del 31 de diciembre",
    formIntro: "Prepare su reserva: le responderemos rápidamente para confirmarla.",
    soireeOnly: "Solo la velada (sin noche en el campamento)",
    adults: "Adultos",
    children: "Niños",
    childrenHint: "Niños de todas las edades bienvenidos, -50 % en la velada. Los menores de 12 años deben ir acompañados de un adulto.",
    seatsLeft: (n) => `Quedan ${n} plazas`,
    tentsTitle: "Velada + noche en tienda",
    addTent: (name) => `Añadir una ${name}`,
    tentLine: (name) => name,
    remove: "Quitar",
    maxPersons: (n) => `${n} personas máx.`,
    transport: (price) => `Traslado ida y vuelta desde Marrakech (${price})`,
    pickup: "Lugar de recogida",
    pickupPlaceholder: "Hotel, riad, dirección…",
    firstName: "Nombre",
    lastName: "Apellido",
    email: "Email",
    phone: "Teléfono (WhatsApp)",
    notes: "Mensaje (opcional)",
    notesPlaceholder: "Alergias, ocasión especial…",
    total: "Total",
    deposit: "Anticipo del 50 % para confirmar",
    terms: "Entiendo que la reserva se confirma tras el pago de un anticipo del 50 %, y que este anticipo no es reembolsable en caso de cancelación.",
    submit: "Enviar mi solicitud",
    sending: "Enviando…",
    successTitle: "¡Solicitud enviada, gracias!",
    successBody: "Recibirá un email que confirma su solicitud. Le contactaremos muy pronto con los datos para pagar el anticipo y confirmar su reserva.",
    successLink: "Ver mi reserva",
    infoLabel: "Información práctica",
    infoTitle: "Bueno saber",
    faq: [
      { q: "¿Cómo confirmo mi reserva?", a: "Tras su solicitud, le enviamos por email el enlace de su reserva con nuestros datos bancarios. La reserva se confirma al recibir un anticipo del 50 %." },
      { q: "¿Puedo cancelar?", a: "Puede cancelar en cualquier momento, pero el anticipo pagado no es reembolsable." },
      { q: "¿Se admiten niños?", a: "Sí, de cualquier edad. Tienen un -50 % en la fórmula solo velada. Los menores de 12 años deben ir acompañados de un adulto." },
      { q: "¿Hay traslado desde Marrakech?", a: "Sí, puede añadir a su reserva un traslado ida y vuelta desde su hotel o riad en Marrakech." },
      { q: "¿Se sirve alcohol?", a: "Las bebidas sin alcohol están incluidas en la velada." },
      { q: "¿Qué incluye la fórmula con noche?", a: "La velada completa, la noche en su tienda y el desayuno del 1 de enero. El restaurante, la piscina y la conserjería 24 h están a disposición de los huéspedes." },
    ],
    finalTitle: "Las plazas son limitadas",
    finalBody: "Reserve ya su Nochevieja en el desierto de Agafay.",
    closed: "Las reservas para Nochevieja están cerradas. Contáctenos por WhatsApp para cualquier pregunta.",
    whatsappMessage: WA.es,
    errors: {
      contact: "Complete sus datos (nombre, apellido, email y teléfono).",
      terms: "Acepte las condiciones del anticipo.",
      empty: "Elija al menos una fórmula: solo velada o una tienda.",
      child_alone: "Un niño debe ir acompañado de al menos un adulto.",
      tent_capacity: "Demasiadas personas para esta tienda.",
      tent_full: "Esta tienda acaba de reservarse y ya no está disponible.",
      seats: "No quedan suficientes plazas para la velada.",
      closed: "Las reservas para Nochevieja están cerradas.",
      generic: "Se produjo un error. Inténtelo de nuevo o contáctenos por WhatsApp.",
    },
  },
  it: {
    eyebrow: "Capodanno · 31 dicembre 2026",
    title: "Capodanno sotto le stelle",
    subtitle: "Cena servita al tavolo, spettacolo gnawa e folkloristico, DJ e mangiafuoco nel cuore del deserto di Agafay, a 30 minuti da Marrakech.",
    ctaBook: "Prenota la mia serata",
    ctaWhatsApp: "Prenota su WhatsApp",
    limited: (n) => `Posti limitati · restano solo ${n} posti per la serata`,
    soldOutSoiree: "Serata al completo",
    introTitle: "Il Capodanno nel cuore del deserto",
    intro: "Il 31 dicembre Arabian Desert Home vi invita a festeggiare il Capodanno nel cuore del deserto di Agafay: cena servita al tavolo, intrattenimento alternato (gruppo folkloristico, gnawa, ballerine, DJ e spettacoli di mangiafuoco) e il tronchetto di fine anno. Per prolungare la festa, passate la notte in una delle nostre tende.",
    programmeLabel: "Programma",
    programmeTitle: "La serata del 31 dicembre",
    programme: [
      { time: "17:30", text: "Accoglienza, tè alla menta e tramonto sul deserto" },
      { time: "19:00", text: "Aperitivo e atmosfera intorno al fuoco" },
      { time: "20:00", text: "Cena di quattro portate servita al tavolo" },
      { time: "21:30", text: "Intrattenimento alternato: gruppo folkloristico, gnawa, ballerine e DJ, con spettacoli di mangiafuoco" },
      { time: "22:00", text: "Bevande analcoliche servite" },
      { time: "23:00", text: "Il tronchetto, il dolce di fine anno" },
      { time: "00:00", text: "Mezzanotte: conto alla rovescia e festa di Capodanno" },
    ],
    indicative: "Orari indicativi.",
    offersLabel: "Le nostre formule",
    offersTitle: "Solo serata, oppure serata e notte al campo",
    soiree: "Serata",
    soireeFor: "Senza notte al campo",
    perPerson: "a persona",
    forPersons: (n) => `per ${n} person${n > 1 ? "e" : "a"}`,
    packageNote: "serata + notte + colazione",
    childHalf: "Bambini: -50%",
    includes: ["Cena di 4 portate al tavolo", "Intrattenimento: gruppo folkloristico, gnawa, ballerine, DJ, mangiafuoco", "Bevande analcoliche", "Tronchetto di fine anno (23:00)"],
    nightIncluded: "Notte in tenda",
    breakfastIncluded: "Colazione del 1° gennaio",
    left: (n) => `Ne restano ${n}`,
    full: "Al completo",
    choose: "Scegli",
    galleryLabel: "La serata in immagini",
    formLabel: "Prenotazione",
    formTitle: "Prenota la tua notte del 31 dicembre",
    formIntro: "Componi la tua prenotazione: ti rispondiamo rapidamente per confermarla.",
    soireeOnly: "Solo serata (senza notte al campo)",
    adults: "Adulti",
    children: "Bambini",
    childrenHint: "Bambini di ogni età benvenuti, -50% sulla serata. I minori di 12 anni devono essere accompagnati da un adulto.",
    seatsLeft: (n) => `${n} posti rimasti`,
    tentsTitle: "Serata + notte in tenda",
    addTent: (name) => `Aggiungi una ${name}`,
    tentLine: (name) => name,
    remove: "Rimuovi",
    maxPersons: (n) => `max ${n} persone`,
    transport: (price) => `Transfer andata e ritorno da Marrakech (${price})`,
    pickup: "Luogo di ritiro",
    pickupPlaceholder: "Hotel, riad, indirizzo…",
    firstName: "Nome",
    lastName: "Cognome",
    email: "Email",
    phone: "Telefono (WhatsApp)",
    notes: "Messaggio (facoltativo)",
    notesPlaceholder: "Allergie, occasione speciale…",
    total: "Totale",
    deposit: "Acconto del 50% da versare per confermare",
    terms: "Ho capito che la prenotazione è confermata dopo il versamento di un acconto del 50% e che questo acconto non è rimborsabile in caso di cancellazione.",
    submit: "Invia la mia richiesta",
    sending: "Invio…",
    successTitle: "Richiesta inviata, grazie!",
    successBody: "Riceverai un'email di conferma della richiesta. Ti ricontatteremo molto presto con i dati per versare l'acconto e confermare la prenotazione.",
    successLink: "Vedi la mia prenotazione",
    infoLabel: "Informazioni pratiche",
    infoTitle: "Da sapere",
    faq: [
      { q: "Come confermo la prenotazione?", a: "Dopo la richiesta ti inviamo via email il link della prenotazione con le nostre coordinate bancarie. La prenotazione è confermata al ricevimento di un acconto del 50%." },
      { q: "Posso cancellare?", a: "Puoi cancellare in qualsiasi momento, ma l'acconto versato non è rimborsabile." },
      { q: "I bambini sono ammessi?", a: "Sì, di ogni età. Hanno il -50% sulla formula solo serata. I minori di 12 anni devono essere accompagnati da un adulto." },
      { q: "C'è un transfer da Marrakech?", a: "Sì, puoi aggiungere alla prenotazione un transfer andata e ritorno dal tuo hotel o riad a Marrakech." },
      { q: "Viene servito alcol?", a: "Le bevande analcoliche sono incluse nella serata." },
      { q: "Cosa include la formula con notte?", a: "La serata completa, la notte in tenda e la colazione del 1° gennaio. Ristorante, piscina e concierge 24h sono a disposizione degli ospiti del campo." },
    ],
    finalTitle: "I posti sono limitati",
    finalBody: "Prenota subito il tuo Capodanno nel deserto di Agafay.",
    closed: "Le prenotazioni per Capodanno sono chiuse. Contattaci su WhatsApp per qualsiasi domanda.",
    whatsappMessage: WA.it,
    errors: {
      contact: "Completa i tuoi dati (nome, cognome, email e telefono).",
      terms: "Accetta le condizioni dell'acconto.",
      empty: "Scegli almeno una formula: solo serata o una tenda.",
      child_alone: "Un bambino deve essere accompagnato da almeno un adulto.",
      tent_capacity: "Troppe persone per questa tenda.",
      tent_full: "Questa tenda è appena stata prenotata e non è più disponibile.",
      seats: "Non restano abbastanza posti per la serata.",
      closed: "Le prenotazioni per Capodanno sono chiuse.",
      generic: "Si è verificato un errore. Riprova o contattaci su WhatsApp.",
    },
  },
};
