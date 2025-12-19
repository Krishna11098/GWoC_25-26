"use client";

import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebaseClient";
import { useRouter } from "next/navigation";

export default function GoogleLoginButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleGoogleLogin() {
    if (loading) return;

    try {
      setLoading(true);

      // 1️⃣ Firebase Google popup
      const res = await signInWithPopup(auth, googleProvider);

      // 2️⃣ Get Firebase ID token
      const token = await res.user.getIdToken();

      // 3️⃣ Send token to backend (login / auto-signup)
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        throw new Error("Backend auth failed");
      }

      // ✅ Redirect after successful auth
      router.replace("/home");
    } catch (err) {
      console.error("Google login error:", err);
      alert("Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleGoogleLogin}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 rounded-md border border-gray-300 bg-white py-2 text-sm font-medium text-gray-700
                 hover:bg-gray-50 transition disabled:opacity-60"
    >
      {/* Google Icon */}
      <svg
        className="h-5 w-5"
        viewBox="0 0 48 48"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M44.5 20H24v8.5h11.9C34.2 33.9 29.7 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.3 0 6.2 1.2 8.5 3.2l6-6C34.6 4.5 29.6 2.5 24 2.5 11.6 2.5 1.5 12.6 1.5 25S11.6 47.5 24 47.5 46.5 37.4 46.5 25c0-1.7-.2-3.3-.6-5z"
          fill="#FFC107"
        />
        <path
          d="M6.3 14.7l7 5.1C15.3 16.2 19.3 13 24 13c3.3 0 6.2 1.2 8.5 3.2l6-6C34.6 4.5 29.6 2.5 24 2.5 15.4 2.5 8.1 7.3 6.3 14.7z"
          fill="#FF3D00"
        />
        <path
          d="M24 47.5c5.5 0 10.5-1.8 14.3-4.9l-6.6-5.4c-1.9 1.3-4.4 2.1-7.7 2.1-5.7 0-10.5-3.8-12.2-9.1l-7 5.4C8.1 42.7 15.4 47.5 24 47.5z"
          fill="#4CAF50"
        />
        <path
          d="M44.5 20H24v8.5h11.9c-1.1 3.1-3.3 5.6-6.2 7.3l6.6 5.4c3.9-3.6 6.3-8.9 6.3-16.2 0-1.7-.2-3.3-.6-5z"
          fill="#1976D2"
        />
      </svg>

      {loading ? "Signing in..." : "Continue with Google"}
    </button>
  );
}
