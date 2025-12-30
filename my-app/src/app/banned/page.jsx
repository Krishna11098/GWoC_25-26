"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

export default function BannedPage() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <div className="max-w-md w-full mx-auto text-center">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
            <span className="text-3xl">🚫</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Account Suspended
          </h1>
          <p className="text-gray-600">
            Your account has been temporarily suspended
          </p>
        </div>

        {/* Message */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h2 className="font-semibold text-red-700 mb-2">
                Account Restrictions
              </h2>
              <ul className="text-sm text-red-600 text-left space-y-1">
                <li>• Cannot access the platform</li>
                <li>• Cannot create or view experiences</li>
                <li>• Cannot interact with other users</li>
                <li>• All your content has been hidden</li>
              </ul>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-semibold text-yellow-700 mb-2">
                What happened?
              </h3>
              <p className="text-sm text-yellow-600">
                Your account was suspended due to multiple community guideline
                violations. This is usually temporary and can be appealed.
              </p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-700 mb-2">
                Want to appeal?
              </h3>
              <p className="text-sm text-blue-600">
                Contact our support team to review your case. Include your email
                and any relevant information about your suspension.
              </p>
              <a
                href="mailto:support@joyjuncture.com"
                className="inline-block mt-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                support@joyjuncture.com
              </a>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleLogout}
            className="w-full py-3 px-4 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout & Return Home
          </button>

          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 px-4 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
          >
            Check Status Again
          </button>

          <p className="text-xs text-gray-500 mt-4">
            If you believe this is a mistake, please contact support
            immediately.
          </p>
        </div>
      </div>
    </div>
  );
}
