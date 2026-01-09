"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";

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
];

export default function ExperiencesLanding() {
  const sliderRef = useRef(null);
  const [current, setCurrent] = useState(0);
  const [heroEvents, setHeroEvents] = useState([]);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const res = await fetch("/api/experiences");
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
            const copy = [...data];
            for (let i = copy.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [copy[i], copy[j]] = [copy[j], copy[i]];
            }
            const mapped = copy.slice(0, 3).map((e) => ({
              id: e.id,
              title: e.title,
              category: e.category,
              description: e.description || e.excerpt || "",
              image: e.coverImage || "",
              href: `/experiences/events/${e.id}`,
            }));
            setHeroEvents(mapped);
          }
        }
      } catch (err) {
        console.error("Error fetching experiences:", err);
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
        card.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [heroEvents]);

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
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4">
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
      </main>
      <Footer />
    </>
  );
}
