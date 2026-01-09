"use client";

import BlogCard from "@/components/BlogCard";

export default function BlogPage({ blogPosts }) {
  const posts =
    blogPosts && blogPosts.length
      ? blogPosts
      : [
          {
            title: "Mastering the Mehfil: A Guide to Social Play",
            category: "Game Strategy",
            description:
              "Learn how to facilitate the perfect circle of conversation with our cultural card game.",
            image: "/images/blog-mehfil.jpg",
            href: "/experiences/blog/mastering-mehfil",
          },
          {
            title: "Saturday Night Showdown Recap",
            category: "Event Highlight",
            description:
              "See the best moments from our last live event at the downtown game zone.",
            image: "/images/blog-event.jpg",
            href: "/experiences/blog/saturday-showdown",
          },
        ];

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
          <BlogCard key={post.title + i} post={post} index={i} />
        ))}
      </div>
    </main>
  );
}
