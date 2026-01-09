"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogPage from "@/components/BlogPage";
import EVENTS from "@/data/events";

export default function EventsPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams ? searchParams.get("category") : null;

  // map category ids (from chips) to human labels used on events
  const CATEGORY_LABELS = {
    private_birthdays: "Private Birthdays",
    corporate_events: "Corporate Events",
    monthly_kits: "Monthly Kits",
    carnivals: "Carnivals",
    weddings: "Weddings",
  };

  const selectedLabel = categoryParam ? CATEGORY_LABELS[categoryParam] : null;

  const source = EVENTS;
  const filtered = selectedLabel
    ? source.filter((e) => e.category.toLowerCase().includes(selectedLabel.toLowerCase()))
    : source;

  // Map events to blog post shape expected by BlogPage
  const blogPosts = filtered.map((e) => ({
    id: e.id,
    title: e.title,
    category: e.category,
    description: e.description,
    image: e.image,
    href: e.href,
    upvotes: e.upvotes,
    downvotes: e.downvotes,
  }));

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
