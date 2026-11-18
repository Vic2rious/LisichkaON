// REGISTER FORM TRANSLATIONS
//
// Option `value`s stay constant across languages (they are what gets saved to
// the database) — only the displayed `label`s are translated.
// To add a new language: add it to ./languages.ts, then add a matching block
// below keyed by the same code.

import type { LangCode } from "./languages";

type Option = { value: string; label: string };

export type RegisterStrings = {
  title: string;
  subtitle: string;
  email: string;
  password: string;
  name: string;
  namePlaceholder: string;
  ageRange: string;
  ageRangePlaceholder: string;
  ageRangeOptions: Option[];
  optional: string;
  selectOption: string;
  referralQ: string;
  referralOptions: Option[];
  experienceQ: string;
  experienceOptions: Option[];
  stageQ: string;
  stageOptions: Option[];
  profilePicture: string;
  takePhoto: string;
  fromGallery: string;
  selectedPrefix: string;
  pictureHint: string;
  agreePrefix: string;
  termsLink: string;
  agreeSuffix: string;
  register: string;
  creating: string;
  processing: string;
  alreadyHaveAccount: string;
  msgMustAgree: string;
  msgUploadPicture: string;
  msgSignupFailed: string;
  msgImageTooLarge: string;
  msgSuccess: string;
};

