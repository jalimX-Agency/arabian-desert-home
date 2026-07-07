"use client";

import Link from "next/link";
import Image from "next/image";
import { Instagram, Mail, MapPin, Phone, Facebook, ArrowRight, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/context";

const footerNavLinks = [
  { labelKey: "footer.navHome", href: "/", enHref: "/en" },
  { labelKey: "footer.navAgafayGuide", href: "/desert-agafay", enHref: "/en/desert-agafay" },
  { labelKey: "footer.navTents", href: "/les-tentes", enHref: "/en/les-tentes" },
  { labelKey: "footer.navRestaurant", href: "/restaurant", enHref: "/restaurant" },
  { labelKey: "footer.navActivities", href: "/les-activites", enHref: "/en/les-activites" },
  { labelKey: "footer.navDayPass", href: "/day-pass", enHref: "/en/day-pass" },
  { labelKey: "footer.navEvents", href: "/les-evenements", enHref: "/les-evenements" },
  { labelKey: "footer.navBlog", href: "/blog", enHref: "/en/blog" },
  { labelKey: "footer.navAbout", href: "/apropo", enHref: "/apropo" },
];

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

const socialLinks = [
  { icon: Facebook, label: "Facebook", href: "https://facebook.com/arabian_desert_home", isCustom: false },
  { icon: Instagram, label: "Instagram", href: "https://instagram.com/arabian_desert_home", isCustom: false },
  { icon: WhatsAppIcon, label: "WhatsApp", href: "https://wa.me/212667370206", isCustom: true },
];

// Smooth Desert Aurora easing
const smoothEase = [0.25, 0.46, 0.45, 0.94] as const;

export function Footer() {
  const { t, language } = useLanguage();
  const isEn = language === "en";

  return (
    <footer className="relative bg-background text-foreground/60 overflow-hidden">

      {/* ═══════════════════════════════════════════
          PRE-FOOTER — Desert CTA Strip
          ═══════════════════════════════════════════ */}
      <div className="relative overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: "url('https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/gallery/hero.png')" }}
        />
        <div className="absolute inset-0 bg-warm-black/75" />
        <div className="absolute inset-0 grain-overlay" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: smoothEase }}
            >
              <p className="luxury-label text-amber/70 mb-3">{t("footer.desertAwaits")}</p>
              <h3 className="heading-display text-3xl md:text-4xl text-white">
                {t("footer.bookYourStay")}
              </h3>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1, ease: smoothEase }}
              className="flex flex-col sm:flex-row gap-4 flex-shrink-0"
            >
              <Link
                href="/reservez-votre-sejour"
                className="btn-primary inline-flex items-center gap-3 cursor-pointer"
              >
                {t("footer.bookNow")}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="tel:+212667370206"
                className="btn-outline inline-flex items-center gap-3 cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                +212 667-370-206
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          MAIN FOOTER — 4-Column Grid
          ═══════════════════════════════════════════ */}
      <div className="relative">
        <div className="absolute inset-0 grain-overlay" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">

            {/* ── Brand Column — 4 cols ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: smoothEase }}
              className="sm:col-span-2 lg:col-span-4"
            >
              {/* Logo */}
              <Link href={isEn ? "/en" : "/"} className="inline-flex items-center group cursor-pointer mb-8">
                <Image
                  src="https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/logo/logoWithNoBg.png"
                  alt="Arabian Desert Home — Agafay, Marrakech"
                  width={240}
                  height={96}
                  className="h-50 w-auto object-contain transition-opacity duration-300 group-hover:opacity-80"
                />
              </Link>

              {/* Brand description */}
              <p className="body-editorial text-sm text-muted-foreground leading-relaxed max-w-xs mb-6">
                {t("footer.brandDesc")}
              </p>

              {/* Subtle amber decorative line */}
              <div className="w-12 h-px bg-gradient-to-r from-amber/50 to-transparent rounded-full" />
            </motion.div>

            {/* ── Navigation Column — 3 cols ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.08, ease: smoothEase }}
              className="lg:col-span-3"
            >
              <h4 className="luxury-label text-amber/50 mb-6">
                {t("footer.explore")}
              </h4>
              <nav aria-label="Footer navigation">
                <ul className="space-y-3.5">
                  {footerNavLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={isEn ? link.enHref : link.href}
                        className="group inline-flex items-center gap-2.5 text-sm text-muted-foreground hover:text-amber transition-colors duration-300 cursor-pointer"
                      >
                        {/* Small dot indicator — appears on hover */}
                        <span className="w-1 h-1 rounded-full bg-amber/0 group-hover:bg-amber/70 transition-all duration-300 group-hover:scale-100 scale-0" />
                        <span className="transition-colors duration-300">
                          {t(link.labelKey)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </motion.div>

            {/* ── Contact Column — 3 cols ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.16, ease: smoothEase }}
              className="lg:col-span-3"
            >
              <h4 className="luxury-label text-amber/50 mb-6">
                {t("footer.contact")}
              </h4>
              <div className="space-y-5">
                {/* Address */}
                <div className="flex items-start gap-3 group cursor-default">
                  <div className="mt-0.5 w-7 h-7 rounded-full border border-amber/15 flex items-center justify-center flex-shrink-0 group-hover:border-amber/35 transition-colors duration-300">
                    <MapPin className="w-3 h-3 text-amber/50 group-hover:text-amber/80 transition-colors duration-300" />
                  </div>
                  <span className="text-sm text-muted-foreground group-hover:text-foreground/60 transition-colors duration-300">
                    {t("footer.address")}
                  </span>
                </div>
                {/* Phone 1 */}
                <a href="tel:+212667370206" className="flex items-center gap-3 group cursor-pointer">
                  <div className="w-7 h-7 rounded-full border border-amber/15 flex items-center justify-center flex-shrink-0 group-hover:border-amber/35 transition-colors duration-300">
                    <Phone className="w-3 h-3 text-amber/50 group-hover:text-amber/80 transition-colors duration-300" />
                  </div>
                  <span className="text-sm text-muted-foreground group-hover:text-amber transition-colors duration-300">
                    +212 667-370-206
                  </span>
                </a>
                {/* Phone 2 */}
                <a href="tel:+212667226383" className="flex items-center gap-3 group cursor-pointer">
                  <div className="w-7 h-7 rounded-full border border-amber/15 flex items-center justify-center flex-shrink-0 group-hover:border-amber/35 transition-colors duration-300">
                    <Phone className="w-3 h-3 text-amber/50 group-hover:text-amber/80 transition-colors duration-300" />
                  </div>
                  <span className="text-sm text-muted-foreground group-hover:text-amber transition-colors duration-300">
                    +212 667-226-383
                  </span>
                </a>
                {/* Email */}
                <a href="mailto:info@arabiandeserthome.ma" className="flex items-center gap-3 group cursor-pointer">
                  <div className="w-7 h-7 rounded-full border border-amber/15 flex items-center justify-center flex-shrink-0 group-hover:border-amber/35 transition-colors duration-300">
                    <Mail className="w-3 h-3 text-amber/50 group-hover:text-amber/80 transition-colors duration-300" />
                  </div>
                  <span className="text-sm text-muted-foreground group-hover:text-amber transition-colors duration-300">
                    info@arabiandeserthome.ma
                  </span>
                </a>
                {/* Trust links */}
                <div className="pt-2 flex flex-col gap-2">
                  <a
                    href="https://maps.google.com/?q=Arabian+Desert+Home+Agafay+Marrakech"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 group cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-full border border-amber/15 flex items-center justify-center flex-shrink-0 group-hover:border-amber/35 transition-colors duration-300">
                      <MapPin className="w-3 h-3 text-amber/50 group-hover:text-amber/80 transition-colors duration-300" />
                    </div>
                    <span className="text-xs text-muted-foreground/70 group-hover:text-amber transition-colors duration-300">
                      Google Maps
                    </span>
                  </a>
                  <a
                    href="https://www.tripadvisor.com/Search?q=Arabian+Desert+Home+Agafay"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 group cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-full border border-amber/15 flex items-center justify-center flex-shrink-0 group-hover:border-amber/35 transition-colors duration-300">
                      <Star className="w-3 h-3 text-amber/50 group-hover:text-amber/80 transition-colors duration-300" />
                    </div>
                    <span className="text-xs text-muted-foreground/70 group-hover:text-amber transition-colors duration-300">
                      TripAdvisor
                    </span>
                  </a>
                </div>
              </div>
            </motion.div>

            {/* ── Social + Newsletter Column — 2 cols ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.24, ease: smoothEase }}
              className="lg:col-span-2"
            >
              <h4 className="luxury-label text-amber/50 mb-6">
                {t("footer.followUs")}
              </h4>

              {/* Social Icons — Rounded circle borders with amber hover */}
              <div className="flex gap-3 mb-8">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full border border-amber/15 flex items-center justify-center text-muted-foreground hover:text-amber hover:border-amber/40 hover:bg-amber/[0.06] hover:shadow-[0_0_16px_rgba(202,138,4,0.1)] transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/40"
                      aria-label={social.label}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>

              {/* Newsletter */}
              <p className="text-xs text-muted-foreground mb-3.5">
                {t("footer.stayInformed")}
              </p>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="relative flex items-center"
              >
                <input
                  type="email"
                  placeholder={t("footer.emailPlaceholder")}
                  className="w-full bg-foreground/[0.03] border border-amber/10 rounded-full pl-5 pr-14 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 focus:border-amber/40 focus:outline-none focus:ring-1 focus:ring-amber/20 transition-all duration-300"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 w-9 h-9 rounded-full bg-gradient-to-br from-amber to-amber-dark flex items-center justify-center text-background hover:shadow-[0_0_20px_rgba(202,138,4,0.25)] transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/40"
                  aria-label="Subscribe to newsletter"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          BOTTOM BAR — Subtle Amber Accents
          ═══════════════════════════════════════════ */}
      <div className="relative">
        {/* Top amber divider */}
        <div className="divider-accent" />

        <div className="max-w-7xl mx-auto px-6 md:px-10 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Copyright */}
          <p className="text-xs text-muted-foreground/50">
            &copy; {new Date().getFullYear()} {t("footer.copyright")}
          </p>

          {/* Legal Links */}
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-xs text-muted-foreground/40 hover:text-amber/60 transition-colors duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber/30 rounded"
            >
              {t("footer.privacy")}
            </a>
            {/* Subtle amber dot separator */}
            <span className="w-1 h-1 rounded-full bg-amber/20" />
            <a
              href="#"
              className="text-xs text-muted-foreground/40 hover:text-amber/60 transition-colors duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber/30 rounded"
            >
              {t("footer.terms")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
