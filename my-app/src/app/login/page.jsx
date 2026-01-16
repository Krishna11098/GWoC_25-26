"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebaseClient";
import { signInWithEmailAndPassword } from "firebase/auth";
import GoogleLoginButton from "@/components/loginButton";
import { useRouter } from "next/navigation";

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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div
        className="w-full max-w-lg rounded-xl shadow-lg p-10"
        style={{
          backgroundColor: "white",
          borderColor: "var(--color-font)",
          borderWidth: "2px",
        }}
      >
        <h1
          className="text-3xl font-bold text-center"
          style={{ color: "var(--color-font)" }}
        >
          Welcome back
        </h1>
        <p
          className="text-sm text-center mt-2"
          style={{ color: "var(--color-font)", opacity: "0.7" }}
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
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--color-font)" }}
            >
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-lg px-4 py-2 text-sm border-2"
              placeholder="you@example.com"
              style={{
                borderColor: "var(--color-green)",
                color: "var(--color-font)",
              }}
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--color-font)" }}
            >
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              className="w-full rounded-lg px-4 py-2 text-sm border-2"
              placeholder="••••••••"
              style={{
                borderColor: "var(--color-green)",
                color: "var(--color-font)",
              }}
            />
          </div>

          <div className="text-right">
            <a
              href="/forgot-password"
              className="text-xs font-medium hover:underline"
              style={{ color: "var(--color-orange)" }}
            >
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg py-3 text-sm font-bold transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: "var(--color-pink)",
              color: "var(--color-font)",
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="mt-6">
          <GoogleLoginButton />
        </div>

        <p
          className="text-sm text-center mt-6"
          style={{ color: "var(--color-font)" }}
        >
          Don't have an account?{" "}
          <a
            href="/signup"
            className="font-bold hover:underline"
            style={{ color: "var(--color-orange)" }}
          >
            Sign up
          </a>
        </p>
      </div>

      <button
        onClick={() => (window.location.href = "/")}
        className="mt-6 px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:shadow-lg"
        style={{
          backgroundColor: "var(--color-green)",
          color: "var(--color-font)",
        }}
      >
        ← Back to Home
      </button>
    </div>
  );
}
