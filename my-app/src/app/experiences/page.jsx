"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";

// Fixed categories from admin/create form
const CATEGORIES = [
  {
    id: "private_birthdays",
    label: "Private Birthdays",
    icon: "🎂",
    colorVar: "--color-pink",
  },
  {
    id: "corporate_events",
    label: "Corporate Events",
    icon: "🏢",
    colorVar: "--color-green",
  },
  {
    id: "monthly_kits",
    label: "Monthly Kits",
    icon: "📦",
    colorVar: "--color-orange",
  },
  { id: "carnivals", label: "Carnivals", icon: "🎡", colorVar: "--color-pink" },
  { id: "weddings", label: "Weddings", icon: "💍", colorVar: "--color-green" },
  { id: "workshops", label: "Workshops", icon: "🎓", colorVar: "--color-blue" },
];

export default function ExperiencesLanding() {
  const sliderRef = useRef(null);
  const [heroEvents] = useState([]);

  return (
    <>
      <Navbar />
      <main className="px-5 md:px-12 pt-5 pb-12 mt-32">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-10">
          {/* Hero Heading Section */}
          <div className="mb-16">
            <div className="mb-10 mt-2 text-center relative">
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
                <h1 className="text-5xl md:text-7xl font-winky-rough tracking-tight leading-none">
                  <span className="text-black/80">Our</span>{" "}
                  <span className="relative inline-block text-font drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                    Experiences
                  </span>
                </h1>
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "60px" }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="h-1.5 bg-font rounded-full mt-4 shadow-sm"
                />
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="mt-6 text-sm md:text-base text-gray-600"
              >
                Curated live experiences, games and engagement formats.
              </motion.p>
            </div>
          </div>

          {/* Themes Section */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2
                className="text-3xl md:text-4xl font-bold"
                style={{ color: "var(--color-font)" }}
              >
                Explore by Theme
              </h2>
              <Link
                href="/experiences/events"
                className="font-semibold text-lg hover:opacity-75 transition"
              >
                See all &gt;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {CATEGORIES.map((c) => (
                <Link
                  key={c.id}
                  href={`/experiences/events?category=${c.id}`}
                  className="w-full p-5 rounded-3xl border shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition duration-200 flex items-start gap-4 h-26"
                  style={{
                    backgroundColor: "var(--bg)",
                    borderColor: "rgba(0,0,0,0.06)",
                  }}
                >
                  <div
                    style={{ backgroundColor: `var(${c.colorVar})` }}
                    className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-sm"
                  >
                    {c.icon}
                  </div>
                  <div className="flex flex-col">
                    <span
                      className="font-semibold text-lg"
                      style={{ color: "var(--color-font)" }}
                    >
                      {c.label}
                    </span>
                    <span
                      className="text-sm mt-1"
                      style={{ color: "var(--color-font)" }}
                    >
                      Explore {c.label.toLowerCase()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Section for Custom Experiences */}
          <div className="mb-16">
            <div
              className="rounded-3xl border shadow-lg p-8 md:p-12"
              style={{
                backgroundColor: "var(--green)",
                borderColor: "var(--font)",
              }}
            >
              <div className="flex items-start gap-4 mb-6">
                <div
                  className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm"
                  style={{
                    backgroundColor: "var(--orange)",
                  }}
                >
                  ✨
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-extrabold">
                    Want to Create Custom Experiences?
                  </h2>
                  <p className="mt-2 text-lg">
                    Personalized, beautiful moments tailored to your vision with
                    JoyJuncture.
                  </p>
                </div>
              </div>

              <p className="mb-8 leading-relaxed text-base">
                Whether it's a private celebration, corporate team-building,
                wedding, or a unique gathering, our expert team designs
                unforgettable moments. Contact us to bring your vision to life
                with our curated experiences, games, and entertainment.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="mailto:contact@joyjuncture.com"
                  className="px-7 py-3 text-white rounded-full hover:opacity-90 font-semibold transition-all duration-300 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg text-center"
                  style={{ backgroundColor: "var(--font)" }}
                >
                  📧 Email Us
                </a>
                <a
                  href="tel:+91-XXXXXXXXXX"
                  className="px-7 py-3 text-white rounded-full hover:opacity-90 font-semibold transition-all duration-300 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg text-center"
                  style={{ backgroundColor: "var(--font)" }}
                >
                  📞 Call Us
                </a>
                <a
                  href="/contact"
                  className="px-7 py-3 text-white rounded-full hover:opacity-90 font-semibold transition-all duration-300 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg text-center"
                  style={{ backgroundColor: "var(--font)" }}
                >
                  💬 Get In Touch
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
