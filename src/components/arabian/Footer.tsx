"use client";

import Link from "next/link";
import { Instagram, Mail, MapPin, Phone, Facebook, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/context";

const footerNavLinks = [
  { labelKey: "footer.navHome", href: "/" },
  { labelKey: "footer.navTents", href: "/les-tentes" },
  { labelKey: "footer.navRestaurant", href: "/restaurant" },
  { labelKey: "footer.navActivities", href: "/les-activites" },
  { labelKey: "footer.navDayPass", href: "/day-pass" },
  { labelKey: "footer.navEvents", href: "/les-evenements" },
  { labelKey: "footer.navSpa", href: "/spa" },
  { labelKey: "footer.navAbout", href: "/apropo" },
];

const socialLinks = [
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
];

// Smooth Desert Aurora easing
const smoothEase = [0.25, 0.46, 0.45, 0.94] as const;

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="relative bg-background text-foreground/60 overflow-hidden">
      {/* ═══════════════════════════════════════════
          PRE-FOOTER CTA — Warm Gradient + Grain
          ═══════════════════════════════════════════ */}
      <div className="relative overflow-hidden">
        {/* Warm gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-warm-black via-background to-amber/[0.06]" />
        <div className="absolute inset-0 pattern-organic" />
        <div className="absolute inset-0 grain-overlay" />

        {/* Amber divider at top */}
        <div className="divider-accent-wide" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-20 md:py-28 flex flex-col md:flex-row items-center justify-between gap-10">
          {/* CTA Text */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: smoothEase }}
            className="text-center md:text-left"
          >
            <p className="luxury-label text-amber/60 mb-4">
              {t("footer.bookYourStay")}
            </p>
            <h3 className="heading-display text-3xl md:text-5xl text-foreground leading-tight">
              {t("footer.desertAwaits")}
            </h3>
          </motion.div>

          {/* CTA Button — Rounded Amber Pill */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.12, ease: smoothEase }}
          >
            <Link href="/reservez-votre-sejour" className="cursor-pointer">
              <span className="btn-primary inline-flex items-center gap-2.5">
                {t("footer.bookNow")}
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </span>
            </Link>
          </motion.div>
        </div>

        {/* Amber divider at bottom */}
        <div className="divider-accent" />
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
              {/* Logo: Same organic circular mark as Navigation */}
              <Link href="/" className="flex items-center gap-3.5 group cursor-pointer mb-8">
                {/* Organic circular mark — warm amber glow */}
                <div className="relative w-10 h-10 flex-shrink-0">
                  {/* Outer ring */}
                  <div className="absolute inset-0 rounded-full border border-amber/40 group-hover:border-amber/70 transition-all duration-400" />
                  {/* Inner fill — warm gradient */}
                  <div className="absolute inset-1.5 rounded-full bg-gradient-to-br from-amber/25 to-amber-dark/20 group-hover:from-amber/40 group-hover:to-amber-dark/30 transition-all duration-400" />
                  {/* Center dot — glow */}
                  <div className="absolute inset-[11px] rounded-full bg-amber/60 group-hover:bg-amber/80 transition-all duration-400 group-hover:shadow-[0_0_12px_rgba(202,138,4,0.4)]" />
                </div>
                {/* Logo type: Cinzel + Josefin */}
                <div className="flex flex-col">
                  <span className="font-serif text-xl tracking-wider leading-tight text-foreground group-hover:text-amber transition-colors duration-300">
                    Arabian
                  </span>
                  <span className="text-[9px] tracking-[0.35em] uppercase text-muted-foreground leading-tight font-sans font-light group-hover:text-amber/70 transition-colors duration-300">
                    Desert Home
                  </span>
                </div>
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
                        href={link.href}
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

            {/* ── Contact Column — 2 cols ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.16, ease: smoothEase }}
              className="lg:col-span-2"
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
                {/* Phone */}
                <a
                  href="tel:+212667370206"
                  className="flex items-center gap-3 group cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full border border-amber/15 flex items-center justify-center flex-shrink-0 group-hover:border-amber/35 transition-colors duration-300">
                    <Phone className="w-3 h-3 text-amber/50 group-hover:text-amber/80 transition-colors duration-300" />
                  </div>
                  <span className="text-sm text-muted-foreground group-hover:text-amber transition-colors duration-300">
                    +212 667-370-206
                  </span>
                </a>
                {/* Email */}
                <a
                  href="mailto:info@arabiandeserthome.com"
                  className="flex items-center gap-3 group cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full border border-amber/15 flex items-center justify-center flex-shrink-0 group-hover:border-amber/35 transition-colors duration-300">
                    <Mail className="w-3 h-3 text-amber/50 group-hover:text-amber/80 transition-colors duration-300" />
                  </div>
                  <span className="text-sm text-muted-foreground group-hover:text-amber transition-colors duration-300">
                    info@arabiandeserthome.com
                  </span>
                </a>
              </div>
            </motion.div>

            {/* ── Social + Newsletter Column — 3 cols ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.24, ease: smoothEase }}
              className="lg:col-span-3"
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
