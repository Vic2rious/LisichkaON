// LOGIN PAGE TRANSLATIONS
//
// Option `value`s stay constant across languages (they are saved to the
// database as `rehearsal_name`) — only the displayed `label`s are translated.
// To add a new language: add it to ./languages.ts, then add a matching block
// below keyed by the same code.

import type { LangCode } from "./languages";

type Option = { value: string; label: string };

export type LoginStrings = {
  title: string;
  subtitle: string;
  email: string;
  password: string;
  rehearsal: string;
  rehearsalPlaceholder: string;
  rehearsalOptions: Option[];
  login: string;
  loggingIn: string;
  processing: string;
  noAccount: string;
  msgSelectRehearsal: string;
  msgLoginFailed: string;
  msgProfileError: string;
  msgHistoryError: string;
  cooldown: (minutes: number) => string;
  msgAttendanceError: string;
  msgSuccess: string;
};

export const loginTranslations: Record<LangCode, LoginStrings> = {
  en: {
    title: "Login",
    subtitle: "Sign in and mark your attendance.",
    email: "Email",
    password: "Password",
    rehearsal: "Rehearsal Name",
    rehearsalPlaceholder: "Select a rehearsal",
    rehearsalOptions: [
      {
        value: "Monday for Beginners",
        label: "Monday for Beginners",
      },
      {
        value: "Thursday for Advanced",
        label: "Thursday for Advanced",
      },
      { value: "Friday for All", label: "Friday for All" },
      { value: "Other", label: "Other" },
    ],
    login: "Login & Save Attendance",
    loggingIn: "Logging In...",
    processing: "Processing...",
    noAccount: "Don't have an account? Register here.",
    msgSelectRehearsal: "Please enter a rehearsal name",
    msgLoginFailed: "Login failed",
    msgProfileError: "Could not load member profile",
    msgHistoryError: "Could not verify attendance history",
    cooldown: (minutes) =>
      `You can only submit attendance once every two hours. Please try again in ${minutes} minute${
        minutes === 1 ? "" : "s"
      }.`,
    msgAttendanceError: "Could not save attendance",
    msgSuccess:
      "Successfully logged in and attendance saved!",
  },
  bg: {
    title: "Вход",
    subtitle: "Влез и отбележи присъствието си.",
    email: "Имейл",
    password: "Парола",
    rehearsal: "Репетиция",
    rehearsalPlaceholder: "Избери репетиция",
    rehearsalOptions: [
      {
        value: "Monday for Beginners",
        label: "Понеделник за начинаещи",
      },
      {
        value: "Thursday for Advanced",
        label: "Четвъртък за напреднали",
      },
      { value: "Friday for All", label: "Петък за всички" },
      { value: "Other", label: "Друго" },
    ],
    login: "Вход и запис на присъствие",
    loggingIn: "Влизане...",
    processing: "Обработва се...",
    noAccount: "Нямаш профил? Регистрирай се тук.",
    msgSelectRehearsal: "Моля, избери репетиция",
    msgLoginFailed: "Входът е неуспешен",
    msgProfileError: "Профилът не може да бъде зареден",
    msgHistoryError:
      "Историята на присъствията не може да бъде проверена",
    cooldown: (minutes) =>
      `Можеш да отбелязваш присъствие само веднъж на два часа. Опитай отново след ${minutes} минут${
        minutes === 1 ? "а" : "и"
      }.`,
    msgAttendanceError: "Присъствието не може да бъде записано",
    msgSuccess: "Успешен вход и записано присъствие!",
  },
  de: {
    title: "Anmelden",
    subtitle:
      "Melde dich an und trage deine Anwesenheit ein.",
    email: "E-Mail",
    password: "Passwort",
    rehearsal: "Probe",
    rehearsalPlaceholder: "Wähle eine Probe",
    rehearsalOptions: [
      {
        value: "Monday for Beginners",
        label: "Montag für Anfänger",
      },
      {
        value: "Thursday for Advanced",
        label: "Donnerstag für Fortgeschrittene",
      },
      { value: "Friday for All", label: "Freitag für Alle" },
      { value: "Other", label: "Sonstiges" },
    ],
    login: "Anmelden & Anwesenheit speichern",
    loggingIn: "Anmeldung läuft...",
    processing: "Wird verarbeitet...",
    noAccount: "Noch kein Konto? Hier registrieren.",
    msgSelectRehearsal: "Bitte wähle eine Probe aus",
    msgLoginFailed: "Anmeldung fehlgeschlagen",
    msgProfileError: "Profil konnte nicht geladen werden",
    msgHistoryError:
      "Anwesenheitsverlauf konnte nicht überprüft werden",
    cooldown: (minutes) =>
      `Du kannst deine Anwesenheit nur alle zwei Stunden eintragen. Bitte versuche es in ${minutes} Minute${
        minutes === 1 ? "" : "n"
      } erneut.`,
    msgAttendanceError:
      "Anwesenheit konnte nicht gespeichert werden",
    msgSuccess:
      "Erfolgreich angemeldet und Anwesenheit gespeichert!",
  },
};
