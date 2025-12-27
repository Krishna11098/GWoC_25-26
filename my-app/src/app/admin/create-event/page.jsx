// src/app/admin/create-event/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import eventService from "@/app/lib/eventService";

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    eventStartTime: "09:00",
    duration: 60,
    location: "",
    category: "general",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("🚀 Creating event with data:", formData);

      // Firebase mein save karo
      await eventService.createEvent(formData);

      console.log("✅ Event created successfully!");
      alert("🎉 Event created in Firebase!");

      // Form reset
      setFormData({
        title: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
        eventStartTime: "09:00",
        duration: 60,
        location: "",
        category: "general",
      });

      // Dashboard pe redirect
      router.push("/admin");
    } catch (error) {
      console.error("❌ Event creation failed:", error);
      alert(
        `Failed to create event: ${error.message}\nCheck Firebase console and rules.`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Create New Event</h1>
        <p className="text-gray-600">
          Add event to Firebase Firestore database
        </p>
        <div className="mt-2 flex items-center text-sm text-blue-600">
          <span className="mr-2">🔥</span>
          <span>Events are stored in Firebase Cloud (NOT localStorage)</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Event Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter event title"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe your event..."
            />
          </div>

          {/* Date, Time & Duration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Event Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Start Time *
              </label>
              <input
                type="time"
                name="eventStartTime"
                value={formData.eventStartTime}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Duration (minutes) *
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 60, 90, 120"
                min="15"
                step="15"
                required
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Location *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Virtual, New York, etc."
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="general">General</option>
              <option value="tech">Technology</option>
              <option value="business">Business</option>
              <option value="social">Social</option>
              <option value="education">Education</option>
              <option value="entertainment">Entertainment</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Creating Event in Firebase...
                </div>
              ) : (
                "🎯 Create Event in Firebase"
              )}
            </button>
          </div>
        </form>

        {/* Test Event Button */}
        <div className="mt-8 pt-6 border-t">
          <p className="text-gray-600 mb-3">Quick Test:</p>
          <button
            onClick={() => {
              setFormData({
                title: "Test Conference 2024",
                description:
                  "Annual technology conference with speakers from around the world.",
                date: "2024-12-25",
                eventStartTime: "14:00",
                duration: 120,
                location: "Virtual / Online",
                category: "tech",
              });
            }}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
          >
            Fill Test Data
          </button>
        </div>
      </div>
    </div>
  );
}
