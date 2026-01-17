"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { auth } from "@/lib/firebaseClient";
import { signInWithEmailAndPassword } from "firebase/auth";
import GoogleLoginButton from "@/components/loginButton";
import { useRouter } from "next/navigation";
import SoftWaveBackground from "@/components/SoftWaveBackground";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Suppress Firebase console errors
  useEffect(() => {
    const originalError = console.error;
    console.error = (...args) => {
      // Suppress Firebase auth errors from console
      if (
        args[0]?.includes?.("Firebase:") ||
        args[0]?.message?.includes?.("Firebase:")
      ) {
        return;
      }
      originalError(...args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const email = e.target.email.value;
      const password = e.target.password.value;

      if (!email || !password) {
        setError("Please enter both email and password");
        setLoading(false);
        return;
      }

      try {
        const res = await signInWithEmailAndPassword(auth, email, password);
        const token = await res.user.getIdToken();

        await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        alert("Login successful");
        router.push("/home");
      } catch (authError) {
        // Catch Firebase auth errors specifically
        let errorMessage = "Login failed. Please try again.";

        if (authError.code === "auth/invalid-credential") {
          errorMessage =
            "Invalid email or password. Please check and try again.";
        } else if (authError.code === "auth/user-not-found") {
          errorMessage = "Email not registered. Please sign up first.";
        } else if (authError.code === "auth/wrong-password") {
          errorMessage = "Incorrect password. Please try again.";
        } else if (authError.code === "auth/invalid-email") {
          errorMessage = "Invalid email address.";
        } else if (authError.code === "auth/user-disabled") {
          errorMessage = "This account has been disabled.";
        } else if (authError.message) {
          errorMessage = authError.message;
        }

        setError(errorMessage);
        setLoading(false);
      }
    } catch (err) {
      console.error("Unexpected login error:", err);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <motion.div
        className="pointer-events-none absolute inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <SoftWaveBackground height="60vh" className="pointer-events-none" />
      </motion.div>
      <motion.div
        className="w-full max-w-lg rounded-xl p-6 sm:p-8 md:p-10"
        style={{
          backgroundColor: "white",
          borderColor: "var(--dark-teal)",
          borderWidth: "2px",
        }}
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center"
          style={{ color: "var(--dark-teal)" }}
        >
          Welcome back
        </h1>
        <p
          className="text-xs sm:text-sm md:text-base text-center mt-2"
          style={{ color: "var(--dark-teal)", opacity: "0.7" }}
        >
          Login to your account
        </p>

        {error && (
          <div
            className="mt-4 p-3 rounded-lg text-sm"
            style={{
              backgroundColor: "#fee2e2",
              color: "#991b1b",
              borderColor: "#fecaca",
              borderWidth: "1px",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <div>
            <label
              className="block text-xs sm:text-sm font-medium mb-2"
              style={{ color: "var(--dark-teal)" }}
            >
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-lg px-4 py-2 text-sm md:text-base border-2"
              placeholder="you@example.com"
              style={{
                borderColor: "var(--dark-teal)",
                color: "var(--dark-teal)",
              }}
            />
          </div>

          <div>
            <label
              className="block text-xs sm:text-sm font-medium mb-2"
              style={{ color: "var(--dark-teal)" }}
            >
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              className="w-full rounded-lg px-4 py-2 text-sm md:text-base border-2"
              placeholder="••••••••"
              style={{
                borderColor: "var(--dark-teal)",
                color: "var(--dark-teal)",
              }}
            />
          </div>

          <div className="text-right">
            <a
              href="/forgot-password"
              className="text-[11px] sm:text-xs font-medium hover:underline"
              style={{ color: "var(--light-orange)" }}
            >
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg py-3 text-sm md:text-base font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: "var(--dark-teal)",
              color: "white",
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="mt-6">
          <GoogleLoginButton />
        </div>

        <p
          className="text-xs sm:text-sm text-center mt-6"
          style={{ color: "var(--dark-teal)" }}
        >
          Don't have an account?{" "}
          <a
            href="/signup"
            className="font-bold hover:underline"
            style={{ color: "var(--light-orange)" }}
          >
            Sign up
          </a>
        </p>
      </motion.div>

      <motion.button
        onClick={() => (window.location.href = "/")}
        className="mt-6 px-6 py-2 rounded-lg font-medium text-sm md:text-base transition-all duration-300"
        style={{
          backgroundColor: "var(--green)",
          color: "var(--dark-teal)",
        }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.15 }}
      >
        ← Back to Home
      </motion.button>
    </div>
  );
}
