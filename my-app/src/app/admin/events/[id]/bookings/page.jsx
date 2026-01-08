"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function EventBookingsPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [event, setEvent] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");

  useEffect(() => {
    if (eventId) {
      loadBookings();
    }
  }, [eventId]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch event details
      const eventResponse = await fetch(`/api/events/${eventId}`);
      if (!eventResponse.ok) {
        throw new Error("Failed to load event");
      }
      const eventData = await eventResponse.json();
      setEvent(eventData.event);

      // Fetch bookings
      const bookingsResponse = await fetch(
        `/api/events/${eventId}/bookings`
      );
      if (!bookingsResponse.ok) {
        throw new Error("Failed to load bookings");
      }
      const bookingsData = await bookingsResponse.json();
      setBookings(bookingsData.bookings || []);
      setStatistics(bookingsData.statistics);
    } catch (err) {
      console.error("Error loading bookings:", err);
      setError(err.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (booking.userEmail && booking.userEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (booking.userId && booking.userId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      booking.bookingId.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = typeof dateString === "string" ? new Date(dateString) : dateString;
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return "Invalid date";
    }
  };

  const formatDateTime = (timestamp) => {
    if (!timestamp) return "N/A";
    
    try {
      let date;
      
      // Handle Firestore Timestamp objects
      if (timestamp && typeof timestamp.toDate === "function") {
        date = timestamp.toDate();
      } 
      // Handle Date objects
      else if (timestamp instanceof Date) {
        date = timestamp;
      }
      // Handle ISO strings and other date strings
      else if (typeof timestamp === "string") {
        date = new Date(timestamp);
      }
      // Handle timestamps (milliseconds or seconds)
      else if (typeof timestamp === "number") {
        date = new Date(timestamp > 10000000000 ? timestamp : timestamp * 1000);
      } else {
        return "Invalid date";
      }

      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }

      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch (e) {
      console.error("Date formatting error:", e, timestamp);
      return "Invalid date";
    }
  };

  const exportToCSV = () => {
    const headers = [
      "Booking ID",
      "User Name",
      "User ID",
      "Seats Booked",
      "Amount Paid (₹)",
      "Payment Date & Time",
    ];
    const rows = bookings.map((booking) => [
      booking.bookingId,
      booking.userName,
      booking.userId || "N/A",
      booking.seatsBooked,
      booking.amountPaid || 0,
      formatDateTime(booking.bookedAt),
    ]);

    let csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `event-${eventId}-bookings.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Event Bookings</h1>
            {event && (
              <>
                <p className="text-gray-600 mt-1">{event.name}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Event ID: <code className="bg-gray-100 px-2 py-1 rounded">{eventId}</code>
                </p>
              </>
            )}
          </div>
          <Link
            href="/admin/events"
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            ← Back to Events
          </Link>
        </div>
      </div>

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
            onClick={loadBookings}
            className="mt-2 px-3 py-1 bg-red-100 text-red-700 text-sm rounded hover:bg-red-200"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow border">
            <div className="text-3xl font-bold text-blue-600">
              {statistics.totalBookings}
            </div>
            <div className="text-sm text-gray-600 mt-1">Total Bookings</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow border">
            <div className="text-3xl font-bold text-green-600">
              {statistics.totalSeatsBooked}
            </div>
            <div className="text-sm text-gray-600 mt-1">Total Seats Booked</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow border">
            <div className="text-3xl font-bold text-purple-600">
              ₹{statistics.totalAmountCollected}
            </div>
            <div className="text-sm text-gray-600 mt-1">Amount Collected</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow border">
            <div className="text-3xl font-bold text-orange-600">
              {statistics.averageSeatsPerBooking}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Average Seats Per Booking
            </div>
          </div>
        </div>
      )}

      {/* Search & Export */}
      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Search by name, user ID, email, or booking ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={exportToCSV}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
        >
          📥 Export CSV
        </button>
      </div>

      {/* Bookings Table */}
      {bookings.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-gray-700">
            No Bookings Yet
          </h3>
          <p className="text-gray-500 mt-2">
            This event doesn't have any bookings yet
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Seats Booked
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount Paid (₹)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking.bookingId} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {booking.bookingId}
                      </code>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.userName}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 font-mono">
                        {booking.userId || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">
                        {booking.seatsBooked}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-green-600">
                        ₹{booking.amountPaid || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {formatDateTime(booking.bookedAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Confirmed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t">
            <div className="text-sm text-gray-600">
              Showing {filteredBookings.length} of {bookings.length} bookings
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
