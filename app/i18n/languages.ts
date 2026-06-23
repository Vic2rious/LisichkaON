// SHARED LANGUAGE LIST
//
// To add a new language later:
//   1. Add an entry here (code, label, flag).
//   2. Add a matching block to every translation file (register.ts, login.ts, ...)
//      keyed by the same `code`.

export const languages = [
  { code: "bg", label: "Български", flag: "🇧🇬" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
] as const;

export type LangCode = (typeof languages)[number]["code"];
