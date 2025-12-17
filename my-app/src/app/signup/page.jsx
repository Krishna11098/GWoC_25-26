"use client";

import { auth } from "@/lib/firebaseClient";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function SignupPage() {
  async function handleSignup(e) {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    // 1️⃣ Firebase Auth
    const res = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // 2️⃣ Save user in Firestore via backend
    await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        uid: res.user.uid,
        email,
      }),
    });

    alert("Signup successful");
  }

  return (
    <form onSubmit={handleSignup}>
      <input name="email" placeholder="Email" />
      <input name="password" type="password" placeholder="Password" />
      <button>Sign up</button>
    </form>
  );
}
