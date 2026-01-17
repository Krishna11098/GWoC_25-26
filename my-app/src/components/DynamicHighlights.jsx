"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import EventService from "@/app/lib/eventService";
import { auth } from "@/lib/firebaseClient";
import { onAuthStateChanged } from "firebase/auth";
import { userFetch } from "@/lib/userFetch";
import { ChevronLeft, ChevronRight, Puzzle, Brain, Film, Calendar, MapPin, ArrowRight, Clock, Users } from "lucide-react";

export default function DynamicHighlights() {
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  const [gameData, setGameData] = useState({
    sudoku: null,
    riddle: null,
    movie: null,
  });
  const [loadingGames, setLoadingGames] = useState(true);

  const [eventIndex, setEventIndex] = useState(0);
  const [gameIndex, setGameIndex] = useState(0);

  const eventRef = useRef(null);
  const gameRef = useRef(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.4, 0.25, 1] },
    },
  };

  const handleEventPrev = () => {
    if (events.length <= 1) return;
    clearInterval(eventRef.current);
    setEventIndex((p) => (p - 1 + events.length) % events.length);
  };

  const handleEventNext = () => {
    if (events.length <= 1) return;
    clearInterval(eventRef.current);
    setEventIndex((p) => (p + 1) % events.length);
  };

  const handleGamePrev = () => {
    clearInterval(gameRef.current);
    setGameIndex((p) => (p - 1 + 3) % 3);
  };

  const handleGameNext = () => {
    clearInterval(gameRef.current);
    setGameIndex((p) => (p + 1) % 3);
  };

  /* ================= EVENTS ================= */
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const all = await EventService.getAllEvents();
        const now = new Date();
        const upcoming = (all || [])
          .filter((e) => e.date && new Date(e.date) >= now)
          .slice(0, 3);
        setEvents(upcoming);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingEvents(false);
      }
    };
    loadEvents();
  }, []);

  /* ================= GAMES ================= */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoadingGames(false);
        return;
      }
      try {
        const [r, m, s] = await Promise.all([
          userFetch("/api/user/riddles").then((r) => r.ok && r.json()),
          userFetch("/api/user/movies").then((r) => r.ok && r.json()),
          userFetch("/api/user/sudoku/levels").then((r) =>
            r.ok ? r.json() : []
          ),
        ]);
        setGameData({
          riddle: r?.[0] || null,
          movie: m?.[0] || null,
          sudoku: s?.[0] || null,
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingGames(false);
      }
    });
    return () => unsub();
  }, []);

  /* ================= AUTO SLIDE ================= */
  useEffect(() => {
    if (events.length > 1) {
      eventRef.current = setInterval(() => {
        setEventIndex((p) => (p + 1) % events.length);
      }, 5000);
    }
    return () => clearInterval(eventRef.current);
  }, [events]);

  useEffect(() => {
    gameRef.current = setInterval(() => {
      setGameIndex((p) => (p + 1) % 3);
    }, 5000);
    return () => clearInterval(gameRef.current);
  }, []);

  const games = [
    {
      icon: <Puzzle />,
      title: "Sudoku",
      desc: loadingGames
        ? "Loading..."
        : gameData.sudoku
          ? `Level ${gameData.sudoku.levelName || "New"}`
          : "Sharpen your logic skills with number puzzles",
      href: "/sudoku",
      gradient: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50",
      image: "https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=500&h=500&fit=crop",
    },
    {
      icon: <Brain />,
      title: "Riddle",
      desc: loadingGames
        ? "Loading..."
        : gameData.riddle
          ? gameData.riddle.question
          : "Test your wit with mind-bending riddles",
      href: "/riddles",
      gradient: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-50",
      image: "https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=500&h=500&fit=crop",
    },
    {
      icon: <Film />,
      title: "Guess the Movie",
      desc: loadingGames
        ? "Loading..."
        : gameData.movie
          ? `Clue: ${gameData.movie.clueData}`
          : "Decode movie clues and test your cinema knowledge",
      href: "/movies",
      gradient: "from-orange-500 to-red-600",
      bgColor: "bg-orange-50",
      image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&h=500&fit=crop",
    },
  ];

  return (
    <motion.section
      ref={sectionRef}
      className="w-full px-4 py-20 md:py-28"
      style={{ backgroundColor: "var(--light-blue)" }}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <div className="max-w-7xl mx-auto">

        {/* ================= PLAY SPOTLIGHT (TOP) ================= */}
        <motion.div variants={itemVariants} className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-3">
              Play Spotlight
            </h2>
            <p className="text-xl text-gray-600">
              Pick up where the fun begins
            </p>
          </div>

          <div className="relative">
            {/* Navigation Arrows */}
            <button
              onClick={handleGamePrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-16 z-20 p-4 rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all bg-white border-2 border-gray-200 text-[var(--dark-teal)]"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={handleGameNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-16 z-20 p-4 rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all bg-white border-2 border-gray-200 text-[var(--dark-teal)]"
            >
              <ChevronRight size={24} />
            </button>

            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${gameIndex * 100}%)` }}
              >
                {games.map((g, i) => (
                  <div key={i} className="min-w-full px-2">
                    <Link href={g.href} className="block group">
                      <div className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-[var(--dark-teal)]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 min-h-[500px]">
                          {/* Image - Left Side */}
                          <div className="relative h-80 md:h-auto overflow-hidden">
                            <img
                              src={g.image}
                              alt={g.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className={`absolute inset-0 bg-gradient-to-br ${g.gradient} opacity-60 group-hover:opacity-70 transition-opacity`}></div>

                            {/* Icon Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                                <div className="text-[var(--dark-teal)]" style={{ transform: "scale(2)" }}>
                                  {g.icon}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Content - Right Side */}
                          <div className="p-10 md:p-12 flex flex-col justify-center min-h-[500px]">
                            <div className={`inline-block px-4 py-2 ${g.bgColor} rounded-full text-sm font-bold text-gray-700 mb-4 w-fit`}>
                              Daily Challenge
                            </div>

                            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                              {g.title}
                            </h3>

                            <p className="text-gray-600 text-xl leading-relaxed mb-8">
                              {g.desc}
                            </p>

                            <span className={`inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r ${g.gradient} text-white rounded-2xl font-bold text-lg shadow-lg group-hover:gap-4 group-hover:shadow-xl transition-all w-fit`}>
                              Play Now
                              <ArrowRight size={22} />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Dots */}
            <div className="mt-8 flex justify-center gap-3">
              {games.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    clearInterval(gameRef.current);
                    setGameIndex(i);
                  }}
                  className={`h-3 rounded-full transition-all duration-300 ${i === gameIndex ? "w-12 bg-[var(--dark-teal)]" : "w-3 bg-gray-300"
                    }`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* ================= UPCOMING EVENTS (BOTTOM) ================= */}
        <motion.div variants={itemVariants}>
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-3">
              Upcoming Events
            </h2>
            <p className="text-xl text-gray-600">
              Don't miss what's happening next
            </p>
          </div>

          <div className="relative">
            {/* Navigation Arrows */}
            <button
              onClick={handleEventPrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-16 z-20 p-4 rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all bg-white border-2 border-gray-200 text-[var(--dark-teal)]"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={handleEventNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-16 z-20 p-4 rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all bg-white border-2 border-gray-200 text-[var(--dark-teal)]"
            >
              <ChevronRight size={24} />
            </button>

            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${eventIndex * 100}%)` }}
              >
                {loadingEvents ? (
                  <div className="min-w-full h-96 bg-white/50 animate-pulse rounded-3xl"></div>
                ) : events.length === 0 ? (
                  <div className="min-w-full h-96 bg-white rounded-3xl flex items-center justify-center border-2 border-gray-200">
                    <div className="text-center">
                      <Calendar size={80} className="mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-400 text-xl">No upcoming events</p>
                    </div>
                  </div>
                ) : (
                  events.map((e) => (
                    <div key={e.id} className="min-w-full px-2">
                      <Link href={`/events/${e.id}`} className="block group">
                        <div className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-[var(--dark-teal)]">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 min-h-[500px]">
                            {/* Image - Left Side */}
                            <div className="relative h-80 md:h-auto overflow-hidden">
                              {e.image ? (
                                <img
                                  src={e.image}
                                  alt={e.title || e.name}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-[var(--light-orange)] to-[var(--light-pink)] flex items-center justify-center">
                                  <Calendar size={100} className="text-white opacity-50" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                              {/* Category Badge */}
                              <div className="absolute top-6 left-6">
                                <span className="px-5 py-2 bg-white text-[var(--dark-teal)] rounded-full text-sm font-bold shadow-xl uppercase tracking-wide">
                                  {e.category || "Event"}
                                </span>
                              </div>

                              {/* Price Badge */}
                              {e.price !== undefined && (
                                <div className="absolute bottom-6 left-6">
                                  <span className="px-5 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full text-lg font-bold shadow-xl">
                                    {e.price === 0 ? "Free" : `₹${e.price}`}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Content - Right Side */}
                            <div className="p-10 md:p-12 flex flex-col justify-center min-h-[500px]">
                              <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 line-clamp-2">
                                {e.title || e.name}
                              </h3>

                              <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Calendar size={22} className="text-blue-600" />
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500 font-medium">Date</p>
                                    <p className="font-bold text-lg text-gray-900">
                                      {new Date(e.date).toLocaleDateString('en-US', {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                      })}
                                    </p>
                                  </div>
                                </div>

                                {e.startTime && (
                                  <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                      <Clock size={22} className="text-green-600" />
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-500 font-medium">Time</p>
                                      <p className="font-bold text-lg text-gray-900">{e.startTime}</p>
                                    </div>
                                  </div>
                                )}

                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <MapPin size={22} className="text-pink-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-500 font-medium">Location</p>
                                    <p className="font-bold text-lg text-gray-900 truncate">{e.location || e.venue || "TBA"}</p>
                                  </div>
                                </div>

                                {e.availableSeats !== undefined && (
                                  <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                                      <Users size={22} className="text-purple-600" />
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-500 font-medium">Available Seats</p>
                                      <p className="font-bold text-lg text-gray-900">{e.availableSeats || e.totalSeats || "Limited"}</p>
                                    </div>
                                  </div>
                                )}
                              </div>

                              <span className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[var(--dark-teal)] to-[var(--green)] text-white rounded-2xl font-bold text-lg shadow-lg group-hover:gap-4 group-hover:shadow-xl transition-all w-fit">
                                View Details
                                <ArrowRight size={22} />
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Dots & View All */}
            <div className="mt-8 space-y-6">
              <div className="flex justify-center gap-3">
                {events.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      clearInterval(eventRef.current);
                      setEventIndex(i);
                    }}
                    className={`h-3 rounded-full transition-all duration-300 ${i === eventIndex ? "w-12 bg-[var(--dark-teal)]" : "w-3 bg-gray-300"
                      }`}
                  />
                ))}
              </div>
              <div className="text-center">
                <Link
                  href="/events"
                  className="inline-block px-12 py-5 rounded-full font-bold text-lg uppercase tracking-wider shadow-xl hover:scale-105 active:scale-95 transition-all bg-[var(--dark-teal)] text-white"
                >
                  View All Events
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </motion.section>
  );
}
