// app/admin/create-event/page.jsx
"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function CreateEventPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "workshop",
    image: "",
    maxAttendees: "",
    price: "0",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Show loading state
  if (loading) {
    return <div>Loading authentication...</div>;
  }

  // Redirect if not admin
  if (!user) {
    router.push("/admin/login");
    return null;
  }

  // handleSubmit mein yeh code dalo:
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      // Validation...
      const eventDateTime = formData.time
        ? `${formData.date}T${formData.time}:00`
        : `${formData.date}T12:00:00`;
      const eventData = {
        title: formData.title,
        description: formData.description,
        date: eventDateTime,
        location: formData.location,
        category: formData.category,
        image: formData.image || "",
        maxAttendees: formData.maxAttendees
          ? parseInt(formData.maxAttendees)
          : null,
        price:
          formData.price === "0" || formData.price === ""
            ? 0
            : parseFloat(formData.price),
        createdBy: user.email,
        createdAt: new Date().toISOString(),
        status: "published",
      };

      // ✅ FIREBASE FIRESTORE MEIN SAVE KARO
      // Pehle import karo:
      

      console.log("🔥 Saving to Firebase...");

      const docRef = await addDoc(collection(db, "events"), eventData);

      console.log("✅ Document written with ID:", docRef.id);

      setSuccess("✅ Event saved to Firebase!");
    } catch (error) {
      console.error("❌ Firebase error:", error);
      setError(`Firebase error: ${error.message}`);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Event</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          <strong>Success:</strong> {success}
          <p className="text-sm mt-1">Redirecting to dashboard...</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 font-medium">Event Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter event title"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Description *</label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            placeholder="Describe your event in detail"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-medium">Date *</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Time *</label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) =>
                setFormData({ ...formData, time: e.target.value })
              }
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-medium">Location *</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Venue address or online link"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Category</label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="workshop">Workshop</option>
              <option value="conference">Conference</option>
              <option value="social">Social Gathering</option>
              <option value="networking">Networking</option>
              <option value="educational">Educational</option>
              <option value="sports">Sports</option>
              <option value="arts">Arts & Culture</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-medium">
              Max Attendees (Optional)
            </label>
            <input
              type="number"
              min="1"
              value={formData.maxAttendees}
              onChange={(e) =>
                setFormData({ ...formData, maxAttendees: e.target.value })
              }
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Leave empty for unlimited"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Price ($)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0 for free"
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 font-medium">Image URL (Optional)</label>
          <input
            type="url"
            value={formData.image}
            onChange={(e) =>
              setFormData({ ...formData, image: e.target.value })
            }
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://example.com/image.jpg"
          />
          <p className="text-sm text-gray-500 mt-1">
            Leave empty to use default event image
          </p>
        </div>

        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed font-medium"
          >
            {isSubmitting ? "Creating Event..." : "Create Event"}
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 bg-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-400 font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
