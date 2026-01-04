"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { userFetch } from "@/lib/userFetch";
import { auth } from "@/lib/firebaseClient";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading riddles...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-12 px-4 mt-24">
        <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🧩 Riddle Challenge
          </h1>
          <p className="text-xl text-gray-600">
            Test your wit and earn coins!
          </p>
          {user && (
            <p className="text-sm text-gray-500 mt-2">
              Logged in as: {user.email}
            </p>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-center">
            {error}
          </div>
        )}

        {riddles.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🤔</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              No Riddles Available
            </h2>
            <p className="text-gray-600">
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
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-purple-100 hover:border-purple-300 transition-all duration-300"
                >
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-white text-sm font-semibold mb-3">
                          Riddle #{riddle.riddleNo || index + 1}
                        </span>
                        <h3 className="text-2xl font-bold text-white">
                          {riddle.question}
                        </h3>
                      </div>
                      <div className="text-right">
                        <div className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-bold text-lg">
                          🪙 {riddle.coins}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    {result ? (
                      <div
                        className={`text-center py-8 rounded-xl ${
                          result.correct
                            ? "bg-green-50 border-2 border-green-300"
                            : "bg-red-50 border-2 border-red-300"
                        }`}
                      >
                        <div className="text-6xl mb-4">
                          {result.correct ? "🎉" : "❌"}
                        </div>
                        <p
                          className={`text-2xl font-bold mb-2 ${
                            result.correct ? "text-green-700" : "text-red-700"
                          }`}
                        >
                          {result.message}
                        </p>
                        {result.correct && !result.alreadySolved && (
                          <p className="text-lg text-green-600 font-semibold">
                            +{result.coins} coins! Total: {result.totalCoins} 🪙
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
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
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg"
                            disabled={isSubmitting}
                          />
                        </div>
                        <button
                          onClick={() => handleSubmit(riddle.id)}
                          disabled={isSubmitting}
                          className={`w-full py-3 rounded-xl font-bold text-lg transition-all duration-300 ${
                            isSubmitting
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                          }`}
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
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium"
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
