"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { userFetch } from "@/lib/userFetch";

export default function AdminBlogsPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await userFetch("/api/admin/blogs");
      if (res.ok) {
        const data = await res.json();
        setBlogs(data);
      } else {
        setError("Failed to fetch blogs");
      }
    } catch (err) {
      setError("Error loading blogs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    try {
      const res = await userFetch(`/api/admin/blogs/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setBlogs(blogs.filter((b) => b.id !== id));
      } else {
        alert("Failed to delete blog");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting blog");
    }
  };

  const handleTogglePublish = async (blog) => {
    try {
      const res = await userFetch(`/api/admin/blogs/${blog.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !blog.isPublished }),
      });

      if (res.ok) {
        fetchBlogs();
      } else {
        alert("Failed to update blog");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating blog");
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Blogs</h1>
          <p className="text-gray-400 mt-1">Manage blog posts</p>
        </div>
        <button
          onClick={() => router.push("/admin/blogs/create")}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          + Create Blog
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-gray-400 mt-4">Loading blogs...</p>
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-12 bg-gray-800 rounded-lg">
          <p className="text-gray-400 text-lg">No blogs yet</p>
          <button
            onClick={() => router.push("/admin/blogs/create")}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Create First Blog
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-white">
                      {blog.title}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        blog.isPublished
                          ? "bg-green-500/20 text-green-400"
                          : "bg-gray-600 text-gray-300"
                      }`}
                    >
                      {blog.isPublished ? "Published" : "Draft"}
                    </span>
                    {blog.category && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400">
                        {blog.category}
                      </span>
                    )}
                  </div>
                  {blog.excerpt && (
                    <p className="text-gray-400 mb-3">{blog.excerpt}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>By {blog.author?.email || "Admin"}</span>
                    <span>•</span>
                    <span>
                      {blog.publishedAt
                        ? new Date(blog.publishedAt).toLocaleDateString()
                        : new Date(blog.createdAt).toLocaleDateString()}
                    </span>
                    {blog.tags?.length > 0 && (
                      <>
                        <span>•</span>
                        <span>{blog.tags.join(", ")}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => router.push(`/admin/blogs/edit/${blog.id}`)}
                    className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleTogglePublish(blog)}
                    className={`px-4 py-2 rounded transition ${
                      blog.isPublished
                        ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    {blog.isPublished ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    onClick={() => handleDelete(blog.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
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
