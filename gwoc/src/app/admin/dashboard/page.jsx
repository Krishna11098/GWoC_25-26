// app/admin/dashboard/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const storedUser = localStorage.getItem("joyjuncture_admin");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem("joyjuncture_admin");
      }
    } else {
      // No user found, redirect to login
      router.push("/admin/login");
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("joyjuncture_admin");
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          {user && (
            <>
              <span className="text-gray-700">
                Welcome, <strong>{user.displayName || user.email}</strong>
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-bold text-lg mb-2">Create Event</h3>
          <p className="text-gray-600 mb-4">Add a new event to the platform</p>
          <Link
            href="/admin/create"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create New
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-bold text-lg mb-2">Manage Events</h3>
          <p className="text-gray-600 mb-4">View and edit existing events</p>
          <Link
            href="/events"
            className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            View All
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-bold text-lg mb-2">Quick Stats</h3>
          <div className="space-y-2">
            <p>
              Total Events: <span className="font-bold">0</span>
            </p>
            <p>
              Upcoming: <span className="font-bold">0</span>
            </p>
            <p>
              Users: <span className="font-bold">1</span>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="text-gray-500 italic">
          No recent activity. Create your first event!
        </div>
      </div>
    </div>
  );
}
