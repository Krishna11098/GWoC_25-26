"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { userFetch } from "@/lib/userFetch";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

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
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Blog Management
            </h1>
            <p className="text-gray-600 mt-1">Manage blog posts</p>
          </div>
          <button
            onClick={() => router.push("/admin/blogs/create")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
          >
            + Create Blog
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

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-4">Loading blogs...</p>
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-gray-700 text-lg mb-2">No blogs yet</p>
          <p className="text-gray-500">
            Create your first blog post to get started
          </p>
          <button
            onClick={() => router.push("/admin/blogs/create")}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create First Blog
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white rounded-lg p-6 shadow border border-gray-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      {blog.title}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        blog.isPublished
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {blog.isPublished ? "Published" : "Draft"}
                    </span>
                    {blog.category && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                        {blog.category}
                      </span>
                    )}
                  </div>
                  {blog.excerpt && (
                    <p className="text-gray-600 mb-3">{blog.excerpt}</p>
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

                {/* Vote Counts */}
                <div className="flex items-center gap-3 mr-2 mt-6">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-200">
                    <FaThumbsUp className="text-sm" />
                    <span className="font-semibold">{blog.upvotes || 0}</span>
                    <span className="text-xs">upvotes</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg border border-red-200">
                    <FaThumbsDown className="text-sm" />
                    <span className="font-semibold">{blog.downvotes || 0}</span>
                    <span className="text-xs">downvotes</span>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => router.push(`/admin/blogs/edit/${blog.id}`)}
                    className="px-4 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleTogglePublish(blog)}
                    className={`px-4 py-2 rounded ${
                      blog.isPublished
                        ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                        : "bg-green-50 text-green-700 hover:bg-green-100"
                    }`}
                  >
                    {blog.isPublished ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    onClick={() => handleDelete(blog.id)}
                    className="px-4 py-2 bg-red-50 text-red-700 rounded hover:bg-red-100"
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
