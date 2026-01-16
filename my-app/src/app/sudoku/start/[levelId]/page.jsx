"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { userFetch } from "@/lib/userFetch";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function StartSudoku() {
  const router = useRouter();
  const params = useParams();
  const levelId = params?.levelId;

  useEffect(() => {
    async function start() {
      // Wait for params to resolve before firing the request
      if (!levelId) return;

      const res = await userFetch("/api/user/sudoku/start", {
        method: "POST",
        body: JSON.stringify({ levelId }),
      });

      if (!res.ok) {
        const errorPayload = await res.json().catch(() => ({}));
        console.error("Failed to start sudoku", errorPayload);
        router.replace("/sudoku");
        return;
      }

      const data = await res.json();
      router.replace(`/sudoku/play/${data.gameId}`);
    }

    start();
  }, [levelId, router]);

  return (
    <>
      <Navbar />
      <div
        className="min-h-screen flex items-center justify-center mt-32"
        style={{ backgroundColor: "var(--color-bg)" }}
      >
        <div className="text-center">
          <div
            className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 mb-4"
            style={{ borderBottomColor: "var(--dark-teal)" }}
          ></div>
          <p className="text-lg font-semibold text-dark-teal">Starting game…</p>
        </div>
      </div>
      <Footer />
    </>
  );
}
