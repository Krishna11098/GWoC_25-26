"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState("email"); // "email", "otp", "password", "success"
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [uid, setUid] = useState("");

  async function sendPasswordResetOTP(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/send-password-reset-otp", {
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

      setSuccessMsg("OTP sent to your email. Check your inbox.");
      setStep("otp");
    } catch (err) {
      setError("Error sending OTP: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function verifyOTP(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("=== OTP Verification ===");
      console.log("Email:", email);
      console.log("OTP:", otp, "Type:", typeof otp, "Length:", otp.length);

      const response = await fetch("/api/auth/verify-password-reset-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to verify OTP");
        return;
      }

      setUid(data.uid);
      setSuccessMsg("OTP verified! Now set your new password.");
      setStep("password");
    } catch (err) {
      setError("Error verifying OTP: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function resetPassword(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (newPassword !== confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }

      if (newPassword.length < 6) {
        setError("Password must be at least 6 characters");
        setLoading(false);
        return;
      }

      // Update password via backend API
      console.log("=== Password Reset Request ===");
      console.log("Email:", email);
      console.log("OTP:", otp, "Type:", typeof otp);
      console.log("New password length:", newPassword.length);

      console.log("Starting password reset for email:", email);
      const response = await fetch("/api/auth/verify-password-reset-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      console.log("Response status:", response.status);

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("Failed to parse response JSON:", parseError);
        const text = await response.text();
        console.error("Response text:", text);
        setError("Invalid response from server. Check console for details.");
        return;
      }

      console.log("Response data:", data);

      if (!response.ok) {
        // Show detailed error message
        let errorMsg = "Failed to reset password";

        if (data && typeof data === "object") {
          if (data.details && data.error) {
            errorMsg = `${data.error}: ${data.details}`;
          } else if (data.error) {
            errorMsg = data.error;
          } else if (data.message) {
            errorMsg = data.message;
          }
        } else if (typeof data === "string") {
          errorMsg = data;
        }

        setError(errorMsg);
        console.error("Password reset failed:", {
          status: response.status,
          data,
        });
        return;
      }

      setSuccessMsg("Password reset successfully! Redirecting to login...");
      setStep("success");

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      setError("Error resetting password: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div
        className="w-full max-w-lg rounded-xl shadow-lg p-10"
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
          {step === "email"
            ? "Forgot Password?"
            : step === "otp"
            ? "Verify OTP"
            : step === "password"
            ? "Set New Password"
            : "Password Reset"}
        </h1>
        <p
          className="text-sm text-center mt-2"
          style={{ color: "var(--color-font)", opacity: "0.7" }}
        >
          {step === "email"
            ? "Enter your email to receive an OTP"
            : step === "otp"
            ? "Enter the 6-digit code sent to your email"
            : step === "password"
            ? "Create a strong new password"
            : "Your password has been reset"}
        </p>

        {error && (
          <div
            className="mt-4 p-3 rounded-lg text-sm"
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
            className="mt-4 p-3 rounded-lg text-sm"
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

        {step === "email" && (
          <form onSubmit={sendPasswordResetOTP} className="mt-8 space-y-5">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--color-font)" }}
              >
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full rounded-lg px-4 py-2 text-sm border-2"
                style={{
                  borderColor: "var(--color-green)",
                  color: "var(--color-font)",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg py-3 text-sm font-bold transition-all duration-300 hover:shadow-lg disabled:opacity-50"
              style={{
                backgroundColor: "var(--color-pink)",
                color: "var(--color-font)",
              }}
            >
              {loading ? "Sending OTP..." : "Send Reset OTP"}
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={verifyOTP} className="mt-8 space-y-5">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--color-font)" }}
              >
                Enter 6-Digit OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                required
                maxLength={6}
                placeholder="000000"
                className="w-full rounded-lg px-4 py-2 text-sm border-2 text-center text-2xl tracking-widest"
                style={{
                  borderColor: "var(--color-green)",
                  color: "var(--color-font)",
                }}
              />
              <p
                className="text-xs mt-2"
                style={{ color: "var(--color-font)", opacity: "0.6" }}
              >
                Check your email for the verification code
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg py-3 text-sm font-bold transition-all duration-300 hover:shadow-lg disabled:opacity-50"
              style={{
                backgroundColor: "var(--color-pink)",
                color: "var(--color-font)",
              }}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep("email");
                setOtp("");
                setSuccessMsg("");
              }}
              className="w-full rounded-lg py-2 text-sm font-medium transition-all duration-300"
              style={{
                backgroundColor: "transparent",
                color: "var(--color-font)",
                borderWidth: "1px",
                borderColor: "var(--color-font)",
              }}
            >
              ← Back
            </button>
          </form>
        )}

        {step === "password" && (
          <form onSubmit={resetPassword} className="mt-8 space-y-5">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--color-font)" }}
              >
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--color-font)" }}
              >
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Confirm your password"
                className="w-full rounded-lg px-4 py-2 text-sm border-2"
                style={{
                  borderColor: "var(--color-green)",
                  color: "var(--color-font)",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg py-3 text-sm font-bold transition-all duration-300 hover:shadow-lg disabled:opacity-50"
              style={{
                backgroundColor: "var(--color-pink)",
                color: "var(--color-font)",
              }}
            >
              {loading ? "Resetting Password..." : "Reset Password"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep("otp");
                setNewPassword("");
                setConfirmPassword("");
                setSuccessMsg("");
              }}
              className="w-full rounded-lg py-2 text-sm font-medium transition-all duration-300"
              style={{
                backgroundColor: "transparent",
                color: "var(--color-font)",
                borderWidth: "1px",
                borderColor: "var(--color-font)",
              }}
            >
              ← Back
            </button>
          </form>
        )}

        {step === "success" && (
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
              className="mt-4 text-sm"
              style={{ color: "var(--color-font)", opacity: "0.7" }}
            >
              Redirecting to login...
            </p>
          </div>
        )}

        {step !== "success" && (
          <p
            className="text-sm text-center mt-6"
            style={{ color: "var(--color-font)" }}
          >
            Remember your password?{" "}
            <a
              href="/login"
              className="font-bold hover:underline"
              style={{ color: "var(--color-orange)" }}
            >
              Login
            </a>
          </p>
        )}
      </div>

      {step !== "success" && (
        <button
          onClick={() => (window.location.href = "/")}
          className="mt-6 px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:shadow-lg"
          style={{
            backgroundColor: "var(--color-green)",
            color: "var(--color-font)",
          }}
        >
          ← Back to Home
        </button>
      )}
    </div>
  );
}
