"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";

// Fixed categories from admin/create form
const CATEGORIES = [
  { id: "private_birthdays", label: "Private Birthdays", icon: "🎂", bg: "from-pink-50 to-pink-100", accent: "bg-pink-100", text: "text-pink-800" },
  { id: "corporate_events", label: "Corporate Events", icon: "🏢", bg: "from-blue-50 to-blue-100", accent: "bg-blue-100", text: "text-blue-800" },
  { id: "monthly_kits", label: "Monthly Kits", icon: "📦", bg: "from-indigo-50 to-indigo-100", accent: "bg-indigo-100", text: "text-indigo-800" },
  { id: "carnivals", label: "Carnivals", icon: "🎡", bg: "from-amber-50 to-amber-100", accent: "bg-amber-100", text: "text-amber-800" },
  { id: "weddings", label: "Weddings", icon: "💍", bg: "from-rose-50 to-rose-100", accent: "bg-rose-100", text: "text-rose-800" },
  { id: "workshops", label: "Workshops", icon: "🎓", bg: "from-teal-50 to-teal-100", accent: "bg-teal-100", text: "text-teal-800" },
];

export default function ExperiencesLanding() {
  const sliderRef = useRef(null);
  const [current, setCurrent] = useState(0);
  const [heroEvents, setHeroEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch experiences from API
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const res = await fetch("/api/experiences");
        if (res.ok) {
          const data = await res.json();
          // API returns { experiences: [...] } so extract the array
          const expsArray = data.experiences || data || [];
          // Filter only published experiences
          const published = Array.isArray(expsArray) ? expsArray.filter((e) => e.isPublished) : [];
          // Shuffle and pick 3 random ones
          const shuffled = [...published];
          for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
          }
          setHeroEvents(shuffled.slice(0, 3));
        }
      } catch (err) {
        console.error("Failed to fetch experiences:", err);
        setHeroEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchExperiences();
  }, []);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || heroEvents.length === 0) return;

    let idx = 0;
    const total = heroEvents.length;
    const interval = setInterval(() => {
      idx = (idx + 1) % total;
      setCurrent(idx);
      const card = slider.children[idx];
      if (card) {
        setTimeout(() => {
          if (card) {
            card.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
          }
        }, 50);
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [heroEvents]);

  return (
    <>
      <Navbar />
      <main className="mt-20">
        {/* Hero */}
        <section className="py-16 px-4 md:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-extrabold text-slate-900">Experiences</h1>
                <p className="mt-2 text-slate-700">Curated live experiences, games and engagement formats.</p>
              </div>
              {/* right-side CTA removed; See All Events moved to Themes section */}
            </div>

            <div className="overflow-x-auto no-scrollbar py-6">
              <div ref={sliderRef} className="flex gap-6 items-stretch snap-x snap-mandatory">
                {heroEvents.map((ev, i) => (
                  <div key={ev.id} className="snap-center min-w-[320px] max-w-[380px]">
                    <BlogCard post={{ ...ev }} index={i} hero showVotes={false} />
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
              <h2 className="text-2xl font-bold">Explore by Theme</h2>
              <Link href="/experiences/events" className="text-emerald-600 font-medium">see all event &gt;</Link>
            </div>

            <div className="flex flex-wrap gap-6">
              {CATEGORIES.map((c) => (
                <Link
                  key={c.id}
                  href={`/experiences/events?category=${c.id}`}
                  className={`w-56 md:w-72 p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition duration-200 flex items-start gap-4 bg-gradient-to-br ${c.bg}`}
                >
                  <div className={`flex-shrink-0 w-14 h-14 rounded-xl ${c.accent} flex items-center justify-center text-2xl shadow-sm`}>{c.icon}</div>
                  <div className="flex flex-col">
                    <span className={`font-semibold ${c.text} text-lg`}>{c.label}</span>
                    <span className="text-sm text-slate-600 mt-1">Explore {c.label.toLowerCase()}</span>
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

