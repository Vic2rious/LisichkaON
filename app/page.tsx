// REGISTER PAGE

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { supabase } from "@/supabase";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");

  const [picture, setPicture] = useState<File | null>(null);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<
    "success" | "error" | ""
  >("");

  const [loading, setLoading] = useState(false);

  async function signUp() {
    setMessage("");
    setMessageType("");
    setLoading(true);

    if (!picture) {
      setMessageType("error");
      setMessage("Please upload a picture");
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
      setMessage(error?.message || "Signup failed");
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
      });

    console.log("INSERT ERROR:", insertError);

    if (insertError) {
      setMessageType("error");
      setMessage(insertError.message);
      setLoading(false);
      return;
    }

    setMessageType("success");

    setMessage(
      "Successfully registered! Redirecting to login..."
    );

    setLoading(false);

    setTimeout(() => {
      router.push("/login");
    }, 2000);
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
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-400/10 border border-orange-400/20 mb-4 shadow-[0_0_25px_rgba(251,146,60,0.25)]">
              <span className="text-3xl">🦊</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 tracking-tight">
              Create Account
            </h1>

            <p className="text-zinc-500 mt-2 text-sm sm:text-base">
              Join the Lisichka side.
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

            {/* Name */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-zinc-700">
                Name
              </label>

              <input
                className="bg-white border border-zinc-200 focus:border-orange-400/60 focus:ring-4 focus:ring-orange-400/10 outline-none transition-all duration-300 rounded-2xl px-4 py-3 text-zinc-900 placeholder:text-zinc-400"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
              />
            </div>

            {/* Birth Date */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-zinc-700">
                Birth Date
              </label>

              <input
                className="bg-white border border-zinc-200 focus:border-orange-400/60 focus:ring-4 focus:ring-orange-400/10 outline-none transition-all duration-300 rounded-2xl px-4 py-3 text-zinc-900"
                type="date"
                value={birthDate}
                onChange={(e) =>
                  setBirthDate(e.target.value)
                }
              />
            </div>

            {/* Upload */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-zinc-700">
                Profile Picture
              </label>

              <label className="cursor-pointer rounded-2xl border border-dashed border-orange-400/30 bg-orange-400/5 hover:bg-orange-400/10 transition-all duration-300 px-4 py-5 text-center">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-2xl">📸</span>

                  <span className="text-sm text-zinc-700">
                    {picture
                      ? picture.name
                      : "Tap to upload image (max 5MB)"}
                  </span>

                  <span className="text-xs text-zinc-500">
                    PNG, JPG, WEBP
                  </span>
                </div>

                <input
                  className="hidden"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (
                      e.target.files &&
                      e.target.files[0]
                    ) {
                      setPicture(e.target.files[0]);
                    }
                  }}
                />
              </label>
            </div>

            {/* Button */}
            <button
              className="mt-2 rounded-2xl bg-orange-400 text-black font-bold py-3.5 px-4 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_30px_rgba(251,146,60,0.45)] disabled:opacity-50 disabled:hover:scale-100"
              onClick={signUp}
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Register"}
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
                href="/login"
                className="text-sm text-zinc-500 hover:text-orange-500 transition-colors"
              >
                Already have an account?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}