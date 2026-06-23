// SHARED LANGUAGE STATE
//
// Holds the selected language for the whole app and persists it to
// localStorage so the choice survives reloads and is shared across pages.

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { languages, type LangCode } from "./languages";

const STORAGE_KEY = "lisichka-lang";

type LanguageContextValue = {
  lang: LangCode;
  setLang: (lang: LangCode) => void;
};

const LanguageContext =
  createContext<LanguageContextValue | null>(null);

function isValidLang(code: string): code is LangCode {
  return languages.some((l) => l.code === code);
}

export function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lang, setLangState] = useState<LangCode>("bg");

  // Restore the persisted choice after mount (localStorage is client-only).
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && isValidLang(stored)) {
      setLangState(stored);
    }
  }, []);

  function setLang(next: LangCode) {
    setLangState(next);
    localStorage.setItem(STORAGE_KEY, next);
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error(
      "useLanguage must be used within a LanguageProvider"
    );
  }
  return ctx;
}
