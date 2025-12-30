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
      <p className="text-gray-600 mb-6">Powered by Firebase Firestore</p>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Events Card */}
        <div className="bg-blue-100 p-6 rounded-xl border border-blue-200">
          <div className="flex items-center mb-2">
            <div className="p-2 bg-blue-200 rounded-lg mr-3">
              <span className="text-blue-600">📅</span>
            </div>
            <h3 className="text-lg font-semibold text-blue-800">
              Total Events
            </h3>
          </div>
          <p className="text-4xl font-bold text-blue-600">
            {loading ? "..." : events.length}
          </p>
          <p className="text-sm text-blue-700 mt-2">Live in database</p>
        </div>
        {/* Total Users Card */}
        <div className="bg-green-100 p-6 rounded-xl border border-green-200">
          <div className="flex items-center mb-2">
            <div className="p-2 bg-green-200 rounded-lg mr-3">
              <span className="text-green-600">👥</span>
            </div>
            <h3 className="text-lg font-semibold text-green-800">
              Total Users
            </h3>
          </div>
          <p className="text-4xl font-bold text-green-600">
            {userLoading ? "..." : totalUsers}
          </p>
          <p className="text-sm text-green-700 mt-2">Registered accounts</p>
        </div>
        {/* Active Users Card (Optional) */}
        <div className="bg-purple-100 p-6 rounded-xl border border-purple-200">
          <div className="flex items-center mb-2">
            <div className="p-2 bg-purple-200 rounded-lg mr-3">
              <span className="text-purple-600">✅</span>
            </div>
            <h3 className="text-lg font-semibold text-purple-800">
              Active Users
            </h3>
          </div>
          <p className="text-4xl font-bold text-purple-600">
            {userLoading ? "..." : activeUsers}
          </p>
          <p className="text-sm text-purple-700 mt-2">
            {activeUsers === totalUsers
              ? "All active"
              : totalUsers > 0
              ? `${Math.round((activeUsers / totalUsers) * 100)}% active`
              : "0% active"}
          </p>
        </div>
        {/* Reports Card */}
        {/* Reports Card */}
        <div className="bg-red-100 p-6 rounded-xl border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="p-2 bg-red-200 rounded-lg mr-3">
                <span className="text-red-600">🚩</span>
              </div>
              <h3 className="text-lg font-semibold text-red-800">Reports</h3>
            </div>

            {/* Report Button - NEW */}
            {totalReports > 0 && (
              <button
                onClick={() => window.open("/admin/reports", "_blank")}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1"
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
            <p className="text-4xl font-bold text-red-600">
              {userLoading ? "..." : totalReports}
            </p>
            {pendingReports > 0 && (
              <span className="ml-2 px-2 py-1 bg-red-200 text-red-700 rounded-full text-sm">
                {pendingReports} pending
              </span>
            )}
          </div>

          <div className="flex justify-between items-center mt-2">
            <p className="text-sm text-red-700">
              {pendingReports > 0
                ? `${pendingReports} need review`
                : "All clear"}
            </p>

            {/* Alternative button placement */}
            {totalReports === 0 && (
              <button
                onClick={() => window.open("/admin/reports", "_blank")}
                className="px-3 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors"
              >
                View Reports
              </button>
            )}
          </div>
        </div>{" "}

        {/* Quick Actions Card */}
        <div className="bg-orange-100 p-6 rounded-xl border border-orange-200">
          <div className="flex items-center mb-2">
            <div className="p-2 bg-orange-200 rounded-lg mr-3">
              <span className="text-orange-600">⚡</span>
            </div>
            <h3 className="text-lg font-semibold text-orange-800">
              Quick Actions
            </h3>
          </div>
          <div className="space-y-2 mt-3">
            <a
              href="/admin/create-event"
              className="block w-full text-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              ➕ Create Event
            </a>
            <a
              href="/admin/users"
              className="block w-full text-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              👥 Manage Users
            </a>
          </div>
        </div>
        {/* Moderation Card */}
        <div className="bg-yellow-100 p-6 rounded-xl border border-yellow-200">
          <div className="flex items-center mb-2">
            <div className="p-2 bg-yellow-200 rounded-lg mr-3">
              <span className="text-yellow-600">⚠️</span>
            </div>
            <h3 className="text-lg font-semibold text-yellow-800">
              Moderation
            </h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-yellow-700">Reported Users:</span>
              <span className="font-bold">
                {userLoading ? "..." : reportedUsers}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-yellow-700">Banned Users:</span>
              <span className="font-bold">
                {userLoading ? "..." : bannedUsers}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats Bar */}
      <div className="mb-8 p-4 bg-gradient-to-r from-blue-50 to-red-50 rounded-xl border">
        <div className="flex flex-wrap gap-6 justify-around">
          <div className="text-center">
            <p className="text-sm text-gray-500">Total Events</p>
            <p className="text-2xl font-bold">
              {loading ? "..." : events.length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="text-2xl font-bold">
              {userLoading ? "..." : totalUsers}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Active Users</p>
            <p className="text-2xl font-bold text-green-600">
              {userLoading ? "..." : activeUsers}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Pending Reports</p>
            <p className="text-2xl font-bold text-red-600">
              {userLoading ? "..." : pendingReports}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Reported Users</p>
            <p className="text-2xl font-bold text-yellow-600">
              {userLoading ? "..." : reportedUsers}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Events Section */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Recent Events</h2>
          <span className="text-sm text-gray-500">
            Showing {Math.min(events.length, 5)} of {events.length}
          </span>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mb-4"></div>
            <p>Loading events from Firebase...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">📅</div>
            <h3 className="text-xl font-semibold mb-2">No Events Created</h3>
            <p className="text-gray-500 mb-6">
              Get started by creating your first event!
            </p>
            <a
              href="/admin/create-event"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Your First Event
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {events.slice(0, 5).map((event) => (
              <div
                key={event.id}
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-bold text-lg flex items-center">
                  <span className="mr-2">🎯</span>
                  {event.title}
                </h3>
                <p className="text-gray-600 mt-1">
                  {event.description || "No description"}
                </p>
                <div className="flex items-center mt-2 text-sm text-gray-500">
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
      <div className="bg-white rounded-xl shadow p-6 mt-6">
        <h2 className="text-2xl font-bold mb-4">Moderation Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <a
            href="/admin/reports"
            className="p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <span className="text-red-600">🚩</span>
              </div>
              <div>
                <h3 className="font-semibold text-red-700">Review Reports</h3>
                <p className="text-sm text-red-600">
                  {pendingReports} reports pending
                </p>
              </div>
            </div>
          </a>

          <a
            href="/admin/users"
            className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-yellow-600">👥</span>
              </div>
              <div>
                <h3 className="font-semibold text-yellow-700">Manage Users</h3>
                <p className="text-sm text-yellow-600">
                  {reportedUsers} users with reports
                </p>
              </div>
            </div>
          </a>

          <a
            href="/admin/ban-users"
            className="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-purple-600">🔨</span>
              </div>
              <div>
                <h3 className="font-semibold text-purple-700">
                  Ban Management
                </h3>
                <p className="text-sm text-purple-600">
                  {bannedUsers} users banned
                </p>
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
          className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 flex items-center"
        >
          <span className="mr-2">🔄</span>
          Refresh Data
        </button>
      </div>
    </div>
  );
}
