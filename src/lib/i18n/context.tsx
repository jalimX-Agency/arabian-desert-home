"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export type Language = "fr" | "en" | "es" | "it";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  tArray: (key: string) => string[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Import translations
import { en } from "./translations/en";
import { fr } from "./translations/fr";
import { es } from "./translations/es";
import { it } from "./translations/it";

const translations: Record<Language, Record<string, unknown>> = { en, fr, es, it };
const VALID_LANGUAGES: Language[] = ["fr", "en", "es", "it"];

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && acc !== null) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

export function LanguageProvider({
  children,
  initialLanguage,
  locked = false,
}: {
  children: React.ReactNode;
  /** Language to render on the server (e.g. "en" under /en/*). Defaults to "fr" for existing routes. */
  initialLanguage?: Language;
  /** When true, skip the localStorage auto-hydration — the URL dictates the language. */
  locked?: boolean;
}) {
  const [language, setLanguageState] = useState<Language>(initialLanguage ?? "fr");

  useEffect(() => {
    if (locked) return;
    const saved = localStorage.getItem("adh-language") as Language | null;
    if (saved && VALID_LANGUAGES.includes(saved)) {
      setLanguageState(saved);
    }
  }, [locked]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("adh-language", lang);
    document.documentElement.lang = lang;
  }, []);

  const t = useCallback(
    (key: string): string => {
      const value = getNestedValue(translations[language], key);
      if (typeof value === "string") return value;
      // Fallback: non-French locales fall back to French; French falls back to English
      const fallbackLang = language === "fr" ? "en" : "fr";
      const fallback = getNestedValue(translations[fallbackLang], key);
      if (typeof fallback === "string") return fallback;
      return key;
    },
    [language]
  );

  const tArray = useCallback(
    (key: string): string[] => {
      const value = getNestedValue(translations[language], key);
      if (Array.isArray(value)) return value as string[];
      const fallbackLang = language === "fr" ? "en" : "fr";
      const fallback = getNestedValue(translations[fallbackLang], key);
      if (Array.isArray(fallback)) return fallback as string[];
      return [];
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tArray }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

/** Prefixes an internal path with the current locale (no-op for French). */
export function withLocale(language: Language, path: string): string {
  return language === "fr" ? path : `/${language}${path}`;
}

/** Picks the localized value of a DB field, falling back to the French base if the translation is empty. */
export function pickLocalized(language: Language, base: string, en?: string, es?: string, it?: string): string {
  if (language === "en" && en) return en;
  if (language === "es" && es) return es;
  if (language === "it" && it) return it;
  return base;
}
