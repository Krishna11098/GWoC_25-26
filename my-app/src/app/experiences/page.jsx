"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
      <main className="mt-20">
        {/* Hero */}
        <section className="py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1
                  className="text-3xl sm:text-4xl md:text-5xl font-extrabold"
                  style={{ color: "var(--color-font)" }}
                >
                  Experiences
                </h1>
                <p
                  className="mt-2 text-sm sm:text-base"
                  style={{ color: "var(--color-font)" }}
                >
                  Curated live experiences, games and engagement formats.
                </p>
              </div>
              {/* right-side CTA removed; See All Events moved to Themes section */}
            </div>
            <div className="overflow-x-auto no-scrollbar py-6">
              <div
                ref={sliderRef}
                className="flex gap-6 items-stretch snap-x snap-mandatory px-2"
              >
                {heroEvents.map((ev, i) => (
                  <div
                    key={ev.id}
                    className="snap-center flex-shrink-0 w-[86%] sm:min-w-[320px] sm:max-w-[380px]"
                  >
                    <BlogCard post={{ ...ev }} index={i} hero />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Themes */}
        <section className="py-12 px-4 md:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-2xl font-bold"
                style={{ color: "var(--color-font)" }}
              >
                Explore by Theme
              </h2>
              <Link href="/experiences/events" className="font-medium">
                see all event &gt;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {CATEGORIES.map((c) => (
                <Link
                  key={c.id}
                  href={`/experiences/events?category=${c.id}`}
                  className={`w-full p-5 rounded-3xl border shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition duration-200 flex items-start gap-4`}
                  style={{
                    backgroundColor: "var(--bg)",
                    borderColor: "rgba(0,0,0,0.06)",
                  }}
                >
                  <div
                    style={{ backgroundColor: `var(${c.colorVar})` }}
                    className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-sm`}
                  >
                    {c.icon}
                  </div>
                  <div className="flex flex-col">
                    <span
                      className={`font-semibold text-lg`}
                      style={{ color: `var(${c.colorVar})` }}
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
        </section>

        {/* Contact Section for Custom Experiences */}
        <section className="py-16 px-4 md:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="bg-gradient-to-br from-slate-100 to-slate-50 rounded-3xl border border-slate-200 shadow-lg p-8 md:p-12">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-3xl shadow-sm">
                  ✨
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
                    Want to Create Custom Experiences?
                  </h2>
                  <p className="text-slate-700 mt-2 text-lg">
                    Personalized, beautiful moments tailored to your vision with JoyJuncture.
                  </p>
                </div>
              </div>
              
              <p className="text-slate-700 mb-8 leading-relaxed text-base">
                Whether it's a private celebration, corporate team-building, wedding, or a unique gathering, our expert team designs unforgettable moments. Contact us to bring your vision to life with our curated experiences, games, and entertainment.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="mailto:contact@joyjuncture.com"
                  className="px-7 py-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 font-semibold transition-all duration-300 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg text-center"
                >
                  📧 Email Us
                </a>
                <a
                  href="tel:+91-XXXXXXXXXX"
                  className="px-7 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 font-semibold transition-all duration-300 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg text-center"
                >
                  📞 Call Us
                </a>
                <a
                  href="/contact"
                  className="px-7 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 font-semibold transition-all duration-300 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg text-center"
                >
                  💬 Get In Touch
                </a>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
