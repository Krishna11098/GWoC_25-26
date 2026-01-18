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
    <div className="p-8" style={{ backgroundColor: "var(--bg)" }}>
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: "var(--dark-teal)" }}>
              Experience Management
            </h1>
            <p className="mt-1" style={{ color: "var(--font)" }}>
              Manage all experiences by category
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/admin/experiences/create")}
              className="px-6 py-3 text-white rounded-lg font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "var(--dark-teal)" }}
            >
              <Plus size={20} /> Create Experience
            </button>
            <button
              onClick={fetchExperiences}
              className="px-4 py-3 rounded-lg font-medium flex items-center gap-2 hover:opacity-90 transition-opacity border-2"
              style={{ backgroundColor: "var(--light-blue)", borderColor: "var(--light-blue)", color: "var(--dark-teal)" }}
            >
              <RefreshCw size={18} /> Refresh
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg border-2" style={{ backgroundColor: "#f5cfc2", borderColor: "var(--light-orange)" }}>
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              style={{ color: "var(--light-orange)" }}
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium" style={{ color: "var(--light-orange)" }}>{error}</span>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: "var(--dark-teal)" }}></div>
          <p className="mt-4" style={{ color: "var(--font)" }}>Loading experiences...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedExperiences).map(
            ([catId, { label, experiences: exps }]) => (
              <div key={catId}>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-2xl font-bold" style={{ color: "var(--dark-teal)" }}>{label}</h2>
                  <span className="px-3 py-1 rounded-full text-sm font-semibold" style={{ backgroundColor: "var(--light-blue)", color: "var(--dark-teal)" }}>
                    {exps.length}
                  </span>
                </div>

                {exps.length === 0 ? (
                  <div className="rounded-lg p-6 border-2 border-dashed text-center" style={{ backgroundColor: "#FBF1E1", borderColor: "var(--light-blue)" }}>
                    <p style={{ color: "var(--font)" }}>
                      No experiences in this category yet
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {exps.map((experience) => (
                      <div
                        key={experience.id}
                        className="rounded-lg p-5 shadow border-2 hover:border-opacity-80 transition-colors"
                        style={{ backgroundColor: "white", borderColor: "var(--light-blue)" }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                              <h3 className="text-lg font-bold" style={{ color: "var(--dark-teal)" }}>
                                {experience.title}
                              </h3>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold`}
                                style={{
                                  backgroundColor: experience.isPublished ? "var(--green)" : "var(--orange)",
                                  color: experience.isPublished ? "var(--dark-teal)" : "#5d4a04"
                                }}
                              >
                                {experience.isPublished ? "Published" : "Draft"}
                              </span>
                            </div>
                            {experience.excerpt && (
                              <p className="mb-2 text-sm" style={{ color: "var(--font)" }}>
                                {experience.excerpt}
                              </p>
                            )}

                            <div className="flex items-center gap-3 text-xs flex-wrap" style={{ color: "var(--font)" }}>
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
                            <div className="flex items-center gap-1 px-2 py-1 rounded text-xs border-2" style={{ backgroundColor: "var(--green)", borderColor: "var(--green)", color: "var(--dark-teal)" }}>
                              <ThumbsUp className="text-xs" size={14} />
                              <span className="font-semibold">
                                {experience.upvotes || 0}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 px-2 py-1 rounded text-xs border-2" style={{ backgroundColor: "var(--pink)", borderColor: "var(--light-orange)", color: "var(--light-orange)" }}>
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
                              className="px-3 py-2 rounded hover:opacity-80 text-sm font-medium flex items-center gap-1 transition-opacity"
                              style={{ backgroundColor: "var(--light-blue)", color: "var(--dark-teal)" }}
                            >
                              <Edit size={14} /> Edit
                            </button>
                            <button
                              onClick={() => handleTogglePublish(experience)}
                              className={`px-3 py-2 rounded text-sm font-medium transition-opacity hover:opacity-80`}
                              style={{
                                backgroundColor: experience.isPublished ? "var(--orange)" : "var(--green)",
                                color: experience.isPublished ? "#5d4a04" : "var(--dark-teal)"
                              }}
                            >
                              {experience.isPublished ? "Unpublish" : "Publish"}
                            </button>
                            <button
                              onClick={() => handleDelete(experience.id)}
                              className="px-3 py-2 rounded text-sm font-medium flex items-center gap-1 transition-opacity hover:opacity-80"
                              style={{ backgroundColor: "var(--pink)", color: "var(--light-orange)" }}
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
            <div className="text-center py-12 rounded-xl" style={{ backgroundColor: "#FBF1E1" }}>
              <div className="text-6xl mb-4">🎉</div>
              <p className="text-lg mb-2" style={{ color: "var(--dark-teal)" }}>No experiences yet</p>
              <p style={{ color: "var(--font)" }}>
                Create your first experience to get started
              </p>
              <button
                onClick={() => router.push("/admin/experiences/create")}
                className="mt-4 px-6 py-2 text-white rounded-lg hover:opacity-90 transition-opacity"
                style={{ backgroundColor: "var(--dark-teal)" }}
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
