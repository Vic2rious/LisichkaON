// REUSABLE FLAG LANGUAGE SWITCHER

"use client";

import { languages } from "./languages";
import { useLanguage } from "./LanguageProvider";

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex justify-end gap-1.5 mb-2">
      {languages.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => setLang(l.code)}
          title={l.label}
          aria-label={l.label}
          className={`text-xl leading-none rounded-lg px-1.5 py-1 transition-all duration-200 ${
            lang === l.code
              ? "opacity-100 scale-110 ring-2 ring-orange-400/50 bg-orange-400/10"
              : "opacity-50 hover:opacity-90"
          }`}
        >
          {l.flag}
        </button>
      ))}
    </div>
  );
}
