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
        <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-none">
          <span className="text-gray-800">Community</span>{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--dark-teal)] to-[var(--green)]">
            Stories
          </span>
        </h1>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "80px" }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="h-2 bg-gradient-to-r from-[var(--orange)] to-[var(--pink)] rounded-full mt-4 shadow-sm"
        />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mt-8 text-xl text-gray-600 max-w-2xl mx-auto"
      >
        Insights, event highlights, and the stories behind the play.
      </motion.p>
    </div>
  );

  if (posts.length === 0) {
    return (
      <main className="mx-auto max-w-7xl px-5 md:px-12 pt-5 pb-12 bg-gradient-to-br from-[#f5f5f0] to-white min-h-screen">
        <Heading />
        <div className="text-center py-20">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-4xl">📝</span>
          </div>
          <p className="text-xl text-gray-500 font-medium">No experiences found.</p>
          <p className="text-gray-400 mt-2">Check back later for exciting stories!</p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-5 md:px-12 pt-5 pb-12 bg-gradient-to-br from-[#f5f5f0] to-white min-h-screen">
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
