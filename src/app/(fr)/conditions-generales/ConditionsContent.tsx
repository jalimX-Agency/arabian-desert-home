"use client";

import { useLanguage, type Language } from "@/lib/i18n/context";
import { LegalDocument, type LegalCopy } from "@/components/arabian/LegalDocument";
import { companyFacts } from "@/lib/company";

/**
 * Terms and conditions. Only rules the business already applies are stated here
 * (payment on site, cancellation from the guest's private link, confirmation by
 * the team, quote conditions). No fee schedule, deadline or arrival time is
 * invented: where those are not fixed, the terms point to the confirmation or
 * the quote instead.
 */
const COPY: Record<Language, LegalCopy> = {
  fr: {
    title: "Conditions générales",
    intro:
      "Ces conditions générales encadrent l'utilisation du site arabiandeserthome.ma et les réservations effectuées auprès d'Arabian Desert Home. En réservant, vous déclarez les avoir lues et acceptées.",
    sections: [
      {
        title: "Qui sommes-nous ?",
        paragraphs: ["Le site arabiandeserthome.ma est édité et exploité par la société suivante :"],
      },
      {
        title: "Champ d'application",
        paragraphs: [
          "Ces conditions s'appliquent à toute réservation de séjour, d'activité, de Day Pass, de repas ou d'événement faite auprès de nous : via le formulaire du site, par téléphone, WhatsApp ou email, ou à la suite d'un devis accepté.",
          "Si vous réservez par une plateforme tierce (Booking.com, Expedia, Trip.com…), les conditions de cette plateforme s'appliquent en plus ; les présentes conditions les complètent pour les points qu'elles ne couvrent pas.",
        ],
      },
      {
        title: "Nos prestations",
        paragraphs: [
          "Arabian Desert Home propose l'hébergement en tentes et suites, des activités dans le désert d'Agafay, des Day Pass, un restaurant et l'organisation d'événements. Les descriptions et photos du site sont données à titre indicatif ; l'offre peut évoluer selon la saison et la météo.",
        ],
      },
      {
        title: "Prix",
        list: [
          "Les prix sont indiqués en dirhams marocains (MAD) ou en euros (EUR) selon la prestation, et peuvent varier selon la période (tarifs saisonniers).",
          "Le prix applicable est celui affiché au moment de votre demande ; il est rappelé dans l'email de confirmation et sur la fiche de réservation.",
          "Les enfants bénéficient des réductions indiquées sur la page de chaque prestation.",
          "Pour un devis, les prix sont ceux du devis, valables jusqu'à la date de validité qui y figure.",
        ],
      },
      {
        title: "Réservation et confirmation",
        list: [
          "Votre demande de réservation n'est pas ferme tant qu'elle n'est pas confirmée par notre équipe. Nous répondons en général sous 24 heures.",
          "La confirmation est envoyée par email, accompagnée de votre fiche de réservation à présenter à l'arrivée.",
          "Une prestation peut être indisponible (période de fermeture, complet) : nous vous proposons alors d'autres dates ou une alternative.",
          "Vous êtes responsable de l'exactitude des informations transmises (coordonnées, dates, nombre de voyageurs).",
        ],
      },
      {
        title: "Paiement",
        paragraphs: [
          "Aucun paiement n'est demandé en ligne lors de la réservation : le règlement s'effectue sur place, comme indiqué sur votre fiche de réservation. Pour les groupes, les événements et les devis, les modalités de paiement figurent dans le devis accepté.",
        ],
      },
      {
        title: "Modification et annulation par vous",
        list: [
          "Depuis le lien personnel reçu par email, vous pouvez modifier les dates d'une prestation (sous réserve de disponibilité ; le tarif peut varier et la réservation repasse en attente de confirmation) ou annuler une prestation, ou toute la réservation.",
          "Merci de nous prévenir le plus tôt possible : cela nous permet de libérer la place pour d'autres voyageurs.",
          "Pour les événements, les groupes et les devis acceptés, les conditions d'annulation indiquées dans le devis s'appliquent.",
        ],
      },
      {
        title: "Modification ou annulation par nos soins",
        paragraphs: [
          "Nous pouvons être amenés à modifier ou annuler une prestation en cas d'indisponibilité, de météo dangereuse, de raison de sécurité ou de force majeure. Nous vous prévenons dès que possible et vous proposons de nouvelles dates ou une alternative ; si elles ne vous conviennent pas, vous pouvez annuler, et toute somme déjà versée pour la prestation annulée vous est remboursée.",
        ],
      },
      {
        title: "Votre séjour",
        list: [
          "Les horaires d'arrivée et de départ vous sont communiqués avec la confirmation. Merci de présenter votre fiche de réservation à l'arrivée.",
          "Les mineurs restent sous la responsabilité des adultes qui les accompagnent.",
          "Respectez les autres voyageurs, le personnel, le matériel, les animaux et l'environnement du désert. Nous pouvons refuser l'accès à toute personne dont le comportement met en danger la sécurité ou trouble la tranquillité des autres.",
          "Vous êtes responsable des dégradations que vous causez.",
        ],
      },
      {
        title: "Activités et sécurité",
        paragraphs: [
          "Les activités (dromadaire, cheval, quad, randonnée, baignade…) comportent des risques inhérents à leur pratique. Suivez les consignes de nos guides et ne participez que si votre état de santé le permet. Nous vous recommandons de souscrire une assurance voyage. Évitez de laisser des objets de valeur sans surveillance ; notre responsabilité reste engagée dans les limites prévues par la loi.",
        ],
      },
      {
        title: "Force majeure",
        paragraphs: [
          "Aucune des parties n'est responsable d'un manquement causé par un événement de force majeure (phénomène météorologique exceptionnel, catastrophe naturelle, décision des autorités, épidémie…).",
        ],
      },
      {
        title: "Données personnelles",
        paragraphs: ["Vos données sont traitées conformément à notre politique de confidentialité, accessible depuis le pied de page du site."],
      },
      {
        title: "Propriété intellectuelle",
        paragraphs: [
          "Les textes, photos, vidéos, logos et le design du site appartiennent à Arabian Desert Home ou à leurs auteurs. Toute reproduction sans autorisation écrite est interdite.",
        ],
      },
      {
        title: "Réclamations",
        paragraphs: [
          "Pour toute remarque ou réclamation, parlez-en à notre équipe sur place afin que nous puissions la résoudre immédiatement, ou écrivez-nous à info@arabiandeserthome.ma. Nous cherchons toujours une solution amiable.",
        ],
      },
      {
        title: "Droit applicable et litiges",
        paragraphs: [
          "Ces conditions sont soumises au droit marocain. En cas de différend, nous recherchons d'abord une solution amiable ; à défaut, les tribunaux de Marrakech sont compétents, sans préjudice des droits que la loi n° 31-08 (protection du consommateur) ou les règles impératives de votre pays de résidence vous reconnaissent.",
        ],
      },
      {
        title: "Modification des conditions",
        paragraphs: ["Nous pouvons mettre à jour ces conditions ; la version applicable à votre réservation est celle en vigueur le jour où vous la faites."],
      },
    ],
    updated: "Dernière mise à jour : octobre 2026.",
  },
  en: {
    title: "Terms & Conditions",
    intro:
      "These terms and conditions govern the use of the arabiandeserthome.ma website and reservations made with Arabian Desert Home. By booking, you confirm that you have read and accepted them.",
    sections: [
      {
        title: "Who we are",
        paragraphs: ["The arabiandeserthome.ma website is published and operated by the following company:"],
      },
      {
        title: "Scope",
        paragraphs: [
          "These terms apply to every reservation of a stay, activity, Day Pass, meal or event made with us: through the website form, by phone, WhatsApp or email, or following an accepted quote.",
          "If you book through a third-party platform (Booking.com, Expedia, Trip.com…), that platform's conditions also apply; these terms complete them on any point they do not cover.",
        ],
      },
      {
        title: "Our services",
        paragraphs: [
          "Arabian Desert Home offers accommodation in tents and suites, activities in the Agafay desert, Day Passes, a restaurant and event organisation. Descriptions and photos on the website are indicative; the offer may change with the season and the weather.",
        ],
      },
      {
        title: "Prices",
        list: [
          "Prices are shown in Moroccan dirhams (MAD) or euros (EUR) depending on the service, and may vary by period (seasonal rates).",
          "The applicable price is the one displayed when you make your request; it is repeated in the confirmation email and on the reservation voucher.",
          "Children benefit from the reductions shown on each service's page.",
          "For a quote, prices are those of the quote, valid until the validity date it states.",
        ],
      },
      {
        title: "Reservation and confirmation",
        list: [
          "Your reservation request is not firm until our team confirms it. We usually reply within 24 hours.",
          "Confirmation is sent by email, together with your reservation voucher to present on arrival.",
          "A service may be unavailable (closed period, fully booked): we will then offer other dates or an alternative.",
          "You are responsible for the accuracy of the information you provide (contact details, dates, number of guests).",
        ],
      },
      {
        title: "Payment",
        paragraphs: [
          "No online payment is requested when you book: payment is made on site, as stated on your reservation voucher. For groups, events and quotes, the payment terms are set out in the accepted quote.",
        ],
      },
      {
        title: "Changes and cancellation by you",
        list: [
          "From the personal link you received by email, you can change the dates of a service (subject to availability; the price may vary and the reservation goes back to awaiting confirmation) or cancel a service, or the whole reservation.",
          "Please tell us as early as possible: it lets us free the place for other travellers.",
          "For events, groups and accepted quotes, the cancellation conditions stated in the quote apply.",
        ],
      },
      {
        title: "Changes or cancellation by us",
        paragraphs: [
          "We may have to change or cancel a service in case of unavailability, dangerous weather, safety reasons or force majeure. We will inform you as soon as possible and offer new dates or an alternative; if they do not suit you, you may cancel, and any amount already paid for the cancelled service will be refunded.",
        ],
      },
      {
        title: "Your stay",
        list: [
          "Arrival and departure times are given with your confirmation. Please present your reservation voucher on arrival.",
          "Minors remain under the responsibility of the adults accompanying them.",
          "Please respect other travellers, staff, equipment, animals and the desert environment. We may refuse access to anyone whose behaviour endangers safety or disturbs others.",
          "You are responsible for any damage you cause.",
        ],
      },
      {
        title: "Activities and safety",
        paragraphs: [
          "Activities (camel, horse, quad, hiking, swimming…) carry risks inherent to their practice. Follow our guides' instructions and take part only if your health allows it. We recommend taking out travel insurance. Avoid leaving valuables unattended; our liability remains engaged within the limits provided by law.",
        ],
      },
      {
        title: "Force majeure",
        paragraphs: [
          "Neither party is liable for a failure caused by a force majeure event (exceptional weather, natural disaster, decision of the authorities, epidemic…).",
        ],
      },
      {
        title: "Personal data",
        paragraphs: ["Your data is processed in accordance with our privacy policy, available from the website footer."],
      },
      {
        title: "Intellectual property",
        paragraphs: [
          "The texts, photos, videos, logos and design of the website belong to Arabian Desert Home or their authors. Any reproduction without written permission is prohibited.",
        ],
      },
      {
        title: "Complaints",
        paragraphs: [
          "For any remark or complaint, speak to our team on site so that we can resolve it immediately, or write to info@arabiandeserthome.ma. We always seek an amicable solution.",
        ],
      },
      {
        title: "Governing law and disputes",
        paragraphs: [
          "These terms are governed by Moroccan law. In the event of a dispute we first seek an amicable solution; failing that, the courts of Marrakech have jurisdiction, without prejudice to the rights granted to you by Law No. 31-08 (consumer protection) or by the mandatory rules of your country of residence.",
        ],
      },
      {
        title: "Changes to these terms",
        paragraphs: ["We may update these terms; the version that applies to your reservation is the one in force on the day you make it."],
      },
    ],
    updated: "Last updated: October 2026.",
  },
  es: {
    title: "Términos y condiciones",
    intro:
      "Estas condiciones generales regulan el uso del sitio arabiandeserthome.ma y las reservas realizadas con Arabian Desert Home. Al reservar, declara haberlas leído y aceptado.",
    sections: [
      {
        title: "Quiénes somos",
        paragraphs: ["El sitio arabiandeserthome.ma es editado y explotado por la siguiente empresa:"],
      },
      {
        title: "Ámbito de aplicación",
        paragraphs: [
          "Estas condiciones se aplican a toda reserva de estancia, actividad, Day Pass, comida o evento realizada con nosotros: mediante el formulario del sitio, por teléfono, WhatsApp o correo electrónico, o tras un presupuesto aceptado.",
          "Si reserva a través de una plataforma de terceros (Booking.com, Expedia, Trip.com…), las condiciones de dicha plataforma se aplican además; las presentes condiciones las complementan en los puntos que no cubran.",
        ],
      },
      {
        title: "Nuestros servicios",
        paragraphs: [
          "Arabian Desert Home ofrece alojamiento en tiendas y suites, actividades en el desierto de Agafay, Day Pass, un restaurante y la organización de eventos. Las descripciones y fotos del sitio son orientativas; la oferta puede cambiar según la estación y el tiempo.",
        ],
      },
      {
        title: "Precios",
        list: [
          "Los precios se indican en dírhams marroquíes (MAD) o en euros (EUR) según el servicio, y pueden variar según el periodo (tarifas de temporada).",
          "El precio aplicable es el que se muestra en el momento de su solicitud; se recuerda en el correo de confirmación y en la ficha de reserva.",
          "Los niños se benefician de las reducciones indicadas en la página de cada servicio.",
          "En el caso de un presupuesto, los precios son los del presupuesto, válidos hasta la fecha de validez que figura en él.",
        ],
      },
      {
        title: "Reserva y confirmación",
        list: [
          "Su solicitud de reserva no es firme hasta que nuestro equipo la confirme. Normalmente respondemos en un plazo de 24 horas.",
          "La confirmación se envía por correo electrónico, junto con su ficha de reserva, que debe presentar a su llegada.",
          "Un servicio puede no estar disponible (periodo de cierre, completo): le propondremos entonces otras fechas o una alternativa.",
          "Usted es responsable de la exactitud de la información facilitada (datos de contacto, fechas, número de viajeros).",
        ],
      },
      {
        title: "Pago",
        paragraphs: [
          "No se solicita ningún pago en línea al reservar: el pago se realiza en el lugar, como se indica en su ficha de reserva. Para grupos, eventos y presupuestos, las condiciones de pago figuran en el presupuesto aceptado.",
        ],
      },
      {
        title: "Modificación y cancelación por su parte",
        list: [
          "Desde el enlace personal recibido por correo electrónico, puede modificar las fechas de un servicio (sujeto a disponibilidad; el precio puede variar y la reserva vuelve a estar pendiente de confirmación) o cancelar un servicio o toda la reserva.",
          "Le rogamos que nos avise lo antes posible: así podemos liberar la plaza para otros viajeros.",
          "Para eventos, grupos y presupuestos aceptados, se aplican las condiciones de cancelación indicadas en el presupuesto.",
        ],
      },
      {
        title: "Modificación o cancelación por nuestra parte",
        paragraphs: [
          "Podemos vernos obligados a modificar o cancelar un servicio en caso de indisponibilidad, mal tiempo peligroso, motivos de seguridad o fuerza mayor. Le avisaremos lo antes posible y le propondremos nuevas fechas o una alternativa; si no le convienen, puede cancelar y se le reembolsará toda cantidad ya abonada por el servicio cancelado.",
        ],
      },
      {
        title: "Su estancia",
        list: [
          "Los horarios de llegada y de salida se le comunican con la confirmación. Le rogamos que presente su ficha de reserva a su llegada.",
          "Los menores permanecen bajo la responsabilidad de los adultos que los acompañan.",
          "Respete a los demás viajeros, al personal, el material, los animales y el entorno del desierto. Podemos denegar el acceso a cualquier persona cuyo comportamiento ponga en peligro la seguridad o perturbe la tranquilidad de los demás.",
          "Usted es responsable de los daños que cause.",
        ],
      },
      {
        title: "Actividades y seguridad",
        paragraphs: [
          "Las actividades (dromedario, caballo, quad, senderismo, baño…) conllevan riesgos inherentes a su práctica. Siga las instrucciones de nuestros guías y participe solo si su estado de salud lo permite. Le recomendamos contratar un seguro de viaje. Evite dejar objetos de valor sin vigilancia; nuestra responsabilidad se mantiene dentro de los límites previstos por la ley.",
        ],
      },
      {
        title: "Fuerza mayor",
        paragraphs: [
          "Ninguna de las partes es responsable de un incumplimiento causado por un caso de fuerza mayor (fenómeno meteorológico excepcional, catástrofe natural, decisión de las autoridades, epidemia…).",
        ],
      },
      {
        title: "Datos personales",
        paragraphs: ["Sus datos se tratan de acuerdo con nuestra política de privacidad, accesible desde el pie de página del sitio."],
      },
      {
        title: "Propiedad intelectual",
        paragraphs: [
          "Los textos, fotos, vídeos, logotipos y el diseño del sitio pertenecen a Arabian Desert Home o a sus autores. Queda prohibida toda reproducción sin autorización escrita.",
        ],
      },
      {
        title: "Reclamaciones",
        paragraphs: [
          "Para cualquier comentario o reclamación, hable con nuestro equipo en el lugar para que podamos resolverlo de inmediato, o escríbanos a info@arabiandeserthome.ma. Siempre buscamos una solución amistosa.",
        ],
      },
      {
        title: "Ley aplicable y litigios",
        paragraphs: [
          "Estas condiciones se rigen por el derecho marroquí. En caso de desacuerdo, buscamos primero una solución amistosa; en su defecto, son competentes los tribunales de Marrakech, sin perjuicio de los derechos que le reconocen la ley n.º 31-08 (protección del consumidor) o las normas imperativas de su país de residencia.",
        ],
      },
      {
        title: "Modificación de las condiciones",
        paragraphs: ["Podemos actualizar estas condiciones; la versión aplicable a su reserva es la vigente el día en que la realiza."],
      },
    ],
    updated: "Última actualización: octubre de 2026.",
  },
  it: {
    title: "Termini e condizioni",
    intro:
      "Le presenti condizioni generali disciplinano l'utilizzo del sito arabiandeserthome.ma e le prenotazioni effettuate presso Arabian Desert Home. Prenotando, dichiarate di averle lette e accettate.",
    sections: [
      {
        title: "Chi siamo",
        paragraphs: ["Il sito arabiandeserthome.ma è pubblicato e gestito dalla seguente società:"],
      },
      {
        title: "Ambito di applicazione",
        paragraphs: [
          "Queste condizioni si applicano a ogni prenotazione di soggiorno, attività, Day Pass, pasto o evento effettuata presso di noi: tramite il modulo del sito, per telefono, WhatsApp o email, oppure a seguito di un preventivo accettato.",
          "Se prenotate tramite una piattaforma terza (Booking.com, Expedia, Trip.com…), si applicano anche le condizioni di tale piattaforma; le presenti condizioni le integrano per i punti che esse non coprono.",
        ],
      },
      {
        title: "I nostri servizi",
        paragraphs: [
          "Arabian Desert Home offre alloggio in tende e suite, attività nel deserto di Agafay, Day Pass, un ristorante e l'organizzazione di eventi. Le descrizioni e le foto del sito sono indicative; l'offerta può cambiare in base alla stagione e al meteo.",
        ],
      },
      {
        title: "Prezzi",
        list: [
          "I prezzi sono indicati in dirham marocchini (MAD) o in euro (EUR) a seconda del servizio e possono variare in base al periodo (tariffe stagionali).",
          "Il prezzo applicabile è quello mostrato al momento della vostra richiesta; viene riportato nell'email di conferma e nella scheda di prenotazione.",
          "I bambini beneficiano delle riduzioni indicate nella pagina di ciascun servizio.",
          "Per un preventivo, i prezzi sono quelli del preventivo, validi fino alla data di validità in esso indicata.",
        ],
      },
      {
        title: "Prenotazione e conferma",
        list: [
          "La vostra richiesta di prenotazione non è definitiva finché non viene confermata dal nostro team. Rispondiamo di norma entro 24 ore.",
          "La conferma viene inviata via email, insieme alla scheda di prenotazione da presentare all'arrivo.",
          "Un servizio può non essere disponibile (periodo di chiusura, tutto esaurito): vi proporremo allora altre date o un'alternativa.",
          "Siete responsabili dell'esattezza delle informazioni fornite (recapiti, date, numero di viaggiatori).",
        ],
      },
      {
        title: "Pagamento",
        paragraphs: [
          "Al momento della prenotazione non viene richiesto alcun pagamento online: il pagamento avviene in loco, come indicato nella vostra scheda di prenotazione. Per gruppi, eventi e preventivi, le modalità di pagamento sono indicate nel preventivo accettato.",
        ],
      },
      {
        title: "Modifica e annullamento da parte vostra",
        list: [
          "Dal link personale ricevuto via email potete modificare le date di un servizio (salvo disponibilità; il prezzo può variare e la prenotazione torna in attesa di conferma) oppure annullare un servizio o l'intera prenotazione.",
          "Vi preghiamo di avvisarci il prima possibile: ci permette di liberare il posto per altri viaggiatori.",
          "Per eventi, gruppi e preventivi accettati si applicano le condizioni di annullamento indicate nel preventivo.",
        ],
      },
      {
        title: "Modifica o annullamento da parte nostra",
        paragraphs: [
          "Potremmo dover modificare o annullare un servizio in caso di indisponibilità, maltempo pericoloso, ragioni di sicurezza o forza maggiore. Vi avviseremo il prima possibile e vi proporremo nuove date o un'alternativa; se non vi vanno bene potete annullare e qualsiasi somma già versata per il servizio annullato vi sarà rimborsata.",
        ],
      },
      {
        title: "Il vostro soggiorno",
        list: [
          "Gli orari di arrivo e di partenza vi vengono comunicati con la conferma. Vi preghiamo di presentare la scheda di prenotazione all'arrivo.",
          "I minori restano sotto la responsabilità degli adulti che li accompagnano.",
          "Rispettate gli altri viaggiatori, il personale, le attrezzature, gli animali e l'ambiente del deserto. Possiamo negare l'accesso a chiunque con il proprio comportamento metta a rischio la sicurezza o disturbi la tranquillità degli altri.",
          "Siete responsabili dei danni che causate.",
        ],
      },
      {
        title: "Attività e sicurezza",
        paragraphs: [
          "Le attività (dromedario, cavallo, quad, escursioni, nuoto…) comportano rischi inerenti alla loro pratica. Seguite le istruzioni delle nostre guide e partecipate solo se le vostre condizioni di salute lo consentono. Vi consigliamo di stipulare un'assicurazione di viaggio. Evitate di lasciare oggetti di valore incustoditi; la nostra responsabilità resta impegnata nei limiti previsti dalla legge.",
        ],
      },
      {
        title: "Forza maggiore",
        paragraphs: [
          "Nessuna delle parti è responsabile di un inadempimento causato da un evento di forza maggiore (fenomeno meteorologico eccezionale, calamità naturale, decisione delle autorità, epidemia…).",
        ],
      },
      {
        title: "Dati personali",
        paragraphs: ["I vostri dati sono trattati in conformità con la nostra informativa sulla privacy, accessibile dal piè di pagina del sito."],
      },
      {
        title: "Proprietà intellettuale",
        paragraphs: [
          "I testi, le foto, i video, i loghi e il design del sito appartengono ad Arabian Desert Home o ai rispettivi autori. È vietata qualsiasi riproduzione senza autorizzazione scritta.",
        ],
      },
      {
        title: "Reclami",
        paragraphs: [
          "Per qualsiasi osservazione o reclamo, parlatene con il nostro team in loco in modo da poterlo risolvere subito, oppure scriveteci a info@arabiandeserthome.ma. Cerchiamo sempre una soluzione amichevole.",
        ],
      },
      {
        title: "Legge applicabile e controversie",
        paragraphs: [
          "Le presenti condizioni sono soggette al diritto marocchino. In caso di controversia cerchiamo anzitutto una soluzione amichevole; in mancanza, sono competenti i tribunali di Marrakech, fatti salvi i diritti riconosciuti dalla legge n. 31-08 (tutela del consumatore) o dalle norme inderogabili del vostro paese di residenza.",
        ],
      },
      {
        title: "Modifica delle condizioni",
        paragraphs: ["Possiamo aggiornare queste condizioni; la versione applicabile alla vostra prenotazione è quella in vigore il giorno in cui la effettuate."],
      },
    ],
    updated: "Ultimo aggiornamento: ottobre 2026.",
  },
};

export function ConditionsContent() {
  const { language } = useLanguage();
  const copy = COPY[language];
  // The first section identifies the company: show its registry details.
  const sections = copy.sections.map((section, i) => (i === 0 ? { ...section, facts: companyFacts(language) } : section));
  return <LegalDocument copy={{ ...copy, sections }} />;
}
