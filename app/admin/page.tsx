// ADMIN BOARD
//
// Shows everyone who marked attendance today (name, email, rehearsal, time).
// Access is limited to whitelisted emails. The client-side check below is for
// UX only — the real protection is the Supabase RLS policy on "Attendance"
// (see the note at the bottom of the file), which only returns all rows when
// the signed-in user's JWT email matches the admin whitelist.

"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { supabase } from "@/supabase";

const ADMIN_EMAILS = ["victor.ava.ivanov@gmail.com", "info@lisichka-muenchen.de"];

type AttendanceRow = {
  name: string | null;
  email: string | null;
  rehearsal_name: string | null;
  created_at: string;
};

export default function AdminPage() {
  const [checking, setChecking] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(
    null
  );

  // Sign-in form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [signingIn, setSigningIn] = useState(false);

  // Board data
  const [rows, setRows] = useState<AttendanceRow[]>([]);
  const [loadingRows, setLoadingRows] = useState(false);
  const [boardError, setBoardError] = useState("");

  const isAdmin =
    userEmail !== null && ADMIN_EMAILS.includes(userEmail);

  const loadAttendance = useCallback(async () => {
    setLoadingRows(true);
    setBoardError("");

    // Start of today in the admin's local timezone
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from("Attendance")
      .select("name, email, rehearsal_name, created_at")
      .gte("created_at", start.toISOString())
      .order("created_at", { ascending: false });

    if (error) {
      setBoardError(error.message);
      setRows([]);
    } else {
      setRows(data ?? []);
    }

    setLoadingRows(false);
  }, []);

  // Check for an existing session on mount
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null);
      setChecking(false);
    });
  }, []);

  // Load the board once we know the user is an admin
  useEffect(() => {
    if (isAdmin) {
      loadAttendance();
    }
  }, [isAdmin, loadAttendance]);

  async function signIn() {
    setAuthError("");
    setSigningIn(true);

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      setAuthError(error.message);
      setSigningIn(false);
      return;
    }

    setUserEmail(data.user?.email ?? null);
    setSigningIn(false);
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUserEmail(null);
    setEmail("");
    setPassword("");
    setRows([]);
  }

  function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="min-h-screen bg-[#f8f8f6] relative overflow-hidden flex items-start sm:items-center justify-center px-4 py-8">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,146,60,0.18),transparent_40%)]" />
      <div className="absolute -top-24 -left-20 w-72 h-72 bg-red-500/10 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-orange-500/10 blur-3xl rounded-full" />

      <div className="relative z-10 w-full max-w-3xl">
        <div className="backdrop-blur-xl bg-white/80 border border-orange-200 rounded-3xl p-6 sm:p-8 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
                🦊 Admin Board
              </h1>
              {isAdmin && (
                <p className="text-zinc-500 mt-1 text-sm">
                  Attendance for {today}
                </p>
              )}
            </div>
            {userEmail && (
              <button
                onClick={signOut}
                className="text-sm text-zinc-500 hover:text-orange-500 transition-colors whitespace-nowrap"
              >
                Sign out
              </button>
            )}
          </div>

          {/* Loading session */}
          {checking && (
            <p className="text-sm text-zinc-500">Loading…</p>
          )}

          {/* Not signed in → sign-in form */}
          {!checking && !userEmail && (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-zinc-600">
                Sign in with an admin account to view the
                board.
              </p>

              <div className="flex flex-col gap-2">
                <label className="text-sm text-zinc-700">
                  Email
                </label>
                <input
                  className="bg-white border border-zinc-200 focus:border-orange-400/60 focus:ring-4 focus:ring-orange-400/10 outline-none transition-all duration-300 rounded-2xl px-4 py-3 text-zinc-900 placeholder:text-zinc-400"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

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
                  onKeyDown={(e) => {
                    if (e.key === "Enter") signIn();
                  }}
                />
              </div>

              <button
                onClick={signIn}
                disabled={signingIn}
                className="mt-2 rounded-2xl bg-orange-400 text-black font-bold py-3.5 px-4 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_30px_rgba(251,146,60,0.45)] disabled:opacity-50 disabled:hover:scale-100"
              >
                {signingIn ? "Signing in…" : "Sign In"}
              </button>

              {authError && (
                <div className="rounded-2xl border border-red-500/40 bg-red-500/10 text-red-700 px-4 py-3 text-sm">
                  {authError}
                </div>
              )}
            </div>
          )}

          {/* Signed in but not whitelisted */}
          {!checking && userEmail && !isAdmin && (
            <div className="rounded-2xl border border-red-500/40 bg-red-500/10 text-red-700 px-4 py-3 text-sm">
              Access denied. <strong>{userEmail}</strong> is
              not an admin account.
            </div>
          )}

          {/* Admin board */}
          {isAdmin && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-zinc-600">
                  {loadingRows
                    ? "Loading…"
                    : `${rows.length} ${
                        rows.length === 1
                          ? "person"
                          : "people"
                      } present today`}
                </span>
                <button
                  onClick={loadAttendance}
                  disabled={loadingRows}
                  className="text-sm rounded-xl bg-zinc-100 hover:bg-zinc-200 transition-colors px-3 py-1.5 text-zinc-700 disabled:opacity-50"
                >
                  Refresh
                </button>
              </div>

              {boardError && (
                <div className="rounded-2xl border border-red-500/40 bg-red-500/10 text-red-700 px-4 py-3 text-sm">
                  {boardError}
                </div>
              )}

              {!loadingRows &&
                !boardError &&
                rows.length === 0 && (
                  <p className="text-sm text-zinc-500 py-8 text-center">
                    No attendance recorded yet today.
                  </p>
                )}

              {rows.length > 0 && (
                <div className="overflow-x-auto rounded-2xl border border-zinc-200">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-zinc-50 text-zinc-500">
                      <tr>
                        <th className="px-4 py-3 font-medium">
                          Name
                        </th>
                        <th className="px-4 py-3 font-medium">
                          Email
                        </th>
                        <th className="px-4 py-3 font-medium">
                          Rehearsal
                        </th>
                        <th className="px-4 py-3 font-medium whitespace-nowrap">
                          Time
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {rows.map((row, i) => (
                        <tr
                          key={i}
                          className="bg-white hover:bg-orange-400/5 transition-colors"
                        >
                          <td className="px-4 py-3 text-zinc-900 font-medium whitespace-nowrap">
                            {row.name || "—"}
                          </td>
                          <td className="px-4 py-3 text-zinc-600">
                            {row.email || "—"}
                          </td>
                          <td className="px-4 py-3 text-zinc-600 whitespace-nowrap">
                            {row.rehearsal_name || "—"}
                          </td>
                          <td className="px-4 py-3 text-zinc-500 whitespace-nowrap">
                            {formatTime(row.created_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-sm text-zinc-500 hover:text-orange-500 transition-colors"
            >
              ← Back to login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
