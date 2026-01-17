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
    <div className="mb-16 mt-2 text-center relative">
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
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-none">
          <span>Community</span> <span className="text-dark-teal">Stories</span>
        </h1>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "80px" }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="h-2 rounded-full mt-4 shadow-sm"
          style={{ backgroundColor: "var(--dark-teal)" }}
        />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mt-8 text-xl max-w-2xl mx-auto"
        style={{ color: "var(--font)" }}
      >
        Insights, event highlights, and the stories behind the play.
      </motion.p>
    </div>
  );

  if (posts.length === 0) {
    return (
      <main
        className="mx-auto max-w-7xl px-5 md:px-12 pt-5 pb-12 min-h-screen"
        style={{ backgroundColor: "var(--bg)" }}
      >
        <Heading />
        <div className="text-center py-20">
          <div
            className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "var(--light-blue)" }}
          >
            <span className="text-4xl">📝</span>
          </div>
          <p
            className="text-xl font-medium"
            style={{ color: "var(--dark-teal)" }}
          >
            No experiences found.
          </p>
          <p className="mt-2" style={{ color: "var(--font)" }}>
            Check back later for exciting stories!
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-5 md:px-12 pt-5 pb-12 min-h-screen mt-32">
      <Heading />

      {/* Alternating List */}
      <div className="grid grid-cols-1 gap-8 md:gap-10">
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
