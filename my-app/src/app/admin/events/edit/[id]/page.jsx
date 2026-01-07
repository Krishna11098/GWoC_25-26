// src/app/admin/events/edit/[id]/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    fullDescription: "",
    category: "workshop",
    date: "",
    startTime: "10:00",
    duration: 120,
    venue: "",
    organizer: "",
    contactEmail: "",
    contactPhone: "",
    eventType: "in_person",
    totalSeats: 50,
    pricePerSeat: 500,
    coinsPerSeat: 100,
    maxSeatsPerUser: 4,
    isFree: false,
  });
  const [bookedUsers, setBookedUsers] = useState([]);

  // Load event data
  useEffect(() => {
    if (eventId) {
      loadEvent();
    }
  }, [eventId]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      setError("");
      console.log("📥 Loading event:", eventId);

      const response = await fetch(`/api/events/${eventId}`);

      if (!response.ok) {
        throw new Error(`Failed to load event: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Event not found");
      }

      const event = data.event;

      // Format date for input field (YYYY-MM-DD)
      const eventDate = event.date
        ? new Date(event.date).toISOString().split("T")[0]
        : "";

      // Format time for input field (HH:MM)
      let eventTime = event.startTime || "10:00";
      if (eventTime && !eventTime.includes(":")) {
        eventTime = "10:00";
      }

      setFormData({
        name: event.name || "",
        description: event.description || "",
        fullDescription: event.fullDescription || event.description || "",
        category: event.category || "workshop",
        date: eventDate,
        startTime: eventTime,
        duration: event.duration || 120,
        venue: event.venue || "",
        organizer: event.organizer || "",
        contactEmail: event.contactEmail || "",
        contactPhone: event.contactPhone || "",
        eventType: event.eventType || "in_person",
        totalSeats: event.totalSeats || 50,
        pricePerSeat: event.price || event.pricePerSeat || 0,
        coinsPerSeat: event.coinsReward || event.coinsPerSeat || 100,
        maxSeatsPerUser: event.maxSeatsPerUser || 4,
        isFree: event.price === 0,
      });

      setBookedUsers(event.bookedUsers || []);

      console.log("✅ Event loaded:", event);
    } catch (error) {
      console.error("❌ Error loading event:", error);
      setError(`Failed to load event: ${error.message}`);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "isFree" && checked ? { pricePerSeat: 0 } : {}),
      ...(name === "pricePerSeat" && formData.isFree
        ? { pricePerSeat: 0 }
        : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      // Validate form data
      if (!formData.name.trim()) {
        throw new Error("Event name is required");
      }
      if (!formData.description.trim()) {
        throw new Error("Event description is required");
      }
      if (!formData.date) {
        throw new Error("Event date is required");
      }
      if (!formData.venue.trim()) {
        throw new Error("Event venue is required");
      }

      // Prepare data for API
      const apiData = {
        ...formData,
        // Ensure numeric fields are numbers
        totalSeats: parseInt(formData.totalSeats) || 50,
        pricePerSeat: formData.isFree
          ? 0
          : parseFloat(formData.pricePerSeat) || 0,
        coinsPerSeat: parseInt(formData.coinsPerSeat) || 100,
        maxSeatsPerUser: parseInt(formData.maxSeatsPerUser) || 4,
        duration: parseInt(formData.duration) || 120,
      };

      console.log("Updating event data:", apiData);

      const response = await fetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update event");
      }

      if (data.success) {
        alert("✅ Event updated successfully!");
        router.push("/admin/events");
      } else {
        throw new Error(data.error || "Failed to update event");
      }
    } catch (error) {
      console.error("Error updating event:", error);
      setError(error.message);
      alert(`Error: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this event?\n\nThis action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete event");
      }

      alert("✅ Event deleted successfully!");
      router.push("/admin/events");
    } catch (error) {
      console.error("Delete error:", error);
      alert(`Delete failed: ${error.message}`);
    }
  };

  const categories = [
    { value: "workshop", label: "Workshop" },
    { value: "seminar", label: "Seminar" },
    { value: "conference", label: "Conference" },
    { value: "networking", label: "Networking" },
    { value: "social", label: "Social Event" },
    { value: "cultural", label: "Cultural" },
    { value: "sports", label: "Sports" },
    { value: "other", label: "Other" },
  ];

  const eventTypes = [
    { value: "in_person", label: "In-Person" },
    { value: "online", label: "Online" },
    { value: "hybrid", label: "Hybrid" },
  ];

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading event...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Edit Event
            </h1>
            <p className="text-gray-600">Update event details below</p>
            <p className="text-sm text-gray-500 mt-1">
              Event ID:{" "}
              <code className="bg-gray-100 px-2 py-1 rounded">{eventId}</code>
            </p>
          </div>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            ← Back
          </button>
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
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-8 bg-white p-6 md:p-8 rounded-2xl shadow-lg"
      >
        {/* Basic Information */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 border-b pb-2">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter event name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Short Description *
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Brief description (max 150 characters)"
              maxLength={150}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Description *
            </label>
            <textarea
              name="fullDescription"
              value={formData.fullDescription}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Detailed description of the event"
            />
          </div>
        </div>

        {/* Date & Time */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 border-b pb-2">
            Date & Time
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time *
              </label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes) *
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                min={30}
                max={480}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Venue & Contact */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 border-b pb-2">
            Venue & Contact
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Venue Address *
            </label>
            <input
              type="text"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter venue address or location name"
            />
            <p className="text-xs text-gray-500 mt-2">
              💡 Example: India Gate New Delhi, or complete address with coordinates
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Type *
            </label>
            <select
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              {eventTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organizer Name *
              </label>
              <input
                type="text"
                name="organizer"
                value={formData.organizer}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Organizer name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Email *
              </label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="contact@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Phone
              </label>
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+91 123-456-7890"
              />
            </div>
          </div>
        </div>

        {/* Seating & Pricing */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 border-b pb-2">
            Seating & Pricing
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Seats *
              </label>
              <input
                type="number"
                name="totalSeats"
                value={formData.totalSeats}
                onChange={handleChange}
                required
                min={1}
                max={10000}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Seats Per User *
              </label>
              <input
                type="number"
                name="maxSeatsPerUser"
                value={formData.maxSeatsPerUser}
                onChange={handleChange}
                required
                min={1}
                max={20}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Per Seat (₹) *
              </label>
              <input
                type="number"
                name="pricePerSeat"
                value={formData.pricePerSeat}
                onChange={handleChange}
                required
                min={0}
                step="0.01"
                disabled={formData.isFree}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Coins Per Seat *
              </label>
              <input
                type="number"
                name="coinsPerSeat"
                value={formData.coinsPerSeat}
                onChange={handleChange}
                required
                min={0}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              name="isFree"
              checked={formData.isFree}
              onChange={handleChange}
              className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
              id="isFree"
            />
            <label
              htmlFor="isFree"
              className="text-sm font-medium text-gray-700"
            >
              This is a free event (no payment required)
            </label>
          </div>
        </div>

        {/* Booked Users Section */}
        {bookedUsers.length > 0 && (
          <div className="space-y-6 pt-6 border-t">
            <h2 className="text-xl font-bold text-gray-900">
              Booked Users ({bookedUsers.length})
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Seats
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookedUsers.map((user, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.username || "Unknown"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.seatsBooked}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ₹{user.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.paymentDate
                          ? new Date(
                            user.paymentDate.seconds * 1000
                          ).toLocaleDateString()
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-6 border-t">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                disabled={saving}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={saving}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50"
              >
                Delete Event
              </button>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-bold flex items-center gap-2"
            >
              {saving ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Updating Event...
                </>
              ) : (
                "Update Event"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
