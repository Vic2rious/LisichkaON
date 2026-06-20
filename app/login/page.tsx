// LOGIN PAGE

"use client";

import { useState } from "react";
import { supabase } from "@/supabase";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rehearsalName, setRehearsalName] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<
    "success" | "error" | ""
  >("");

  const [loading, setLoading] = useState(false);

  async function login() {
    setMessage("");
    setMessageType("");
    setLoading(true);

    if (!rehearsalName.trim()) {
      setMessageType("error");
      setMessage("Please enter a rehearsal name");
      setLoading(false);
      return;
    }

    // LOGIN
    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    console.log("LOGIN DATA:", data);
    console.log("LOGIN ERROR:", error);

    if (error) {
      setMessageType("error");
      setMessage(error.message);
      setLoading(false);
      return;
    }

    if (!data.user) {
      setMessageType("error");
      setMessage("Login failed");
      setLoading(false);
      return;
    }

    console.log("USER:", data.user);

    // GET USER PROFILE
    const { data: memberData, error: memberError } =
      await supabase
        .from("profiles")
        .select("name")
        .eq("id", data.user.id)
        .single();

    console.log("MEMBER DATA:", memberData);
    console.log("MEMBER ERROR:", memberError);

    if (memberError || !memberData) {
      setMessageType("error");
      setMessage("Could not load member profile");
      setLoading(false);
      return;
    }

    // INSERT ATTENDANCE
    const { error: attendanceError } =
      await supabase
        .from("Attendance")
        .insert({
          name: memberData.name,
          rehearsal_name: rehearsalName,
          user_id: data.user.id,
        });

    console.log("ATTENDANCE ERROR:", attendanceError);

    if (attendanceError) {
      setMessageType("error");
      setMessage("Could not save attendance");
      setLoading(false);
      return;
    }

    setMessageType("success");

    setMessage(
      "Successfully logged in and attendance saved!"
    );

    console.log("Attendance entry created");

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#f8f8f6] relative overflow-hidden flex items-center justify-center px-4 py-8">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,146,60,0.18),transparent_40%)]" />
      <div className="absolute -top-24 -left-20 w-72 h-72 bg-red-500/10 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-orange-500/10 blur-3xl rounded-full" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/80 border border-orange-200 rounded-3xl p-6 sm:p-8 shadow-2xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-400/10 border border-orange-400/20 mb-4 shadow-[0_0_25px_rgba(251,146,60,0.25)]">
              <span className="text-3xl">🦊</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 tracking-tight">
              Login
            </h1>

            <p className="text-zinc-500 mt-2 text-sm sm:text-base">
              Sign in and mark your attendance.
            </p>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-zinc-700">
                Email
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
                Password
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

            {/* Rehearsal Name */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-zinc-700">
                Rehearsal Name
              </label>

              <input
                className="bg-white border border-zinc-200 focus:border-orange-400/60 focus:ring-4 focus:ring-orange-400/10 outline-none transition-all duration-300 rounded-2xl px-4 py-3 text-zinc-900 placeholder:text-zinc-400"
                type="text"
                placeholder="Friday Night Practice"
                value={rehearsalName}
                onChange={(e) =>
                  setRehearsalName(e.target.value)
                }
              />
            </div>

            {/* Button */}
            <button
              className="mt-2 rounded-2xl bg-orange-400 text-black font-bold py-3.5 px-4 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_30px_rgba(251,146,60,0.45)] disabled:opacity-50 disabled:hover:scale-100"
              onClick={login}
              disabled={loading} 
            >
              {loading
                ? "Logging In..."
                : "Login & Save Attendance"}
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
                {loading ? "Processing..." : message}
              </div>
            )}

            {/* Footer */}
            <div className="mt-4 text-center">
              <Link
                href="/"
                className="text-sm text-zinc-500 hover:text-orange-500 transition-colors"
              >
                Don't have an account? Register here.
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}