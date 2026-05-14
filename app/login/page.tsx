"use client";

import { useState } from "react";
import { supabase } from "@/supabase";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rehearsalName, setRehearsalName] = useState("");

  const [message, setMessage] = useState("");

  async function login() {
    setMessage("");

    // LOGIN
    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    console.log("LOGIN DATA:", data);
    console.log("LOGIN ERROR:", error);

    if (error) {
      setMessage(error.message);
      return;
    }

    if (!data.user) {
      setMessage("Login failed");
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
      setMessage("Could not load member profile");
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
      setMessage("Could not save attendance");
      return;
    }

    setMessage("Successfully logged in and attendance saved!");

    console.log("Attendance entry created");
  }

  return (
    <main className="p-10 flex flex-col gap-3 max-w-sm">
      <h1>Login</h1>

      <input
        className="border p-2"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border p-2"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        className="border p-2"
        type="text"
        placeholder="Rehearsal Name"
        value={rehearsalName}
        onChange={(e) => setRehearsalName(e.target.value)}
      />

      <button
        className="border p-2"
        onClick={login}
      >
        Login
      </button>

      <p>{message}</p>

      <Link href="/">
        Back to register
      </Link>
    </main>
  );
}