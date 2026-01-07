"use client";

import { useState, useEffect } from "react";
import eventService from "@/app/lib/eventService";
import userService from "@/app/lib/userService";

export default function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [totalReports, setTotalReports] = useState(0);
  const [pendingReports, setPendingReports] = useState(0);
  const [reportedUsers, setReportedUsers] = useState(0);
  const [bannedUsers, setBannedUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    loadEvents();
    loadUsers();
  }, []);

  const loadEvents = async () => {
    try {
      const allEvents = await eventService.getAllEvents();
      setEvents(allEvents);
    } catch (error) {
      console.error("Dashboard load error:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      // Get total users count
      const count = await userService.getTotalUsers();
      setTotalUsers(count);

      // Get active users count (optional)
      const activeCount = await userService.getActiveUsers();
      setActiveUsers(activeCount);

      // Get reports data
      const reportsData = await userService.getReportsStats();
      if (reportsData) {
        setTotalReports(reportsData.total || 0);
        setPendingReports(reportsData.pending || 0);
        setReportedUsers(reportsData.reportedUsers || 0);
        setBannedUsers(reportsData.banned || 0);
      }
    } catch (error) {
      console.error("User load error:", error);
    } finally {
      setUserLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">🔥 JoyJuncture Admin</h1>
      <p className="mb-6">Powered by Firebase Firestore</p>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Events Card */}
        <div className="p-6 rounded-xl border">
          <div className="flex items-center mb-2">
            <div className="p-2 rounded-lg mr-3">
              <span>📅</span>
            </div>
            <h3 className="text-lg font-semibold">Total Events</h3>
          </div>
          <p className="text-4xl font-bold">
            {loading ? "..." : events.length}
          </p>
          <p className="text-sm mt-2">Live in database</p>
        </div>
        {/* Total Users Card */}
        <div className="p-6 rounded-xl border">
          <div className="flex items-center mb-2">
            <div className="p-2 rounded-lg mr-3">
              <span>👥</span>
            </div>
            <h3 className="text-lg font-semibold">Total Users</h3>
          </div>
          <p className="text-4xl font-bold">
            {userLoading ? "..." : totalUsers}
          </p>
          <p className="text-sm mt-2">Registered accounts</p>
        </div>
        {/* Active Users Card (Optional) */}
        <div className="p-6 rounded-xl border">
          <div className="flex items-center mb-2">
            <div className="p-2 rounded-lg mr-3">
              <span>✅</span>
            </div>
            <h3 className="text-lg font-semibold">Active Users</h3>
          </div>
          <p className="text-4xl font-bold">
            {userLoading ? "..." : activeUsers}
          </p>
          <p className="text-sm mt-2">
            {activeUsers === totalUsers
              ? "All active"
              : totalUsers > 0
              ? `${Math.round((activeUsers / totalUsers) * 100)}% active`
              : "0% active"}
          </p>
        </div>
        {/* Reports Card */}
        <div className="p-6 rounded-xl border">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="p-2 rounded-lg mr-3">
                <span>🚩</span>
              </div>
              <h3 className="text-lg font-semibold">Reports</h3>
            </div>

            {totalReports > 0 && (
              <button
                onClick={() => window.open("/admin/reports", "_blank")}
                className="px-3 py-1 text-sm rounded-lg transition-colors flex items-center gap-1"
              >
                <span>View</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}
          </div>

          <div className="flex items-baseline">
            <p className="text-4xl font-bold">
              {userLoading ? "..." : totalReports}
            </p>
            {pendingReports > 0 && (
              <span className="ml-2 px-2 py-1 rounded-full text-sm">
                {pendingReports} pending
              </span>
            )}
          </div>

          <div className="flex justify-between items-center mt-2">
            <p className="text-sm">
              {pendingReports > 0
                ? `${pendingReports} need review`
                : "All clear"}
            </p>

            {totalReports === 0 && (
              <button
                onClick={() => window.open("/admin/reports", "_blank")}
                className="px-3 py-1 text-xs rounded-lg transition-colors"
              >
                View Reports
              </button>
            )}
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="p-6 rounded-xl border">
          <div className="flex items-center mb-2">
            <div className="p-2 rounded-lg mr-3">
              <span>⚡</span>
            </div>
            <h3 className="text-lg font-semibold">Quick Actions</h3>
          </div>
          <div className="space-y-2 mt-3">
            <a
              href="/admin/create-event"
              className="block w-full text-center px-4 py-2 rounded-lg"
            >
              ➕ Create Event
            </a>
            <a
              href="/admin/users"
              className="block w-full text-center px-4 py-2 rounded-lg"
            >
              👥 Manage Users
            </a>
            <a
              href="/admin/riddles"
              className="block w-full text-center px-4 py-2 bg-font text-white rounded-lg hover:bg-font/80 hover:text-black"
            >
              🧩 Manage Riddles
            </a>
            <a
              href="/admin/movies"
              className="block w-full text-center px-4 py-2 bg-font text-white rounded-lg hover:bg-font/80 hover:text-black"
            >
              🎬 Manage Movies
            </a>
            <a
              href="/admin/blogs"
              className="block w-full text-center px-4 py-2 bg-font text-white rounded-lg hover:bg-font/80 hover:text-black"
            >
              📝 Manage Blogs
            </a>
            <a
              href="/admin/sudoku"
              className="block w-full text-center px-4 py-2 bg-font text-white rounded-lg hover:bg-font/80 hover:text-black"
            >
              🎯 Manage Sudoku
            </a>
            <a
              href="/admin/products"
              className="block w-full text-center px-4 py-2 bg-font text-white rounded-lg hover:bg-font/80 hover:text-black"
            >
              🛍️ Manage Products
            </a>
          </div>
        </div>
        {/* Moderation Card */}
        <div className="p-6 rounded-xl border">
          <div className="flex items-center mb-2">
            <div className="p-2 rounded-lg mr-3">
              <span>⚠️</span>
            </div>
            <h3 className="text-lg font-semibold">Moderation</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Reported Users:</span>
              <span className="font-bold">
                {userLoading ? "..." : reportedUsers}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Banned Users:</span>
              <span className="font-bold">
                {userLoading ? "..." : bannedUsers}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats Bar */}
      <div className="mb-8 p-4 rounded-xl border">
        <div className="flex flex-wrap gap-6 justify-around">
          <div className="text-center">
            <p className="text-sm">Total Events</p>
            <p className="text-2xl font-bold">
              {loading ? "..." : events.length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm">Total Users</p>
            <p className="text-2xl font-bold">
              {userLoading ? "..." : totalUsers}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm">Active Users</p>
            <p className="text-2xl font-bold">
              {userLoading ? "..." : activeUsers}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm">Pending Reports</p>
            <p className="text-2xl font-bold">
              {userLoading ? "..." : pendingReports}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm">Reported Users</p>
            <p className="text-2xl font-bold">
              {userLoading ? "..." : reportedUsers}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Events Section */}
      <div className="rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Recent Events</h2>
          <span className="text-sm">
            Showing {Math.min(events.length, 5)} of {events.length}
          </span>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 mb-4"></div>
            <p>Loading events from Firebase...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">📅</div>
            <h3 className="text-xl font-semibold mb-2">No Events Created</h3>
            <p className="mb-6">Get started by creating your first event!</p>
            <a
              href="/admin/create-event"
              className="inline-block px-6 py-3 rounded-lg"
            >
              Create Your First Event
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {events.slice(0, 5).map((event) => (
              <div
                key={event.id}
                className="p-4 border rounded-lg transition-colors"
              >
                <h3 className="font-bold text-lg flex items-center">
                  <span className="mr-2">🎯</span>
                  {event.title}
                </h3>
                <p className="mt-1">{event.description || "No description"}</p>
                <div className="flex items-center mt-2 text-sm">
                  <span className="mr-4">
                    📍 {event.location || "Location not set"}
                  </span>
                  <span>
                    📅{" "}
                    {event.date
                      ? new Date(event.date).toLocaleDateString()
                      : "No date"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Moderation Actions */}
      <div className="rounded-xl shadow p-6 mt-6">
        <h2 className="text-2xl font-bold mb-4">Moderation Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <a
            href="/admin/reports"
            className="p-4 border rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg">
                <span>🚩</span>
              </div>
              <div>
                <h3 className="font-semibold">Review Reports</h3>
                <p className="text-sm">{pendingReports} reports pending</p>
              </div>
            </div>
          </a>

          <a
            href="/admin/users"
            className="p-4 border rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg">
                <span>👥</span>
              </div>
              <div>
                <h3 className="font-semibold">Manage Users</h3>
                <p className="text-sm">{reportedUsers} users with reports</p>
              </div>
            </div>
          </a>

          <a
            href="/admin/ban-users"
            className="p-4 border rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg">
                <span>🔨</span>
              </div>
              <div>
                <h3 className="font-semibold">Ban Management</h3>
                <p className="text-sm">{bannedUsers} users banned</p>
              </div>
            </div>
          </a>
        </div>
      </div>

      {/* Quick Refresh Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => {
            setLoading(true);
            setUserLoading(true);
            loadEvents();
            loadUsers();
          }}
          className="px-4 py-2 rounded-lg flex items-center"
        >
          <span className="mr-2">🔄</span>
          Refresh Data
        </button>
      </div>
    </div>
  );
}
