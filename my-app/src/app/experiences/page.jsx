"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import SoftWaveBackground from "@/components/SoftWaveBackground";

const CATEGORIES = [
  { id: "private_birthdays", label: "Private Birthdays", image: "/gallery/experiences/JJ_Private_birthday.png", fallbackColor: "from-pink-400 to-rose-500" },
  { id: "corporate_events", label: "Corporate Events", image: "/gallery/experiences/JJ_Corporate_Event.png", fallbackColor: "from-blue-400 to-indigo-500" },
  { id: "monthly_kits", label: "Monthly Kits", image: "/gallery/experiences/JJ_Monthly_Kits.png", fallbackColor: "from-purple-400 to-indigo-500" },
  { id: "carnivals", label: "Carnivals", image: "/gallery/experiences/JJ_Carnivals.png", fallbackColor: "from-yellow-400 to-orange-500" },
  { id: "weddings", label: "Weddings", image: "/gallery/experiences/JJ_Weddings.png", fallbackColor: "from-red-400 to-pink-500" },
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
        const cardWidth = card.offsetWidth + 24; // 24px is the gap
        slider.scrollLeft = idx * cardWidth - (slider.offsetWidth - cardWidth) / 2;
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [heroEvents]);

  return (
    <>
      <Navbar />
      <main className="mt-20 min-h-screen" style={{ backgroundColor: "var(--bg)" }}>
        {/* Hero + Wave Wrapper */}
        <div className="relative overflow-hidden">
          <SoftWaveBackground height="450px" className="pointer-events-none" />
          {/* Hero */}
          <section className="py-16 relative z-10" style={{ backgroundColor: "transparent" }}>
            <div className="max-w-6xl mx-auto px-4">
            {/* Centered Header - matching Game Marketplace style */}
            <div className="mb-14 mt-4 text-center relative">
              <div className="inline-flex flex-col items-center gap-2">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-none">
                  <span className="relative inline-block text-dark-teal drop-shadow-[0_4px_8px_rgba(0,0,0,0.15)]">
                    Experiences
                  </span>
                </h1>
                <div
                  className="h-2 rounded-full mt-6 shadow-md"
                  style={{ 
                    width: "80px",
                    backgroundColor: "var(--orange)"
                  }}
                />
              </div>
              <p
                className="mt-8 text-lg md:text-xl font-medium text-gray-700"
              >
                Curated live experiences, games and engagement formats
              </p>
            </div>

            {heroEvents.length > 0 && (
              <div className="overflow-x-auto no-scrollbar py-6">
                <div
                  ref={sliderRef}
                  className="flex gap-6 items-stretch snap-x snap-mandatory"
                >
                  {heroEvents.map((ev, i) => (
                    <div
                      key={ev.id}
                      className="snap-center min-w-[320px] max-w-[380px]"
                    >
                      <BlogCard post={{ ...ev }} index={i} hero />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
        </div>

        {/* Themes */}
        <section className="py-12 relative z-20" style={{ backgroundColor: "var(--bg)" }}>
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col items-center mb-12">
              <div className="inline-flex flex-col items-center gap-2 mb-6">
                <h2
                  className="text-4xl font-bold"
                  style={{ color: "var(--font)" }}
                >
                  Explore by Theme
                </h2>
                <div
                  className="h-2 rounded-full shadow-md"
                  style={{ 
                    width: "80px",
                    backgroundColor: "var(--dark-teal)"
                  }}
                />
              </div>
            </div>

            <div className="flex justify-end mb-8">
              <Link 
                href="/experiences/events" 
                className="font-medium"
                style={{ color: "var(--orange)" }}
              >
                see all event &gt;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {CATEGORIES.map((c) => (
                <Link
                  key={c.id}
                  href={`/experiences/events?category=${c.id}`}
                  className="group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
                >
                  {/* Background Image */}
                  <div className="relative w-full h-80 md:h-96 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={c.image}
                      alt={c.label}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    {/* Fallback gradient if image fails to load */}
                    <div 
                      className={`absolute inset-0 bg-gradient-to-br ${c.fallbackColor}`}
                      style={{ zIndex: -1 }}
                    />
                  </div>

                  {/* Blurred Gradient Overlay at Bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 via-black/30 to-transparent backdrop-blur-sm" />

                  {/* Text at Bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center justify-center">
                    <h3 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg text-center">
                      {c.label}
                    </h3>
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
