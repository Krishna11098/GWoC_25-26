"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import BlogCard from "@/components/BlogCard";
import BlogVoting from "@/components/BlogVoting";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function BlogDetailPage() {
  const params = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        // Fetch from public API
        const res = await fetch(`/api/blogs/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setBlog(data);
        } else {
          const errorData = await res.json();
          setError(errorData.error || "Blog not found");
        }
      } catch (err) {
        console.error(err);
        setError("Error loading blog");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [params.id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-dark-teal"></div>
            <p className="text-gray-600 mt-4">Loading story...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !blog) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-6xl xl:max-w-7xl py-10 mt-32 w-full relative">
          <div>
            <div className="rounded-3xl bg-[var(--light-pink)]/50 border border-[var(--dark-teal)]/20 px-6 py-4 text-[var(--dark-teal)]">
              <h2 className="text-xl font-bold">Error</h2>
              <p>{error || "Blog not found"}</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Convert sections to BlogCard format for rendering
  const sectionCards =
    blog.sections?.map((section, idx) => ({
      title: "", // Remove section titles
      category: "", // Remove category from sections
      description: section.text,
      image: section.image || null,
      href: "#",
    })) || [];

  // Combine section cards
  const allCards = [
    {
      title: blog.title,
      category: blog.category,
      description: blog.excerpt || blog.sections?.[0]?.text?.slice(0, 160),
      image: blog.coverImage,
      href: "#",
    },
    ...sectionCards, // Include all sections
  ];

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl xl:max-w-7xl py-10 mt-32 w-full relative">
        <div className="px-4 md:px-6">
          {/* Blog Content - Merged Cards as One Section */}
          <div
            className="rounded-3xl shadow-lg p-6 md:p-8 border-2"
            style={{
              backgroundColor: "var(--light-blue)",
              borderColor: "var(--dark-teal)",
              color: "var(--black)",
            }}
          >
            {allCards.map((card, idx) => {
              const isEven = idx % 2 === 1;
              return (
                <div key={idx} className={idx > 0 ? "mt-8 md:mt-12" : ""}>
                  <div
                    className={`flex flex-col ${
                      card.image
                        ? "md:flex-row items-start md:items-center gap-6 md:gap-10"
                        : ""
                    } ${card.image && isEven ? "md:flex-row-reverse" : ""}`}
                  >
                    {/* Image */}
                    {card.image && (
                      <div className="w-full md:w-1/2">
                        <div className="aspect-video rounded-3xl overflow-hidden bg-slate-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={card.image}
                            alt={card.title || "Blog image"}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      </div>
                    )}

                    {/* Content */}
                    <div className={card.image ? "w-full md:w-1/2" : "w-full"}>
                      {card.category && (
                        <span
                          className="inline-block rounded-full px-3 py-1 text-xs font-semibold"
                          style={{
                            border: "1px solid var(--dark-teal)",
                            backgroundColor: "var(--dark-teal)",
                            color: "white",
                          }}
                        >
                          {card.category}
                        </span>
                      )}
                      {card.title && (
                        <h3
                          className={`text-2xl md:text-3xl font-bold ${
                            card.category ? "mt-3" : ""
                          }`}
                          style={{ color: "var(--black)" }}
                        >
                          {card.title}
                        </h3>
                      )}
                      <p
                        className={`${card.title ? "mt-2" : ""} ${
                          !card.image ? "text-justify" : ""
                        }`}
                        style={{
                          color: "var(--black)",
                          lineHeight: 1.7,
                          fontSize: "1rem",
                        }}
                      >
                        {card.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Voting Section */}
        <div className="mt-8">
          <div
            style={{
              backgroundColor: "var(--light-blue)",
              border: "1px solid var(--dark-teal)",
              borderRadius: 12,
              padding: 12,
            }}
          >
            <BlogVoting
              blogId={params.id}
              initialUpvotes={blog.upvotes || 0}
              initialDownvotes={blog.downvotes || 0}
            />
          </div>
        </div>

        {/* Contact CTA Section */}
        <section
          className="mt-12 rounded-3xl p-8 md:p-12"
          style={{
            backgroundColor: "var(--light-pink)",
            border: "1px solid var(--dark-teal)",
          }}
        >
          <h2
            className="text-2xl md:text-3xl font-bold mb-6"
            style={{ color: "var(--black)" }}
          >
            Looking to host a corporate Game Night?
          </h2>

          <p className="text-lg mb-4" style={{ color: "var(--black)" }}>
            If your company is searching for:
          </p>

          <ul className="space-y-3 mb-8">
            <li
              className="flex items-start gap-3"
              style={{ color: "var(--black)" }}
            >
              <span style={{ color: "var(--dark-teal)", fontSize: "1.25rem" }}>
                📍
              </span>
              <span>
                Employee engagement activities in Mumbai, Pune, Delhi, or
                anywhere in India & abroad
              </span>
            </li>
            <li
              className="flex items-start gap-3"
              style={{ color: "var(--black)" }}
            >
              <span style={{ color: "var(--dark-teal)", fontSize: "1.25rem" }}>
                📍
              </span>
              <span>Team-building experiences</span>
            </li>
            <li
              className="flex items-start gap-3"
              style={{ color: "var(--black)" }}
            >
              <span style={{ color: "var(--dark-teal)", fontSize: "1.25rem" }}>
                📍
              </span>
              <span>Smart corporate games</span>
            </li>
            <li
              className="flex items-start gap-3"
              style={{ color: "var(--black)" }}
            >
              <span style={{ color: "var(--dark-teal)", fontSize: "1.25rem" }}>
                📍
              </span>
              <span>Large-group interactive events</span>
            </li>
            <li
              className="flex items-start gap-3"
              style={{ color: "var(--black)" }}
            >
              <span style={{ color: "var(--dark-teal)", fontSize: "1.25rem" }}>
                📍
              </span>
              <span>Unique corporate workshops</span>
            </li>
          </ul>

          <div
            className="rounded-2xl p-6"
            style={{
              border: "1px solid var(--dark-teal)",
            }}
          >
            <p
              className="mb-3 flex items-start gap-2"
              style={{ color: "var(--black)" }}
            >
              <span style={{ color: "var(--dark-teal)", fontSize: "1.25rem" }}>
                📌
              </span>
              <span>
                To book a Murder Mystery Game Night or any custom corporate
                activity, contact Joy Juncture
              </span>
            </p>
            <a
              href="mailto:joyjuncture@gmail.com"
              className="text-2xl font-bold transition"
              style={{ color: "var(--dark-teal)" }}
            >
              joyjuncture@gmail.com
            </a>
          </div>
        </section>

        {/* Navigation Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/community/blog"
            className="rounded-2xl p-6 text-white transition text-center"
            style={{ backgroundColor: "var(--dark-teal)" }}
          >
            <div className="text-3xl mb-2">←</div>
            <div className="font-bold text-lg">Back to Blog</div>
          </Link>
          <Link
            href="/"
            className="rounded-2xl p-6 text-white transition text-center"
            style={{ backgroundColor: "var(--light-pink)" }}
          >
            <div className="text-3xl mb-2">🏠</div>
            <div className="font-bold text-lg">Back to Home</div>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
