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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-semibold text-gray-900 text-center">
          Create an account
        </h1>
        <p className="text-sm text-gray-500 text-center mt-1">
          Get started in less than a minute
        </p>

        <form onSubmit={handleSignup} className="mt-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
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
              minLength={6}
              placeholder="At least 6 characters"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-black py-2 text-sm font-medium text-white"
          >
            Sign up
          </button>
        </form>
         <div className="mt-6">
                  <GoogleLoginButton />
                </div>

        <p className="text-sm text-gray-500 text-center mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-black font-medium hover:underline">
            Login
          </a>
        </p>
       
      </div>
      
    </div>
  );
}
