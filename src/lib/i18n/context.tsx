"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export type Language = "fr" | "en";

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

const translations: Record<Language, Record<string, unknown>> = { en, fr };

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && acc !== null) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Always start with "fr" to match SSR, then hydrate from localStorage in useEffect
  const [language, setLanguageState] = useState<Language>("fr");

  useEffect(() => {
    const saved = localStorage.getItem("adh-language") as Language | null;
    if (saved === "fr" || saved === "en") {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("adh-language", lang);
    document.documentElement.lang = lang;
  }, []);

  const t = useCallback(
    (key: string): string => {
      const value = getNestedValue(translations[language], key);
      if (typeof value === "string") return value;
      // Fallback to other language
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
