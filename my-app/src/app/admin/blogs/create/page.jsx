"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { userFetch } from "@/lib/userFetch";

export default function CreateBlogPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "general",
    tags: "",
    coverImage: "",
    isPublished: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };

      const res = await userFetch("/api/admin/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/admin/blogs");
      } else {
        const error = await res.json();
        alert(error.error || "Failed to create blog");
      }
    } catch (err) {
      console.error(err);
      alert("Error creating blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Create Blog Post</h1>
        <p className="text-gray-400 mt-1">Write and publish a new blog post</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            placeholder="Enter blog title"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Excerpt
          </label>
          <input
            type="text"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            placeholder="Short description"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="general">General</option>
              <option value="games">Games</option>
              <option value="events">Events</option>
              <option value="community">Community</option>
              <option value="storytelling">Storytelling</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Tags (comma separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="tag1, tag2, tag3"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Cover Image URL
          </label>
          <input
            type="url"
            name="coverImage"
            value={formData.coverImage}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Content *
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={12}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            placeholder="Write your blog content here..."
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="isPublished"
            checked={formData.isPublished}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-700 rounded focus:ring-blue-500"
          />
          <label className="ml-2 text-sm font-medium text-gray-300">
            Publish immediately
          </label>
        </div>

        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Blog"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/blogs")}
            className="px-8 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition font-semibold"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
