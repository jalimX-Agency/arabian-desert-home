"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "@/lib/i18n/context";

export function Dining() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const { t } = useLanguage();

  return (
    <section
      ref={sectionRef}
      id="dining"
      className="relative py-24 md:py-36 px-6 md:px-10 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Left — Content */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="mb-4"
            >
              <span className="mono-number text-terracotta/30 text-6xl md:text-7xl leading-none">01</span>
            </motion.div>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="luxury-label text-terracotta block mb-4"
            >
              {t("dining.label")}
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.2 }}
              className="heading-editorial text-4xl md:text-5xl lg:text-6xl mb-8"
            >
              {t("dining.title1")}
              <br />
              <span className="italic">{t("dining.title2")}</span>
            </motion.h2>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.4 }}
              className="h-px w-16 bg-terracotta/30 origin-left max-w-[120px] mb-8"
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="body-editorial text-muted-foreground mb-6"
            >
              {t("dining.paragraph1")}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-sm text-muted-foreground/70 mb-10"
            >
              {t("dining.paragraph2")}
            </motion.p>

            {/* Menu Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="space-y-4"
            >
              {[
                {
                  name: t("dining.menu1Name"),
                  desc: t("dining.menu1Desc"),
                },
                {
                  name: t("dining.menu2Name"),
                  desc: t("dining.menu2Desc"),
                },
                {
                  name: t("dining.menu3Name"),
                  desc: t("dining.menu3Desc"),
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 py-3 border-b border-border/30 group cursor-default"
                >
                  <div className="w-4 h-px bg-terracotta mt-2 shrink-0" />
                  <div>
                    <span className="heading-editorial text-lg group-hover:text-terracotta transition-colors duration-300">
                      {item.name}
                    </span>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Image */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1.2, delay: 0.3 }}
              className="relative"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src="/images/dining.png"
                  alt="Luxury Moroccan fine dining under the stars at Arabian Desert Home"
                  className="w-full h-full object-cover img-luxury"
                />
              </div>

              {/* Floating Quote */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 1 }}
                className="absolute -bottom-6 -left-4 md:-left-8 bg-background/90 backdrop-blur-sm border border-terracotta/15 p-6 max-w-xs"
              >
                <p className="heading-editorial italic text-lg leading-snug">
                  &ldquo;{t("dining.quote")}&rdquo;
                </p>
                <span className="luxury-label text-terracotta mt-3 block">
                  {t("dining.quoteAuthor")}
                </span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
