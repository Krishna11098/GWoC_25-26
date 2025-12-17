"use client";

import { auth } from "@/lib/firebaseClient";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginPage() {
  async function handleLogin(e) {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    const res = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const token = await res.user.getIdToken();

    await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ token }),
    });

    alert("Login successful");
  }

  return (
    <form onSubmit={handleLogin}>
      <input name="email" />
      <input name="password" type="password" />
      <button>Login</button>
    </form>
  );
}
