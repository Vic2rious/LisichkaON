"use client";

import { useState } from "react";
import { supabase } from "@/supabase";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signUp() {
    await supabase.auth.signUp({
      email,
      password,
    });

    alert("Check email or login");
  }

  async function login() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) alert(error.message);
  }

  async function submitAttendance() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Not logged in");
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    const { error } = await supabase.from("attendance").insert({
      user_id: user.id,
      meeting_date: today,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Attendance submitted");
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <input
        className="border p-2"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border p-2"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="border px-4 py-2" onClick={signUp}>
        Register
      </button>

      <button className="border px-4 py-2" onClick={login}>
        Login
      </button>

      <button className="border px-4 py-2" onClick={submitAttendance}>
        Submit Attendance
      </button>
    </main>
  );
}