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
    <section className="max-w-5xl mx-auto px-4 mt-20 mb-28 space-y-32">
      {/* ================= UPCOMING EVENTS ================= */}
      <div className="text-center">
        <h2 className="text-4xl font-bold">Upcoming Events</h2>
        <p className="mt-2 opacity-80">
          Don’t miss what’s happening next
        </p>

        <div className="mt-10 overflow-hidden">
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
                    className="min-w-full px-2"
                  >
                    <div className="rounded-2xl border-2 border-[var(--green)] bg-[var(--bg)] p-8 shadow-md hover:scale-[1.02] transition">
                      <h3 className="text-2xl font-semibold">
                        {e.title || e.name}
                      </h3>
                      <p className="mt-2 opacity-80">
                        {e.location || "TBA"}
                      </p>
                      <p className="mt-3 text-sm">
                        {new Date(e.date).toLocaleDateString()}
                      </p>
                      {e.price && (
                        <p className="mt-2 font-medium">
                          From ₹{e.price}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
          </div>
        </div>

        {/* dots */}
        <div className="flex justify-center gap-2 mt-4">
          {events.map((_, i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full ${
                i === eventIndex
                  ? "bg-[var(--green)]"
                  : "bg-[var(--green)] opacity-30"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ================= PLAY SPOTLIGHT ================= */}
      <div className="text-center">
        <h2 className="text-4xl font-bold">Play Spotlight</h2>
        <p className="mt-2 opacity-80">
          Pick up where the fun begins
        </p>

        <div className="mt-10 overflow-hidden">
          <div
            className="flex transition-transform duration-700"
            style={{ transform: `translateX(-${gameIndex * 100}%)` }}
          >
            {games.map((g, i) => (
              <Link key={i} href={g.href} className="min-w-full px-2">
                <div className="rounded-2xl border-2 border-[var(--green)] bg-[var(--bg)] p-10 shadow-md hover:scale-[1.02] transition">
                  <div className="text-6xl">{g.emoji}</div>
                  <h3 className="mt-4 text-2xl font-semibold">
                    {g.title}
                  </h3>
                  <p className="mt-3 opacity-80 max-w-md mx-auto">
                    {g.desc}
                  </p>
                  <div className="mt-6 underline font-medium">
                    Play now →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* dots */}
        <div className="flex justify-center gap-2 mt-4">
          {games.map((_, i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full ${
                i === gameIndex
                  ? "bg-[var(--green)]"
                  : "bg-[var(--green)] opacity-30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
