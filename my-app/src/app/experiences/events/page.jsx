"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogPage from "@/components/BlogPage";
import { CATEGORY_MAPPING } from "@/config/categories";

export default function EventsPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams ? searchParams.get("category") : null;
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const res = await fetch("/api/experiences");
        if (res.ok) {
          const data = await res.json();
          setExperiences(data);
        }
      } catch (err) {
        console.error("Error fetching experiences:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  // Map selected category param to event data category
  const selectedLabel = categoryParam ? CATEGORY_MAPPING[categoryParam] : null;

  // Filter experiences by selected category
  const filtered = selectedLabel
    ? experiences.filter((e) => e.category.toLowerCase().includes(selectedLabel.toLowerCase()))
    : experiences;

  // Map experiences to blog post shape expected by BlogPage
  const blogPosts = filtered.map((e) => ({
    id: e.id,
    title: e.title,
    category: e.category,
    description: e.description || e.excerpt || "",
    image: e.coverImage || "",
    href: e.href || `/experiences/events/${e.id}`,
    upvotes: e.upvotes || 0,
    downvotes: e.downvotes || 0,
  }));

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="mt-20 pt-8 text-center">Loading experiences...</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="mt-20 pt-8">
        <BlogPage blogPosts={blogPosts} />
      </div>
      <Footer />
    </>
  );
}
