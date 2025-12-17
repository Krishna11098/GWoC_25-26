"use client";

import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebaseClient";

export default function GoogleLoginButton() {
  async function handleGoogleLogin() {
    try {
      // 1️⃣ Firebase Google popup
      const res = await signInWithPopup(auth, googleProvider);

      // 2️⃣ Get ID token
      const token = await res.user.getIdToken();

      // 3️⃣ Send token to backend
      await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      alert("Google login successful");
    } catch (err) {
      console.error(err);
      alert("Google login failed");
    }
  }

  return (
    <button onClick={handleGoogleLogin}>
      Continue with Google
    </button>
  );
}
