"use client";

import { useMemo, useState, useEffect } from "react";
import GameGrid from "./GameGrid";

function normalizePlayers(value) {
  if (!value) return null;
  // common formats: "3-6", "2-4", "3+", "1-4 players", "3-5 players"
  const m = String(value).match(/(\d+)(?:\s*-\s*(\d+))?/);
  if (!m) return null;
  const low = parseInt(m[1], 10);
  const high = m[2] ? parseInt(m[2], 10) : low;
  return { low, high };
}

export default function ShopWithFilters({
  items = [],
  imageById = {},
  fallbackImages = [],
}) {
  const [occasion, setOccasion] = useState([]);
  const [players, setPlayers] = useState("");
  const [mood, setMood] = useState([]);
  const [gameType, setGameType] = useState([]);
  const [panelOpen, setPanelOpen] = useState(false);

  // close on escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setPanelOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Predefined filter options
  const options = useMemo(() => {
    const playerBuckets = new Set();

    items.forEach((it) => {
      const p = it.numberOfPlayers || it.players || it.playersRange || "";
      const norm = normalizePlayers(p);
      if (norm) {
        // bucket low values like "1-2", "2-4", "4+"
        if (norm.high <= 2) playerBuckets.add("1-2");
        else if (norm.high <= 4) playerBuckets.add("2-4");
        else if (norm.high <= 6) playerBuckets.add("4-6");
        else playerBuckets.add("6+");
      }
    });

    return {
      occasions: ["All", "party", "family", "corporate", "wedding", "kids"],
      moods: ["fun", "strategic", "creative", "competitive", "relaxing"],
      types: ["party", "family", "strategy", "adults only"],
      playerBuckets: Array.from(playerBuckets).sort(),
    };
  }, [items]);

  const toggleMulti = (setter, arr, value) => {
    if (arr.includes(value)) setter(arr.filter((a) => a !== value));
    else setter([...arr, value]);
  };

  const filtered = useMemo(() => {
    return items.filter((it) => {
      // occasion
      if (occasion.length > 0) {
        const its = it.occasion
          ? Array.isArray(it.occasion)
            ? it.occasion
            : [it.occasion]
          : [];
        if (!occasion.some((o) => its.includes(o))) return false;
      }

      // mood
      if (mood.length > 0) {
        const its = it.mood
          ? Array.isArray(it.mood)
            ? it.mood
            : [it.mood]
          : [];
        if (!mood.some((m) => its.includes(m))) return false;
      }

      // gameType/category
      if (gameType.length > 0) {
        const gt = it.gameType || it.category || it.type || "";
        if (!gameType.includes(gt)) return false;
      }

      // players
      if (players) {
        const bucket = players;
        const pVal = it.numberOfPlayers || it.players || it.playersRange || "";
        const norm = normalizePlayers(pVal);
        if (!norm) return false;
        if (bucket === "1-2" && norm.high > 2) return false;
        if (bucket === "2-4" && norm.high > 4) return false;
        if (bucket === "4-6" && norm.high > 6) return false;
        if (bucket === "6+" && norm.high < 7) return false;
      }

      return true;
    });
  }, [items, occasion, players, mood, gameType]);

  return (
    <div className="mt-8 relative">
      {/* Filter toggle positioned under the navbar on small screens */}
      <button
        aria-label="Open filters"
        aria-expanded={panelOpen}
        aria-controls="filters-panel"
        onClick={() => setPanelOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setPanelOpen(true);
        }}
        className="fixed top-32 right-6 z-50 flex items-center gap-2 rounded-full px-4 py-2 text-white shadow-lg focus:outline-none focus:ring-4 focus:ring-offset-2"
        style={{
          boxShadow: "0 8px 26px rgba(0,0,0,0.22)",
          backgroundColor: "var(--color-font)",
          border: "2px solid rgba(255,255,255,0.06)",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 12.414V19a1 1 0 01-.553.894l-4 2A1 1 0 019 21v-8.586L3.293 6.707A1 1 0 013 6V4z"
          />
        </svg>
        <span className="hidden sm:inline">Filters</span>
      </button>

      {/* Overlay */}
      {panelOpen && (
        <div
          onClick={() => setPanelOpen(false)}
          className="fixed inset-0 z-40 bg-black/40"
        />
      )}

      {/* Sliding panel */}
      <aside
        id="filters-panel"
        role="dialog"
        aria-modal="true"
        aria-hidden={!panelOpen}
        className={`fixed top-0 left-0 z-50 h-full w-full md:w-80 transform bg-white shadow-xl transition-transform duration-300 ${
          panelOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Filters</h3>
            <button
              onClick={() => setPanelOpen(false)}
              className="text-sm text-gray-600"
            >
              Close
            </button>
          </div>

          {/* All filters kept inside panel */}
          <div className="space-y-6">
            {/* Occasion */}
            {options.occasions.length > 1 && (
              <div>
                <div className="text-sm font-semibold mb-2">By Occasion</div>
                <div className="flex flex-wrap gap-2">
                  {options.occasions.filter((o) => o !== "All").map((o) => (
                    <button
                      key={o}
                      onClick={() => toggleMulti(setOccasion, occasion, o)}
                      className={`px-3 py-1.5 rounded-full border text-sm font-medium transition-all ${
                        occasion.includes(o)
                          ? "bg-[var(--color-font)] text-white border-[var(--color-font)]"
                          : "bg-white text-[var(--color-font)] border-[var(--color-font)]/30 hover:border-[var(--color-font)]"
                      }`}
                    >
                      {o.charAt(0).toUpperCase() + o.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Players */}
            <div>
              <div className="text-sm font-semibold mb-2">
                By Number of Players
              </div>
              <select
                value={players}
                onChange={(e) => setPlayers(e.target.value)}
                className="rounded border border-[var(--color-font)]/30 px-3 py-2 text-sm w-full focus:outline-none focus:border-[var(--color-font)] transition-colors"
                style={{ color: "var(--color-font)" }}
              >
                <option value="">All</option>
                {options.playerBuckets.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Mood */}
            {options.moods.length > 0 && (
              <div>
                <div className="text-sm font-semibold mb-2">By Mood / Vibe</div>
                <div className="flex flex-wrap gap-2">
                  {options.moods.map((m) => (
                    <button
                      key={m}
                      onClick={() => toggleMulti(setMood, mood, m)}
                      className={`px-3 py-1.5 rounded-full border text-sm font-medium transition-all ${
                        mood.includes(m)
                          ? "bg-[var(--color-font)] text-white border-[var(--color-font)]"
                          : "bg-white text-[var(--color-font)] border-[var(--color-font)]/30 hover:border-[var(--color-font)]"
                      }`}
                    >
                      {m.charAt(0).toUpperCase() + m.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Game Type */}
            {options.types.length > 0 && (
              <div>
                <div className="text-sm font-semibold mb-2">By Game Type</div>
                <div className="flex flex-wrap gap-2">
                  {options.types.map((t) => (
                    <button
                      key={t}
                      onClick={() => toggleMulti(setGameType, gameType, t)}
                      className={`px-3 py-1.5 rounded-full border text-sm font-medium transition-all ${
                        gameType.includes(t)
                          ? "bg-[var(--color-font)] text-white border-[var(--color-font)]"
                          : "bg-white text-[var(--color-font)] border-[var(--color-font)]/30 hover:border-[var(--color-font)]"
                      }`}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setOccasion([]);
                  setPlayers("");
                  setMood([]);
                  setGameType([]);
                }}
                className="rounded border px-4 py-2 text-sm"
              >
                Clear
              </button>
              <button
                onClick={() => setPanelOpen(false)}
                className="rounded bg-gray-900 text-white px-4 py-2 text-sm"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </aside>

      <div className="pl-0 md:pl-0">
        <GameGrid
          items={filtered}
          imageById={imageById}
          fallbackImages={fallbackImages}
        />
      </div>
    </div>
  );
}
