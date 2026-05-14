"use client";

import { useState } from "react";
import { supabase } from "@/supabase";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");

  const [picture, setPicture] = useState<File | null>(null);

  const [message, setMessage] = useState("");

  async function signUp() {
    setMessage("");

    if (!picture) {
      setMessage("Please upload a picture");
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
      setMessage("Signup failed");
      return;
    }

    const user = data.user;

    // CREATE UNIQUE FILE NAME
    const fileExt = picture.name.split(".").pop();
    const fileName = `${user.id}.${fileExt}`;

    // UPLOAD IMAGE
    const { error: uploadError } = await supabase.storage
      .from("profile-pictures")
      .upload(fileName, picture);

    console.log("UPLOAD ERROR:", uploadError);

    if (uploadError) {
      setMessage("Image upload failed");
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
      setMessage("Profile creation failed");
      return;
    }

    setMessage("Successfully registered!");
  }

  return (
    <main className="p-10 flex flex-col gap-3 max-w-sm">
      <h1>Register</h1>

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
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="border p-2"
        type="date"
        value={birthDate}
        onChange={(e) => setBirthDate(e.target.value)}
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            setPicture(e.target.files[0]);
          }
        }}
      />

      <button
        className="border p-2"
        onClick={signUp}
      >
        Register
      </button>

      <p>{message}</p>

      <Link href="/login">
        Already have an account?
      </Link>
    </main>
  );
}