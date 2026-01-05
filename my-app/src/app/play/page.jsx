"use client";

import { useState } from "react";
import SudokuBoard from "@/components/SudokuBoard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Sample Sudoku puzzles
const puzzles = [
  {
    id: 1,
    levelNo: 1,
    difficulty: "easy",
    puzzle: [
      5, 3, 0, 0, 7, 0, 0, 0, 0, 6, 0, 0, 1, 9, 5, 0, 0, 0, 0, 9, 8, 0, 0, 0, 0,
      6, 0, 8, 0, 0, 0, 6, 0, 0, 0, 3, 4, 0, 0, 8, 0, 3, 0, 0, 1, 7, 0, 0, 0, 2,
      0, 0, 0, 6, 0, 6, 0, 0, 0, 0, 2, 8, 0, 0, 0, 0, 4, 1, 9, 0, 0, 5, 0, 0, 0,
      0, 8, 0, 0, 7, 9,
    ],
    solution: [
      5, 3, 4, 6, 7, 8, 9, 1, 2, 6, 7, 2, 1, 9, 5, 3, 4, 8, 1, 9, 8, 3, 4, 2, 5,
      6, 7, 8, 5, 9, 7, 6, 1, 4, 2, 3, 4, 2, 6, 8, 5, 3, 7, 9, 1, 7, 1, 3, 9, 2,
      4, 8, 5, 6, 9, 6, 1, 5, 3, 7, 2, 8, 4, 2, 8, 7, 4, 1, 9, 6, 3, 5, 3, 4, 5,
      2, 8, 6, 1, 7, 9,
    ],
  },
  {
    id: 2,
    levelNo: 2,
    difficulty: "medium",
    puzzle: [
      0, 2, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0,
    ],
    solution: [
      1, 2, 3, 6, 4, 5, 7, 8, 9, 4, 5, 6, 7, 8, 9, 2, 1, 3, 7, 8, 9, 1, 2, 3, 5,
      6, 4, 2, 3, 4, 5, 6, 1, 8, 9, 7, 5, 6, 1, 2, 3, 4, 7, 5, 2, 6, 7, 8, 9, 5,
      2, 3, 9, 1, 3, 1, 2, 8, 7, 6, 4, 5, 6, 8, 9, 7, 4, 1, 5, 6, 2, 3, 9, 4, 5,
      3, 6, 7, 1, 3, 8,
    ],
  },
  {
    id: 3,
    levelNo: 3,
    difficulty: "hard",
    puzzle: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0,
    ],
    solution: [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 4, 5, 6, 7, 8, 9, 1, 2, 3, 7, 8, 9, 1, 2, 3, 4,
      5, 6, 2, 3, 4, 5, 6, 7, 8, 9, 1, 5, 6, 7, 8, 9, 1, 2, 3, 4, 8, 9, 1, 2, 3,
      4, 5, 6, 7, 3, 4, 5, 6, 7, 8, 9, 1, 2, 6, 7, 8, 9, 1, 2, 3, 4, 5, 9, 1, 2,
      3, 4, 5, 6, 7, 8,
    ],
  },
];

export default function SudokuPage() {
  const [selectedPuzzle, setSelectedPuzzle] = useState(null);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-40 pb-12 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          {!selectedPuzzle ? (
            <div>
              {/* Header */}
              <div className="text-center mb-12">
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
                  Sudoku Challenge
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Test your logic and problem-solving skills. Choose a
                  difficulty level and start playing!
                </p>
              </div>

              {/* Difficulty Selection */}
              <div className="grid md:grid-cols-3 gap-6">
                {puzzles.map((puzzle) => (
                  <div
                    key={puzzle.id}
                    onClick={() => setSelectedPuzzle(puzzle)}
                    className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105"
                  >
                    {/* Background gradient based on difficulty */}
                    <div
                      className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                        puzzle.difficulty === "easy"
                          ? "bg-gradient-to-br from-green-400 to-emerald-600"
                          : puzzle.difficulty === "medium"
                          ? "bg-gradient-to-br from-yellow-400 to-orange-600"
                          : "bg-gradient-to-br from-red-400 to-rose-600"
                      }`}
                    />

                    {/* Content */}
                    <div className="relative z-10 p-8 h-full flex flex-col justify-between group-hover:text-white transition-colors duration-300">
                      <div>
                        <h2 className="text-3xl font-bold mb-2 capitalize">
                          {puzzle.difficulty}
                        </h2>
                        <p className="text-gray-600 group-hover:text-white/90 transition-colors">
                          Level {puzzle.levelNo}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <span>Play Now</span>
                        <span className="group-hover:translate-x-2 transition-transform">
                          →
                        </span>
                      </div>
                    </div>

                    {/* Border animation */}
                    <div
                      className={`absolute inset-0 rounded-2xl border-2 group-hover:border-white/50 transition-all duration-300 ${
                        puzzle.difficulty === "easy"
                          ? "border-green-200 group-hover:border-white/50"
                          : puzzle.difficulty === "medium"
                          ? "border-yellow-200 group-hover:border-white/50"
                          : "border-red-200 group-hover:border-white/50"
                      }`}
                    />
                  </div>
                ))}
              </div>

              {/* Features Section */}
              <div className="mt-16 grid md:grid-cols-3 gap-8">
                <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                  <div className="text-4xl mb-3">⌨️</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Keyboard Navigation
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Use arrow keys to navigate the grid for a smooth playing
                    experience.
                  </p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                  <div className="text-4xl mb-3">💡</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Smart Hints
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Get stuck? Use hints to reveal one cell at a time when you
                    need help.
                  </p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                  <div className="text-4xl mb-3">✅</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Instant Feedback
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Check your progress anytime and get immediate feedback on
                    your entries.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {/* Back Button */}
              <button
                onClick={() => setSelectedPuzzle(null)}
                className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-gray-900 font-semibold shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95"
              >
                ← Back to Puzzles
              </button>

              {/* Game Board */}
              <div className="flex justify-center">
                <SudokuBoard
                  puzzle={selectedPuzzle.puzzle}
                  solution={selectedPuzzle.solution}
                  levelNo={selectedPuzzle.levelNo}
                  difficulty={selectedPuzzle.difficulty}
                />
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
