// LOGO THAT OPENS THE REGISTRATION QR CODE
//
// Used in the header of the register and login pages. Clicking the logo
// opens a popup with /QRtoRegister.png. The popup is rendered into
// <body> via a portal, because the page card uses backdrop-blur, which
// would otherwise trap a `position: fixed` overlay inside the card.

"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

import { qrTranslations } from "../i18n/qr";
import { useLanguage } from "../i18n/LanguageProvider";

export function QrLogo() {
  const { lang } = useLanguage();
  const t = qrTranslations[lang];

  const [open, setOpen] = useState(false);

  // Close with the Escape key
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t.show}
        title={t.show}
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

      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
            onClick={() => setOpen(false)}
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
                onClick={() => setOpen(false)}
                aria-label={t.close}
                autoFocus
                className="absolute top-3 right-3 w-9 h-9 rounded-full text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors text-xl leading-none focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-400/40"
              >
                ×
              </button>

              <h2
                id="qr-title"
                className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight"
              >
                {t.title}
              </h2>

              <Image
                src="/QRtoRegister.png"
                alt={t.title}
                width={1024}
                height={1024}
                className="mt-5 w-full h-auto rounded-2xl bg-white"
                loading="eager"
                unoptimized
              />

              <p className="mt-4 text-sm text-zinc-500">{t.hint}</p>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
