"use client";

import Link from "next/link";
import { Instagram, Mail, MapPin, Phone, Facebook } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-obsidian text-foreground/60">
      {/* Pre-footer CTA — Minimal */}
      <div className="border-b border-terracotta/10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-20 md:py-28 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-luxury-label text-terracotta/50 mb-3">
              {t("footer.bookYourStay")}
            </p>
            <h3 className="font-serif text-3xl md:text-5xl text-foreground">
              {t("footer.desertAwaits")}
            </h3>
          </div>
          <Link
            href="/reservez-votre-sejour"
            className="inline-flex items-center gap-3 bg-terracotta text-white px-10 py-5 text-luxury-label hover:bg-terracotta-light transition-all duration-500 hover:shadow-[0_0_30px_oklch(0.62_0.08_30/15%)]"
          >
            {t("footer.bookNow")}
          </Link>
        </div>
      </div>

      {/* Main Footer — Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand — 4 cols */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-4 mb-8">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 rotate-45 border border-terracotta/40" />
                <div className="absolute inset-2 rotate-45 bg-terracotta/15" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl tracking-wide text-foreground leading-tight">
                  Arabian
                </span>
                <span className="text-[9px] tracking-[0.35em] uppercase text-foreground/30 leading-tight">
                  Desert Home
                </span>
              </div>
            </div>
            <p className="text-sm text-foreground/30 leading-relaxed max-w-xs">
              {t("footer.brandDesc")}
            </p>
          </div>

          {/* Navigation — 3 cols */}
          <div className="md:col-span-3">
            <h4 className="text-luxury-label text-terracotta/40 mb-6">{t("footer.explore")}</h4>
            <div className="space-y-3">
              {[
                { label: t("footer.navHome"), href: "/" },
                { label: t("footer.navTents"), href: "/les-tentes" },
                { label: t("footer.navRestaurant"), href: "/restaurant" },
                { label: t("footer.navActivities"), href: "/les-activites" },
                { label: t("footer.navDayPass"), href: "/day-pass" },
                { label: t("footer.navEvents"), href: "/les-evenements" },
                { label: t("footer.navSpa"), href: "/spa" },
                { label: t("footer.navAbout"), href: "/apropo" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-foreground/30 hover:text-terracotta transition-colors duration-500"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact — 3 cols */}
          <div className="md:col-span-2">
            <h4 className="text-luxury-label text-terracotta/40 mb-6">{t("footer.contact")}</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-3.5 h-3.5 text-terracotta/40 mt-0.5 shrink-0" />
                <span className="text-sm text-foreground/30">
                  {t("footer.address")}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-3.5 h-3.5 text-terracotta/40 shrink-0" />
                <span className="text-sm text-foreground/30">+212 667-370-206</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-3.5 h-3.5 text-terracotta/40 shrink-0" />
                <span className="text-sm text-foreground/30">
                  info@arabiandeserthome.com
                </span>
              </div>
            </div>
          </div>

          {/* Social + Newsletter — 2 cols */}
          <div className="md:col-span-3">
            <h4 className="text-luxury-label text-terracotta/40 mb-6">{t("footer.followUs")}</h4>
            <div className="flex gap-3 mb-8">
              <a
                href="#"
                className="w-10 h-10 border border-terracotta/15 flex items-center justify-center hover:border-terracotta/50 hover:text-terracotta transition-all duration-500"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 border border-terracotta/15 flex items-center justify-center hover:border-terracotta/50 hover:text-terracotta transition-all duration-500"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
            <p className="text-xs text-foreground/20 mb-3">
              {t("footer.stayInformed")}
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder={t("footer.emailPlaceholder")}
                className="flex-1 bg-foreground/5 border border-terracotta/10 px-4 py-3 text-sm text-foreground placeholder:text-foreground/15 focus:border-terracotta/40 focus:outline-none transition-colors"
              />
              <button className="bg-terracotta text-white px-5 py-3 text-luxury-label hover:bg-terracotta-light transition-colors">
                →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-terracotta/5">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-foreground/15">
            © {new Date().getFullYear()} {t("footer.copyright")}
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-xs text-foreground/15 hover:text-foreground/30 transition-colors">
              {t("footer.privacy")}
            </a>
            <a href="#" className="text-xs text-foreground/15 hover:text-foreground/30 transition-colors">
              {t("footer.terms")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
