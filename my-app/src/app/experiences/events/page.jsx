"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogPage from "@/components/BlogPage";

export default function EventsPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams ? searchParams.get("category") : null;
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch published experiences from public backend endpoint
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const res = await fetch("/api/experiences" + (categoryParam ? `?category=${encodeURIComponent(categoryParam)}` : ""));
        if (!res.ok) throw new Error("Failed to load experiences");
        const data = await res.json();
        const expsArray = data?.experiences || data || [];
        const published = Array.isArray(expsArray)
          ? expsArray.filter((exp) => exp.isPublished)
          : [];
        setExperiences(published);
      } catch (err) {
        console.error("Failed to fetch experiences:", err);
        setExperiences([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, [categoryParam]);

  const filtered = categoryParam
    ? experiences.filter((e) => (e.category || "").toLowerCase() === categoryParam.toLowerCase())
    : experiences;

  // Map events to blog post shape expected by BlogPage
  const blogPosts = filtered.map((e) => ({
    id: e.id,
    title: e.title,
    category: e.category,
    description: e.excerpt || e.description || "",
    image: e.coverImage || e.image || "",
    href: `/experiences/events/${e.id}`,
  }));

  return (
    <>
      <Navbar />
      <div className="mt-20 pt-8">
        <BlogPage blogPosts={blogPosts} loading={loading} showVotes={false} />
      </div>
      <Footer />
    </>
  );
}
