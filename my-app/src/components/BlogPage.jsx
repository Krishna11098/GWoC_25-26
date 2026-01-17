"use client";

import { motion } from "framer-motion";
import BlogCard from "@/components/BlogCard";

export default function BlogPage({
  blogPosts = [],
  loading = false,
  showVotes = true,
}) {
  const posts = loading ? [] : blogPosts;

  const Heading = () => (
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
          <span
            className="relative inline-block drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
            style={{ color: "var(--black)" }}
          >
            Stories
          </span>
        </h1>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "60px" }}
          transition={{ delay: 0.6, duration: 0.8 }}
          style={{ backgroundColor: "var(--dark-teal)" }}
          className="h-1.5 rounded-full mt-4 shadow-sm"
        />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.6 }}
        style={{ color: "var(--black)" }}
        className="mt-6 text-sm md:text-base"
      >
        Insights, event highlights, and the stories behind the play.
      </motion.p>
    </div>
  );

  if (posts.length === 0) {
    return (
      <main className="mx-auto max-w-6xl xl:max-w-7xl px-5 md:px-12 pt-5 pb-12">
        <Heading />
        <div className="text-center py-12">
          <p style={{ color: "var(--black)" }}>No experiences found.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl xl:max-w-7xl px-5 md:px-12 pt-5 pb-12">
      <Heading />

      {/* Alternating List */}
      <div className="grid grid-cols-1 gap-6 md:gap-8">
        {posts.map((post, i) => (
          <BlogCard
            key={(post.id || post.title || "post") + i}
            post={post}
            index={i}
            showVotes={showVotes}
          />
        ))}
      </div>
    </main>
  );
}
