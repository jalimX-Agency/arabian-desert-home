"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, Globe } from "lucide-react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/lib/i18n/context";

const navLinkKeys = [
  { labelKey: "nav.home", href: "/" },
  { labelKey: "nav.tents", href: "/les-tentes" },
  { labelKey: "nav.restaurant", href: "/restaurant" },
  { labelKey: "nav.activities", href: "/les-activites" },
  { labelKey: "nav.dayPass", href: "/day-pass" },
  { labelKey: "nav.events", href: "/les-evenements" },
  { labelKey: "nav.spa", href: "/spa" },
  { labelKey: "nav.contact", href: "/contact" },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === "fr" ? "en" : "fr");
  }, [language, setLanguage]);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
  }, []);

  // Smooth easing curves for Desert Aurora
  const smoothEase = [0.25, 0.46, 0.45, 0.94] as const;
  const flowingEase = [0.16, 1, 0.3, 1] as const;

  return (
    <>
      {/* ── Desktop & Mobile Header ── */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9, ease: flowingEase }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "glass-premium shadow-lg shadow-amber/[0.03]"
            : "bg-transparent"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-5 sm:px-8 md:px-10 h-20 flex items-center justify-between">
          {/* ── Logo: Warm Circular Mark + Typography ── */}
          <Link href="/" className="flex items-center gap-3.5 group cursor-pointer">
            {/* Organic circular mark — warm amber glow */}
            <div className="relative w-10 h-10 flex-shrink-0">
              {/* Outer ring — amber with glow */}
              <div className="absolute inset-0 rounded-full border border-amber/40 group-hover:border-amber/70 transition-all duration-400" />
              {/* Inner fill — warm amber pulse */}
              <div className="absolute inset-1.5 rounded-full bg-gradient-to-br from-amber/25 to-amber-dark/20 group-hover:from-amber/40 group-hover:to-amber-dark/30 transition-all duration-400" />
              {/* Center dot — warm glow */}
              <div className="absolute inset-[11px] rounded-full bg-amber/60 group-hover:bg-amber/80 transition-all duration-400 group-hover:shadow-[0_0_12px_rgba(202,138,4,0.4)]" />
            </div>
            {/* Logo type */}
            <div className="flex flex-col">
              <span className="font-serif text-xl tracking-wider leading-tight text-foreground group-hover:text-amber transition-colors duration-300">
                Arabian
              </span>
              <span className="text-[9px] tracking-[0.35em] uppercase text-muted-foreground leading-tight font-sans font-light group-hover:text-amber/70 transition-colors duration-300">
                Desert Home
              </span>
            </div>
          </Link>

          {/* ── Desktop Nav Links — Smooth Underline ── */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinkKeys.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`luxury-label relative group cursor-pointer transition-colors duration-300 ${
                    isActive
                      ? "text-amber"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t(link.labelKey)}
                  {/* Underline indicator — smooth amber slide */}
                  <span
                    className={`absolute -bottom-1.5 left-0 h-[1.5px] rounded-full bg-gradient-to-r from-amber to-amber-light transition-all duration-300 ease-out ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* ── Right Controls: Theme · Language · Book · Mobile Toggle ── */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle — Rounded glass circle */}
            <button
              onClick={toggleTheme}
              className="relative w-9 h-9 hidden md:flex items-center justify-center rounded-full border border-amber/15 bg-amber/[0.04] text-muted-foreground hover:text-amber hover:border-amber/30 hover:bg-amber/[0.08] transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/40 focus-visible:ring-offset-1 focus-visible:ring-offset-background"
              aria-label="Toggle theme"
            >
              <Sun className="w-4 h-4 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute w-4 h-4 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
            </button>

            {/* Language Toggle — Rounded Pill */}
            <button
              onClick={toggleLanguage}
              className="hidden md:flex items-center gap-1 luxury-label px-3.5 h-9 rounded-full border border-amber/15 bg-amber/[0.04] text-muted-foreground hover:text-amber hover:border-amber/30 hover:bg-amber/[0.08] transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/40 focus-visible:ring-offset-1 focus-visible:ring-offset-background"
              aria-label="Toggle language"
            >
              <Globe className="w-3.5 h-3.5 mr-0.5" />
              <span className={`transition-colors duration-200 ${language === "fr" ? "text-amber" : ""}`}>FR</span>
              <span className="text-border/50 mx-0.5">·</span>
              <span className={`transition-colors duration-200 ${language === "en" ? "text-amber" : ""}`}>EN</span>
            </button>

            {/* Book Now — Amber Gradient Pill */}
            <Link href="/reservez-votre-sejour" className="hidden md:block">
              <span className="btn-primary inline-block cursor-pointer hover:no-underline">
                {t("nav.bookNow")}
              </span>
            </Link>

            {/* Mobile Hamburger — Rounded */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full border border-amber/15 bg-amber/[0.04] text-foreground hover:text-amber hover:border-amber/30 transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/40"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2, ease: smoothEase }}
                  >
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2, ease: smoothEase }}
                  >
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </nav>

        {/* Bottom amber line when scrolled — subtle divider */}
        <div
          className={`h-px transition-opacity duration-500 ${
            scrolled ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background: "linear-gradient(90deg, transparent, var(--amber), transparent)",
          }}
        />
      </motion.header>

      {/* ── Mobile Menu — Full-Screen Glass Overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: smoothEase }}
            className="fixed inset-0 z-40 glass-premium grain-overlay overflow-hidden"
          >
            <div className="h-full flex flex-col pt-28 pb-10 px-8">
              {/* Nav Links — Large serif, staggered entrance */}
              <div className="flex-1 flex flex-col justify-center gap-1">
                {navLinkKeys.map((link, i) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -40 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.08 + i * 0.05,
                        duration: 0.5,
                        ease: flowingEase,
                      }}
                    >
                      <Link
                        href={link.href}
                        onClick={closeMobile}
                        className={`font-serif text-4xl sm:text-5xl py-3 flex items-center gap-4 group cursor-pointer transition-colors duration-300 ${
                          isActive
                            ? "text-amber"
                            : "text-foreground/80 hover:text-amber"
                        }`}
                      >
                        {/* Active indicator dot */}
                        <span
                          className={`w-2 h-2 rounded-full bg-amber transition-all duration-300 ${
                            isActive
                              ? "opacity-100 scale-100"
                              : "opacity-0 scale-0 group-hover:opacity-60 group-hover:scale-100"
                          }`}
                        />
                        {t(link.labelKey)}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Bottom controls — Book + Language + Theme */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5, ease: smoothEase }}
                className="flex flex-col gap-4"
              >
                {/* Divider */}
                <div className="divider-accent mb-2" />

                {/* Book Now Button */}
                <Link href="/reservez-votre-sejour" onClick={closeMobile}>
                  <span className="btn-primary block text-center cursor-pointer w-full py-4">
                    {t("nav.bookYourStay")}
                  </span>
                </Link>

                {/* Language & Theme row */}
                <div className="flex items-center justify-between">
                  {/* Language Toggle — Pill */}
                  <button
                    onClick={toggleLanguage}
                    className="flex items-center gap-1.5 luxury-label px-5 h-11 rounded-full border border-amber/15 bg-amber/[0.04] text-muted-foreground hover:text-amber hover:border-amber/30 transition-all duration-300 cursor-pointer"
                    aria-label="Toggle language"
                  >
                    <Globe className="w-4 h-4" />
                    <span className={language === "fr" ? "text-amber" : ""}>FR</span>
                    <span className="text-border/50 mx-0.5">·</span>
                    <span className={language === "en" ? "text-amber" : ""}>EN</span>
                  </button>

                  {/* Theme Toggle — Pill */}
                  <button
                    onClick={toggleTheme}
                    className="relative flex items-center gap-2 luxury-label px-5 h-11 rounded-full border border-amber/15 bg-amber/[0.04] text-muted-foreground hover:text-amber hover:border-amber/30 transition-all duration-300 cursor-pointer"
                    aria-label="Toggle theme"
                  >
                    <span className="relative w-4 h-4">
                      <Sun className="absolute inset-0 w-4 h-4 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
                      <Moon className="absolute inset-0 w-4 h-4 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
                    </span>
                    <span className="dark:hidden">Dark</span>
                    <span className="hidden dark:inline">Light</span>
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
