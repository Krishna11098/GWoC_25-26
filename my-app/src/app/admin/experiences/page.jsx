// /app/admin/experiences/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { userFetch } from "@/lib/userFetch";
import {
  ThumbsUp,
  ThumbsDown,
  Plus,
  RefreshCw,
  Trash2,
  Edit,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const EXPERIENCE_CATEGORIES = [
  { id: "private_birthdays", label: "Private Birthdays" },
  { id: "corporate_events", label: "Corporate Events" },
  { id: "monthly_kits", label: "Monthly Kits" },
  { id: "carnivals", label: "Carnivals" },
  { id: "weddings", label: "Weddings" },
];

export default function AdminExperiencesPage() {
  const router = useRouter();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await userFetch("/api/admin/experiences");
      if (res.ok) {
        const data = await res.json();
        // API returns { experiences: [...] } so extract the array
        const expsArray = data.experiences || data || [];
        setExperiences(Array.isArray(expsArray) ? expsArray : []);
      } else {
        const errorData = await res.json().catch(() => ({}));
        setError(errorData.error || "Failed to fetch experiences");
        setExperiences([]);
      }
    } catch (err) {
      setError("Error loading experiences");
      setExperiences([]);
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this experience?")) return;

    try {
      const res = await userFetch(`/api/admin/experiences/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setExperiences(experiences.filter((e) => e.id !== id));
      } else {
        alert("Failed to delete experience");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting experience");
    }
  };

  const handleTogglePublish = async (experience) => {
    try {
      const res = await userFetch(`/api/admin/experiences/${experience.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !experience.isPublished }),
      });

      if (res.ok) {
        fetchExperiences();
      } else {
        alert("Failed to update experience");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating experience");
    }
  };

  // Get category label from id
  const getCategoryLabel = (categoryId) => {
    if (!categoryId) return "Uncategorized";
    const category = EXPERIENCE_CATEGORIES.find((c) => c.id === categoryId);
    if (category) return category.label;
    // Convert snake_case to Title Case for unknown categories
    return categoryId
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Group experiences by category - dynamically handle all categories
  const groupedExperiences = (() => {
    const expsArray = Array.isArray(experiences) ? experiences : [];
    const grouped = {};

    // First add all predefined categories
    EXPERIENCE_CATEGORIES.forEach((cat) => {
      grouped[cat.id] = {
        label: cat.label,
        experiences: expsArray.filter((exp) => exp.category === cat.id),
      };
    });

    // Then add any other categories found in experiences that aren't in our predefined list
    expsArray.forEach((exp) => {
      if (exp.category && !grouped[exp.category]) {
        grouped[exp.category] = {
          label: getCategoryLabel(exp.category),
          experiences: expsArray.filter((e) => e.category === exp.category),
        };
      }
    });

    return grouped;
  })();

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Experience Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage all experiences by category
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/admin/experiences/create")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold flex items-center gap-2"
            >
              <Plus size={20} /> Create Experience
            </button>
            <button
              onClick={fetchExperiences}
              className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium flex items-center gap-2 border border-gray-300"
            >
              <RefreshCw size={18} /> Refresh
            </button>
          </div>
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

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-4">Loading experiences...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedExperiences).map(
            ([catId, { label, experiences: exps }]) => (
              <div key={catId}>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{label}</h2>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                    {exps.length}
                  </span>
                </div>

                {exps.length === 0 ? (
                  <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300 text-center">
                    <p className="text-gray-500">
                      No experiences in this category yet
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {exps.map((experience) => (
                      <div
                        key={experience.id}
                        className="bg-white rounded-lg p-5 shadow border border-gray-200 hover:border-gray-300 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                              <h3 className="text-lg font-bold text-gray-900">
                                {experience.title}
                              </h3>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  experience.isPublished
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {experience.isPublished ? "Published" : "Draft"}
                              </span>
                            </div>
                            {experience.excerpt && (
                              <p className="text-gray-600 mb-2 text-sm">
                                {experience.excerpt}
                              </p>
                            )}

                            <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                              <span>
                                By {experience.author?.email || "Admin"}
                              </span>
                              <span>•</span>
                              <span>
                                {experience.publishedAt
                                  ? new Date(
                                      experience.publishedAt
                                    ).toLocaleDateString()
                                  : new Date(
                                      experience.createdAt
                                    ).toLocaleDateString()}
                              </span>
                              {experience.tags?.length > 0 && (
                                <>
                                  <span>•</span>
                                  <span>{experience.tags.join(", ")}</span>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 ml-4 mt-2">
                            <div className="flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-600 rounded text-xs border border-emerald-200">
                              <ThumbsUp className="text-xs" size={14} />
                              <span className="font-semibold">
                                {experience.upvotes || 0}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 rounded text-xs border border-red-200">
                              <ThumbsDown className="text-xs" size={14} />
                              <span className="font-semibold">
                                {experience.downvotes || 0}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2 ml-4 flex-shrink-0">
                            <button
                              onClick={() =>
                                router.push(
                                  `/admin/experiences/edit/${experience.id}`
                                )
                              }
                              className="px-3 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 text-sm font-medium flex items-center gap-1"
                            >
                              <Edit size={14} /> Edit
                            </button>
                            <button
                              onClick={() => handleTogglePublish(experience)}
                              className={`px-3 py-2 rounded text-sm font-medium ${
                                experience.isPublished
                                  ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                                  : "bg-green-50 text-green-700 hover:bg-green-100"
                              }`}
                            >
                              {experience.isPublished ? "Unpublish" : "Publish"}
                            </button>
                            <button
                              onClick={() => handleDelete(experience.id)}
                              className="px-3 py-2 bg-red-50 text-red-700 rounded hover:bg-red-100 text-sm font-medium flex items-center gap-1"
                            >
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          )}

          {experiences.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <div className="text-6xl mb-4">🎉</div>
              <p className="text-gray-700 text-lg mb-2">No experiences yet</p>
              <p className="text-gray-500">
                Create your first experience to get started
              </p>
              <button
                onClick={() => router.push("/admin/experiences/create")}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create First Experience
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
