"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogPage from "@/components/BlogPage";
import SoftWaveBackground from "@/components/SoftWaveBackground";

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
          image: blog.coverImage || null,
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
              style={{ borderBottomColor: "var(--dark-teal)" }}
            />
            <p style={{ color: "var(--black)", marginTop: "1rem" }}>
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
          <div className="text-center" style={{ color: "var(--dark-teal)" }}>
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
      <div className="px-5 md:px-12 pt-5 pb-12 relative">
        <SoftWaveBackground height="420px" className="pointer-events-none" />
        <div className="relative z-10 mt-32">
          <BlogPage blogPosts={blogPosts} />
        </div>
      </div>
      <Footer />
    </>
  );
}