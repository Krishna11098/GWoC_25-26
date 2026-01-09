"use client";

import BlogCard from "@/components/BlogCard";

export default function BlogPage({ blogPosts = [], loading = false, showVotes = true }) {
  const posts = loading ? [] : blogPosts;

  if (posts.length === 0) {
    return (
      <main className="mx-auto max-w-6xl xl:max-w-7xl px-4 md:px-10 py-10">
        <header className="mb-8 md:mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Community Stories</h1>
          <p className="mt-2 text-slate-700">
            Insights, event highlights, and the stories behind the play.
          </p>
        </header>
        <div className="text-center py-12">
          <p className="text-slate-600">No experiences found.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl xl:max-w-7xl px-4 md:px-10 py-10">
      {/* Header */}
      <header className="mb-8 md:mb-10">
        <h1
          className="text-4xl md:text-5xl font-bold"
          style={{ color: "var(--color-font)" }}
        >
          Community Stories
        </h1>
        <p className="mt-2" style={{ color: "var(--color-font)" }}>
          Insights, event highlights, and the stories behind the play.
        </p>
      </header>

      {/* Alternating List */}
      <div className="grid grid-cols-1 gap-6 md:gap-8">
        {posts.map((post, i) => (
          <BlogCard key={(post.id || post.title || "post") + i} post={post} index={i} showVotes={showVotes} />
        ))}
      </div>
    </main>
  );
}
