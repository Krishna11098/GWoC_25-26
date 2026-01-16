"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { userFetch } from "@/lib/userFetch";
import { auth } from "@/lib/firebaseClient";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Puzzle, Search, Coins, PartyPopper, CircleX } from "lucide-react";

export default function RiddlesPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [riddles, setRiddles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState({});
  const [results, setResults] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        fetchRiddles();
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const fetchRiddles = async () => {
    try {
      setLoading(true);
      const res = await userFetch("/api/user/riddles");
      if (res.ok) {
        const data = await res.json();
        setRiddles(data);
      } else {
        setError("Failed to fetch riddles");
      }
    } catch (err) {
      setError("Error loading riddles");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (riddleId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [riddleId]: value,
    }));
  };

  const handleSubmit = async (riddleId) => {
    const answer = answers[riddleId];
    if (!answer || !answer.trim()) {
      alert("Please enter an answer");
      return;
    }

    setSubmitting((prev) => ({ ...prev, [riddleId]: true }));

    try {
      const res = await userFetch("/api/user/riddles/submit", {
        method: "POST",
        body: JSON.stringify({
          riddleId,
          answer,
        }),
      });

      if (res.ok) {
        const result = await res.json();
        setResults((prev) => ({ ...prev, [riddleId]: result }));

        if (result.correct && !result.alreadySolved) {
          // Show success message
          setTimeout(() => {
            setResults((prev) => ({ ...prev, [riddleId]: null }));
            setAnswers((prev) => ({ ...prev, [riddleId]: "" }));
          }, 3000);
        }
      } else {
        alert("Failed to submit answer");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting answer");
    } finally {
      setSubmitting((prev) => ({ ...prev, [riddleId]: false }));
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "white" }}
      >
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-16 w-16 border-b-4"
            style={{ borderBottomColor: "var(--dark-teal)" }}
          ></div>
          <p className="text-dark-teal text-lg mt-4">Loading riddles...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div
        className="px-5 md:px-12 pt-5 pb-12 mt-32"
        style={{ color: "var(--dark-teal)" }}
      >
        <div className="mx-auto w-full max-w-6xl px-4 md:px-10">
          {/* Header */}
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
                <span className="text-black/80">Riddle</span>{" "}
                <span className="relative inline-block text-dark-teal drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                  Challenge
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
              className="mt-6 text-sm md:text-base text-gray-600"
            >
              Test your wit and earn coins!
            </motion.p>
          </div>

          {error && (
            <div
              className="mb-6 p-4 rounded-lg text-center"
              style={{
                backgroundColor: "var(--light-orange)",
                color: "var(--dark-teal)",
                borderColor: "var(--dark-teal)",
              }}
            >
              {error}
            </div>
          )}

          {riddles.length === 0 ? (
            <div className="text-center py-16">
              <div
                className="flex justify-center mb-4"
                style={{ color: "var(--dark-teal)" }}
              >
                <Search size={64} />
              </div>
              <h2 className="text-2xl font-semibold text-dark-teal mb-2">
                No Riddles Available
              </h2>
              <p className="text-dark-teal">
                Check back later for new riddles!
              </p>
            </div>
          ) : (
            <div className="grid gap-8">
              {riddles.map((riddle, index) => {
                const result = results[riddle.id];
                const isSubmitting = submitting[riddle.id];

                return (
                  <div
                    key={riddle.id}
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
                            Riddle #{riddle.riddleNo || index + 1}
                          </span>
                          <h3 className="text-2xl font-bold text-dark-teal">
                            {riddle.question}
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
                            <Coins size={20} /> {riddle.coins}
                          </div>
                        </div>
                      </div>
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
                              <CircleX
                                size={64}
                                style={{ color: "var(--dark-teal)" }}
                              />
                            )}
                          </div>
                          <p
                            className={`text-2xl font-bold mb-2 ${
                              result.correct
                                ? "text-dark-teal"
                                : "text-dark-teal"
                            }`}
                          >
                            {result.message}
                          </p>
                          {result.correct && !result.alreadySolved && (
                            <p
                              className="text-lg font-semibold flex items-center justify-center gap-2"
                              style={{ color: "var(--dark-teal)" }}
                            >
                              +{result.coins} coins! Total: {result.totalCoins}{" "}
                              <Coins size={20} />
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
                              value={answers[riddle.id] || ""}
                              onChange={(e) =>
                                handleAnswerChange(riddle.id, e.target.value)
                              }
                              onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                  handleSubmit(riddle.id);
                                }
                              }}
                              placeholder="Type your answer here..."
                              className="w-full px-4 py-3 border-2 border-dark-teal rounded-xl focus:ring-2 focus:ring-dark-teal focus:border-dark-teal text-lg"
                              disabled={isSubmitting}
                            />
                          </div>
                          <button
                            onClick={() => handleSubmit(riddle.id)}
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

          {/* Back to Home */}
          <div className="text-center mt-12">
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 rounded-xl transition-colors font-medium"
              style={{
                backgroundColor: "var(--dark-teal)",
                color: "white",
              }}
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
