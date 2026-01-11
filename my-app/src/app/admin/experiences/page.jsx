// /app/admin/experiences/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { userFetch } from "@/lib/userFetch";
import { ThumbsUp, ThumbsDown, Plus, RefreshCw, Trash2, Edit, CheckCircle2, AlertCircle } from "lucide-react";

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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--font)]">Experiences</h1>
          <p className="text-[var(--font)] mt-1">Manage all experiences by category</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/admin/experiences/create")}
            className="px-6 py-3 bg-[var(--orange)] text-[var(--font)] rounded-lg font-semibold flex items-center gap-2"
          >
            <Plus size={20} /> Create Experience
          </button>
          <button
            onClick={fetchExperiences}
            className="px-4 py-3 bg-[var(--bg)] text-[var(--font)] rounded-lg font-medium flex items-center gap-2"
          >
            <RefreshCw size={18} /> Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-[var(--pink)]/20 border border-[var(--pink)] text-[var(--font)] px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--orange)]"></div>
          <p className="text-[var(--font)] mt-4">Loading experiences...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedExperiences).map(([catId, { label, experiences: exps }]) => (
            <div key={catId}>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-2xl font-bold text-[var(--font)]">{label}</h2>
                <span className="px-3 py-1 bg-[var(--orange)]/30 text-[var(--font)] rounded-full text-sm font-semibold">
                  {exps.length}
                </span>
              </div>

              {exps.length === 0 ? (
                <div className="bg-[var(--bg)] rounded-lg p-6 border-2 border-dashed border-[var(--green)]/30 text-center">
                  <p className="text-[var(--font)]/60">No experiences in this category yet</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {exps.map((experience) => (
                    <div
                      key={experience.id}
                      className="bg-[var(--bg)] rounded-lg p-5 border-2 border-[var(--green)]/50 hover:border-[var(--green)] transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h3 className="text-lg font-bold text-[var(--font)]">{experience.title}</h3>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                experience.isPublished
                                  ? "bg-[var(--green)]/40 text-[var(--font)]"
                                  : "bg-[var(--pink)]/30 text-[var(--font)]"
                              }`}
                            >
                              {experience.isPublished ? "Published" : "Draft"}
                            </span>
                          </div>
                          {experience.excerpt && (
                            <p className="text-[var(--font)]/70 mb-2 text-sm">{experience.excerpt}</p>
                          )}

                          <div className="flex items-center gap-3 text-xs text-[var(--font)]/60 flex-wrap">
                            <span>By {experience.author?.email || "Admin"}</span>
                            <span>•</span>
                            <span>
                              {experience.publishedAt
                                ? new Date(experience.publishedAt).toLocaleDateString()
                                : new Date(experience.createdAt).toLocaleDateString()}
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
                          <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs">
                            <ThumbsUp className="text-xs" size={14} />
                            <span className="font-semibold">{experience.upvotes || 0}</span>
                          </div>
                          <div className="flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">
                            <ThumbsDown className="text-xs" size={14} />
                            <span className="font-semibold">{experience.downvotes || 0}</span>
                          </div>
                        </div>

                        <div className="flex gap-2 ml-4 flex-shrink-0">
                          <button
                            onClick={() => router.push(`/admin/experiences/edit/${experience.id}`)}
                            className="px-3 py-2 bg-[var(--green)] text-[var(--font)] rounded text-sm font-medium hover:opacity-80 flex items-center gap-1"
                          >
                            <Edit size={14} /> Edit
                          </button>
                          <button
                            onClick={() => handleTogglePublish(experience)}
                            className={`px-3 py-2 rounded text-sm font-medium ${
                              experience.isPublished
                                ? "bg-[var(--orange)] text-[var(--font)] hover:opacity-80"
                                : "bg-[var(--green)] text-[var(--font)] hover:opacity-80"
                            }`}
                          >
                            {experience.isPublished ? "Unpublish" : "Publish"}
                          </button>
                          <button
                            onClick={() => handleDelete(experience.id)}
                            className="px-3 py-2 bg-[var(--pink)] text-[var(--font)] rounded text-sm font-medium hover:opacity-80 flex items-center gap-1"
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
          ))}

          {experiences.length === 0 && (
            <div className="text-center py-12 bg-[var(--green)]/30 rounded-lg">
              <p className="text-[var(--font)] text-lg">No experiences yet</p>
              <button
                onClick={() => router.push("/admin/experiences/create")}
                className="mt-4 px-6 py-2 bg-[var(--orange)] text-[var(--font)] rounded-lg"
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
