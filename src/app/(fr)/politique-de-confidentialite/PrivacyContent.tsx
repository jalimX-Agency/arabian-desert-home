"use client";

import { useLanguage, type Language } from "@/lib/i18n/context";
import { LegalDocument, type LegalCopy } from "@/components/arabian/LegalDocument";
import { companyFacts } from "@/lib/company";

const COPY: Record<Language, LegalCopy> = {
  fr: {
    title: "Politique de confidentialité",
    intro:
      "Cette page explique quelles données personnelles Arabian Desert Home collecte sur ce site, pourquoi, combien de temps nous les conservons et comment exercer vos droits.",
    sections: [
      {
        title: "Qui est responsable de vos données ?",
        paragraphs: [
          "Les données personnelles collectées sur ce site sont traitées par la société suivante :",
        ],
      },
      {
        title: "Les données que nous collectons",
        list: [
          "Demande de réservation ou de devis : nom, prénom, email, téléphone, détails du séjour, demandes particulières et langue du site utilisée.",
          "Formulaire de contact : votre nom, votre email et votre message.",
          "Après votre séjour : votre adresse email peut servir à vous remercier et à vous inviter à laisser un avis Google.",
          "Mesure d'audience (uniquement avec votre accord) : pages consultées, clics sur le téléphone et WhatsApp, envois du formulaire de réservation, type d'appareil et pays approximatif.",
        ],
      },
      {
        title: "Pourquoi, et sur quelle base légale",
        list: [
          "Traiter votre réservation ou votre devis et vous envoyer confirmations, modifications et fiche de réservation : exécution d'un contrat ou de mesures précontractuelles.",
          "Répondre à vos messages et vous écrire après votre séjour : notre intérêt légitime à assurer le service client.",
          "Mesurer l'audience du site : votre consentement.",
        ],
      },
      {
        title: "Cookies et mesure d'audience",
        paragraphs: [
          "Nous utilisons Google Analytics 4 pour comprendre comment le site est utilisé. Il n'est chargé qu'après votre accord via la bannière cookies : sans accord, aucun cookie de mesure n'est déposé et aucune donnée n'est envoyée à Google. Les cookies concernés (_ga, _ga_*) ont une durée maximale de 2 ans. Nous n'utilisons ni publicité ni personnalisation publicitaire. Votre choix est redemandé tous les 6 mois et vous pouvez le modifier à tout moment via le lien « Cookies » en bas de chaque page.",
          "D'autres informations sont enregistrées dans votre navigateur uniquement pour faire fonctionner le site (langue choisie, thème, mémorisation de votre choix de cookies) ; elles ne nécessitent pas de consentement.",
        ],
      },
      {
        title: "Qui reçoit vos données ?",
        paragraphs: [
          "Nous ne vendons pas vos données. Nos prestataires techniques les traitent pour notre compte : hébergement (Vercel), base de données (Neon), envoi d'emails (Resend) et, avec votre accord, mesure d'audience (Google). Certains sont situés hors de l'Union européenne ou du Maroc ; les transferts sont encadrés par des garanties appropriées.",
        ],
      },
      {
        title: "Combien de temps les conservons-nous ?",
        paragraphs: [
          "Les données de réservation sont conservées le temps nécessaire à la gestion de votre séjour, puis pendant les durées imposées par la loi (obligations comptables notamment). Les messages de contact sont conservés le temps de traiter votre demande.",
        ],
      },
      {
        title: "Vos droits",
        paragraphs: [
          "Vous pouvez demander l'accès, la rectification ou la suppression de vos données, vous opposer à leur traitement, en demander la limitation ou la portabilité, et retirer votre consentement à tout moment, en écrivant à info@arabiandeserthome.ma. Vous pouvez aussi saisir l'autorité de protection des données de votre pays (par exemple la CNIL en France ou la CNDP au Maroc).",
        ],
      },
    ],
    updated: "Dernière mise à jour : octobre 2026.",
  },
  en: {
    title: "Privacy policy",
    intro:
      "This page explains which personal data Arabian Desert Home collects on this website, why, how long we keep it and how to exercise your rights.",
    sections: [
      {
        title: "Who is responsible for your data?",
        paragraphs: [
          "Personal data collected on this website is processed by the following company:",
        ],
      },
      {
        title: "The data we collect",
        list: [
          "Reservation or quote request: first and last name, email, phone number, stay details, special requests and the site language you used.",
          "Contact form: your name, email and message.",
          "After your stay: we may use your email address to thank you and invite you to leave a Google review.",
          "Audience measurement (only with your consent): pages viewed, clicks on phone and WhatsApp links, reservation form submissions, device type and approximate country.",
        ],
      },
      {
        title: "Why, and on what legal basis",
        list: [
          "Processing your reservation or quote and sending you confirmations, changes and your reservation voucher: performance of a contract or pre-contractual steps.",
          "Answering your messages and writing to you after your stay: our legitimate interest in providing customer service.",
          "Measuring site audience: your consent.",
        ],
      },
      {
        title: "Cookies and audience measurement",
        paragraphs: [
          "We use Google Analytics 4 to understand how the site is used. It is loaded only after you accept through the cookie banner: without your consent no measurement cookie is set and no data is sent to Google. The cookies involved (_ga, _ga_*) last up to 2 years. We run no advertising and no ad personalisation. Your choice is asked again every 6 months and you can change it at any time with the “Cookies” link at the bottom of any page.",
          "Other information is stored in your browser only to make the site work (chosen language, theme, remembering your cookie choice); it does not require consent.",
        ],
      },
      {
        title: "Who receives your data?",
        paragraphs: [
          "We do not sell your data. Our technical providers process it on our behalf: hosting (Vercel), database (Neon), email delivery (Resend) and, with your consent, audience measurement (Google). Some are located outside the European Union or Morocco; transfers are covered by appropriate safeguards.",
        ],
      },
      {
        title: "How long do we keep it?",
        paragraphs: [
          "Reservation data is kept as long as needed to manage your stay, then for the periods required by law (accounting obligations in particular). Contact messages are kept for as long as needed to handle your request.",
        ],
      },
      {
        title: "Your rights",
        paragraphs: [
          "You may ask for access to, correction or deletion of your data, object to its processing, request restriction or portability, and withdraw your consent at any time, by writing to info@arabiandeserthome.ma. You may also lodge a complaint with the data protection authority of your country (for example the CNIL in France or the CNDP in Morocco).",
        ],
      },
    ],
    updated: "Last updated: October 2026.",
  },
  es: {
    title: "Política de privacidad",
    intro:
      "Esta página explica qué datos personales recoge Arabian Desert Home en este sitio web, para qué, durante cuánto tiempo los conservamos y cómo ejercer sus derechos.",
    sections: [
      {
        title: "¿Quién es el responsable de sus datos?",
        paragraphs: [
          "Los datos personales recogidos en este sitio web son tratados por la siguiente empresa:",
        ],
      },
      {
        title: "Los datos que recogemos",
        list: [
          "Solicitud de reserva o de presupuesto: nombre y apellidos, correo electrónico, teléfono, detalles de la estancia, peticiones especiales y el idioma del sitio utilizado.",
          "Formulario de contacto: su nombre, correo electrónico y mensaje.",
          "Después de su estancia: podemos usar su correo electrónico para darle las gracias e invitarle a dejar una reseña en Google.",
          "Medición de audiencia (solo con su consentimiento): páginas consultadas, clics en el teléfono y WhatsApp, envíos del formulario de reserva, tipo de dispositivo y país aproximado.",
        ],
      },
      {
        title: "Para qué y con qué base legal",
        list: [
          "Tramitar su reserva o presupuesto y enviarle confirmaciones, modificaciones y la ficha de reserva: ejecución de un contrato o medidas precontractuales.",
          "Responder a sus mensajes y escribirle después de su estancia: nuestro interés legítimo en atender a los clientes.",
          "Medir la audiencia del sitio: su consentimiento.",
        ],
      },
      {
        title: "Cookies y medición de audiencia",
        paragraphs: [
          "Utilizamos Google Analytics 4 para entender cómo se usa el sitio. Solo se carga después de que usted acepte en el banner de cookies: sin su consentimiento no se instala ninguna cookie de medición ni se envían datos a Google. Las cookies implicadas (_ga, _ga_*) duran hasta 2 años. No usamos publicidad ni personalización publicitaria. Su elección se vuelve a solicitar cada 6 meses y puede cambiarla en cualquier momento con el enlace «Cookies» al pie de cualquier página.",
          "Otra información se guarda en su navegador solo para que el sitio funcione (idioma elegido, tema, recordar su elección sobre cookies); no requiere consentimiento.",
        ],
      },
      {
        title: "¿Quién recibe sus datos?",
        paragraphs: [
          "No vendemos sus datos. Nuestros proveedores técnicos los tratan por cuenta nuestra: alojamiento (Vercel), base de datos (Neon), envío de correos (Resend) y, con su consentimiento, medición de audiencia (Google). Algunos se encuentran fuera de la Unión Europea o de Marruecos; las transferencias cuentan con garantías adecuadas.",
        ],
      },
      {
        title: "¿Cuánto tiempo los conservamos?",
        paragraphs: [
          "Los datos de reserva se conservan el tiempo necesario para gestionar su estancia y, después, durante los plazos que exige la ley (en particular, las obligaciones contables). Los mensajes de contacto se conservan mientras sea necesario para atender su solicitud.",
        ],
      },
      {
        title: "Sus derechos",
        paragraphs: [
          "Puede solicitar el acceso, la rectificación o la supresión de sus datos, oponerse a su tratamiento, solicitar su limitación o portabilidad y retirar su consentimiento en cualquier momento escribiendo a info@arabiandeserthome.ma. También puede presentar una reclamación ante la autoridad de protección de datos de su país (por ejemplo, la AEPD en España o la CNDP en Marruecos).",
        ],
      },
    ],
    updated: "Última actualización: octubre de 2026.",
  },
  it: {
    title: "Informativa sulla privacy",
    intro:
      "Questa pagina spiega quali dati personali Arabian Desert Home raccoglie su questo sito, per quali finalità, per quanto tempo li conserviamo e come esercitare i vostri diritti.",
    sections: [
      {
        title: "Chi è responsabile dei vostri dati?",
        paragraphs: [
          "I dati personali raccolti su questo sito sono trattati dalla seguente società:",
        ],
      },
      {
        title: "I dati che raccogliamo",
        list: [
          "Richiesta di prenotazione o di preventivo: nome e cognome, email, telefono, dettagli del soggiorno, richieste particolari e lingua del sito utilizzata.",
          "Modulo di contatto: nome, email e messaggio.",
          "Dopo il soggiorno: potremmo usare il vostro indirizzo email per ringraziarvi e invitarvi a lasciare una recensione su Google.",
          "Misurazione del pubblico (solo con il vostro consenso): pagine visualizzate, clic su telefono e WhatsApp, invii del modulo di prenotazione, tipo di dispositivo e paese approssimativo.",
        ],
      },
      {
        title: "Perché e su quale base giuridica",
        list: [
          "Gestire la prenotazione o il preventivo e inviarvi conferme, modifiche e la scheda di prenotazione: esecuzione di un contratto o misure precontrattuali.",
          "Rispondere ai vostri messaggi e scrivervi dopo il soggiorno: il nostro legittimo interesse a garantire l'assistenza clienti.",
          "Misurare il pubblico del sito: il vostro consenso.",
        ],
      },
      {
        title: "Cookie e misurazione del pubblico",
        paragraphs: [
          "Utilizziamo Google Analytics 4 per capire come viene usato il sito. Viene caricato solo dopo la vostra accettazione tramite il banner dei cookie: senza il vostro consenso non viene installato alcun cookie di misurazione né inviato alcun dato a Google. I cookie interessati (_ga, _ga_*) durano fino a 2 anni. Non utilizziamo pubblicità né personalizzazione pubblicitaria. La vostra scelta viene richiesta di nuovo ogni 6 mesi e potete modificarla in qualsiasi momento con il link «Cookie» in fondo a ogni pagina.",
          "Altre informazioni vengono memorizzate nel vostro browser solo per far funzionare il sito (lingua scelta, tema, memorizzazione della scelta sui cookie); non richiedono consenso.",
        ],
      },
      {
        title: "Chi riceve i vostri dati?",
        paragraphs: [
          "Non vendiamo i vostri dati. I nostri fornitori tecnici li trattano per nostro conto: hosting (Vercel), database (Neon), invio delle email (Resend) e, con il vostro consenso, misurazione del pubblico (Google). Alcuni si trovano fuori dall'Unione Europea o dal Marocco; i trasferimenti sono coperti da garanzie adeguate.",
        ],
      },
      {
        title: "Per quanto tempo li conserviamo?",
        paragraphs: [
          "I dati di prenotazione sono conservati per il tempo necessario a gestire il soggiorno e poi per i periodi previsti dalla legge (in particolare gli obblighi contabili). I messaggi di contatto sono conservati per il tempo necessario a gestire la vostra richiesta.",
        ],
      },
      {
        title: "I vostri diritti",
        paragraphs: [
          "Potete chiedere l'accesso, la rettifica o la cancellazione dei vostri dati, opporvi al loro trattamento, chiederne la limitazione o la portabilità e revocare il consenso in qualsiasi momento scrivendo a info@arabiandeserthome.ma. Potete inoltre presentare reclamo all'autorità di protezione dei dati del vostro paese (ad esempio il Garante per la protezione dei dati personali in Italia o la CNDP in Marocco).",
        ],
      },
    ],
    updated: "Ultimo aggiornamento: ottobre 2026.",
  },
};

export function PrivacyContent() {
  const { language } = useLanguage();
  const copy = COPY[language];
  // The first section is the controller's identification: show the company's registry details.
  const sections = copy.sections.map((section, i) => (i === 0 ? { ...section, facts: companyFacts(language) } : section));
  return <LegalDocument copy={{ ...copy, sections }} />;
}
