// TERMS & CONDITIONS PAGE

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function TermsPage() {
  const [termsText, setTermsText] = useState("");

  useEffect(() => {
    fetch("/terms.txt")
      .then((r) => r.text())
      .then(setTermsText);
  }, []);

  return (
    <main className="min-h-screen bg-[#f8f8f6] relative overflow-hidden flex items-center justify-center px-4 py-8">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,146,60,0.18),transparent_40%)]" />
      <div className="absolute -top-24 -left-20 w-72 h-72 bg-red-500/10 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-orange-500/10 blur-3xl rounded-full" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-2xl">
        <div className="backdrop-blur-xl bg-white/80 border border-orange-200 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-zinc-100">
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
              Terms & Conditions
            </h1>
            <span className="text-3xl">🦊</span>
          </div>

          {/* Text */}
          <div className="overflow-y-auto px-6 sm:px-8 py-6 text-sm text-zinc-600 leading-relaxed whitespace-pre-wrap font-mono">
            {termsText}
          </div>

          {/* Footer */}
          <div className="px-6 sm:px-8 py-4 border-t border-zinc-100">
            <Link
              href="/"
              className="block w-full text-center rounded-2xl bg-orange-400 text-black font-bold py-3.5 px-4 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_30px_rgba(251,146,60,0.45)]"
            >
              Go Back
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
