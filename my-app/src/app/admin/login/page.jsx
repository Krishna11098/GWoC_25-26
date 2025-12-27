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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center text-white">
          <h1 className="text-3xl font-bold">🎉 JoyJuncture</h1>
          <p className="mt-2 opacity-90">Admin Portal</p>
          <div className="mt-4 inline-flex items-center bg-white/20 px-3 py-1 rounded-full text-sm">
            <span className="mr-2">🔒</span>
            Secure Firebase Authentication
          </div>
        </div>

        {/* Login Form */}
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Admin Login</h2>
          <p className="text-gray-600 mb-6">Sign in with your credentials</p>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="admin@example.com"
                required
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Enter your password"
                required
                disabled={loading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm flex items-center">
                  <span className="mr-2">⚠️</span>
                  {error}
                </p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Authenticating...
                </div>
              ) : (
                "🔐 Sign In to Admin Panel"
              )}
            </button>
          </form>

          {/* Test Credentials */}
          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-gray-600 mb-3">For testing purposes:</p>
            <button
              type="button"
              onClick={useTestCredentials}
              className="w-full py-2 bg-yellow-100 text-yellow-800 rounded-lg border border-yellow-200 hover:bg-yellow-200 transition"
            >
              🧪 Use Test Credentials
            </button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Note: Create this user in Firebase Console first
            </p>
          </div>

          {/* Firebase Status */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg border">
            <p className="font-medium text-gray-700 mb-2 flex items-center">
              <span className="mr-2">🔥</span>
              Firebase Authentication
            </p>
            <div className="space-y-1">
              <p className="text-sm text-green-600 flex items-center">
                <span className="mr-1">✓</span>
                Secure email/password auth
              </p>
              <p className="text-sm text-green-600 flex items-center">
                <span className="mr-1">✓</span>
                Real-time session management
              </p>
            </div>
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              ← Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
