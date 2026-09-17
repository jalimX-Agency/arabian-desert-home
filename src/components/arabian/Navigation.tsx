"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, Globe, ChevronDown, Check, ArrowUpRight } from "lucide-react";
import { useTheme } from "next-themes";
import { useLanguage, withLocale, type Language } from "@/lib/i18n/context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

// Route prefixes that have real, server-rendered translations in every non-French locale.
// Extend this list as more locale routes ship.
const LOCALE_READY_PREFIXES = [
  "/les-tentes", "/les-activites", "/les-experiences", "/day-pass", "/blog", "/desert-agafay",
  "/restaurant", "/contact", "/apropo", "/les-evenements", "/reservez-votre-sejour",
];
const NON_FR_LOCALES: Language[] = ["en", "es", "it"];

function hasLocaleVersion(pathname: string): boolean {
  if (pathname === "/") return true;
  return LOCALE_READY_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

function currentLocalePrefix(pathname: string): Language | null {
  for (const l of NON_FR_LOCALES) {
    if (pathname === `/${l}` || pathname.startsWith(`/${l}/`)) return l;
  }
  return null;
}

/** Strips any leading /en, /es, /it prefix, returning the French-equivalent path. */
function stripLocalePrefix(pathname: string): string {
  const current = currentLocalePrefix(pathname);
  if (!current) return pathname;
  const stripped = pathname.slice(current.length + 1);
  return stripped === "" ? "/" : stripped;
}

/** Maps a pathname to its target-locale equivalent, only when one actually exists. */
function toLocalePath(pathname: string, target: Language): string {
  const frPath = stripLocalePrefix(pathname);
  if (target === "fr") return frPath;
  if (!hasLocaleVersion(frPath)) return pathname; // no translated sibling yet — stay put
  return frPath === "/" ? `/${target}` : `/${target}${frPath}`;
}

interface NavLeaf {
  labelKey: string;
  href: string;
  descKey?: string;
}

type NavEntry =
  | ({ kind: "link" } & NavLeaf)
  | { kind: "group"; labelKey: string; items: NavLeaf[] };

// The five bookable offers live behind one "Découvrir" menu so the header stays
// readable — a flat list of nine was burying Day Pass and Restaurant.
const navEntries: NavEntry[] = [
  { kind: "link", labelKey: "nav.home", href: "/" },
  { kind: "link", labelKey: "nav.tents", href: "/les-tentes" },
  {
    kind: "group",
    labelKey: "nav.discover",
    items: [
      { labelKey: "nav.activities", href: "/les-activites", descKey: "navMenu.activitiesDesc" },
      { labelKey: "nav.experiences", href: "/les-experiences", descKey: "navMenu.experiencesDesc" },
      { labelKey: "nav.dayPass", href: "/day-pass", descKey: "navMenu.dayPassDesc" },
      { labelKey: "nav.restaurant", href: "/restaurant", descKey: "navMenu.restaurantDesc" },
      { labelKey: "nav.events", href: "/les-evenements", descKey: "navMenu.eventsDesc" },
    ],
  },
  { kind: "link", labelKey: "nav.blog", href: "/blog" },
  { kind: "link", labelKey: "nav.contact", href: "/contact" },
];

function localizedHref(href: string, language: Language): string {
  if (language === "fr") return href;
  return href === "/" ? `/${language}` : `/${language}${href}`;
}

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

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
        initial={{ y: -130 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9, ease: flowingEase }}
        className={`fixed top-0 inset-x-0 z-50 pointer-events-none transition-[filter] duration-500 ${scrolled ? "nav-tab--scrolled" : ""
          }`}
      >
        {/* Hanging tab — a thin ink strip along the top edge and a tab with curved shoulders
            dropping from it. Solid ink, so it reads on any page. */}
        <div aria-hidden="true" className="nav-ink absolute inset-x-0 top-0 h-3 hidden lg:block" />
        <nav className="nav-ink pointer-events-auto relative mx-auto w-full lg:w-[calc(100%-8rem)] max-w-[1200px] h-[76px] pl-5 pr-3 lg:pl-8 lg:pr-4 flex items-center justify-between rounded-b-[28px]">
          <svg aria-hidden="true" viewBox="0 0 56 48" className="nav-ink-fill absolute top-0 -left-[55px] w-14 h-12 hidden lg:block">
            <path d="M0,0 H56 V48 C56,24 38,12 0,12 Z" />
          </svg>
          <svg aria-hidden="true" viewBox="0 0 56 48" className="nav-ink-fill absolute top-0 -right-[55px] w-14 h-12 -scale-x-100 hidden lg:block">
            <path d="M0,0 H56 V48 C56,24 38,12 0,12 Z" />
          </svg>
          {/* ── Logo ── */}
          {/* The source PNG is square with the artwork in its middle band — crop to it. */}
          <Link
            href={language === "fr" ? "/" : `/${language}`}
            className="relative block h-11 w-[96px] shrink-0 overflow-hidden group cursor-pointer"
          >
            <Image
              src="https://pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev/logo/logoWithNoBg.png"
              alt="Arabian Desert Home — Agafay, Marrakech"
              width={498}
              height={501}
              priority
              className="absolute left-[-16px] top-[-42px] h-[128px] w-[128px] max-w-none brightness-0 invert transition-opacity duration-300 group-hover:opacity-75"
            />
          </Link>

          {/* ── Desktop Nav — mono labels, amber dot marks the current page ── */}
          <NavigationMenu viewport={false} className="hidden lg:flex">
            <NavigationMenuList className="gap-8">
              {navEntries.map((entry) => {
                const idleColor = "text-white/60 hover:text-white";
                const dot = (on: boolean) => (
                  <span
                    aria-hidden="true"
                    className={`absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber transition-all duration-300 ${on ? "opacity-100 scale-100" : "opacity-0 scale-0 group-hover/navlink:opacity-50 group-hover/navlink:scale-100"
                      }`}
                  />
                );

                if (entry.kind === "link") {
                  const href = localizedHref(entry.href, language);
                  const isActive = pathname === href;
                  return (
                    <NavigationMenuItem key={entry.href}>
                      <Link
                        href={href}
                        aria-current={isActive ? "page" : undefined}
                        className={`mono-meta relative group/navlink cursor-pointer transition-colors duration-300 ${isActive ? "text-amber" : idleColor
                          }`}
                      >
                        {t(entry.labelKey)}
                        {dot(isActive)}
                      </Link>
                    </NavigationMenuItem>
                  );
                }

                const groupActive = entry.items.some(
                  (item) => pathname === localizedHref(item.href, language)
                );
                return (
                  <NavigationMenuItem key={entry.labelKey}>
                    <NavigationMenuTrigger
                      className={`group/navlink mono-meta relative h-auto w-auto rounded-none bg-transparent px-0 py-0 text-[0.6875rem] font-normal hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent data-[state=open]:hover:bg-transparent data-[state=open]:focus:bg-transparent data-[state=open]:text-white cursor-pointer transition-colors duration-300 ${groupActive ? "text-amber" : idleColor
                        }`}
                    >
                      {t(entry.labelKey)}
                      {dot(groupActive)}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="!mt-[44px] !rounded-3xl !border !border-border !bg-popover !text-popover-foreground p-2 !shadow-2xl !shadow-black/10">
                      <ul className="w-[20rem]">
                        {entry.items.map((item) => {
                          const href = localizedHref(item.href, language);
                          const isActive = pathname === href;
                          return (
                            <li key={item.href}>
                              <NavigationMenuLink asChild>
                                <Link
                                  href={href}
                                  aria-current={isActive ? "page" : undefined}
                                  className={`group/item block rounded-2xl px-4 py-3 transition-colors duration-300 cursor-pointer hover:bg-amber/[0.08] focus-visible:bg-amber/[0.08] ${isActive ? "bg-amber/[0.08]" : ""
                                    }`}
                                >
                                  <span
                                    className={`luxury-label flex items-center justify-between mb-1 ${isActive ? "text-amber" : "text-foreground"
                                      }`}
                                  >
                                    {t(item.labelKey)}
                                    <ArrowUpRight className="w-3.5 h-3.5 text-amber opacity-0 -translate-x-1 transition-all duration-300 group-hover/item:opacity-100 group-hover/item:translate-x-0" />
                                  </span>
                                  {item.descKey && (
                                    <span className="body-editorial block text-xs leading-snug text-muted-foreground">
                                      {t(item.descKey)}
                                    </span>
                                  )}
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          );
                        })}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>

          {/* ── Right Controls: Language · Book · Mobile Toggle ── */}
          <div className="flex items-center gap-2">
            {/* Language Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="hidden md:flex items-center gap-1.5 mono-meta px-3 h-11 rounded-full text-white/60 hover:text-white hover:bg-white/[0.06] transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/50"
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
                <DropdownMenuItem
                  onClick={() => switchLanguage("es")}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">🇪🇸</span>
                    Español
                  </span>
                  {language === "es" && <Check className="w-4 h-4 text-amber" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => switchLanguage("it")}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">🇮🇹</span>
                    Italiano
                  </span>
                  {language === "it" && <Check className="w-4 h-4 text-amber" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Book Now — Amber Gradient Pill */}
            <Link href={withLocale(language, "/reservez-votre-sejour")} className="hidden md:block">
              <span className="btn-primary inline-flex items-center h-12 !py-0 cursor-pointer hover:no-underline">
                {t("nav.bookNow")}
              </span>
            </Link>

            {/* Mobile language toggle — always visible on mobile, cycles through fr→en→es→it */}
            <button
              onClick={() => {
                const order: Language[] = ["fr", "en", "es", "it"];
                const next = order[(order.indexOf(language) + 1) % order.length];
                switchLanguage(next);
              }}
              className="flex md:hidden items-center justify-center mono-meta w-11 h-11 rounded-full text-amber cursor-pointer hover:bg-white/[0.06] transition-all duration-300"
              aria-label="Toggle language"
            >
              {language.toUpperCase()}
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-12 h-12 flex items-center justify-center rounded-full bg-white/[0.08] text-white hover:bg-white/[0.14] transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber/50"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
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
              <div className="flex-1 flex flex-col justify-center gap-1 overflow-y-auto">
                {navEntries.map((entry, i) => {
                  const transition = { delay: 0.08 + i * 0.05, duration: 0.5, ease: flowingEase };

                  if (entry.kind === "group") {
                    return (
                      <motion.div
                        key={entry.labelKey}
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={transition}
                        className="py-2 pl-6"
                      >
                        <span className="mono-meta text-amber/70 block mb-2">{t(entry.labelKey)}</span>
                        <div className="flex flex-col border-l border-amber/15 pl-4">
                          {entry.items.map((item) => {
                            const href = localizedHref(item.href, language);
                            const isActive = pathname === href;
                            return (
                              <Link
                                key={item.href}
                                href={href}
                                onClick={closeMobile}
                                className={`font-serif text-xl sm:text-2xl py-1.5 cursor-pointer transition-colors duration-300 ${isActive ? "text-amber" : "text-foreground/70 hover:text-amber"
                                  }`}
                              >
                                {t(item.labelKey)}
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    );
                  }

                  const href = localizedHref(entry.href, language);
                  const isActive = pathname === href;
                  return (
                    <motion.div
                      key={entry.href}
                      initial={{ opacity: 0, x: -40 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={transition}
                    >
                      <Link
                        href={href}
                        onClick={closeMobile}
                        className={`font-serif text-3xl sm:text-4xl py-2 flex items-center gap-4 group cursor-pointer transition-colors duration-300 ${isActive
                          ? "text-amber"
                          : "text-foreground/80 hover:text-amber"
                          }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full bg-amber transition-all duration-300 ${isActive
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-0 group-hover:opacity-60 group-hover:scale-100"
                            }`}
                        />
                        {t(entry.labelKey)}
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
                <Link href={withLocale(language, "/reservez-votre-sejour")} onClick={closeMobile}>
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
                    <DropdownMenuItem
                      onClick={() => switchLanguage("es")}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-base">🇪🇸</span>
                        Español
                      </span>
                      {language === "es" && <Check className="w-4 h-4 text-amber" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => switchLanguage("it")}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-base">🇮🇹</span>
                        Italiano
                      </span>
                      {language === "it" && <Check className="w-4 h-4 text-amber" />}
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
