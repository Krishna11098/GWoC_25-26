"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { userFetch } from "@/lib/userFetch";
import { auth } from "@/lib/firebaseClient";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SoftWaveBackground from "@/components/SoftWaveBackground";
import { Film, PartyPopper } from "lucide-react";

export default function MoviesPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState({});
  const [results, setResults] = useState({});
  const [hintCounts, setHintCounts] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        fetchMovies();
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const res = await userFetch("/api/user/movies");
      if (res.ok) {
        const data = await res.json();
        setMovies(data);
        // initialize hint counts for each movie
        const initialHints = {};
        data.forEach((m) => (initialHints[m.id] = 0));
        setHintCounts(initialHints);
      } else {
        setError("Failed to fetch movies");
      }
    } catch (err) {
      console.error(err);
      setError("Error loading movies");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (movieId, value) => {
    setAnswers((prev) => ({ ...prev, [movieId]: value }));
  };

  const handleSubmit = async (movieId) => {
    const answer = answers[movieId];
    if (!answer || !answer.trim()) {
      setResults((prev) => ({
        ...prev,
        [movieId]: { correct: false, message: "Please enter an answer" },
      }));
      return;
    }

    setSubmitting((prev) => ({ ...prev, [movieId]: true }));
    try {
      const res = await userFetch("/api/user/movies/submit", {
        method: "POST",
        body: JSON.stringify({ movieId, answer }),
      });
      const result = await res.json();
      setResults((prev) => ({ ...prev, [movieId]: result }));
      if (result.correct) {
        setAnswers((prev) => ({ ...prev, [movieId]: "" }));
      }
    } catch (err) {
      console.error(err);
      setResults((prev) => ({
        ...prev,
        [movieId]: { correct: false, message: "Submission failed" },
      }));
    } finally {
      setSubmitting((prev) => ({ ...prev, [movieId]: false }));
    }
  };

  const revealNextHint = (movieId, totalHints) => {
    setHintCounts((prev) => {
      const current = prev[movieId] || 0;
      const next = Math.min(current + 1, totalHints);
      return { ...prev, [movieId]: next };
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[var(--bg)] p-8 pt-32">
          <div className="max-w-6xl mx-auto">
            <p className="text-gray-600 text-lg">Loading movies...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="px-5 md:px-12 pt-5 pb-12 relative">
        <SoftWaveBackground height="400px" className="pointer-events-none" />
        <div className="mx-auto w-full max-w-6xl px-4 md:px-10 relative z-10 mt-32">
          <div className="mb-10 mt-2 text-center relative">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
                type: "spring",
                stiffness: 100,
                damping: 15,
              }}
              className="inline-flex flex-col items-center gap-2"
            >
              <h1 className="text-5xl md:text-7xl font-winky-rough tracking-tight leading-none">
                <span className="text-black/80">Guess the</span>{" "}
                <span className="relative inline-block text-dark-teal drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                  Movie
                </span>
              </h1>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "60px" }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="h-1.5 bg-dark-teal rounded-full mt-4 shadow-sm"
              />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-6 text-base md:text-lg text-gray-600"
            >
              Test your movie knowledge and solve the mystery scenes!
            </motion.p>
          </div>

          {error && (
            <div
              className="mb-4 p-4 rounded-lg border-2"
              style={{
                backgroundColor: "var(--light-pink)",
                borderColor: "var(--pink)",
                color: "var(--dark-teal)",
              }}
            >
              {error}
            </div>
          )}

          {movies.length === 0 ? (
            <div className="text-center py-12">
              <h2
                className="text-2xl md:text-3xl font-bold"
                style={{ color: "var(--dark-teal)" }}
              >
                No Movies Available
              </h2>
              <p
                className="text-base md:text-lg font-medium mt-2"
                style={{ color: "var(--black)" }}
              >
                Check back later for new challenges!
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {movies.map((movie, index) => {
                const result = results[movie.id];
                const isSubmitting = submitting[movie.id];

                return (
                  <div
                    key={movie.id}
                    className="p-6 rounded-lg shadow-md border-2"
                    style={{
                      backgroundColor: "var(--light-blue)",
                      borderColor: "var(--dark-teal)",
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div
                          className="flex items-center gap-2 text-base mb-2"
                          style={{ color: "var(--dark-teal)" }}
                        >
                          <span>{movie.category || "General"}</span>
                          <span>•</span>
                          <span className="capitalize">
                            {movie.difficulty || "medium"}
                          </span>
                          <span>•</span>
                          <span>Movie #{movie.movieNo || index + 1}</span>
                        </div>
                        <p
                          className="text-xl font-bold mb-2"
                          style={{ color: "var(--dark-teal)" }}
                        >
                          Clue ({movie.clueType}): {movie.clueData}
                        </p>
                        <p
                          className="text-lg font-medium"
                          style={{ color: "var(--black)" }}
                        >
                          Coins: {movie.coins}
                        </p>
                        {Array.isArray(movie.hints) &&
                          movie.hints.length > 0 && (
                            <div className="mt-3">
                              <div className="flex items-center gap-2 mb-2">
                                <span
                                  className="text-lg font-medium"
                                  style={{ color: "var(--dark-teal)" }}
                                >
                                  Hints
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    revealNextHint(movie.id, movie.hints.length)
                                  }
                                  disabled={
                                    (hintCounts[movie.id] || 0) >=
                                    movie.hints.length
                                  }
                                  className="px-3 py-1 rounded disabled:opacity-50 text-base font-bold"
                                  style={{
                                    backgroundColor: "var(--orange)",
                                    color: "var(--dark-teal)",
                                  }}
                                >
                                  {(hintCounts[movie.id] || 0) >=
                                  movie.hints.length
                                    ? "No more hints"
                                    : "Show Hint"}
                                </button>
                              </div>
                              {(hintCounts[movie.id] || 0) > 0 && (
                                <ul
                                  className="list-disc ml-5 text-base"
                                  style={{ color: "var(--black)" }}
                                >
                                  {movie.hints
                                    .slice(0, hintCounts[movie.id])
                                    .map((h, i) => (
                                      <li key={i}>{h}</li>
                                    ))}
                                </ul>
                              )}
                            </div>
                          )}
                      </div>
                    </div>

                    <div className="mt-4">
                      <label
                        className="block text-base font-bold mb-2"
                        style={{ color: "var(--dark-teal)" }}
                      >
                        Your Answer
                      </label>
                      <input
                        type="text"
                        value={answers[movie.id] || ""}
                        onChange={(e) =>
                          handleAnswerChange(movie.id, e.target.value)
                        }
                        className="w-full px-3 py-3 border-2 rounded-lg text-lg font-medium"
                        style={{
                          borderColor: "var(--dark-teal)",
                          backgroundColor: "rgba(255,255,255,0.8)",
                          color: "var(--dark-teal)",
                        }}
                        placeholder="Type the movie name"
                      />
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => handleSubmit(movie.id)}
                          disabled={isSubmitting}
                          className="px-4 py-2 rounded-lg disabled:opacity-60 text-lg font-bold"
                          style={{
                            backgroundColor: "var(--green)",
                            color: "var(--dark-teal)",
                          }}
                        >
                          {isSubmitting ? "Checking..." : "Submit"}
                        </button>
                        <button
                          onClick={() => {
                            setResults((prev) => ({
                              ...prev,
                              [movie.id]: null,
                            }));
                            setAnswers((prev) => ({ ...prev, [movie.id]: "" }));
                          }}
                          className="px-4 py-2 rounded-lg text-lg font-bold"
                          style={{
                            backgroundColor: "var(--pink)",
                            color: "var(--dark-teal)",
                          }}
                        >
                          Clear
                        </button>
                      </div>
                    </div>

                    {result && (
                      <div
                        className="mt-4 p-3 rounded-lg border-2"
                        style={{
                          borderColor: result.correct
                            ? "var(--green)"
                            : "var(--pink)",
                          backgroundColor: result.correct
                            ? "rgba(203, 216, 172, 0.2)"
                            : "rgba(243, 204, 231, 0.2)",
                        }}
                      >
                        <p
                          className="font-bold"
                          style={{
                            color: result.correct
                              ? "var(--green)"
                              : "var(--pink)",
                          }}
                        >
                          {result.correct ? "✓ Correct!" : "✗ Incorrect."}{" "}
                          {result.message}
                        </p>
                        {result.correct && result.coins > 0 && (
                          <p
                            className="text-lg mt-1 flex items-center gap-2"
                            style={{ color: "var(--dark-teal)" }}
                          >
                            You earned {result.coins} coins{" "}
                            <PartyPopper size={18} />
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
