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
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            <p className="text-slate-600 mt-4">Loading story...</p>
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
        <main className="mx-auto max-w-6xl xl:max-w-7xl px-4 md:px-10 py-10">
          <div className="rounded-3xl bg-red-100 border border-red-300 px-6 py-4 text-red-700">
            <h2 className="text-xl font-bold">Error</h2>
            <p>{error || "Blog not found"}</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Convert sections to BlogCard format for rendering
  const sectionCards = blog.sections?.map((section, idx) => ({
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
      <main className="mx-auto max-w-6xl xl:max-w-7xl px-4 md:px-10 py-10 mt-20 pt-16">
        {/* Header */}
        <header className="mb-8 md:mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">{blog.title}</h1>
          <div className="mt-4 flex items-center gap-4 text-sm text-slate-600">
            <span className="inline-block rounded-full border border-emerald-300 bg-emerald-100 px-3 py-1 font-semibold text-emerald-700">
              {blog.category}
            </span>
            {blog.publishedAt && (
              <time>
                {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            )}
          </div>
        </header>

        {/* Blog Content - Merged Cards as One Section */}
        <div className="rounded-3xl bg-white/90 border border-slate-200 shadow-sm p-6 md:p-8">
          {allCards.map((card, idx) => {
            const isEven = idx % 2 === 1;
            return (
              <div key={idx} className={idx > 0 ? "mt-8 md:mt-12" : ""}>
                <div
                  className={`flex flex-col ${card.image ? 'md:flex-row items-start md:items-center gap-6 md:gap-10' : ''} ${
                    card.image && isEven ? "md:flex-row-reverse" : ""
                  }`}
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
                      <span className="inline-block rounded-full border border-emerald-300 bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                        {card.category}
                      </span>
                    )}
                    {card.title && (
                      <h3 className={`text-2xl md:text-3xl font-bold text-slate-900 ${card.category ? 'mt-3' : ''}`}>
                        {card.title}
                      </h3>
                    )}
                    <p className={`text-slate-700 leading-relaxed text-base md:text-lg ${card.title ? 'mt-2' : ''} ${!card.image ? 'text-justify' : ''}`}>
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Voting Section */}
        <div className="mt-8">
          <BlogVoting 
            blogId={params.id} 
            initialUpvotes={blog.upvotes || 0}
            initialDownvotes={blog.downvotes || 0}
          />
        </div>

        {/* Contact CTA Section */}
        <section className="mt-12 rounded-3xl bg-white border border-slate-200 p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">Looking to host a corporate Game Night?</h2>
          
          <p className="text-slate-700 text-lg mb-4">If your company is searching for:</p>
          
          <ul className="space-y-3 mb-8">
            <li className="flex items-start gap-3 text-slate-700">
              <span className="text-pink-500 text-xl">📍</span>
              <span>Employee engagement activities in Mumbai, Pune, Delhi, or anywhere in India & abroad</span>
            </li>
            <li className="flex items-start gap-3 text-slate-700">
              <span className="text-pink-500 text-xl">📍</span>
              <span>Team-building experiences</span>
            </li>
            <li className="flex items-start gap-3 text-slate-700">
              <span className="text-pink-500 text-xl">📍</span>
              <span>Smart corporate games</span>
            </li>
            <li className="flex items-start gap-3 text-slate-700">
              <span className="text-pink-500 text-xl">📍</span>
              <span>Large-group interactive events</span>
            </li>
            <li className="flex items-start gap-3 text-slate-700">
              <span className="text-pink-500 text-xl">📍</span>
              <span>Unique corporate workshops</span>
            </li>
          </ul>

          <div className="rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-6">
            <p className="text-slate-700 mb-3 flex items-start gap-2">
              <span className="text-pink-500 text-xl">📌</span>
              <span>To book a Murder Mystery Game Night or any custom corporate activity, contact Joy Juncture</span>
            </p>
            <a 
              href="mailto:joyjuncture@gmail.com" 
              className="text-2xl font-bold text-emerald-600 hover:text-emerald-700 transition"
            >
              joyjuncture@gmail.com
            </a>
          </div>
        </section>

        {/* Navigation Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/community/blog"
            className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 p-6 text-white hover:from-emerald-600 hover:to-teal-600 transition text-center"
          >
            <div className="text-3xl mb-2">←</div>
            <div className="font-bold text-lg">Back to Blog</div>
          </Link>
          <Link
            href="/"
            className="rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 p-6 text-white hover:from-blue-600 hover:to-indigo-600 transition text-center"
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
