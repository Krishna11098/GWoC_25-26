"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import EventService from "@/app/lib/eventService";
import { auth } from "@/lib/firebaseClient";
import { onAuthStateChanged } from "firebase/auth";
import { userFetch } from "@/lib/userFetch";
import { ChevronLeft, ChevronRight, Puzzle, Brain, Film } from "lucide-react";

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
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] },
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

  const themeColors = ["#87a878", "#e6b94d", "#e6a1a1"];

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
      }, 3000);
    }
    return () => clearInterval(eventRef.current);
  }, [events]);

  useEffect(() => {
    gameRef.current = setInterval(() => {
      setGameIndex((p) => (p + 1) % 3);
    }, 3000);
    return () => clearInterval(gameRef.current);
  }, []);

  const games = [
    {
      emoji: <Puzzle />,
      title: "Sudoku",
      desc: loadingGames
        ? "Loading..."
        : gameData.sudoku
        ? `Level ${gameData.sudoku.levelName || "New"}`
        : "Sharpen your logic skills.",
      href: "/sudoku",
    },
    {
      emoji: <Brain />,
      title: "Riddle",
      desc: loadingGames
        ? "Loading..."
        : gameData.riddle
        ? gameData.riddle.question
        : "Crack today’s riddle.",
      href: "/riddles",
    },
    {
      emoji: <Film />,
      title: "Guess the Movie",
      desc: loadingGames
        ? "Loading..."
        : gameData.movie
        ? `Clue: ${gameData.movie.clueData}`
        : "Decode the movie clue.",
      href: "/movies",
    },
  ];

  return (
    <motion.section
      ref={sectionRef}
      className="max-w-5xl mx-auto px-4 mt-20 mb-20 md:mb-28 space-y-24 md:space-y-32"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {/* ================= UPCOMING EVENTS ================= */}
      <motion.div variants={itemVariants} className="text-center">
        <motion.h2
          className="text-3xl md:text-5xl font-black"
          style={{
            background: "linear-gradient(135deg, #a855f7, #ec4899, #f43f5e)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Upcoming Events
        </motion.h2>
        <motion.p
          className="mt-2 text-sm md:text-base font-semibold"
          style={{ color: "var(--color-font)" }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          ✨ Don't miss what's happening next ✨
        </motion.p>

        <div className="relative mt-8 md:mt-10">
          {/* Navigation Arrows */}
          <button
            onClick={handleEventPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-14 z-20 bg-white p-3 rounded-full text-zinc-800 shadow-xl hover:scale-110 active:scale-95 transition-all border border-zinc-200"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            onClick={handleEventNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-14 z-20 bg-white p-3 rounded-full text-zinc-800 shadow-xl hover:scale-110 active:scale-95 transition-all border border-zinc-200"
          >
            <ChevronRight size={28} />
          </button>

          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-700"
              style={{ transform: `translateX(-${eventIndex * 100}%)` }}
            >
              {loadingEvents
                ? null
                : events.map((e) => (
                    <Link
                      key={e.id}
                      href={`/events/${e.id}`}
                      className="min-w-full px-1 md:px-2"
                    >
                      <motion.div
                        className="rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-8 shadow-2xl transition-all duration-500 border-[3px] relative overflow-hidden group/card"
                        style={{
                          backgroundColor:
                            themeColors[events.indexOf(e) % themeColors.length],
                          borderColor: "rgba(255,255,255,0.6)",
                        }}
                        whileHover={{
                          scale: 1.02,
                          boxShadow: "0 30px 60px rgba(168, 85, 247, 0.4)",
                          borderColor: "rgba(255,255,255,0.9)",
                        }}
                      >
                        {/* Animated gradient overlay */}
                        <motion.div
                          className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))",
                          }}
                          animate={{
                            backgroundPosition: ["0% 0%", "100% 100%"],
                          }}
                          transition={{ duration: 3, repeat: Infinity }}
                        />

                        {/* Shine effect */}
                        <motion.div
                          className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"
                          style={{
                            background:
                              "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                          }}
                          animate={{ x: ["100%", "-100%"] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />

                        <motion.h3
                          className="text-xl md:text-2xl font-black text-white relative z-10 drop-shadow-md"
                          initial={{ y: 0 }}
                          whileHover={{ y: -5 }}
                        >
                          {e.title || e.name}
                        </motion.h3>
                        <motion.p
                          className="mt-2 text-sm md:text-base text-white relative z-10 font-semibold"
                          style={{ textShadow: "0 2px 4px rgba(0,0,0,0.2)" }}
                        >
                          📍 {e.location || "TBA"}
                        </motion.p>
                        <motion.p className="mt-3 text-xs md:text-sm text-white/90 relative z-10 font-bold uppercase tracking-wider">
                          🗓️ {new Date(e.date).toLocaleDateString()}
                        </motion.p>
                        <div className="mt-6 flex items-center justify-center relative z-10">
                          <motion.span
                            className="bg-white px-8 py-2.5 rounded-full text-xs md:text-sm font-black text-slate-800 shadow-lg"
                            whileHover={{ scale: 1.1, y: -3 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            View Details →
                          </motion.span>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
            </div>
          </div>
        </div>

        {/* dots & View All */}
        <div className="mt-8 space-y-8">
          <div className="flex justify-center gap-3">
            {events.map((_, i) => (
              <span
                key={i}
                className={`h-2.5 w-2.5 rounded-full transition-all duration-300 bg-font ${
                  i === eventIndex ? "w-8" : "opacity-20"
                }`}
              />
            ))}
          </div>
          <Link
            href="/events"
            className="inline-block bg-font text-bg px-10 py-4 rounded-full font-bold text-sm uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
          >
            View All Events
          </Link>
        </div>
      </motion.div>

      {/* ================= PLAY SPOTLIGHT ================= */}
      <motion.div variants={itemVariants} className="text-center">
        <motion.h2
          className="text-3xl md:text-5xl font-black"
          style={{
            background: "linear-gradient(135deg, #ec4899, #a855f7, #0ea5e9)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Play Spotlight
        </motion.h2>
        <motion.p
          className="mt-2 text-sm md:text-base font-semibold"
          style={{ color: "var(--color-font)" }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          🎮 Pick up where the fun begins 🎮
        </motion.p>

        <div className="relative mt-8 md:mt-12">
          {/* Navigation Arrows */}
          <button
            onClick={handleGamePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-14 z-20 bg-white p-3 rounded-full text-zinc-800 shadow-xl hover:scale-110 active:scale-95 transition-all border border-zinc-200"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            onClick={handleGameNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-14 z-20 bg-white p-3 rounded-full text-zinc-800 shadow-xl hover:scale-110 active:scale-95 transition-all border border-zinc-200"
          >
            <ChevronRight size={28} />
          </button>

          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-700"
              style={{ transform: `translateX(-${gameIndex * 100}%)` }}
            >
              {games.map((g, i) => (
                <Link key={i} href={g.href} className="min-w-full px-2 md:px-4">
                  <motion.div
                    className="rounded-[2.5rem] md:rounded-[3.5rem] p-10 md:p-14 shadow-2xl transition-all duration-500 border-[3px] relative overflow-hidden group/game"
                    style={{
                      backgroundColor: themeColors[i % themeColors.length],
                      borderColor: "rgba(255,255,255,0.6)",
                    }}
                    whileHover={{
                      scale: 1.03,
                      boxShadow: "0 40px 80px rgba(168, 85, 247, 0.4)",
                      borderColor: "rgba(255,255,255,0.9)",
                    }}
                  >
                    {/* Animated gradient background */}
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover/game:opacity-100 transition-opacity duration-500"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))",
                      }}
                    />

                    {/* Premium shine effect */}
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover/game:opacity-100"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                      }}
                      animate={{ x: ["100%", "-100%"] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    />

                    <div className="relative z-10">
                      <motion.div
                        className="text-9xl md:text-[10rem] drop-shadow-2xl flex justify-center"
                        animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
                        transition={{
                          duration: 3.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        {g.emoji}
                      </motion.div>

                      <motion.h3
                        className="mt-4 text-2xl md:text-4xl font-black text-white drop-shadow-md"
                        whileHover={{ scale: 1.05, y: -5 }}
                      >
                        {g.title}
                      </motion.h3>

                      <motion.p
                        className="mt-4 text-sm md:text-xl text-white font-semibold max-w-md mx-auto leading-relaxed"
                        style={{ textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
                      >
                        {g.desc}
                      </motion.p>

                      <div className="mt-10">
                        <motion.button
                          className="inline-block bg-white text-slate-800 px-12 py-4 rounded-full font-black text-lg shadow-2xl"
                          whileHover={{ scale: 1.12, y: -5 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Play now →
                        </motion.button>
                      </div>
                    </div>

                    {/* Premium glowing orbs */}
                    <motion.div
                      className="absolute -top-10 -left-10 w-48 h-48 rounded-full blur-3xl opacity-20 group-hover/game:opacity-40 transition-opacity"
                      style={{ background: "rgba(255,255,255,0.8)" }}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    <motion.div
                      className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full blur-3xl opacity-10 group-hover/game:opacity-30 transition-opacity"
                      style={{ background: "rgba(255,255,255,1)" }}
                      animate={{ scale: [1.2, 1, 1.2] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    />
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* dots & Explore */}
        <div className="mt-8 space-y-8">
          <div className="flex justify-center gap-3">
            {games.map((_, i) => (
              <span
                key={i}
                className={`h-2.5 w-2.5 rounded-full transition-all duration-300 bg-font ${
                  i === gameIndex ? "w-8" : "opacity-20"
                }`}
              />
            ))}
          </div>
          {/* <Link 
            href="/play" 
            className="inline-block bg-[var(--font)] text-bg px-10 py-4 rounded-full font-bold text-sm uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
          >
            Explore More Games
          </Link> */}
        </div>
      </motion.div>
    </motion.section>
  );
}