export const registerTranslations: Record<LangCode, RegisterStrings> = {
  en: {
    title: "Create Account",
    subtitle: "Join the Lisichka side.",
    email: "Email",
    password: "Password",
    name: "Name",
    namePlaceholder: "Your name",
    ageRange: "Age Range",
    ageRangePlaceholder: "Select your age range",
    ageRangeOptions: [
      { value: "0-18", label: "0 – 18" },
      { value: "18-25", label: "18 – 25" },
      { value: "25+", label: "25+" },
    ],
    optional: "(optional)",
    selectOption: "Select an option",
    referralQ: "How did you learn about Lisichka?",
    referralOptions: [
      { value: "Friend or family", label: "Friend or family" },
      { value: "Social media", label: "Social media" },
      { value: "Web search", label: "Web search" },
      { value: "Local event", label: "Local event" },
      { value: "Other", label: "Other" },
    ],
    experienceQ: "What is your experience in folk dancing?",
    experienceOptions: [
      { value: "None", label: "None" },
      { value: "Beginner", label: "Beginner" },
      { value: "Intermediate", label: "Intermediate" },
      { value: "Advanced", label: "Advanced" },
    ],
    stageQ: "Are you comfortable performing on stage?",
    stageOptions: [
      { value: "Yes", label: "Yes" },
      { value: "No", label: "No" },
      { value: "Not sure", label: "Not sure" },
    ],
    profilePicture: "Profile Picture",
    takePhoto: "Take Photo",
    fromGallery: "From Gallery",
    selectedPrefix: "Selected:",
    pictureHint: "PNG, JPG, WEBP — max 5MB",
    agreePrefix: "I agree with the",
    termsLink: "Lisichka Terms & Conditions",
    agreeSuffix: "",
    register: "Register",
    creating: "Creating Account...",
    processing: "Processing...",
    alreadyHaveAccount: "Already have an account?",
    msgMustAgree: "You must agree to the Terms & Conditions",
    msgUploadPicture: "Please upload a picture",
    msgSignupFailed: "Signup failed",
    msgImageTooLarge: "Image must be 5MB or smaller",
    msgSuccess: "Successfully registered! Redirecting to login...",
  },
  bg: {
    title: "Създаване на профил",
    subtitle: "Присъедини се към Lisichka.",
    email: "Имейл",
    password: "Парола",
    name: "Име",
    namePlaceholder: "Твоето име",
    ageRange: "Възрастова група",
    ageRangePlaceholder: "Избери възрастова група",
    ageRangeOptions: [
      { value: "0-18", label: "0 – 18" },
      { value: "18-25", label: "18 – 25" },
      { value: "25+", label: "25+" },
    ],
    optional: "(по избор)",
    selectOption: "Избери опция",
    referralQ: "Как разбра за Lisichka?",
    referralOptions: [
      { value: "Friend or family", label: "Приятел или семейство" },
      { value: "Social media", label: "Социални мрежи" },
      { value: "Web search", label: "Търсене в интернет" },
      { value: "Local event", label: "Местно събитие" },
      { value: "Other", label: "Друго" },
    ],
    experienceQ: "Какъв опит имаш в народните танци?",
    experienceOptions: [
      { value: "None", label: "Никакъв" },
      { value: "Beginner", label: "Начинаещ" },
      { value: "Intermediate", label: "Средно ниво" },
      { value: "Advanced", label: "Напреднал" },
    ],
    stageQ: "Чувстваш ли се комфортно да изпълняваш на сцена?",
    stageOptions: [
      { value: "Yes", label: "Да" },
      { value: "No", label: "Не" },
      { value: "Not sure", label: "Не съм сигурен" },
    ],
    profilePicture: "Профилна снимка",
    takePhoto: "Снимай",
    fromGallery: "От галерия",
    selectedPrefix: "Избрано:",
    pictureHint: "PNG, JPG, WEBP — макс. 5 МБ",
    agreePrefix: "Съгласявам се с",
    termsLink: "Общите условия на Lisichka",
    agreeSuffix: "",
    register: "Регистрация",
    creating: "Създаване на профил...",
    processing: "Обработва се...",
    alreadyHaveAccount: "Вече имаш профил?",
    msgMustAgree: "Трябва да приемеш Общите условия",
    msgUploadPicture: "Моля, качи снимка",
    msgSignupFailed: "Регистрацията е неуспешна",
    msgImageTooLarge: "Снимката трябва да е най-много 5 МБ",
    msgSuccess: "Успешна регистрация! Пренасочване към вход...",
  },
  de: {
    title: "Konto erstellen",
    subtitle: "Werde Teil von Lisichka.",
    email: "E-Mail",
    password: "Passwort",
    name: "Name",
    namePlaceholder: "Dein Name",
    ageRange: "Altersgruppe",
    ageRangePlaceholder: "Wähle deine Altersgruppe",
    ageRangeOptions: [
      { value: "0-18", label: "0 – 18" },
      { value: "18-25", label: "18 – 25" },
      { value: "25+", label: "25+" },
    ],
    optional: "(optional)",
    selectOption: "Bitte auswählen",
    referralQ: "Wie hast du von Lisichka erfahren?",
    referralOptions: [
      { value: "Friend or family", label: "Freunde oder Familie" },
      { value: "Social media", label: "Soziale Medien" },
      { value: "Web search", label: "Internetsuche" },
      { value: "Local event", label: "Lokale Veranstaltung" },
      { value: "Other", label: "Sonstiges" },
    ],
    experienceQ: "Welche Erfahrung hast du im Volkstanz?",
    experienceOptions: [
      { value: "None", label: "Keine" },
      { value: "Beginner", label: "Anfänger" },
      { value: "Intermediate", label: "Mittelstufe" },
      { value: "Advanced", label: "Fortgeschritten" },
    ],
    stageQ: "Fühlst du dich wohl, auf der Bühne aufzutreten?",
    stageOptions: [
      { value: "Yes", label: "Ja" },
      { value: "No", label: "Nein" },
      { value: "Not sure", label: "Nicht sicher" },
    ],
    profilePicture: "Profilbild",
    takePhoto: "Foto aufnehmen",
    fromGallery: "Aus Galerie",
    selectedPrefix: "Ausgewählt:",
    pictureHint: "PNG, JPG, WEBP — max. 5 MB",
    agreePrefix: "Ich stimme den",
    termsLink: "Lisichka Geschäftsbedingungen",
    agreeSuffix: "zu",
    register: "Registrieren",
    creating: "Konto wird erstellt...",
    processing: "Wird verarbeitet...",
    alreadyHaveAccount: "Hast du bereits ein Konto?",
    msgMustAgree: "Du musst den Geschäftsbedingungen zustimmen",
    msgUploadPicture: "Bitte lade ein Bild hoch",
    msgSignupFailed: "Registrierung fehlgeschlagen",
    msgImageTooLarge: "Das Bild darf höchstens 5 MB groß sein",
    msgSuccess: "Erfolgreich registriert! Weiterleitung zum Login...",
  },
};
