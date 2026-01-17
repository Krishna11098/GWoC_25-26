"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { auth } from "@/lib/firebaseClient";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import GoogleLoginButton from "@/components/loginButton";
import SoftWaveBackground from "@/components/SoftWaveBackground";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState("signup"); // "signup", "otp", "verified"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  async function sendOTP(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to send OTP");
        return;
      }

      setSuccessMsg("OTP sent to your email. Please check and enter below.");
      setStep("otp");
    } catch (err) {
      setError("Error sending OTP: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function verifyOTPAndSignup(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Verify OTP
      const otpResponse = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const otpData = await otpResponse.json();

      if (!otpResponse.ok) {
        setError(otpData.error || "Failed to verify OTP");
        return;
      }

      // OTP verified, create user in Firebase
      const res = await createUserWithEmailAndPassword(auth, email, password);

      // Save user in backend
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

      setSuccessMsg("Email verified! Account created successfully.");
      setStep("verified");

      setTimeout(() => {
        router.push("/home");
      }, 2000);
    } catch (err) {
      setError("Error creating account: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <motion.div
        className="pointer-events-none absolute inset-0 -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <SoftWaveBackground height="60vh" className="pointer-events-none" />
      </motion.div>
      <motion.div
        className="w-full max-w-lg rounded-xl p-6 sm:p-8 md:p-10"
        style={{
          backgroundColor: "white",
          borderColor: "var(--dark-teal)",
          borderWidth: "2px",
        }}
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center"
          style={{ color: "var(--dark-teal)" }}
        >
          {step === "signup"
            ? "Create an account"
            : step === "otp"
            ? "Verify Email"
            : "Account Created!"}
        </h1>
        <p
          className="text-xs sm:text-sm md:text-base text-center mt-2"
          style={{ color: "var(--dark-teal)", opacity: "0.7" }}
        >
          {step === "signup"
            ? "Get started in less than a minute"
            : step === "otp"
            ? "Enter the OTP sent to your email"
            : "Your account is ready to use"}
        </p>

        {error && (
          <div
            className="mt-4 p-3 rounded-lg text-xs sm:text-sm"
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

        {successMsg && (
          <div
            className="mt-4 p-3 rounded-lg text-xs sm:text-sm"
            style={{
              backgroundColor: "#dcfce7",
              color: "#15803d",
              borderColor: "#86efac",
              borderWidth: "1px",
            }}
          >
            {successMsg}
          </div>
        )}

        {step === "signup" && (
          <form onSubmit={sendOTP} className="mt-8 space-y-5">
            <div>
              <label
                className="block text-xs sm:text-sm font-medium mb-2"
                style={{ color: "var(--dark-teal)" }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full rounded-lg px-4 py-2 text-sm md:text-base border-2"
                style={{
                  borderColor: "var(--dark-teal)",
                  color: "var(--dark-teal)",
                }}
              />
            </div>

            <div>
              <label
                className="block text-xs sm:text-sm font-medium mb-2"
                style={{ color: "var(--dark-teal)" }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="At least 6 characters"
                className="w-full rounded-lg px-4 py-2 text-sm md:text-base border-2"
                style={{
                  borderColor: "var(--dark-teal)",
                  color: "var(--dark-teal)",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg py-3 text-sm md:text-base font-bold transition-all duration-300 disabled:opacity-50"
              style={{
                backgroundColor: "var(--dark-teal)",
                color: "white",
              }}
            >
              {loading ? "Sending OTP..." : "Continue with Email Verification"}
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={verifyOTPAndSignup} className="mt-8 space-y-5">
            <div>
              <label
                className="block text-xs sm:text-sm font-medium mb-2"
                style={{ color: "var(--dark-teal)" }}
              >
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                required
                maxLength={6}
                placeholder="000000"
                className="w-full rounded-lg px-4 py-2 border-2 text-center text-xl sm:text-2xl md:text-3xl tracking-widest"
                style={{
                  borderColor: "var(--dark-teal)",
                  color: "var(--dark-teal)",
                }}
              />
              <p
                className="text-[11px] sm:text-xs mt-2"
                style={{ color: "var(--dark-teal)", opacity: "0.6" }}
              >
                Check your email for the 6-digit code
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg py-3 text-sm md:text-base font-bold transition-all duration-300 disabled:opacity-50"
              style={{
                backgroundColor: "var(--dark-teal)",
                color: "white",
              }}
            >
              {loading ? "Verifying..." : "Verify & Create Account"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep("signup");
                setOtp("");
                setSuccessMsg("");
              }}
              className="w-full rounded-lg py-2 text-sm md:text-base font-medium transition-all duration-300"
              style={{
                backgroundColor: "transparent",
                color: "var(--dark-teal)",
                borderWidth: "1px",
                borderColor: "var(--dark-teal)",
              }}
            >
              ← Back
            </button>
          </form>
        )}

        {step === "verified" && (
          <div className="mt-8 text-center">
            <div
              className="inline-block p-4 rounded-full"
              style={{ backgroundColor: "#dcfce7" }}
            >
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#15803d"
                strokeWidth="2"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <p
              className="mt-4 text-xs sm:text-sm"
              style={{ color: "var(--dark-teal)", opacity: "0.7" }}
            >
              Redirecting to home...
            </p>
          </div>
        )}

        {step !== "verified" && (
          <>
            <div className="mt-6">
              <GoogleLoginButton />
            </div>

            <p
              className="text-xs sm:text-sm text-center mt-6"
              style={{ color: "var(--dark-teal)" }}
            >
              Already have an account?{" "}
              <a
                href="/login"
                className="font-bold hover:underline"
                style={{ color: "var(--light-orange)" }}
              >
                Login
              </a>
            </p>
          </>
        )}
      </motion.div>

      {step !== "verified" && (
        <motion.button
          onClick={() => (window.location.href = "/")}
          className="mt-6 px-6 py-2 rounded-lg font-medium text-sm md:text-base transition-all duration-300"
          style={{
            backgroundColor: "var(--green)",
            color: "var(--dark-teal)",
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
        >
          ← Back to Home
        </motion.button>
      )}
    </div>
  );
}
