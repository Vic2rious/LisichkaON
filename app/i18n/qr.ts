// QR CODE POPUP TRANSLATIONS (shared by the register and login pages)

import type { LangCode } from "./languages";

export type QrStrings = {
  show: string;
  title: string;
  hint: string;
  close: string;
};

export const qrTranslations: Record<LangCode, QrStrings> = {
  en: {
    show: "Show registration QR code",
    title: "Scan to register",
    hint: "Point your phone camera at the code to open the registration page.",
    close: "Close",
  },
  bg: {
    show: "Покажи QR кода за регистрация",
    title: "Сканирай, за да се регистрираш",
    hint: "Насочи камерата на телефона към кода, за да отвориш страницата за регистрация.",
    close: "Затвори",
  },
  de: {
    show: "QR-Code zur Registrierung anzeigen",
    title: "Zum Registrieren scannen",
    hint: "Richte die Handykamera auf den Code, um die Registrierungsseite zu öffnen.",
    close: "Schließen",
  },
};
