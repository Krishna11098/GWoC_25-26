// components/AdminDashboard.jsx or app/admin/dashboard/page.jsx
"use client";

import { useAuth } from "@/context/AuthContext"; // Use the custom hook
import Link from "next/link";

export default function AdminDashboard() {
  // ✅ CORRECT: Use the custom hook
  const { user, loading, logout } = useAuth();

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  if (!user) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Access Denied</h2>
        <p>Please log in to access the admin dashboard.</p>
        <Link href="/admin/login" className="text-blue-600 hover:underline">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <p>Welcome, {user.email}</p>
      {/* Rest of your dashboard */}
    </div>
  );
}
