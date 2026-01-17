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
        <div
          className="mx-auto w-full max-w-6xl px-4 md:px-10 relative z-10 mt-32
        "
        >
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
            <div className="grid gap-8">
              {movies.map((movie, index) => {
                const result = results[movie.id];
                const isSubmitting = submitting[movie.id];

                return (
                  <div
                    key={movie.id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-dark-teal hover:border-dark-teal transition-all duration-300"
                  >
                    <div
                      className="p-6"
                      style={{ background: "var(--light-blue)" }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span
                            className="inline-block px-3 py-1 rounded-full text-sm font-semibold mb-3"
                            style={{
                              background: "rgba(0,0,0,0.1)",
                              color: "var(--dark-teal)",
                            }}
                          >
                            Movie #{movie.movieNo || index + 1} •{" "}
                            {movie.category || "General"} •{" "}
                            {movie.difficulty || "medium"}
                          </span>
                          <h3 className="text-2xl font-bold text-dark-teal">
                            Clue ({movie.clueType}): {movie.clueData}
                          </h3>
                        </div>
                        <div className="text-right">
                          <div
                            className="px-4 py-2 rounded-full font-bold text-lg w-25 text-center flex items-center justify-center gap-2"
                            style={{
                              backgroundColor: "var(--light-orange)",
                              color: "var(--dark-teal)",
                            }}
                          >
                            <Film size={20} /> {movie.coins}
                          </div>
                        </div>
                      </div>
                      {Array.isArray(movie.hints) && movie.hints.length > 0 && (
                        <div className="mt-3">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg font-medium text-dark-teal">
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
                              {(hintCounts[movie.id] || 0) >= movie.hints.length
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

                    <div className="p-6">
                      {result ? (
                        <div
                          className={`text-center py-8 rounded-xl ${
                            result.correct
                              ? "bg-light-pink border-2 border-light-pink"
                              : "bg-light-orange border-2 border-light-orange"
                          }`}
                        >
                          <div className="flex justify-center mb-4">
                            {result.correct ? (
                              <PartyPopper
                                size={64}
                                style={{ color: "var(--dark-teal)" }}
                              />
                            ) : (
                              <Film
                                size={64}
                                style={{ color: "var(--dark-teal)" }}
                              />
                            )}
                          </div>
                          <p className="text-2xl font-bold mb-2 text-dark-teal">
                            {result.message}
                          </p>
                          {result.correct && result.coins > 0 && (
                            <p
                              className="text-lg font-semibold flex items-center justify-center gap-2"
                              style={{ color: "var(--dark-teal)" }}
                            >
                              +{result.coins} coins! <PartyPopper size={20} />
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-dark-teal mb-2">
                              Your Answer:
                            </label>
                            <input
                              type="text"
                              value={answers[movie.id] || ""}
                              onChange={(e) =>
                                handleAnswerChange(movie.id, e.target.value)
                              }
                              onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                  handleSubmit(movie.id);
                                }
                              }}
                              placeholder="Type the movie name..."
                              className="w-full px-4 py-3 border-2 border-dark-teal rounded-xl focus:ring-2 focus:ring-dark-teal focus:border-dark-teal text-lg"
                              disabled={isSubmitting}
                            />
                          </div>
                          <button
                            onClick={() => handleSubmit(movie.id)}
                            disabled={isSubmitting}
                            className="w-full py-3 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            style={{
                              backgroundColor: isSubmitting
                                ? "#ccc"
                                : "var(--light-pink)",
                              color: "var(--dark-teal)",
                              cursor: isSubmitting ? "not-allowed" : "pointer",
                            }}
                          >
                            {isSubmitting ? (
                              <span className="flex items-center justify-center">
                                <svg
                                  className="animate-spin h-5 w-5 mr-3"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                  />
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  />
                                </svg>
                                Checking...
                              </span>
                            ) : (
                              "Submit Answer"
                            )}
                          </button>
                        </div>
                      )}
                    </div>
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
