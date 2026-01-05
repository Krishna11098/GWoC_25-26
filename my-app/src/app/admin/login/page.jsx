// src/app/admin/login/page.jsx - REPLACE WITH THIS
"use client";

import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/app/lib/firebaseConfig";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Check if already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("✅ User already logged in:", user.email);
        router.push("/admin");
      }
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("🔐 Attempting login...");

      // Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      console.log("✅ Login successful:", user.email);
      console.log("🎯 User ID:", user.uid);

      // Success - redirect to admin
      router.push("/admin");
    } catch (error) {
      console.error("❌ Login error:", error.code, error.message);

      // User-friendly error messages
      switch (error.code) {
        case "auth/invalid-email":
          setError("Invalid email address");
          break;
        case "auth/user-disabled":
          setError("This account has been disabled");
          break;
        case "auth/user-not-found":
          setError("No account found with this email");
          break;
        case "auth/wrong-password":
          setError("Incorrect password");
          break;
        case "auth/too-many-requests":
          setError("Too many attempts. Try again later");
          break;
        default:
          setError("Login failed: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Test credentials button
  const useTestCredentials = () => {
    // You need to create this user in Firebase Console first
    setEmail("admin@joyjuncture.com");
    setPassword("admin123");
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center font-winky-rough bg-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-background border-t-transparent mx-auto"></div>
          <p className="mt-4 text-font font-medium">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-winky-rough">
      <div className=" backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-foreground/20">
        {/* Header */}
        <div className="p-8 text-center">
          <h1 className="text-4xl font-bold drop-shadow-sm">🎉 JoyJuncture</h1>
          <p className="mt-2 font-medium">Admin Portal</p>
          <div className="mt-4 inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold backdrop-blur-sm border border-white/30">
            <span className="mr-2">🔒</span>
            Secure Firebase Authentication
          </div>
        </div>

        {/* Login Form */}
        <div className="p-8">
          <h2 className="text-2xl font-bold text-background-2 mb-2">Admin Login</h2>
          <p className="text-font mb-8">Sign in with your credentials</p>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-font font-bold mb-2 ml-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 border-2 border-foreground/20 rounded-xl focus:ring-2 focus:ring-orange focus:border-orange outline-none transition-all bg-bg/50 font-medium"
                placeholder="admin@example.com"
                required
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-font font-bold mb-2 ml-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 border-2 border-foreground/20 rounded-xl focus:ring-2 focus:ring-orange focus:border-orange outline-none transition-all bg-bg/50 font-medium"
                placeholder="Enter your password"
                required
                disabled={loading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-pink/20 border-2 border-pink/50 rounded-xl animate-pulse-soft">
                <p className="text-red-800 text-sm font-bold flex items-center">
                  <span className="mr-2 text-xl">⚠️</span>
                  {error}
                </p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-background text-lg font-bold rounded-xl hover:bg-orange hover:text-background-2 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-4 border-white border-t-transparent mr-3"></div>
                  Authenticating...
                </div>
              ) : (
                "🔐 Sign In to Admin Panel"
              )}
            </button>
          </form>

          {/* Test Credentials */}
          <div className="mt-8 pt-6 border-t border-foreground/10">
            <p className="text-sm text-font/60 mb-3 font-medium text-center">For testing purposes:</p>
            <button
              type="button"
              onClick={useTestCredentials}
              className="w-full py-3 bg-green/20 text-background-2 font-bold rounded-xl border-2 border-green/30 hover:bg-green hover:border-green transition-all duration-300"
            >
              🧪 Use Test Credentials
            </button>
            <p className="text-xs text-font/40 mt-3 text-center font-bold">
              Note: Create this user in Firebase Console first
            </p>
          </div>

          {/* Firebase Status */}
          <div className="mt-8 p-5 bg-bg/50 rounded-xl border border-foreground/10">
            <p className="font-bold text-background-2 mb-3 flex items-center">
              <span className="mr-2">🔥</span>
              Firebase Authentication
            </p>
            <div className="space-y-2">
              <p className="text-sm text-green font-bold flex items-center">
                <span className="mr-2 text-lg">✓</span>
                Secure email/password auth
              </p>
              <p className="text-sm text-green font-bold flex items-center">
                <span className="mr-2 text-lg">✓</span>
                Real-time session management
              </p>
            </div>
          </div>

          {/* Back to Home */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="text-background hover:text-orange font-bold text-sm transition-colors duration-300 flex items-center justify-center gap-2 group"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
