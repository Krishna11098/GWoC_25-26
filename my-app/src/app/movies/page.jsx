"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { userFetch } from "@/lib/userFetch";
import { auth } from "@/lib/firebaseClient";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
      <div className="min-h-screen p-8 pt-32">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl md:text-5xl font-bold py-2 flex items-center gap-3">
              <Film size={40} /> Guess the Movie
            </h1>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-[var(--pink)]/20 border border-[var(--pink)] rounded-lg">
              {error}
            </div>
          )}

          {movies.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl md:text-3xl font-semibold">
                No Movies Available
              </h2>
              <p className="text-base md:text-lg opacity-80">
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
                    className="bg-[var(--bg)] p-6 rounded-lg shadow-sm border-2 border-[var(--green)]"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-sm opacity-80 mb-2">
                          <span>{movie.category || "General"}</span>
                          <span>•</span>
                          <span className="capitalize">
                            {movie.difficulty || "medium"}
                          </span>
                          <span>•</span>
                          <span>Movie #{movie.movieNo || index + 1}</span>
                        </div>
                        <p className="text-lg font-medium mb-2">
                          Clue ({movie.clueType}): {movie.clueData}
                        </p>
                        <p className="text-base">Coins: {movie.coins}</p>
                        {Array.isArray(movie.hints) &&
                          movie.hints.length > 0 && (
                            <div className="mt-3">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-base font-medium">
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
                                  className="px-3 py-1 rounded bg-[var(--orange)] disabled:opacity-50 text-sm"
                                >
                                  {(hintCounts[movie.id] || 0) >=
                                  movie.hints.length
                                    ? "No more hints"
                                    : "Show Hint"}
                                </button>
                              </div>
                              {(hintCounts[movie.id] || 0) > 0 && (
                                <ul className="list-disc ml-5 text-sm opacity-90">
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
                      <label className="block text-sm font-medium mb-2">
                        Your Answer
                      </label>
                      <input
                        type="text"
                        value={answers[movie.id] || ""}
                        onChange={(e) =>
                          handleAnswerChange(movie.id, e.target.value)
                        }
                        className="w-full px-3 py-3 border border-[var(--green)] rounded-lg bg-[var(--bg)] text-base"
                        placeholder="Type the movie name"
                      />
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => handleSubmit(movie.id)}
                          disabled={isSubmitting}
                          className="px-4 py-2 rounded-lg bg-[var(--green)] disabled:opacity-60 text-base"
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
                          className="px-4 py-2 rounded-lg bg-[var(--pink)]"
                          className="px-4 py-2 rounded-lg bg-[var(--pink)] text-base"
                        >
                          Clear
                        </button>
                      </div>
                    </div>

                    {result && (
                      <div
                        className={`mt-4 p-3 rounded-lg border ${
                          result.correct
                            ? "border-[var(--green)]"
                            : "border-[var(--pink)]"
                        }`}
                      >
                        <p className="font-medium">
                          {result.correct ? "Correct!" : "Incorrect."}{" "}
                          {result.message}
                        </p>
                        {result.correct && result.coins > 0 && (
                          <p className="text-base mt-1 flex items-center gap-2">
                            You earned {result.coins} coins <PartyPopper size={18} />
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
