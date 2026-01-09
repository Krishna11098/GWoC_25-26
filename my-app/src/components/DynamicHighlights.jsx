"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import EventService from "@/app/lib/eventService";
import { auth } from "@/lib/firebaseClient";
import { onAuthStateChanged } from "firebase/auth";
import { userFetch } from "@/lib/userFetch";

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
      emoji: "🧩",
      title: "Sudoku",
      desc: loadingGames
        ? "Loading..."
        : gameData.sudoku
        ? `Level ${gameData.sudoku.levelName || "New"}`
        : "Sharpen your logic skills.",
      href: "/sudoku",
    },
    {
      emoji: "🧠",
      title: "Riddle",
      desc: loadingGames
        ? "Loading..."
        : gameData.riddle
        ? gameData.riddle.question
        : "Crack today’s riddle.",
      href: "/riddles",
    },
    {
      emoji: "🎬",
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
    <section className="max-w-5xl mx-auto px-4 mt-20 mb-20 md:mb-28 space-y-24 md:space-y-32">
      {/* ================= UPCOMING EVENTS ================= */}
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold">Upcoming Events</h2>
        <p className="mt-2 text-sm md:text-base opacity-80">
          Don’t miss what’s happening next
        </p>

        <div className="mt-8 md:mt-10 overflow-hidden">
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
                    <div 
                      className="rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-8 shadow-2xl hover:scale-[1.02] transition-all duration-500 border-[6px] border-white/40 relative overflow-hidden group/card hover:border-white/80"
                      style={{ backgroundColor: themeColors[events.indexOf(e) % themeColors.length] }}
                    >
                      {/* Inner Shine Effect */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 shadow-inner" />
                      
                      <h3 className="text-xl md:text-2xl font-black text-white relative z-10 drop-shadow-md">
                        {e.title || e.name}
                      </h3>
                      <p className="mt-2 text-sm md:text-base text-white relative z-10 font-medium">
                        {e.location || "TBA"}
                      </p>
                      <p className="mt-3 text-xs md:text-sm text-white/80 relative z-10 font-bold uppercase tracking-wider">
                        {new Date(e.date).toLocaleDateString()}
                      </p>
                      <div className="mt-6 flex items-center justify-between relative z-10">
                        {e.price && (
                          <p className="text-sm md:text-base font-black text-white">
                            ₹{e.price}
                          </p>
                        )}
                        <span className="bg-white px-5 py-2 rounded-full text-xs md:text-sm font-black text-slate-800 shadow-lg group-hover/card:scale-110 transition-transform duration-300">
                          View Details
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
          </div>
        </div>

        {/* dots & View All */}
        <div className="mt-8 space-y-8">
          <div className="flex justify-center gap-3">
            {events.map((_, i) => (
              <span
                key={i}
                className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                  i === eventIndex
                    ? "bg-[var(--font)] w-8"
                    : "bg-[var(--font)] opacity-20"
                }`}
              />
            ))}
          </div>
          <Link 
            href="/events" 
            className="inline-block bg-[var(--font)] text-bg px-10 py-4 rounded-full font-bold text-sm uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
          >
            View All Events
          </Link>
        </div>
      </div>

      {/* ================= PLAY SPOTLIGHT ================= */}
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold">Play Spotlight</h2>
        <p className="mt-2 text-sm md:text-base opacity-80">
          Pick up where the fun begins
        </p>

        <div className="mt-8 md:mt-12 overflow-hidden">
          <div
            className="flex transition-transform duration-700"
            style={{ transform: `translateX(-${gameIndex * 100}%)` }}
          >
            {games.map((g, i) => (
              <Link key={i} href={g.href} className="min-w-full px-2 md:px-4">
                <div 
                  className="rounded-[2.5rem] md:rounded-[3.5rem] p-10 md:p-14 shadow-2xl hover:scale-[1.02] transition-all duration-500 border-[6px] border-white/40 relative overflow-hidden group/game hover:border-white/80"
                  style={{ backgroundColor: themeColors[i % themeColors.length] }}
                >
                  <div className="relative z-10">
                    <div className="text-7xl md:text-8xl animate-float drop-shadow-2xl">{g.emoji}</div>
                    <h3 className="mt-8 text-2xl md:text-4xl font-black text-white drop-shadow-md">
                      {g.title}
                    </h3>
                    <p className="mt-4 text-sm md:text-xl text-white font-medium max-w-md mx-auto leading-relaxed">
                      {g.desc}
                    </p>
                    <div className="mt-10">
                      <span className="inline-block bg-white text-slate-800 px-12 py-4 rounded-full font-black text-lg shadow-2xl transform group-hover/game:scale-110 active:scale-95 transition-all duration-300">
                        Play now →
                      </span>
                    </div>
                  </div>
                  {/* Subtle Background Glows */}
                  <div className="absolute -top-10 -left-10 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
                  <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl group-hover/game:bg-white/30 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* dots & Explore */}
        <div className="mt-8 space-y-8">
          <div className="flex justify-center gap-3">
            {games.map((_, i) => (
              <span
                key={i}
                className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                  i === gameIndex
                    ? "bg-[var(--font)] w-8"
                    : "bg-[var(--font)] opacity-20"
                }`}
              />
            ))}
          </div>
          <Link 
            href="/play" 
            className="inline-block bg-[var(--font)] text-bg px-10 py-4 rounded-full font-bold text-sm uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
          >
            Explore More Games
          </Link>
        </div>
      </div>
    </section>
  );
}
