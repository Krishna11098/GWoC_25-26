"use client";

import { useState, useEffect } from "react";
import eventService from "@/app/lib/eventService";
import userService from "@/app/lib/userService";

import {
  Flame,
  Calendar,
  Users,
  CheckCircle2,
  Flag,
  Zap,
  Plus,
  Puzzle,
  Film,
  FileText,
  Target,
  ShoppingBag,
  AlertTriangle,
  MapPin,
  Hammer,
  RefreshCw,
} from "lucide-react";

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Flame className="text-orange-500" /> JoyJuncture Admin Dashboard
        </h1>
        <p className="text-gray-600">Powered by Firebase Firestore</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Events Card */}
        <div className="p-6 rounded-xl shadow border border-gray-200 bg-white hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-2">
            <div className="p-2 rounded-lg mr-3 bg-blue-100">
              <Calendar size={20} className="text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Total Events
            </h3>
          </div>
          <p className="text-4xl font-bold text-gray-900">
            {loading ? "..." : events.length}
          </p>
          <p className="text-sm text-gray-600 mt-2">Live in database</p>
        </div>
        {/* Total Users Card */}
        <div className="p-6 rounded-xl shadow border border-gray-200 bg-white hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-2">
            <div className="p-2 rounded-lg mr-3 bg-green-100">
              <Users size={20} className="text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Total Users</h3>
          </div>
          <p className="text-4xl font-bold text-gray-900">
            {userLoading ? "..." : totalUsers}
          </p>
          <p className="text-sm text-gray-600 mt-2">Registered accounts</p>
        </div>
        {/* Active Users Card (Optional) */}
        <div className="p-6 rounded-xl shadow border border-gray-200 bg-white hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-2">
            <div className="p-2 rounded-lg mr-3 bg-green-100">
              <CheckCircle2 size={20} className="text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Active Users
            </h3>
          </div>
          <p className="text-4xl font-bold text-gray-900">
            {userLoading ? "..." : activeUsers}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            {activeUsers === totalUsers
              ? "All active"
              : totalUsers > 0
              ? `${Math.round((activeUsers / totalUsers) * 100)}% active`
              : "0% active"}
          </p>
        </div>
        {/* Reports Card */}
        <div className="p-6 rounded-xl shadow border border-gray-200 bg-white hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="p-2 rounded-lg mr-3 bg-red-100">
                <Flag size={20} className="text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Reports</h3>
            </div>

            {totalReports > 0 && (
              <button
                onClick={() => window.open("/admin/reports", "_blank")}
                className="px-3 py-1 text-sm rounded-lg transition-colors flex items-center gap-1 bg-blue-50 text-blue-700 hover:bg-blue-100"
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
            <p className="text-4xl font-bold text-gray-900">
              {userLoading ? "..." : totalReports}
            </p>
            {pendingReports > 0 && (
              <span className="ml-2 px-2 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                {pendingReports} pending
              </span>
            )}
          </div>

          <div className="flex justify-between items-center mt-2">
            <p className="text-sm text-gray-600">
              {pendingReports > 0
                ? `${pendingReports} need review`
                : "All clear"}
            </p>

            {totalReports === 0 && (
              <button
                onClick={() => window.open("/admin/reports", "_blank")}
                className="px-3 py-1 text-xs rounded-lg transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                View Reports
              </button>
            )}
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="p-6 rounded-xl shadow border border-gray-200 bg-white hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-2">
            <div className="p-2 rounded-lg mr-3 bg-yellow-100">
              <Zap size={20} className="text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Quick Actions
            </h3>
          </div>
          <div className="space-y-2 mt-3">
            <a
              href="/admin/create-event"
              className="block w-full text-center px-4 py-2 rounded-lg flex items-center justify-center gap-2 bg-blue-50 text-blue-700 hover:bg-blue-100"
            >
              <Plus size={16} /> Create Event
            </a>
            <a
              href="/admin/users"
              className="block w-full text-center px-4 py-2 rounded-lg flex items-center justify-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              <Users size={16} /> Manage Users
            </a>
            <a
              href="/admin/riddles"
              className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <Puzzle size={16} /> Manage Riddles
            </a>
            <a
              href="/admin/movies"
              className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <Film size={16} /> Manage Movies
            </a>
            <a
              href="/admin/blogs"
              className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <FileText size={16} /> Manage Blogs
            </a>
            <a
              href="/admin/sudoku"
              className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <Target size={16} /> Manage Sudoku
            </a>
            <a
              href="/admin/products"
              className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <ShoppingBag size={16} /> Manage Products
            </a>
          </div>
        </div>
        {/* Moderation Card */}
        <div className="p-6 rounded-xl shadow border border-gray-200 bg-white hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-2">
            <div className="p-2 rounded-lg mr-3 bg-amber-100">
              <AlertTriangle size={20} className="text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Moderation</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-700">Reported Users:</span>
              <span className="font-bold text-gray-900">
                {userLoading ? "..." : reportedUsers}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-700">Banned Users:</span>
              <span className="font-bold text-gray-900">
                {userLoading ? "..." : bannedUsers}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats Bar */}
      <div className="mb-8 p-4 rounded-xl shadow border border-gray-200 bg-white">
        <div className="flex flex-wrap gap-6 justify-around">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Events</p>
            <p className="text-2xl font-bold text-gray-900">
              {loading ? "..." : events.length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Users</p>
            <p className="text-2xl font-bold text-gray-900">
              {userLoading ? "..." : totalUsers}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Active Users</p>
            <p className="text-2xl font-bold text-gray-900">
              {userLoading ? "..." : activeUsers}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Pending Reports</p>
            <p className="text-2xl font-bold text-gray-900">
              {userLoading ? "..." : pendingReports}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Reported Users</p>
            <p className="text-2xl font-bold text-gray-900">
              {userLoading ? "..." : reportedUsers}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Events Section */}
      <div className="rounded-xl shadow p-6 mb-6 border border-gray-200 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Recent Events</h2>
          <span className="text-sm text-gray-600">
            Showing {Math.min(events.length, 5)} of {events.length}
          </span>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading events from Firebase...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-8">
            <div className="flex justify-center mb-4 text-gray-300">
              <Calendar size={64} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Events Created
            </h3>
            <p className="mb-6 text-gray-600">
              Get started by creating your first event!
            </p>
            <a
              href="/admin/create-event"
              className="inline-block px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Create Your First Event
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {events.slice(0, 5).map((event) => (
              <div
                key={event.id}
                className="p-4 border border-gray-200 rounded-lg transition-colors hover:border-gray-300 hover:bg-gray-50"
              >
                <h3 className="font-bold text-lg text-gray-900 flex items-center">
                  <Target size={18} className="mr-2 text-blue-600" />
                  {event.title}
                </h3>
                <p className="mt-1 text-gray-700">
                  {event.description || "No description"}
                </p>
                <div className="flex items-center mt-2 text-sm text-gray-600">
                  <span className="mr-4 flex items-center gap-1">
                    <MapPin size={14} /> {event.location || "Location not set"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />{" "}
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
      <div className="rounded-xl shadow p-6 mb-6 border border-gray-200 bg-white">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Moderation Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <a
            href="/admin/reports"
            className="p-4 border border-gray-200 rounded-lg transition-colors hover:border-gray-300 hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100">
                <Flag size={20} className="text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Review Reports</h3>
                <p className="text-sm text-gray-600">
                  {pendingReports} reports pending
                </p>
              </div>
            </div>
          </a>

          <a
            href="/admin/users"
            className="p-4 border border-gray-200 rounded-lg transition-colors hover:border-gray-300 hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <Users size={20} className="text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Manage Users</h3>
                <p className="text-sm text-gray-600">
                  {reportedUsers} users with reports
                </p>
              </div>
            </div>
          </a>

          <a
            href="/admin/ban-users"
            className="p-4 border border-gray-200 rounded-lg transition-colors hover:border-gray-300 hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100">
                <Hammer size={20} className="text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Ban Management</h3>
                <p className="text-sm text-gray-600">
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
          className="px-4 py-2 rounded-lg flex items-center gap-2 font-bold bg-blue-600 text-white hover:bg-blue-700"
        >
          <RefreshCw size={18} />
          Refresh Data
        </button>
      </div>
    </div>
  );
}
