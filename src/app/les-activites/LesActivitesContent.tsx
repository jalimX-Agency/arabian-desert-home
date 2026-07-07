"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { CTASection } from "@/components/arabian/CTASection";
import { useLanguage } from "@/lib/i18n/context";
import { Clock, Check, Bus, Calendar, ArrowRight } from "lucide-react";

interface Activity {
  id: string;
  name: string;
  nameEn: string;
  slug: string;
  description: string;
  descriptionEn: string;
  longDescription: string;
  duration: string;
  price: number;
  originalPrice?: number | null;
  currency: string;
  image: string;
  category: string;
  includes: string;
  includesEn: string;
  schedule: string;
  transportIncluded: boolean;
  order: number;
  featured: boolean;
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


export function LesActivitesContent({ activities }: { activities: Activity[] }) {
  const { t, language } = useLanguage();
  const isEn = language === "en";
  const loc = (fr: string, en: string) => (isEn && en) ? en : fr;
  const data = activities;

  const individualActivities = data.filter((a) => a.category === "Activité");
  const experienceActivities = data.filter(
    (a) => a.category === "Expérience" || a.category === "Aventure"
  );

  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const individualRef = useRef(null);
  const individualInView = useInView(individualRef, { once: true, margin: "-80px" });
  const experiencesRef = useRef(null);
  const experiencesInView = useInView(experiencesRef, { once: true, margin: "-80px" });

  return (
    <>
      {/* ── Hero Section ── */}
      <section ref={heroRef} className="relative">
        <div className="relative h-[40vh] md:h-[50vh] w-full overflow-hidden">
          <img
            src="https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/activities/activity-horse.png"
            alt="Activités au désert d'Agafay — randonnées équestres et dromadaires"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
          <div className="absolute inset-0 bg-amber/[0.06]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: smoothEase }}
          className="-mt-20 md:-mt-20 relative z-10 bg-background/90 backdrop-blur-xl border border-amber/10 rounded-t-3xl"
        >
          <div className="max-w-4xl mx-auto px-6 md:px-12 py-10 md:py-14">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.15, ease: smoothEase }}
              className="luxury-label text-amber block mb-4"
            >
              {t("activities.heroLabel")}
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.3, ease: smoothEase }}
              className="heading-display text-4xl md:text-6xl lg:text-7xl mb-5"
            >
              {t("activities.heroTitle")}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5, ease: smoothEase }}
              className="heading-editorial italic text-xl md:text-2xl text-muted-foreground"
            >
              {t("activities.heroSubtitle")}
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* ── Individual Activities ── */}
      <section ref={individualRef} className="py-20 md:py-28 px-6 md:px-10 relative">
        <div className="absolute inset-0 pattern-dots pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div variants={fadeIn} initial="hidden" animate={individualInView ? "visible" : "hidden"} custom={0} className="mb-4">
            <span className="mono-number text-amber/10 text-6xl md:text-8xl leading-none block">
              {t("activities.individualSectionNumber")}
            </span>
          </motion.div>
          <motion.span variants={revealUp} initial="hidden" animate={individualInView ? "visible" : "hidden"} custom={0.1} className="luxury-label text-amber block mb-4">
            {t("activities.individualLabel")}
          </motion.span>
          <motion.h2 variants={revealUp} initial="hidden" animate={individualInView ? "visible" : "hidden"} custom={0.2} className="heading-display text-3xl md:text-5xl mb-4">
            {t("activities.individualTitle1")}
            <br />
            <span className="italic text-amber">{t("activities.individualTitle2")}</span>
          </motion.h2>
          <motion.div variants={fadeIn} initial="hidden" animate={individualInView ? "visible" : "hidden"} custom={0.25} className="divider-accent max-w-xs mb-6" />
          <motion.p variants={revealUp} initial="hidden" animate={individualInView ? "visible" : "hidden"} custom={0.3} className="body-editorial text-muted-foreground max-w-2xl mb-16">
            {t("activities.individualText")}
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {individualActivities.map((activity, i) => (
              <motion.div
                key={activity.id}
                variants={revealScale}
                initial="hidden"
                animate={individualInView ? "visible" : "hidden"}
                custom={0.4 + i * 0.15}
                className="group glass-card card-warm overflow-hidden"
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img src={activity.image} alt={activity.name} className="w-full h-full object-cover img-luxury" />
                  <div className="absolute inset-0 bg-amber/0 group-hover:bg-amber/10 transition-all duration-500" />
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber/[0.08] rounded-bl-3xl" />
                  <div className="absolute top-4 right-4 bg-warm-black/60 backdrop-blur-md px-3 py-2 rounded-2xl text-right">
                    {activity.originalPrice && (
                      <span className="block text-white/40 line-through text-xs mono-number leading-none mb-0.5">
                        {activity.originalPrice} {activity.currency}
                      </span>
                    )}
                    <div className="flex items-baseline gap-1">
                      <span className="text-amber mono-number text-lg leading-none">{activity.price}</span>
                      <span className="text-amber/60 text-[10px]">{activity.currency}/pers.</span>
                    </div>
                    {activity.originalPrice && (
                      <span className="block text-red-400 text-[10px] font-medium mt-0.5">
                        -{Math.round((1 - activity.price / activity.originalPrice) * 100)}%
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-amber/10 border border-amber/15 flex items-center justify-center">
                      <Clock className="w-3 h-3 text-amber" />
                    </div>
                    <span className="text-sm text-muted-foreground body-editorial">{activity.duration}</span>
                  </div>
                  <h3 className="heading-editorial text-xl md:text-2xl mb-2 group-hover:text-amber transition-colors duration-400">{loc(activity.name, activity.nameEn)}</h3>
                  <p className="text-sm text-muted-foreground mb-4 body-editorial">{loc(activity.description, activity.descriptionEn)}</p>
                  <div className="space-y-2 mb-5">
                    {loc(activity.includes, activity.includesEn).split(",").map((item, j) => (
                      <div key={j} className="flex items-center gap-2 text-sm text-muted-foreground/70 body-editorial">
                        <div className="w-5 h-5 rounded-full bg-amber/10 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-amber" />
                        </div>
                        <span>{item.trim()}</span>
                      </div>
                    ))}
                  </div>
                  <Link
                    href={isEn ? `/en/les-activites/${activity.slug}` : `/les-activites/${activity.slug}`}
                    className="btn-outline w-full flex items-center justify-center gap-2 text-sm"
                  >
                    Voir les détails
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider-accent max-w-7xl mx-auto" />

      {/* ── Full Experiences ── */}
      <section ref={experiencesRef} className="py-20 md:py-28 px-6 md:px-10 relative">
        <div className="absolute inset-0 pattern-organic opacity-50 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div variants={fadeIn} initial="hidden" animate={experiencesInView ? "visible" : "hidden"} custom={0} className="mb-4">
            <span className="mono-number text-amber/10 text-6xl md:text-8xl leading-none block">
              {t("activities.experiencesSectionNumber")}
            </span>
          </motion.div>
          <motion.span variants={revealUp} initial="hidden" animate={experiencesInView ? "visible" : "hidden"} custom={0.1} className="luxury-label text-amber block mb-4">
            {t("activities.experiencesLabel")}
          </motion.span>
          <motion.h2 variants={revealUp} initial="hidden" animate={experiencesInView ? "visible" : "hidden"} custom={0.2} className="heading-display text-3xl md:text-5xl mb-4">
            {t("activities.experiencesTitle1")}
            <br />
            <span className="italic text-amber">{t("activities.experiencesTitle2")}</span>
          </motion.h2>
          <motion.div variants={fadeIn} initial="hidden" animate={experiencesInView ? "visible" : "hidden"} custom={0.25} className="divider-accent max-w-xs mb-6" />
          <motion.p variants={revealUp} initial="hidden" animate={experiencesInView ? "visible" : "hidden"} custom={0.3} className="body-editorial text-muted-foreground max-w-2xl mb-16">
            {t("activities.experiencesText")}
          </motion.p>

          <div className="space-y-8">
            {experienceActivities.map((activity, i) => (
              <motion.div
                key={activity.id}
                variants={revealScale}
                initial="hidden"
                animate={experiencesInView ? "visible" : "hidden"}
                custom={0.4 + i * 0.2}
                className="group glass-card card-warm overflow-hidden"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  <div className="lg:col-span-5 aspect-[4/3] lg:aspect-auto overflow-hidden relative">
                    <img src={activity.image} alt={activity.name} className="w-full h-full object-cover img-luxury" />
                    <div className="absolute inset-0 bg-amber/0 group-hover:bg-amber/10 transition-all duration-500" />
                    <div className="absolute top-4 left-4">
                      <span className="luxury-label text-white/90 bg-warm-black/40 backdrop-blur-md px-4 py-2 rounded-full">
                        {activity.category}
                      </span>
                    </div>
                  </div>

                  <div className="lg:col-span-7 p-8 md:p-10 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4 flex-wrap">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-amber/10 border border-amber/15 flex items-center justify-center">
                          <Clock className="w-3 h-3 text-amber" />
                        </div>
                        <span className="text-sm text-muted-foreground body-editorial">{activity.duration}</span>
                      </div>
                      {activity.transportIncluded && (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-amber/10 border border-amber/15 flex items-center justify-center">
                            <Bus className="w-3 h-3 text-amber" />
                          </div>
                          <span className="text-sm text-muted-foreground body-editorial">{t("activities.transportIncluded")}</span>
                        </div>
                      )}
                    </div>

                    <h3 className="heading-editorial text-2xl md:text-3xl mb-2 group-hover:text-amber transition-colors duration-400">{loc(activity.name, activity.nameEn)}</h3>
                    <div className="divider-accent max-w-[80px] mb-4" />
                    <p className="text-sm text-muted-foreground mb-2 body-editorial">{loc(activity.description, activity.descriptionEn)}</p>
                    <p className="text-sm text-muted-foreground/70 leading-relaxed mb-6 body-editorial">{activity.longDescription}</p>

                    <div className="mb-6">
                      <span className="luxury-label text-amber block mb-3">{t("activities.includes")}</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {loc(activity.includes, activity.includesEn).split(",").map((item, j) => (
                          <div key={j} className="flex items-center gap-2 text-sm text-muted-foreground/70 body-editorial">
                            <div className="w-5 h-5 rounded-full bg-amber/10 flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3 text-amber" />
                            </div>
                            <span>{item.trim()}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {activity.schedule && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground/70 mb-4 body-editorial">
                        <div className="w-5 h-5 rounded-full bg-amber/10 flex items-center justify-center shrink-0">
                          <Calendar className="w-3 h-3 text-amber" />
                        </div>
                        <span>{activity.schedule}</span>
                      </div>
                    )}

                    <div className="mt-auto pt-4 border-t border-amber/10">
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div>
                          {activity.originalPrice && (
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm text-muted-foreground line-through mono-number">
                                {activity.originalPrice} {activity.currency}
                              </span>
                              <span className="bg-red-500/10 text-red-500 text-xs px-2 py-0.5 rounded-full font-medium">
                                -{Math.round((1 - activity.price / activity.originalPrice) * 100)}%
                              </span>
                            </div>
                          )}
                          <div className="flex items-baseline gap-1.5">
                            <span className="mono-number text-3xl text-amber">{activity.price}</span>
                            <span className="text-sm text-muted-foreground body-editorial">
                              {activity.currency} {t("activities.perPerson")}
                            </span>
                          </div>
                        </div>
                        <Link
                          href={isEn ? `/en/les-activites/${activity.slug}` : `/les-activites/${activity.slug}`}
                          className="btn-outline flex items-center gap-2 text-sm shrink-0"
                        >
                          Voir les détails
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        label={t("activities.ctaLabel")}
        title={t("activities.ctaTitle")}
        buttonText={t("activities.ctaButton")}
        buttonHref="/reservez-votre-sejour"
      />
    </>
  );
}
