"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { userFetch } from "@/lib/userFetch";
import SudokuGrid from "@/components/SudokuGrid";
import SudokuActions from "@/components/SudokuActions";
import SudokuResultModal from "@/components/SudokuResultModal";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PlaySudoku() {
  const router = useRouter();
  const params = useParams();

  const [grid, setGrid] = useState(null);
  const [initial, setInitial] = useState(null);
  const [completed, setCompleted] = useState(false);

  const gameId = params?.gameId;

  useEffect(() => {
    async function load() {
      // Wait for params to resolve before firing the request
      if (!gameId) return;

      const res = await userFetch(`/api/user/sudoku/history`);
      if (!res.ok) {
        router.replace("/sudoku");
        return;
      }

      const history = await res.json();
      const game = history.find(g => g.gameId === gameId);

      if (!game || !game.initialGrid) {
        router.replace("/sudoku");
        return;
      }

      setGrid(game.initialGrid);
      setInitial(game.initialGrid);
    }

    load();
  }, [gameId, router]);

  async function submit() {
    const res = await userFetch(
      "/api/user/sudoku/submit",
      {
        method: "POST",
        body: JSON.stringify({
          gameId,
          userGrid: grid,
        }),
      }
    );

    if (res.ok) setCompleted(true);
    else alert("Wrong solution");
  }

  if (!grid) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
          <p className="text-lg text-gray-600">Loading…</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => router.push("/sudoku")}
            className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-gray-900 font-semibold shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            ← Back to Levels
          </button>

          {/* Game Board Container */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
            <SudokuGrid
              grid={grid}
              initial={initial}
              setGrid={setGrid}
            />

            <SudokuActions
              onSubmit={submit}
              gameId={params?.gameId}
            />
          </div>
        </div>
      </main>
      <Footer />

      {completed && (
        <SudokuResultModal />
      )}
    </>
  );
}
