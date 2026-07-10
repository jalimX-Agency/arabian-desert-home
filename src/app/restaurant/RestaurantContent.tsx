"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CTASection } from "@/components/arabian/CTASection";
import { useLanguage, withLocale, pickLocalized, type Language } from "@/lib/i18n/context";
import { Users, Sparkles, Music } from "lucide-react";

interface DiningVenue {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  image: string;
  capacity: string | null;
  order: number;
  nameEn?: string;
  descriptionEn?: string;
  longDescriptionEn?: string;
  nameEs?: string;
  descriptionEs?: string;
  longDescriptionEs?: string;
  nameIt?: string;
  descriptionIt?: string;
  longDescriptionIt?: string;
}

const smoothEase = [0.25, 0.46, 0.45, 0.94] as const;

const revealUp = {
  hidden: { opacity: 0, y: 50 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay, ease: smoothEase },
  }),
};

const revealScale = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.9, delay, ease: smoothEase },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.8, delay },
  }),
};


const COPY: Record<Language, {
  menusLabel: string;
  menusTitle1: string;
  menusTitle2: string;
  menusPricing: (from: React.ReactNode, to: React.ReactNode) => React.ReactNode;
  menus: { num: string; name: string; items: string[] }[];
}> = {
  fr: {
    menusLabel: "Nos Menus",
    menusTitle1: "Saveurs du",
    menusTitle2: "Maroc",
    menusPricing: (from, to) => <>Tarif adulte entre {from} et {to} selon le menu choisi.</>,
    menus: [
      { num: "01", name: "Menu Tradition", items: ["Zaalouk", "Tajine de poulet au citron confit", "Coupe de fruits"] },
      { num: "02", name: "Menu Saveurs", items: ["Taktouka", "Tajine de bœuf aux pruneaux", "Flan chocolat caramel"] },
      { num: "03", name: "Menu Végétarien", items: ["Soupe marocaine", "Tajine végétarien", "Pâtisseries marocaines & thé à la menthe"] },
      { num: "04", name: "Menu Gourmand", items: ["Salade marocaine", "Tajine de boulettes de bœuf", "Glace artisanale"] },
    ],
  },
  en: {
    menusLabel: "Our Menus",
    menusTitle1: "Flavors of",
    menusTitle2: "Morocco",
    menusPricing: (from, to) => <>Adult rate between {from} and {to} depending on the menu chosen.</>,
    menus: [
      { num: "01", name: "Tradition Menu", items: ["Zaalouk", "Chicken tagine with preserved lemon", "Fruit cup"] },
      { num: "02", name: "Flavors Menu", items: ["Taktouka", "Beef tagine with prunes", "Chocolate caramel flan"] },
      { num: "03", name: "Vegetarian Menu", items: ["Moroccan soup", "Vegetarian tagine", "Moroccan pastries & mint tea"] },
      { num: "04", name: "Gourmet Menu", items: ["Moroccan salad", "Beef meatball tagine", "Artisanal ice cream"] },
    ],
  },
  es: {
    menusLabel: "Nuestros Menús",
    menusTitle1: "Sabores de",
    menusTitle2: "Marruecos",
    menusPricing: (from, to) => <>Tarifa adulto entre {from} y {to} según el menú elegido.</>,
    menus: [
      { num: "01", name: "Menú Tradición", items: ["Zaalouk", "Tajín de pollo al limón confitado", "Copa de frutas"] },
      { num: "02", name: "Menú Sabores", items: ["Taktouka", "Tajín de ternera con ciruelas", "Flan de chocolate y caramelo"] },
      { num: "03", name: "Menú Vegetariano", items: ["Sopa marroquí", "Tajín vegetariano", "Pastelería marroquí & té a la menta"] },
      { num: "04", name: "Menú Gourmet", items: ["Ensalada marroquí", "Tajín de albóndigas de ternera", "Helado artesanal"] },
    ],
  },
  it: {
    menusLabel: "I Nostri Menu",
    menusTitle1: "Sapori del",
    menusTitle2: "Marocco",
    menusPricing: (from, to) => <>Tariffa adulto tra {from} e {to} a seconda del menu scelto.</>,
    menus: [
      { num: "01", name: "Menu Tradizione", items: ["Zaalouk", "Tajine di pollo al limone confit", "Coppa di frutta"] },
      { num: "02", name: "Menu Sapori", items: ["Taktouka", "Tajine di manzo alle prugne", "Flan cioccolato e caramello"] },
      { num: "03", name: "Menu Vegetariano", items: ["Zuppa marocchina", "Tajine vegetariano", "Pasticceria marocchina & tè alla menta"] },
      { num: "04", name: "Menu Gourmet", items: ["Insalata marocchina", "Tajine di polpette di manzo", "Gelato artigianale"] },
    ],
  },
};

