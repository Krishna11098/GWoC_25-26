"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogPage from "@/components/BlogPage";

export default function CommunityBlogPage() {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch("/api/blogs");
        if (!res.ok) {
          throw new Error("Failed to fetch blogs");
        }
        const data = await res.json();

        // Transform data to match BlogPage expected format
        const transformedBlogs = data.map((blog) => ({
          id: blog.id,
          title: blog.title,
          category: blog.category,
          description: blog.excerpt || "Read more about this story...",
          image: blog.coverImage || null, // Use null instead of empty string
          href: `/blog/${blog.id}`,
          upvotes: blog.upvotes || 0,
          downvotes: blog.downvotes || 0,
        }));

        setBlogPosts(transformedBlogs);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center mt-20">
          <div className="text-center">
            <div
              className="inline-block animate-spin rounded-full h-12 w-12 border-2 border-transparent"
              style={{ borderBottomColor: "var(--color-green)" }}
            />
            <p style={{ color: "var(--color-font)", marginTop: "1rem" }}>
              Loading blogs...
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center mt-20">
          <div className="text-center text-red-600">
            <p>Error loading blogs: {error}</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="mt-20 pt-8">
        <BlogPage blogPosts={blogPosts} />
      </div>
      <Footer />
    </>
  );
}
