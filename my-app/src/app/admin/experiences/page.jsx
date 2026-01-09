// /app/admin/experiences/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { userFetch } from "@/lib/userFetch";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

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
      const res = await userFetch("/api/admin/experiences");
      if (res.ok) {
        const data = await res.json();
        setExperiences(data.filter((e) => e.isPublished));
      } else {
        setError("Failed to fetch experiences");
      }
    } catch (err) {
      setError("Error loading experiences");
      console.error(err);
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

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--font)]">Experiences</h1>
          <p className="text-[var(--font)] mt-1">Published experiences</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/admin/experiences/create")}
            className="px-6 py-3 bg-[var(--orange)] text-[var(--font)] rounded-lg font-semibold"
          >
            + Create Experience
          </button>
          <button
            onClick={fetchExperiences}
            className="px-4 py-3 bg-[var(--bg)] text-[var(--font)] rounded-lg font-medium"
          >
            Refresh
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
          <p className="text-[var(--font)] mt-4">Loading posts...</p>
        </div>
      ) : experiences.length === 0 ? (
        <div className="text-center py-12 bg-[var(--green)]/30 rounded-lg">
          <p className="text-[var(--font)] text-lg">No published experiences yet</p>
          <button
            onClick={() => router.push("/admin/experiences/create")}
            className="mt-4 px-6 py-2 bg-[var(--orange)] text-[var(--font)] rounded-lg"
          >
            Create First Experience
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {experiences.map((experience) => (
            <div
              key={experience.id}
              className="bg-[var(--bg)] rounded-lg p-6 border-2 border-[var(--green)]"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-[var(--font)]">{experience.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${experience.isPublished ? "bg-[var(--green)]/40 text-[var(--font)]" : "bg-[var(--pink)]/30 text-[var(--font)]"}`}>
                      {experience.isPublished ? "Published" : "Draft"}
                    </span>
                    {experience.category && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[var(--orange)]/30 text-[var(--font)]">
                        {experience.category}
                      </span>
                    )}
                  </div>
                  {experience.excerpt && <p className="text-[var(--font)]/70 mb-3">{experience.excerpt}</p>}

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>By {experience.author?.email || "Admin"}</span>
                    <span>•</span>
                    <span>{experience.publishedAt ? new Date(experience.publishedAt).toLocaleDateString() : new Date(experience.createdAt).toLocaleDateString()}</span>
                    {experience.tags?.length > 0 && (
                      <>
                        <span>•</span>
                        <span>{experience.tags.join(", ")}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 mr-2 mt-6">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg">
                    <FaThumbsUp className="text-sm" />
                    <span className="font-semibold">{experience.upvotes || 0}</span>
                    <span className="text-xs">upvotes</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg">
                    <FaThumbsDown className="text-sm" />
                    <span className="font-semibold">{experience.downvotes || 0}</span>
                    <span className="text-xs">downvotes</span>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => router.push(`/admin/experiences/edit/${experience.id}`)}
                    className="px-4 py-2 bg-[var(--green)] text-[var(--font)] rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleTogglePublish(experience)}
                    className={`px-4 py-2 rounded ${experience.isPublished ? "bg-[var(--orange)] text-[var(--font)]" : "bg-[var(--green)] text-[var(--font)]"}`}
                  >
                    {experience.isPublished ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    onClick={() => handleDelete(experience.id)}
                    className="px-4 py-2 bg-[var(--pink)] text-[var(--font)] rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
