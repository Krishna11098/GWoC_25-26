"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AllEventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    past: 0,
    free: 0,
    paid: 0,
    totalSeats: 0,
    bookedSeats: 0,
  });

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError("");
      console.log("📥 Loading events from API...");

      const response = await fetch("/api/events");
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ API Response:", data);

      if (!data.success) {
        throw new Error(data.error || "Failed to load events");
      }

      setEvents(data.events || []);
      calculateStats(data.events || []);
    } catch (error) {
      console.error("❌ Error loading events:", error);
      setError(`Failed to load events: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (eventsList) => {
    const now = new Date();
    let totalSeats = 0;
    let bookedSeats = 0;
    let upcoming = 0;
    let past = 0;
    let free = 0;
    let paid = 0;

    eventsList.forEach((event) => {
      const eventDate = event.date ? new Date(event.date) : null;

      if (eventDate) {
        if (eventDate >= now) upcoming++;
        else past++;
      }

      // Price based categorization
      if (event.price === 0) {
        free++;
      } else {
        paid++;
      }

      // Calculate seat stats
      totalSeats += event.totalSeats || 0;
      bookedSeats += event.bookedSeats || 0;
    });

    setStats({
      total: eventsList.length,
      upcoming,
      past,
      free,
      paid,
      totalSeats,
      bookedSeats,
      availableSeats: totalSeats - bookedSeats,
      occupancyRate:
        totalSeats > 0 ? ((bookedSeats / totalSeats) * 100).toFixed(1) : 0,
    });
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleDelete = async (eventId, eventName) => {
    if (!confirm(`Are you sure you want to delete "${eventName}"?`)) {
      return;
    }

    setDeletingId(eventId);

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete event");
      }

      // Remove from local state
      setEvents(events.filter((event) => event.id !== eventId));
      calculateStats(events.filter((event) => event.id !== eventId));

      alert("✅ Event deleted successfully!");
    } catch (error) {
      console.error("Delete failed:", error);
      alert(`❌ Failed to delete: ${error.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (eventId, currentActive) => {
    try {
      const response = await fetch(`/api/events/${eventId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !currentActive }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update status");
      }

      // Update local state
      setEvents(
        events.map((event) =>
          event.id === eventId ? { ...event, active: !currentActive } : event
        )
      );

      alert(`✅ Event ${!currentActive ? "activated" : "deactivated"}!`);
    } catch (error) {
      console.error("Toggle status failed:", error);
      alert(`❌ Failed to update status: ${error.message}`);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "No date/time";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getEventStatus = (event) => {
    const now = new Date();
    const eventDate = event.date ? new Date(event.date) : null;

    if (!eventDate) return { text: "Unknown", color: "gray" };
    if (eventDate < now) return { text: "Past", color: "gray" };
    if (event.bookedSeats >= event.totalSeats)
      return { text: "Sold Out", color: "red" };
    if (!event.active) return { text: "Inactive", color: "yellow" };
    return { text: "Active", color: "green" };
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Event Management
            </h1>
            <p className="text-gray-600 mt-1">Manage all events from here</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={loadEvents}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                  Loading...
                </>
              ) : (
                "🔄 Refresh"
              )}
            </button>
            <Link
              href="/admin/create-event"
              className="px-4 py-2 bg-font text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              ➕ Create Event
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="bg-white p-4 rounded-xl shadow border">
            <div className="text-2xl font-bold text-blue-600">
              {stats.total}
            </div>
            <div className="text-sm text-gray-600">Total Events</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow border">
            <div className="text-2xl font-bold text-green-600">
              {stats.upcoming}
            </div>
            <div className="text-sm text-gray-600">Upcoming</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow border">
            <div className="text-2xl font-bold text-purple-600">
              {stats.free}
            </div>
            <div className="text-sm text-gray-600">Free Events</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow border">
            <div className="text-2xl font-bold text-orange-600">
              {stats.paid}
            </div>
            <div className="text-sm text-gray-600">Paid Events</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow border">
            <div className="text-2xl font-bold text-indigo-600">
              {stats.bookedSeats}
            </div>
            <div className="text-sm text-gray-600">Booked Seats</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow border">
            <div className="text-2xl font-bold text-cyan-600">
              {stats.occupancyRate}%
            </div>
            <div className="text-sm text-gray-600">Occupancy Rate</div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-red-600 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-red-600 font-medium">{error}</span>
          </div>
          <button
            onClick={loadEvents}
            className="mt-2 px-3 py-1 bg-red-100 text-red-700 text-sm rounded hover:bg-red-200"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading events...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-gray-700">
            No Events Found
          </h3>
          <p className="text-gray-500 mt-2">
            Create your first event to get started
          </p>
          <Link
            href="/admin/events/create"
            className="inline-block mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Your First Event
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {/* Events Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Venue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Seats
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pricing
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {events.map((event) => {
                  const status = getEventStatus(event);
                  const availableSeats = event.totalSeats - event.bookedSeats;
                  const occupancyPercentage =
                    event.totalSeats > 0
                      ? (event.bookedSeats / event.totalSeats) * 100
                      : 0;

                  return (
                    <tr key={event.id} className="hover:bg-gray-50">
                      {/* Event Name & Category */}
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">
                            {event.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              {event.category}
                            </span>
                            <span className="ml-2">
                              {event.price === 0 ? "Free" : `₹${event.price}`}
                            </span>
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            ID: {event.id}
                          </div>
                        </div>
                      </td>

                      {/* Date & Venue */}
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="text-gray-900">
                            {formatDateTime(event.date)}
                          </div>
                          <div className="text-gray-500 mt-1">
                            {event.venue}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {event.eventType === "online"
                              ? "🌐 Online"
                              : "📍 In-Person"}
                          </div>
                        </div>
                      </td>

                      {/* Seats */}
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="text-gray-900">
                            {event.bookedSeats} / {event.totalSeats}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div
                              className="h-2 rounded-full"
                              style={{
                                width: `${occupancyPercentage}%`,
                                backgroundColor:
                                  occupancyPercentage > 80
                                    ? "#ef4444"
                                    : occupancyPercentage > 50
                                    ? "#f59e0b"
                                    : "#10b981",
                              }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {availableSeats} seats available
                          </div>
                        </div>
                      </td>

                      {/* Pricing */}
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="text-gray-900">
                            ₹{event.price} per seat
                          </div>
                          <div className="text-yellow-600">
                            {event.coinsPerSeat || event.coinsReward || 0} coins per seat
                          </div>
                          <div className="text-xs text-gray-500">
                            Max: {event.maxSeatsPerUser} per user
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`px-2 py-1 text-xs rounded-full w-fit ${
                              status.color === "green"
                                ? "bg-green-100 text-green-800"
                                : status.color === "red"
                                ? "bg-red-100 text-red-800"
                                : status.color === "yellow"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {status.text}
                          </span>
                          <button
                            onClick={() =>
                              handleToggleStatus(
                                event.id,
                                event.active !== false
                              )
                            }
                            className={`text-xs px-2 py-1 rounded w-fit ${
                              event.active !== false
                                ? "bg-red-50 text-red-700 hover:bg-red-100"
                                : "bg-green-50 text-green-700 hover:bg-green-100"
                            }`}
                          >
                            {event.active !== false ? "Deactivate" : "Activate"}
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Link
                            href={`/events/${event.id}`}
                            target="_blank"
                            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                          >
                            View
                          </Link>
                          <Link
                            href={`/admin/events/${event.id}/bookings`}
                            className="px-3 py-1 text-sm bg-green-50 text-green-700 rounded hover:bg-green-100"
                          >
                            Bookings
                          </Link>
                          <Link
                            href={`/admin/events/edit/${event.id}`}
                            className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(event.id, event.name)}
                            className="px-3 py-1 text-sm bg-red-50 text-red-700 rounded hover:bg-red-100 disabled:opacity-50"
                            disabled={deletingId === event.id}
                          >
                            {deletingId === event.id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Showing {events.length} events
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-semibold">{stats.availableSeats}</span>{" "}
                seats available •
                <span className="font-semibold ml-2">
                  {stats.occupancyRate}%
                </span>{" "}
                occupancy
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
