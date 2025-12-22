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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-semibold text-gray-900 text-center">
          Welcome back
        </h1>
        <p className="text-sm text-gray-500 text-center mt-1">
          Login to your account
        </p>

        <form onSubmit={handleLogin} className="mt-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-black py-2 text-sm font-medium text-white"
          >
            Login
          </button>
        </form>
        <div className="mt-6">
          <GoogleLoginButton />
        </div>
      </div>
    </div>
  );
}
