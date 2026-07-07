"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, Globe, ChevronDown, Check } from "lucide-react";
import { useTheme } from "next-themes";
import { useLanguage, type Language } from "@/lib/i18n/context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Route prefixes that currently have a real, server-rendered /en equivalent.
// Extend this list as more /en/* routes ship.
const EN_READY_PREFIXES = ["/les-tentes", "/les-activites", "/day-pass", "/blog", "/desert-agafay"];

function hasEnglishVersion(pathname: string): boolean {
  if (pathname === "/") return true;
  return EN_READY_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/** Maps a pathname to its opposite-locale equivalent, only when one actually exists. */
function toLocalePath(pathname: string, target: Language): string {
  const isCurrentlyEn = pathname === "/en" || pathname.startsWith("/en/");
  if (target === "en") {
    if (isCurrentlyEn) return pathname;
    if (!hasEnglishVersion(pathname)) return pathname; // no /en sibling yet — stay put
    return pathname === "/" ? "/en" : `/en${pathname}`;
  }
  // target === "fr"
  if (!isCurrentlyEn) return pathname;
  const stripped = pathname.slice(3); // remove leading "/en"
  return stripped === "" ? "/" : stripped;
}

const navLinkKeys = [
  { labelKey: "nav.home", href: "/", enHref: "/en" },
  { labelKey: "nav.tents", href: "/les-tentes", enHref: "/en/les-tentes" },
  { labelKey: "nav.restaurant", href: "/restaurant", enHref: "/restaurant" },
  { labelKey: "nav.activities", href: "/les-activites", enHref: "/en/les-activites" },
  { labelKey: "nav.dayPass", href: "/day-pass", enHref: "/en/day-pass" },
  { labelKey: "nav.events", href: "/les-evenements", enHref: "/les-evenements" },
  { labelKey: "nav.agafayGuide", href: "/desert-agafay", enHref: "/en/desert-agafay" },
  { labelKey: "nav.blog", href: "/blog", enHref: "/en/blog" },
  { labelKey: "nav.contact", href: "/contact", enHref: "/contact" },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const isEn = language === "en";

  const switchLanguage = useCallback(
    (target: Language) => {
      const targetPath = toLocalePath(pathname, target);
      if (targetPath !== pathname) {
        router.push(targetPath);
      } else {
        setLanguage(target);
      }
    },
    [pathname, router, setLanguage]
  );

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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
          ? "glass-premium shadow-lg shadow-amber/[0.03]"
          : "bg-transparent"
          }`}
      >
        <nav className="max-w-7xl mx-auto px-5 sm:px-8 md:px-10 h-24 flex items-center justify-between">
          {/* ── Logo ── */}
          <Link href={isEn ? "/en" : "/"} className="flex items-center group cursor-pointer">
            <Image
              src="https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/logo/logoWithNoBg.png"
              alt="Arabian Desert Home — Agafay, Marrakech"
              width={500}
              height={200}
              priority
              className="h-50 w-auto object-contain transition-opacity duration-300 group-hover:opacity-80"
            />
          </Link>

          {/* ── Desktop Nav Links — Smooth Underline ── */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinkKeys.map((link) => {
              const href = isEn ? link.enHref : link.href;
              const isActive = pathname === href;
              return (
                <Link
                  key={link.href}
                  href={href}
                  className={`luxury-label relative group cursor-pointer transition-colors duration-300 ${isActive
                    ? "text-amber"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {t(link.labelKey)}
                  {/* Underline indicator — smooth amber slide */}
                  <span
                    className={`absolute -bottom-1.5 left-0 h-[1.5px] rounded-full bg-gradient-to-r from-amber to-amber-light transition-all duration-300 ease-out ${isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* ── Right Controls: Language · Book · Mobile Toggle ── */}
          <div className="flex items-center gap-3">
            {/* Language Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="hidden md:flex items-center gap-1.5 luxury-label px-3.5 h-9 rounded-full border border-amber/15 bg-amber/[0.04] text-muted-foreground hover:text-amber hover:border-amber/30 hover:bg-amber/[0.08] transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/40 focus-visible:ring-offset-1 focus-visible:ring-offset-background"
                  aria-label="Select language"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span className="text-amber">{language.toUpperCase()}</span>
                  <ChevronDown className="w-3 h-3 opacity-50" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[140px]">
                <DropdownMenuItem
                  onClick={() => switchLanguage("fr")}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">🇫🇷</span>
                    Français
                  </span>
                  {language === "fr" && <Check className="w-4 h-4 text-amber" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => switchLanguage("en")}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">🇬🇧</span>
                    English
                  </span>
                  {language === "en" && <Check className="w-4 h-4 text-amber" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Book Now — Amber Gradient Pill */}
            <Link href="/reservez-votre-sejour" className="hidden md:block">
              <span className="btn-primary inline-block cursor-pointer hover:no-underline">
                {t("nav.bookNow")}
              </span>
            </Link>

            {/* Mobile language toggle — always visible on mobile, one tap FR↔EN */}
            <button
              onClick={() => switchLanguage(language === "fr" ? "en" : "fr")}
              className="flex md:hidden items-center luxury-label px-2.5 h-8 rounded-full border border-amber/15 bg-amber/[0.04] text-amber text-xs cursor-pointer hover:border-amber/30 hover:bg-amber/[0.08] transition-all duration-300"
              aria-label="Toggle language"
            >
              {language.toUpperCase()}
            </button>

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
          className={`h-px transition-opacity duration-500 ${scrolled ? "opacity-100" : "opacity-0"
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
            <div className="h-full flex flex-col pt-24 pb-8 px-8">
              {/* Nav Links — Large serif, staggered entrance */}
              <div className="flex-1 flex flex-col justify-center gap-1">
                {navLinkKeys.map((link, i) => {
                  const href = isEn ? link.enHref : link.href;
                  const isActive = pathname === href;
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
                        href={href}
                        onClick={closeMobile}
                        className={`font-serif text-3xl sm:text-4xl py-2 flex items-center gap-4 group cursor-pointer transition-colors duration-300 ${isActive
                          ? "text-amber"
                          : "text-foreground/80 hover:text-amber"
                          }`}
                      >
                        {/* Active indicator dot */}
                        <span
                          className={`w-2 h-2 rounded-full bg-amber transition-all duration-300 ${isActive
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

                {/* Language Dropdown for Mobile */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="flex items-center gap-1.5 luxury-label px-5 h-11 rounded-full border border-amber/15 bg-amber/[0.04] text-muted-foreground hover:text-amber hover:border-amber/30 transition-all duration-300 cursor-pointer"
                      aria-label="Select language"
                    >
                      <Globe className="w-4 h-4" />
                      <span className="text-amber">{language.toUpperCase()}</span>
                      <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="min-w-[160px]">
                    <DropdownMenuItem
                      onClick={() => switchLanguage("fr")}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-base">🇫🇷</span>
                        Français
                      </span>
                      {language === "fr" && <Check className="w-4 h-4 text-amber" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => switchLanguage("en")}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-base">🇬🇧</span>
                        English
                      </span>
                      {language === "en" && <Check className="w-4 h-4 text-amber" />}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating Theme Toggle — Bottom Left ── */}
      <motion.button
        onClick={toggleTheme}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.5, ease: flowingEase }}
        className="fixed bottom-6 left-6 z-50 w-12 h-12 flex items-center justify-center rounded-full border border-amber/20 bg-background/80 backdrop-blur-md text-muted-foreground hover:text-amber hover:border-amber/40 hover:bg-amber/[0.08] shadow-lg shadow-black/10 transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background group"
        aria-label="Toggle theme"
      >
        <Sun className="w-5 h-5 rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0 group-hover:rotate-12" />
        <Moon className="absolute w-5 h-5 rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100 group-hover:-rotate-12" />
      </motion.button>
    </>
  );
}
