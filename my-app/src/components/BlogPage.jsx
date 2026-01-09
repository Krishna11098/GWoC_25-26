"use client";

import BlogCard from "@/components/BlogCard";

export default function BlogPage({ blogPosts }) {
  const posts = blogPosts && blogPosts.length ? blogPosts : [];

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
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Community Stories</h1>
        <p className="mt-2 text-slate-700">
          Insights, event highlights, and the stories behind the play.
        </p>
      </header>

      {/* Alternating List */}
      <div className="grid grid-cols-1 gap-6 md:gap-8">
        {posts.map((post, i) => (
          <BlogCard key={post.title + i} post={post} index={i} />
        ))}
      </div>
    </main>
  );
}
