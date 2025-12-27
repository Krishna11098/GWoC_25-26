// src/app/admin/events/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import eventService from "@/app/lib/eventService";

export default function AllEventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError("");
      console.log("📥 Loading events from Firebase...");

      const allEvents = await eventService.getAllEvents();
      console.log("✅ Events loaded:", allEvents);

      setEvents(allEvents);
    } catch (error) {
      console.error("❌ Error loading events:", error);
      setError(`Failed to load events: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleDelete = async (eventId, eventTitle) => {
    if (!confirm(`Are you sure you want to delete "${eventTitle}"?`)) {
      return;
    }

    setDeletingId(eventId);

    try {
      await eventService.deleteEvent(eventId);
      console.log(`🗑️ Event ${eventId} deleted from Firebase`);

      // Remove from local state
      setEvents(events.filter((event) => event.id !== eventId));

      alert("✅ Event deleted successfully from Firebase!");
    } catch (error) {
      console.error("Delete failed:", error);
      alert(`❌ Failed to delete: ${error.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (eventId) => {
    router.push(`/admin/events/edit/${eventId}`);
  };

  const handleView = (event) => {
    console.log("Event details:", event);
    alert(
      `📋 Event Details:\n\nTitle: ${event.title}\nDescription: ${
        event.description || "N/A"
      }\nDate: ${
        event.date ? new Date(event.date).toLocaleDateString() : "N/A"
      }\nLocation: ${event.location || "N/A"}\nCategory: ${
        event.category || "general"
      }\nID: ${event.id}`
    );
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">All Events</h1>
        <p className="text-gray-600">Events stored in Firebase Firestore</p>
        <div className="mt-2 flex items-center space-x-4">
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">
            🔥 Connected to Firebase
          </span>
          <span className="text-gray-700">
            Total Events: <strong>{events.length}</strong>
          </span>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="mb-6">
        <button
          onClick={loadEvents}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "🔄 Loading..." : "🔄 Refresh Events"}
        </button>
        <a
          href="/admin/create-event"
          className="ml-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          ➕ Create New Event
        </a>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 font-medium">Error:</p>
          <p className="text-red-600">{error}</p>
          <p className="text-sm text-red-500 mt-2">
            Check Firebase console and Firestore rules.
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading events from Firebase...</p>
          <p className="text-sm text-gray-500">
            Firestore Collection: "events"
          </p>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-gray-700">
            No Events Found
          </h3>
          <p className="text-gray-500 mt-2">Firestore database is empty.</p>
          <a
            href="/admin/create-event"
            className="inline-block mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Your First Event
          </a>
          <p className="text-sm text-gray-400 mt-4">
            Make sure Firestore rules allow reading data
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {event.title || "Untitled Event"}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {event.description || "No description"}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        ID: {event.id}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-gray-900">
                        📅{" "}
                        {event.date
                          ? new Date(event.date).toLocaleDateString()
                          : "No date"}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        📍 {event.location || "No location"}
                      </p>
                      {event.createdAt && (
                        <p className="text-xs text-gray-400 mt-2">
                          Created:{" "}
                          {event.createdAt.toDate
                            ? new Date(
                                event.createdAt.toDate()
                              ).toLocaleString()
                            : "Recently"}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {event.category || "general"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      {/* Edit Button */}
                      <button
                        onClick={() => handleEdit(event.id)}
                        className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                      >
                        ✏️ Edit
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(event.id, event.title)}
                        disabled={deletingId === event.id}
                        className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50"
                      >
                        {deletingId === event.id
                          ? "🗑️ Deleting..."
                          : "🗑️ Delete"}
                      </button>

                      {/* View Button */}
                      <button
                        onClick={() => handleView(event)}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        👁️ View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
