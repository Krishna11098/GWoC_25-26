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
        setLevels(data.filter((l) => l.difficulty === difficulty));
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
      <main
        className="min-h-screen py-12 px-4 md:px-6 mt-32"
        style={{ backgroundColor: "var(--color-background)" }}
      >
        <div className="max-w-7xl mx-auto">
          {authLoading ? (
            <div className="text-center">
              <p className="text-lg">Loading authentication...</p>
            </div>
          ) : !user ? (
            <div className="text-center">
              <h1
                className="text-5xl md:text-6xl font-bold mb-4"
                style={{
                  color: "#F5F3F8",
                  textShadow: "0 4px 20px rgba(0,0,0,0.25)",
                }}
              >
                Sudoku Challenge
              </h1>
              <p
                className="text-lg mb-6"
                style={{ color: "var(--color-font-2)", opacity: 0.9 }}
              >
                Please log in to play Sudoku and track your progress!
              </p>
              <Link
                href="/login"
                className="inline-block px-6 py-3 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
                style={{
                  backgroundColor: "var(--color-foreground)",
                  color: "var(--color-font-2)",
                }}
              >
                Go to Login
              </Link>
            </div>
          ) : (
            <div>
              {/* Header */}
              <div className="text-center mb-12">
                <h1
                  className="text-5xl md:text-6xl font-bold mb-4"
                  style={{
                    color: "#F5F3F8",
                    textShadow: "0 4px 20px rgba(0,0,0,0.25)",
                  }}
                >
                  Sudoku Challenge
                </h1>
                <p
                  className="text-lg max-w-2xl mx-auto"
                  style={{ color: "var(--color-font-2)", opacity: 0.9 }}
                >
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
                        ? "shadow-lg transform scale-105"
                        : "shadow-md hover:shadow-lg hover:scale-105"
                    }`}
                    style={
                      difficulty === lvl
                        ? {
                            backgroundColor: "var(--color-foreground)",
                            color: "var(--color-font)",
                          }
                        : {
                            backgroundColor: "transparent",
                            color: "var(--color-font-2)",
                          }
                    }
                  >
                    {lvl}
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="text-center">
                  <p className="text-lg">Loading levels...</p>
                </div>
              ) : (
                <>
                  {/* Level Selection */}
                  <div className="grid md:grid-cols-3 gap-6">
                    {levels.map((level) => (
                      <Link
                        key={level.levelId}
                        href={`/sudoku/start/${level.levelId}`}
                        className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-105"
                        style={{
                          backgroundColor: "var(--color-background-2)",
                          color: "var(--color-font-2)",
                          borderColor: "var(--color-foreground)",
                        }}
                      >
                        {/* Hover overlay uses accent foreground */}
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{ backgroundColor: "var(--color-foreground)",
                            color: "var(--color-font)",
                           }}
                        />

                        {/* Content */}
                        <div className="relative z-10 p-8 h-full flex flex-col justify-between transition-colors duration-300">
                          <div>
                            <h2
                              className="text-3xl font-bold mb-2 capitalize"
                            >
                              {level.difficulty}
                            </h2>
                            <p
                              className="transition-colors"
                              style={{
                                color: "var(--color-foreground)",
                                opacity: 0.9,
                              }}
                            >
                              Level {level.levelNo || level.levelId}
                            </p>
                            <p
                              className="text-lg font-semibold mt-2"
                              style={{
                                color: "var(--color-foreground)",
                                opacity: 0.9,
                              }}
                            >
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
                        <div className="absolute inset-0 rounded-2xl border-2 transition-all duration-300" />
                      </Link>
                    ))}
                  </div>

                  {/* Features Section */}
                  <div className="mt-16 grid md:grid-cols-3 gap-8">
                    <div className="rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow feature-card">
                      <img
                        src="/icons/keyboard.svg"
                        alt="keyboard"
                        className="h-8 w-8 mb-3 inline-block icon-current-color"
                        style={{ color: "var(--color-foreground-2)" }}
                      />
                      <h3
                        className="text-lg font-bold mb-2"
                        style={{ color: "var(--color-font-2)" }}
                      >
                        Keyboard Navigation
                      </h3>
                      <p
                        className="text-sm"
                        style={{
                          color: "var(--color-font)",
                          opacity: 0.9,
                        }}
                      >
                        Use arrow keys to navigate the grid for a smooth playing
                        experience.
                      </p>
                    </div>
                    <div className="rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow feature-card">
                      <img
                        src="/icons/bulb.svg"
                        alt="tip"
                        className="h-8 w-8 mb-3 inline-block icon-current-color"
                        style={{ color: "var(--color-foreground-2)" }}
                      />
                      <h3
                        className="text-lg font-bold mb-2"
                        style={{ color: "var(--color-font)" }}
                      >
                        Earn Coins
                      </h3>
                      <p
                        className="text-sm"
                        style={{
                          color: "var(--color-font-2)",
                          opacity: 0.9,
                        }}
                      >
                        Complete puzzles to earn coins and unlock more
                        challenging levels.
                      </p>
                    </div>
                    <div className="rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow feature-card">
                      <img
                        src="/icons/check.svg"
                        alt="track"
                        className="h-8 w-8 mb-3 inline-block icon-current-color"
                        style={{ color: "var(--color-foreground-2)" }}
                      />
                      <h3
                        className="text-lg font-bold mb-2"
                        style={{ color: "var(--color-font)" }}
                      >
                        Track Progress
                      </h3>
                      <p
                        className="text-sm"
                        style={{
                          color: "var(--color-font-2)",
                          opacity: 0.9,
                        }}
                      >
                        Check your progress anytime and get immediate feedback
                        on your entries.
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
