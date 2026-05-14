"use client";

import { useEffect } from "react";
import { supabase } from "@/supabase";

export default function Home() {
  useEffect(() => {
    async function testConnection() {
      const { data, error } = await supabase
        .from("profiles")
        .select("*");

      console.log("DATA:", data);
      console.log("ERROR:", error);
    }

    testConnection();
  }, []);

  return (
    <main className="p-10">
      <h1>Supabase Test</h1>
    </main>
  );
}