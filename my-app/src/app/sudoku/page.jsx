"use client";

import { useEffect, useState } from "react";
import { userFetch } from "@/lib/userFetch";
import { auth } from "@/lib/firebaseClient";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SudokuPage() {
  const [difficulty, setDifficulty] = useState("easy");
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Wait for auth to initialize
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function load() {
      if (authLoading || !user) return;
      
      setLoading(true);
      try {
        const res = await userFetch("/api/user/sudoku/levels");
        const data = await res.json();
        setLevels(
          data.filter(l => l.difficulty === difficulty)
        );
      } catch (error) {
        console.error("Error loading levels:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [difficulty, user, authLoading]);

  const difficulties = ["easy", "medium", "hard"];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          {authLoading ? (
            <div className="text-center">
              <p className="text-lg text-gray-600">Loading authentication...</p>
            </div>
          ) : !user ? (
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
                Sudoku Challenge
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Please log in to play Sudoku and track your progress!
              </p>
              <Link 
                href="/login" 
                className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                Go to Login
              </Link>
            </div>
          ) : (
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

              {/* Difficulty Tabs */}
              <div className="flex justify-center gap-4 mb-8">
                {difficulties.map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setDifficulty(lvl)}
                    className={`px-6 py-3 rounded-lg capitalize font-semibold transition-all duration-300 ${
                      difficulty === lvl
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105"
                        : "bg-white text-gray-900 shadow-md hover:shadow-lg hover:scale-105"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="text-center">
                  <p className="text-lg text-gray-600">Loading levels...</p>
                </div>
              ) : (
                <>
                  {/* Level Selection */}
                  <div className="grid md:grid-cols-3 gap-6">
                    {levels.map((level) => (
                      <Link
                        key={level.levelId}
                        href={`/sudoku/start/${level.levelId}`}
                        className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105"
                      >
                        {/* Background gradient based on difficulty */}
                        <div
                          className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                            level.difficulty === "easy"
                              ? "bg-gradient-to-br from-green-400 to-emerald-600"
                              : level.difficulty === "medium"
                              ? "bg-gradient-to-br from-yellow-400 to-orange-600"
                              : "bg-gradient-to-br from-red-400 to-rose-600"
                          }`}
                        />

                        {/* Content */}
                        <div className="relative z-10 p-8 h-full flex flex-col justify-between group-hover:text-white transition-colors duration-300">
                          <div>
                            <h2 className="text-3xl font-bold mb-2 capitalize">
                              {level.difficulty}
                            </h2>
                            <p className="text-gray-600 group-hover:text-white/90 transition-colors">
                              Level {level.levelNo || level.levelId}
                            </p>
                            <p className="text-lg font-semibold mt-2 text-gray-800 group-hover:text-white/90">
                              {level.coins} coins
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
                            level.difficulty === "easy"
                              ? "border-green-200 group-hover:border-white/50"
                              : level.difficulty === "medium"
                              ? "border-yellow-200 group-hover:border-white/50"
                              : "border-red-200 group-hover:border-white/50"
                          }`}
                        />
                      </Link>
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
                        Earn Coins
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Complete puzzles to earn coins and unlock more challenging
                        levels.
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                      <div className="text-4xl mb-3">✅</div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        Track Progress
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Check your progress anytime and get immediate feedback on
                        your entries.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
