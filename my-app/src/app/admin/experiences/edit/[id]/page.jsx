/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { userFetch } from "@/lib/userFetch";
import BlogCard from "@/components/BlogCard";

const EXPERIENCE_CATEGORIES = [
  { id: "private_birthdays", label: "Private Birthdays" },
  { id: "corporate_events", label: "Corporate Events" },
  { id: "monthly_kits", label: "Monthly Kits" },
  { id: "carnivals", label: "Carnivals" },
  { id: "weddings", label: "Weddings" },
];

export default function EditExperiencePage() {
  const router = useRouter();
  const params = useParams();
  const experienceId = params.id;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    category: EXPERIENCE_CATEGORIES[0].id,
    tags: "",
    coverImage: "",
    isPublished: false,
    sections: [{ text: "", image: "" }],
  });

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetchExperience();
  }, [experienceId]);

  const fetchExperience = async () => {
    try {
      setLoading(true);
      const res = await userFetch(`/api/admin/experiences/${experienceId}`);
      if (res.ok) {
        const data = await res.json();
        setFormData({
          title: data.title || "",
          excerpt: data.excerpt || "",
          category: data.category || EXPERIENCE_CATEGORIES[0].id,
          tags: data.tags?.join(", ") || "",
          coverImage: data.coverImage || "",
          isPublished: data.isPublished || false,
          sections: data.sections || [{ text: "", image: "" }],
        });
      } else {
        setError("Failed to load experience");
      }
    } catch (err) {
      setError("Error loading experience");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleHeaderChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
  };

  const handleSectionChange = (index, field, value) => {
    const newSections = [...formData.sections];
    newSections[index] = { ...newSections[index], [field]: value };
    setFormData((prev) => ({ ...prev, sections: newSections }));
    setError("");
  };

  const addSection = () => {
    setFormData((prev) => ({
      ...prev,
      sections: [...prev.sections, { text: "", image: "" }],
    }));
  };

  const removeSection = (index) => {
    if (formData.sections.length > 1) {
      setFormData((prev) => ({
        ...prev,
        sections: prev.sections.filter((_, i) => i !== index),
      }));
    }
  };

  const handleCoverImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const form = new FormData();
      form.append("images", file);

      const res = await userFetch("/api/admin/upload", {
        method: "POST",
        body: form,
      });

      if (res.ok) {
        const data = await res.json();
        const imageUrl = data.images[0].url;
        setFormData((prev) => ({ ...prev, coverImage: imageUrl }));
        setUploading(false);
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Failed to upload image");
        setUploading(false);
      }
    } catch (err) {
      console.error(err);
      setError("Error uploading image");
      setUploading(false);
    }
  };

  const handleSectionImageUpload = async (index, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formDataUpload = new FormData();
      formDataUpload.append("images", file);

      const res = await userFetch("/api/admin/upload", {
        method: "POST",
        body: formDataUpload,
      });

      if (res.ok) {
        const data = await res.json();
        const imageUrl = data.images[0].url;
        handleSectionChange(index, "image", imageUrl);
        setUploading(false);
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Failed to upload image");
        setUploading(false);
      }
    } catch (err) {
      console.error(err);
      setError("Error uploading image");
      setUploading(false);
    }
  };

  const previewPost = useMemo(() => {
    const firstSection = formData.sections[0];
    const desc =
      formData.excerpt?.trim() ||
      (firstSection?.text
        ? `${firstSection.text.slice(0, 160)}${
            firstSection.text.length > 160 ? "…" : ""
          }`
        : "Build sections below to preview.");

    const categoryLabel =
      EXPERIENCE_CATEGORIES.find((c) => c.id === formData.category)?.label ||
      formData.category;

    return {
      title: formData.title || "Untitled Experience",
      category: categoryLabel,
      description: desc,
      image:
        formData.coverImage ||
        "https://via.placeholder.com/800x450?text=Experience+Image",
      href: "#",
    };
  }, [formData]);

  const handleSubmit = async (publish = false) => {
    setError("");
    setSubmitting(true);

    if (!formData.title) {
      setError("Title is required");
      setSubmitting(false);
      return;
    }
    if (!formData.coverImage) {
      setError("Cover image is mandatory");
      setSubmitting(false);
      return;
    }
    if (formData.sections.length === 0) {
      setError("Add at least one section");
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        title: formData.title,
        excerpt: formData.excerpt,
        category: formData.category,
        coverImage: formData.coverImage,
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        sections: formData.sections.filter((s) => s.text.trim()),
        isPublished: publish,
      };

      const res = await userFetch(`/api/admin/experiences/${experienceId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const successMsg = publish
          ? "Experience updated and published!"
          : "Experience updated as draft!";
        alert(successMsg);
        router.push("/admin/experiences");
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Failed to update experience");
      }
    } catch (err) {
      console.error(err);
      setError("Error updating experience");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveDraft = () => handleSubmit(false);
  const handlePublish = () => handleSubmit(true);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
          <p className="text-slate-700 font-medium">Loading experience...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 md:px-10 py-10">
      <header className="mb-8 md:mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
          Edit Experience
        </h1>
        <p className="mt-2 text-slate-700">Update this experience.</p>
      </header>

      {error && (
        <div className="mb-6 rounded-2xl bg-red-100 border border-red-300 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-3xl bg-white/90 border border-slate-200 shadow-sm p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-4">
              Experience Header
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleHeaderChange}
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400"
                  placeholder="Enter experience title"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Cover Image *
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    name="coverImage"
                    value={formData.coverImage || ""}
                    onChange={handleHeaderChange}
                    className="flex-1 px-4 py-3 rounded-2xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400"
                    placeholder="https://example.com/image.jpg"
                  />
                  <label className="cursor-pointer flex-shrink-0">
                    <div className="px-4 py-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-700 hover:bg-emerald-100 transition text-sm font-medium whitespace-nowrap">
                      {uploading ? "⏳" : "📁"}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverImageUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                </div>
                {formData.coverImage && (
                  <div className="mt-3 rounded-2xl overflow-hidden border border-slate-200">
                    <img
                      src={formData.coverImage}
                      alt="Cover preview"
                      className="w-full h-40 object-cover"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Excerpt
                </label>
                <input
                  type="text"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleHeaderChange}
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400"
                  placeholder="Short description (or use first section text)"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleHeaderChange}
                    className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400"
                  >
                    {EXPERIENCE_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleHeaderChange}
                    className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400"
                    placeholder="tag1, tag2, tag3"
                  />
                </div>
              </div>

              <div className="flex items-center pt-2">
                <input
                  id="publish"
                  type="checkbox"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleHeaderChange}
                  className="w-4 h-4 text-emerald-600 bg-white border-slate-300 rounded focus:ring-emerald-500"
                />
                <label
                  htmlFor="publish"
                  className="ml-2 text-sm font-medium text-slate-700"
                >
                  Publish immediately
                </label>
              </div>
            </form>
          </section>

          <div>
            <div className="mb-4">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                Experience Sections
              </h2>
            </div>

            <div className="space-y-4">
              {formData.sections.map((section, index) => (
                <section
                  key={index}
                  className="rounded-3xl bg-white/90 border border-slate-200 shadow-sm p-4 md:p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-900">
                      Section {index + 1}
                    </h3>
                    <button
                      type="button"
                      onClick={() => removeSection(index)}
                      disabled={formData.sections.length === 1}
                      className="px-3 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Section Text *
                      </label>
                      <textarea
                        value={section.text}
                        onChange={(e) =>
                          handleSectionChange(index, "text", e.target.value)
                        }
                        rows={6}
                        className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400"
                        placeholder="Write section content..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Section Image (optional)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="url"
                          value={section.image || ""}
                          onChange={(e) =>
                            handleSectionChange(index, "image", e.target.value)
                          }
                          className="flex-1 px-4 py-3 rounded-2xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400"
                          placeholder="https://example.com/section-image.jpg"
                        />
                        <label className="cursor-pointer flex-shrink-0">
                          <div className="px-4 py-3 rounded-2xl bg-slate-100 border border-slate-300 text-slate-700 hover:bg-slate-200 transition text-sm font-medium">
                            {uploading ? "⏳" : "📁"}
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleSectionImageUpload(index, e)
                            }
                            disabled={uploading}
                            className="hidden"
                          />
                        </label>
                      </div>
                      {section.image && (
                        <div className="mt-3 rounded-2xl overflow-hidden border border-slate-200">
                          <img
                            src={section.image}
                            alt="Section preview"
                            className="w-full h-32 object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              ))}

              <button
                type="button"
                onClick={addSection}
                className="w-full px-4 py-3 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700 transition font-semibold text-sm"
              >
                + Add Section
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-4">
            <div className="rounded-3xl bg-white/90 border border-slate-200 shadow-sm p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-6">
                Actions
              </h2>
              <div className="space-y-3">
                <button
                  onClick={handleSaveDraft}
                  disabled={submitting || uploading}
                  className="w-full px-6 py-4 rounded-2xl bg-slate-100 border border-slate-300 text-slate-900 font-semibold hover:bg-slate-200 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <span>💾</span>
                  <span>{submitting ? "Saving..." : "Save Draft"}</span>
                </button>

                <button
                  onClick={handlePublish}
                  disabled={submitting || uploading}
                  className="w-full px-6 py-4 rounded-2xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <span>🚀</span>
                  <span>
                    {submitting
                      ? "Publishing..."
                      : "Update & Publish Experience"}
                  </span>
                </button>

                <button
                  onClick={() => router.push("/admin/experiences")}
                  disabled={submitting}
                  className="w-full px-6 py-4 rounded-2xl bg-slate-200 border border-slate-300 text-slate-900 font-semibold hover:bg-slate-300 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <span>↩️</span>
                  <span>Cancel</span>
                </button>
              </div>
            </div>

            <div className="rounded-3xl bg-slate-50 border border-slate-200 p-4">
              <h3 className="font-semibold text-slate-900 mb-2 text-sm">
                📝 Quick Guide
              </h3>
              <ul className="text-xs text-slate-600 space-y-1">
                <li>• <strong>Save Draft:</strong> Save without publishing</li>
                <li>• <strong>Publish:</strong> Make updates live on site</li>
              </ul>
            </div>

            <div className="rounded-3xl bg-emerald-50 border border-emerald-200 p-4">
              <p className="text-xs text-emerald-700">
                <strong>Status:</strong> {formData.isPublished ? "Published" : "Draft"}
              </p>
              <p className="text-xs text-emerald-600 mt-1">
                <strong>Sections:</strong> {formData.sections.length}
              </p>
              <p className="text-xs text-emerald-600 mt-1">
                <strong>Category:</strong>{" "}
                {
                  EXPERIENCE_CATEGORIES.find(
                    (c) => c.id === formData.category
                  )?.label
                }
              </p>
            </div>

            <div className="rounded-3xl bg-white/90 border border-slate-200 shadow-sm p-4">
              <div className="mb-3">
                <h3 className="text-lg font-bold text-slate-900">
                  Live Preview
                </h3>
                <p className="text-xs text-slate-600">
                  How your experience card will appear
                </p>
              </div>
              <BlogCard post={previewPost} index={0} />
            </div>
          </div>
        </div>
      </div>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed right-6 bottom-6 p-4 rounded-full bg-emerald-600 text-white shadow-lg hover:bg-emerald-700 transition-all duration-300 hover:scale-110 z-50"
          aria-label="Scroll to top"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3-3m0 0l3 3m-3-3v12"
            />
          </svg>
        </button>
      )}
    </main>
  );
}
