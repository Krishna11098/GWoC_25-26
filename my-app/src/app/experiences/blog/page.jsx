"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogPage from "@/components/BlogPage";

export default function ExperiencesBlogPage() {
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
          title: blog.title,
          category: blog.category,
          description: blog.excerpt || "Read more about this story...",
          image: blog.coverImage || null,
          href: `/blog/${blog.id}`,
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
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            <p className="text-slate-600 mt-4">Loading blogs...</p>
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
