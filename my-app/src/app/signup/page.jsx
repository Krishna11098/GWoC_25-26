"use client";

import { auth } from "@/lib/firebaseClient";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import GoogleLoginButton from "@/components/loginButton";

export default function SignupPage() {
  const router = useRouter();

  async function handleSignup(e) {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    // 1️⃣ Firebase Auth
    const res = await createUserWithEmailAndPassword(auth, email, password);

    // 2️⃣ Save user in backend
    await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uid: res.user.uid,
        email,
      }),
    });

    alert("Signup successful");

    // ✅ Client-side redirect
    router.push("/home");
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
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
          Create an account
        </h1>
        <p
          className="text-sm text-center mt-2"
          style={{ color: "var(--color-font)", opacity: "0.7" }}
        >
          Get started in less than a minute
        </p>

        <form onSubmit={handleSignup} className="mt-8 space-y-5">
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
              placeholder="you@example.com"
              className="w-full rounded-lg px-4 py-2 text-sm border-2"
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
              minLength={6}
              placeholder="At least 6 characters"
              className="w-full rounded-lg px-4 py-2 text-sm border-2"
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
            Sign up
          </button>
        </form>
        <div className="mt-6">
          <GoogleLoginButton />
        </div>

        <p
          className="text-sm text-center mt-6"
          style={{ color: "var(--color-font)" }}
        >
          Already have an account?{" "}
          <a
            href="/login"
            className="font-bold hover:underline"
            style={{ color: "var(--color-orange)" }}
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
