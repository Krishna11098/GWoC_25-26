"use client";

import { auth } from "@/lib/firebaseClient";
import { signInWithEmailAndPassword } from "firebase/auth";
import GoogleLoginButton from "@/components/loginButton";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  async function handleLogin(e) {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

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
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div
        className="w-full max-w-md rounded-xl shadow-lg p-8"
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

          <button
            type="submit"
            className="w-full rounded-lg py-3 text-sm font-bold transition-all duration-300 hover:shadow-lg"
            style={{
              backgroundColor: "var(--color-pink)",
              color: "var(--color-font)",
            }}
          >
            Login
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
    </div>
  );
}
