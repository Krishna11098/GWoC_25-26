"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
      <div className="px-5 md:px-12 pt-5 pb-12 mt-32">
        {/*<div className="mx-auto w-full max-w-6xl px-4 md:px-10">
          <div className="mb-10 mt-2 text-center relative">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
                type: "spring",
                stiffness: 100,
                damping: 15,
              }}
              className="inline-flex flex-col items-center gap-2"
            >
              <h1 className="text-5xl md:text-7xl font-winky-rough tracking-tight leading-none">
                <span className="text-black/80">Community</span>{" "}
                <span className="relative inline-block text-font drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                  Blogs
                </span>
              </h1>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "60px" }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="h-1.5 bg-font rounded-full mt-4 shadow-sm"
              />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-6 text-sm md:text-base text-gray-600"
            >
              Discover stories and insights from our amazing community.
            </motion.p>
          </div>
        </div>*/}
        <BlogPage blogPosts={blogPosts} />
      </div>
      <Footer />
    </>
  );
}