export function RestaurantContent({ venues }: { venues: DiningVenue[] }) {
  const { t, language } = useLanguage();
  const data = venues;
  const c = COPY[language];

  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const introRef = useRef(null);
  const introInView = useInView(introRef, { once: true, margin: "-80px" });
  const venuesRef = useRef(null);
  const venuesInView = useInView(venuesRef, { once: true, margin: "-80px" });
  const entertainmentRef = useRef(null);
  const entertainmentInView = useInView(entertainmentRef, { once: true, margin: "-80px" });

  return (
    <>
      {/* ── Hero ── */}
      <section ref={heroRef} className="relative h-[60vh] md:h-[70vh] min-h-[500px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/dining/restaurant-outdoor.png" alt="Restaurant en plein air au désert d'Agafay" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>
        <div className="absolute inset-0 grain-overlay pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: smoothEase }}
          className="relative z-10 w-full max-w-lg backdrop-blur-xl bg-black/30 border border-white/10 rounded-2xl p-8 md:p-12 mx-6 md:mx-10 mb-8 md:mb-12 md:mr-auto md:ml-10"
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: smoothEase }}
            className="luxury-label text-amber block mb-4"
          >
            {t("restaurant.heroLabel")}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.3, ease: smoothEase }}
            className="heading-display text-3xl md:text-5xl lg:text-6xl text-white mb-4"
          >
            {t("restaurant.heroTitle")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5, ease: smoothEase }}
            className="heading-editorial italic text-lg md:text-xl text-white/70 mb-5"
          >
            {t("restaurant.heroSubtitle")}
          </motion.p>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={heroInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.7, ease: smoothEase }}
            className="h-px w-16 bg-amber/60 origin-left"
          />
        </motion.div>
      </section>

      {/* ── Intro ── */}
      <section ref={introRef} className="py-20 md:py-28 px-6 md:px-10 relative">
        <div className="absolute inset-0 pattern-dots pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div variants={fadeIn} initial="hidden" animate={introInView ? "visible" : "hidden"} custom={0} className="divider-accent max-w-[120px] mx-auto mb-10" />
          <motion.p variants={revealUp} initial="hidden" animate={introInView ? "visible" : "hidden"} custom={0.3} className="body-editorial text-lg md:text-xl text-muted-foreground">
            {t("restaurant.introText")}
          </motion.p>
        </div>
      </section>

      {/* ── Venues ── */}
      <section ref={venuesRef} className="py-16 md:py-24 px-6 md:px-10 relative">
        <div className="absolute inset-0 pattern-organic opacity-50 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div variants={fadeIn} initial="hidden" animate={venuesInView ? "visible" : "hidden"} custom={0} className="mb-4">
            <span className="mono-number text-amber/10 text-6xl md:text-8xl leading-none block">
              {t("restaurant.venuesSectionNumber")}
            </span>
          </motion.div>
          <motion.span variants={revealUp} initial="hidden" animate={venuesInView ? "visible" : "hidden"} custom={0.1} className="luxury-label text-amber block mb-4">
            {t("restaurant.venuesLabel")}
          </motion.span>
          <motion.h2 variants={revealUp} initial="hidden" animate={venuesInView ? "visible" : "hidden"} custom={0.2} className="heading-display text-3xl md:text-5xl mb-4">
            {t("restaurant.venuesTitle1")}
            <br />
            <span className="italic text-amber">{t("restaurant.venuesTitle2")}</span>
          </motion.h2>
          <motion.div variants={fadeIn} initial="hidden" animate={venuesInView ? "visible" : "hidden"} custom={0.3} className="divider-accent max-w-xs mb-16" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.map((venue, i) => {
              const name = pickLocalized(language, venue.name, venue.nameEn, venue.nameEs, venue.nameIt);
              const description = pickLocalized(language, venue.description, venue.descriptionEn, venue.descriptionEs, venue.descriptionIt);
              const longDescription = pickLocalized(language, venue.longDescription, venue.longDescriptionEn, venue.longDescriptionEs, venue.longDescriptionIt);
              return (
                <motion.div
                  key={venue.id}
                  variants={revealScale}
                  initial="hidden"
                  animate={venuesInView ? "visible" : "hidden"}
                  custom={0.4 + i * 0.15}
                  className="group glass-card card-warm overflow-hidden"
                >
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img src={venue.image} alt={name} className="w-full h-full object-cover img-luxury" />
                    <div className="absolute inset-0 bg-amber/0 group-hover:bg-amber/10 transition-all duration-500" />
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber/[0.08] rounded-bl-3xl" />
                  </div>
                  <div className="p-6 md:p-8">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="heading-editorial text-xl md:text-2xl group-hover:text-amber transition-colors duration-400">{name}</h3>
                      {venue.capacity && (
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <div className="w-6 h-6 rounded-full bg-amber/10 border border-amber/15 flex items-center justify-center">
                            <Users className="w-3 h-3 text-amber" />
                          </div>
                          <span className="text-xs">{venue.capacity}</span>
                        </div>
                      )}
                    </div>
                    <div className="divider-accent max-w-[60px] mb-4" />
                    <p className="text-sm text-muted-foreground mb-3 body-editorial">{description}</p>
                    <p className="text-sm text-muted-foreground/70 leading-relaxed body-editorial">{longDescription}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Menus ── */}
      <section className="py-16 md:py-24 px-6 md:px-10 relative">
        <div className="absolute inset-0 pattern-dots pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <span className="luxury-label text-amber block mb-3">{c.menusLabel}</span>
            <h2 className="heading-display text-3xl md:text-4xl mb-3">
              {c.menusTitle1} <span className="italic text-amber">{c.menusTitle2}</span>
            </h2>
            <p className="body-editorial text-muted-foreground max-w-xl mx-auto text-sm">
              {c.menusPricing(
                <span className="text-amber mono-number">200</span>,
                <span className="text-amber mono-number">250 DH</span>
              )}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {c.menus.map((menu) => (
              <div key={menu.num} className="glass-card card-warm p-7 flex flex-col">
                <span className="mono-number text-amber/20 text-5xl leading-none mb-4">{menu.num}</span>
                <h3 className="heading-editorial text-lg mb-4">{menu.name}</h3>
                <div className="divider-accent max-w-[50px] mb-5" />
                <ul className="space-y-2 flex-1">
                  {menu.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground body-editorial">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber/50 mt-1.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Entertainment ── */}
      <section ref={entertainmentRef} className="py-20 md:py-28 px-6 md:px-10 relative">
        <div className="absolute inset-0 pattern-dots pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div variants={revealUp} initial="hidden" animate={entertainmentInView ? "visible" : "hidden"} custom={0}>
              <span className="mono-number text-amber/10 text-6xl md:text-8xl leading-none block mb-3">
                {t("restaurant.entertainmentSectionNumber")}
              </span>
              <span className="luxury-label text-amber block mb-4">{t("restaurant.entertainmentLabel")}</span>
              <h2 className="heading-display text-3xl md:text-4xl mb-6">
                {t("restaurant.entertainmentTitle1")}
                <br />
                <span className="italic text-amber">{t("restaurant.entertainmentTitle2")}</span>
              </h2>
              <div className="divider-accent max-w-[120px] mb-8" />
              <p className="body-editorial text-muted-foreground mb-8">{t("restaurant.entertainmentText")}</p>

              <div className="space-y-5">
                {[
                  { icon: Sparkles, label: t("restaurant.entertainmentDance"), desc: t("restaurant.entertainmentDanceDesc") },
                  { icon: Music, label: t("restaurant.entertainmentMusic"), desc: t("restaurant.entertainmentMusicDesc") },
                  { icon: Sparkles, label: t("restaurant.entertainmentLights"), desc: t("restaurant.entertainmentLightsDesc") },
                ].map(({ icon: Icon, label, desc }) => (
                  <div key={label} className="flex items-start gap-4 p-4 rounded-2xl glass-card card-warm cursor-pointer group/item">
                    <div className="w-10 h-10 rounded-xl bg-amber/10 border border-amber/15 flex items-center justify-center shrink-0 group-hover/item:bg-amber/20 group-hover/item:border-amber/30 transition-all duration-400">
                      <Icon className="w-5 h-5 text-amber" />
                    </div>
                    <div>
                      <span className="heading-editorial text-base">{label}</span>
                      <p className="text-xs text-muted-foreground mt-0.5 body-editorial">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={revealScale} initial="hidden" animate={entertainmentInView ? "visible" : "hidden"} custom={0.3} className="relative">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl relative">
                <img src="https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/dining/dar-agafay.png" alt="Soirée d'animation au Dar Agafay — dîner sous les étoiles" className="w-full h-full object-cover img-luxury" />
                <div className="absolute inset-0 bg-amber/0 hover:bg-amber/10 transition-all duration-500 rounded-2xl" />
              </div>

              <div className="absolute -bottom-6 -left-4 md:-left-8 glass-card p-6 max-w-sm">
                <p className="text-sm text-muted-foreground leading-relaxed body-editorial">
                  {t("restaurant.pricingNote")}{" "}
                  <span className="text-amber mono-number">200</span>{" "}
                  {t("restaurant.pricingNoteAnd")}{" "}
                  <span className="text-amber mono-number">250 DH</span>
                  {", "}
                  {t("restaurant.pricingNoteCurrency")}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <CTASection
        label={t("restaurant.ctaLabel")}
        title={t("restaurant.ctaTitle")}
        buttonText={t("restaurant.ctaButton")}
        buttonHref={withLocale(language, "/contact")}
      />
    </>
  );
}
