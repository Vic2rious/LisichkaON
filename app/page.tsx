// REGISTER PAGE

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { supabase } from "@/supabase";
import { registerTranslations } from "./i18n/register";
import { useLanguage } from "./i18n/LanguageProvider";
import { LanguageSwitcher } from "./i18n/LanguageSwitcher";

export default function RegisterPage() {
  const router = useRouter();

  const { lang } = useLanguage();
  const t = registerTranslations[lang];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");

  // Optional survey questions (not required for registration)
  const [referralSource, setReferralSource] = useState("");
  const [danceExperience, setDanceExperience] = useState("");
  const [stageComfort, setStageComfort] = useState("");

  const [picture, setPicture] = useState<File | null>(null);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<
    "success" | "error" | ""
  >("");

  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [showQr, setShowQr] = useState(false);

  // Close the QR popup with the Escape key
  useEffect(() => {
    if (!showQr) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setShowQr(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showQr]);

  async function signUp() {
    setMessage("");
    setMessageType("");
    setLoading(true);

    if (!agreed) {
      setMessageType("error");
      setMessage(t.msgMustAgree);
      setLoading(false);
      return;
    }

    if (!picture) {
      setMessageType("error");
      setMessage(t.msgUploadPicture);
      setLoading(false);
      return;
    }

    // CREATE AUTH USER
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    console.log("SIGNUP DATA:", data);
    console.log("SIGNUP ERROR:", error);

    if (error || !data.user) {
      setMessageType("error");
      setMessage(error?.message || t.msgSignupFailed);
      setLoading(false);
      return;
    }

    const user = data.user;

    // CREATE FILE NAME
    const fileExt = picture.name.split(".").pop();
    const fileName = `${user.id}.${fileExt}`;

    // UPLOAD IMAGE
    const { error: uploadError } = await supabase.storage
      .from("profile-pictures")
      .upload(fileName, picture);

    console.log("UPLOAD ERROR:", uploadError);

    if (uploadError) {
      setMessageType("error");
      setMessage(uploadError.message);
      setLoading(false);
      return;
    }

    // GET PUBLIC URL
    const {
      data: { publicUrl },
    } = supabase.storage
      .from("profile-pictures")
      .getPublicUrl(fileName);

    console.log("IMAGE URL:", publicUrl);

    // INSERT PROFILE
    const { error: insertError } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        name: name,
        birth_date: birthDate,
        picture: publicUrl,
        basic_info: [
          referralSource,
          danceExperience,
          stageComfort,
        ],
      });

    console.log("INSERT ERROR:", insertError);

    if (insertError) {
      setMessageType("error");
      setMessage(insertError.message);
      setLoading(false);
      return;
    }

    setMessageType("success");

    setMessage(t.msgSuccess);

    setLoading(false);

    setTimeout(() => {
      router.push("/login");
    }, 2000);
  }

  const MAX_PICTURE_BYTES = 5 * 1024 * 1024; // 5MB

  function handlePictureSelect(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    // Allow re-selecting the same file later
    e.target.value = "";

    if (!file) return;

    if (file.size > MAX_PICTURE_BYTES) {
      setMessageType("error");
      setMessage(t.msgImageTooLarge);
      setPicture(null);
      return;
    }

    setMessage("");
    setMessageType("");
    setPicture(file);
  }

  return (
    <main className="min-h-screen bg-[#f8f8f6] relative overflow-hidden flex items-center justify-center px-4 py-8">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,146,60,0.18),transparent_40%)]" />
      <div className="absolute -top-24 -left-20 w-72 h-72 bg-red-500/10 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-orange-500/10 blur-3xl rounded-full" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/80 border border-orange-200 rounded-3xl p-6 sm:p-8 shadow-2xl">
          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Header */}
          <div className="mb-8 text-center">
            <button
              type="button"
              onClick={() => setShowQr(true)}
              aria-label={t.qrShow}
              title={t.qrShow}
              className="inline-flex items-center justify-center mb-4 rounded-2xl cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-400/40"
            >
              <Image
                src="/Lisichka-Logo.jpg"
                alt="Lisichka Logo"
                width={72}
                height={72}
                className="rounded-2xl shadow-[0_0_25px_rgba(251,146,60,0.25)]"
              />
            </button>

            <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 tracking-tight">
              {t.title}
            </h1>

            <p className="text-zinc-500 mt-2 text-sm sm:text-base">
              {t.subtitle}
            </p>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-zinc-700">
                {t.email}
              </label>

              <input
                className="bg-white border border-zinc-200 focus:border-orange-400/60 focus:ring-4 focus:ring-orange-400/10 outline-none transition-all duration-300 rounded-2xl px-4 py-3 text-zinc-900 placeholder:text-zinc-400"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-zinc-700">
                {t.password}
              </label>

              <input
                className="bg-white border border-zinc-200 focus:border-orange-400/60 focus:ring-4 focus:ring-orange-400/10 outline-none transition-all duration-300 rounded-2xl px-4 py-3 text-zinc-900 placeholder:text-zinc-400"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />
            </div>

            {/* Name */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-zinc-700">
                {t.name}
              </label>

              <input
                className="bg-white border border-zinc-200 focus:border-orange-400/60 focus:ring-4 focus:ring-orange-400/10 outline-none transition-all duration-300 rounded-2xl px-4 py-3 text-zinc-900 placeholder:text-zinc-400"
                type="text"
                placeholder={t.namePlaceholder}
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
              />
            </div>

            {/* Age Range */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-zinc-700">
                {t.ageRange}
              </label>

              <select
                className="bg-white border border-zinc-200 focus:border-orange-400/60 focus:ring-4 focus:ring-orange-400/10 outline-none transition-all duration-300 rounded-2xl px-4 py-3 text-zinc-900 appearance-none cursor-pointer"
                value={birthDate}
                onChange={(e) =>
                  setBirthDate(e.target.value)
                }
              >
                <option value="" disabled>
                  {t.ageRangePlaceholder}
                </option>
                {t.ageRangeOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Optional survey questions */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-zinc-700">
                {t.referralQ}{" "}
                <span className="text-zinc-400">{t.optional}</span>
              </label>

              <select
                className="bg-white border border-zinc-200 focus:border-orange-400/60 focus:ring-4 focus:ring-orange-400/10 outline-none transition-all duration-300 rounded-2xl px-4 py-3 text-zinc-900 appearance-none cursor-pointer"
                value={referralSource}
                onChange={(e) =>
                  setReferralSource(e.target.value)
                }
              >
                <option value="">{t.selectOption}</option>
                {t.referralOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-zinc-700">
                {t.experienceQ}{" "}
                <span className="text-zinc-400">{t.optional}</span>
              </label>

              <select
                className="bg-white border border-zinc-200 focus:border-orange-400/60 focus:ring-4 focus:ring-orange-400/10 outline-none transition-all duration-300 rounded-2xl px-4 py-3 text-zinc-900 appearance-none cursor-pointer"
                value={danceExperience}
                onChange={(e) =>
                  setDanceExperience(e.target.value)
                }
              >
                <option value="">{t.selectOption}</option>
                {t.experienceOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-zinc-700">
                {t.stageQ}{" "}
                <span className="text-zinc-400">{t.optional}</span>
              </label>

              <select
                className="bg-white border border-zinc-200 focus:border-orange-400/60 focus:ring-4 focus:ring-orange-400/10 outline-none transition-all duration-300 rounded-2xl px-4 py-3 text-zinc-900 appearance-none cursor-pointer"
                value={stageComfort}
                onChange={(e) =>
                  setStageComfort(e.target.value)
                }
              >
                <option value="">{t.selectOption}</option>
                {t.stageOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Upload */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-zinc-700">
                {t.profilePicture}
              </label>

              <div className="grid grid-cols-2 gap-3">
                {/* Take Photo */}
                <label className="cursor-pointer rounded-2xl border border-dashed border-orange-400/30 bg-orange-400/5 hover:bg-orange-400/10 transition-all duration-300 px-4 py-5 text-center">
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="text-2xl">📷</span>
                    <span className="text-sm text-zinc-700">
                      {t.takePhoto}
                    </span>
                  </div>

                  <input
                    className="hidden"
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handlePictureSelect}
                  />
                </label>

                {/* Choose from Gallery */}
                <label className="cursor-pointer rounded-2xl border border-dashed border-orange-400/30 bg-orange-400/5 hover:bg-orange-400/10 transition-all duration-300 px-4 py-5 text-center">
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="text-2xl">🖼️</span>
                    <span className="text-sm text-zinc-700">
                      {t.fromGallery}
                    </span>
                  </div>

                  <input
                    className="hidden"
                    type="file"
                    accept="image/*"
                    onChange={handlePictureSelect}
                  />
                </label>
              </div>

              <p className="text-xs text-zinc-500 text-center">
                {picture
                  ? `${t.selectedPrefix} ${picture.name}`
                  : t.pictureHint}
              </p>
            </div>

            {/* Terms & Conditions */}
            <div className="flex flex-col gap-2">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <div className="relative mt-0.5 flex-shrink-0">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                  />
                  <div className="w-5 h-5 rounded-md border-2 border-zinc-300 bg-white peer-checked:bg-orange-400 peer-checked:border-orange-400 transition-all duration-200 flex items-center justify-center">
                    {agreed && (
                      <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm text-zinc-600 leading-snug">
                  {t.agreePrefix}{" "}
                  <a
                    href="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-500 hover:text-orange-600 underline underline-offset-2 font-medium transition-colors"
                  >
                    {t.termsLink}
                  </a>
                  {t.agreeSuffix ? ` ${t.agreeSuffix}` : ""}
                </span>
              </label>
            </div>

            {/* Button */}
            <button
              className="mt-2 rounded-2xl bg-orange-400 text-black font-bold py-3.5 px-4 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_30px_rgba(251,146,60,0.45)] disabled:opacity-50 disabled:hover:scale-100"
              onClick={signUp}
              disabled={loading}
            >
              {loading ? t.creating : t.register}
            </button>

            {/* Status */}
            {(loading || message) && (
              <div
                className={`mt-2 rounded-2xl border px-4 py-3 text-sm transition-all duration-300 ${
                  loading
                    ? "border-zinc-200 bg-white text-zinc-600"
                    : messageType === "success"
                    ? "border-green-500/40 bg-green-500/10 text-green-700"
                    : "border-red-500/40 bg-red-500/10 text-red-700"
                }`}
              >
                {loading ? t.processing : message}
              </div>
            )}

            {/* Footer */}
            <div className="mt-4 text-center">
              <Link
                href="/login"
                className="text-sm text-zinc-500 hover:text-orange-500 transition-colors"
              >
                {t.alreadyHaveAccount}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* QR code popup (opened by clicking the logo) */}
      {showQr && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          onClick={() => setShowQr(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="qr-title"
            className="relative w-full max-w-sm rounded-3xl border border-orange-200 bg-white p-6 sm:p-8 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowQr(false)}
              aria-label={t.qrClose}
              autoFocus
              className="absolute top-3 right-3 w-9 h-9 rounded-full text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors text-xl leading-none focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-400/40"
            >
              ×
            </button>

            <h2
              id="qr-title"
              className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight"
            >
              {t.qrTitle}
            </h2>

            <Image
              src="/QRtoRegister.png"
              alt={t.qrTitle}
              width={1024}
              height={1024}
              className="mt-5 w-full h-auto rounded-2xl bg-white"
              loading="eager"
              unoptimized
            />

            <p className="mt-4 text-sm text-zinc-500">{t.qrHint}</p>
          </div>
        </div>
      )}
    </main>
  );
}