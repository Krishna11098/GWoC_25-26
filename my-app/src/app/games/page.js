"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingCartButton from "@/components/FloatingCartButton";
import ShopWithFilters from "@/components/ShopWithFilters";
import AddToCartButton from "@/components/AddToCartButton";
import SoftWaveBackground from "@/components/SoftWaveBackground";

export default function GamesPage() {
  const [products, setProducts] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    fetchProducts();
  }, []);

  const images = [
    "/gallery/marketplace/Buzzed – The Drinking Card Game.webp",
    "/gallery/marketplace/Court 52 Pickleball.WEBP",
    "/gallery/marketplace/Dead Man's Deck.webp",
    "/gallery/marketplace/Dreamer’s Fair.WEBP",
    "/gallery/marketplace/Judge Me & Guess.webp",
    "/gallery/marketplace/Mehfil – The Ultimate Musical Card Game.webp",
    "/gallery/marketplace/One More Round.webp",
    "/gallery/marketplace/Tamasha – The Bollywood Bid Card Game.webp",
    "/gallery/marketplace/The Bloody Inheritance.webp",
  ];

  const imageById = {
    buzzed: "/gallery/marketplace/Buzzed – The Drinking Card Game.webp",
    "court-52": "/gallery/marketplace/Court 52 Pickleball.WEBP",
    "dead-mans-deck": "/gallery/marketplace/Dead Man's Deck.webp",
    "dreamers-fair": "/gallery/marketplace/Dreamer’s Fair.WEBP",
    "judge-me-guess": "/gallery/marketplace/Judge Me & Guess.webp",
    mehfil: "/gallery/marketplace/Mehfil – The Ultimate Musical Card Game.webp",
    "one-more-round": "/gallery/marketplace/One More Round.webp",
    tamasha: "/gallery/marketplace/Tamasha – The Bollywood Bid Card Game.webp",
    "the-bloody-inheritance":
      "/gallery/marketplace/The Bloody Inheritance.webp",
  };

  // Game details for backside info (similar to the screenshot)
  const gameDetails = {
    "court-52": {
      players: "2-4 Players",
      duration: "30-45m",
      mood: "Fun",
      age: "8+",
    },
    buzzed: {
      players: "3-8 Players",
      duration: "30-60m",
      mood: "Party",
      age: "21+", // Drinking game
    },
    "dead-mans-deck": {
      players: "2-6 Players",
      duration: "20-40m",
      mood: "Mystery",
      age: "14+",
    },
    "dreamers-fair": {
      players: "1-4 Players",
      duration: "45-60m",
      mood: "Relaxing",
      age: "10+",
    },
    "judge-me-guess": {
      players: "4-10 Players",
      duration: "15-30m",
      mood: "Social",
      age: "12+",
    },
    mehfil: {
      players: "3-8 Players",
      duration: "30-45m",
      mood: "Musical",
      age: "12+",
    },
    "one-more-round": {
      players: "4-12 Players",
      duration: "20-40m",
      mood: "Party",
      age: "18+",
    },
    tamasha: {
      players: "3-7 Players",
      duration: "40-60m",
      mood: "Bollywood",
      age: "14+",
    },
    "the-bloody-inheritance": {
      players: "3-6 Players",
      duration: "60-90m",
      mood: "Thriller",
      age: "14+",
    },
  };

  // Fallback: if no Firestore products (or server creds missing), show dummy cards
  const fallback = [
    {
      id: "buzzed",
      name: "Buzzed – The Drinking Card Game",
      category: "card_game",
      price: 14.99,
    },
    {
      id: "dead-mans-deck",
      name: "Dead Man's Deck",
      category: "card_game",
      price: 19.99,
    },
    {
      id: "court-52",
      name: "Court 52 Pickleball Card Game",
      category: "card_game",
      price: 15.99,
    },
    {
      id: "dreamers-fair",
      name: "Dreamer's Fair | 36 PCS Silhouette Puzzle",
      category: "puzzle",
      price: 699.0,
    },
    {
      id: "judge-me-guess",
      name: "Judge Me & Guess",
      category: "party_game",
      price: 16.99,
    },
    {
      id: "mehfil",
      name: "Mehfil – The Ultimate Musical Card Game",
      category: "card_game",
      price: 24.99,
    },
    {
      id: "one-more-round",
      name: "One More Round",
      category: "party_game",
      price: 17.99,
    },
    {
      id: "tamasha",
      name: "Tamasha – The Bollywood Bid Card Game",
      category: "card_game",
      price: 22.99,
    },
    {
      id: "the-bloody-inheritance",
      name: "The Bloody Inheritance",
      category: "mystery_game",
      price: 29.99,
    },
  ];
  const items = products.length ? products : fallback;

  // Filters State
  const [filters, setFilters] = useState({
    age: "All",
    players: "All",
    type: "All",
  });

  const uniqueCategories = ["All", ...new Set(items.map((i) => i.category))];
  // Extract unique player counts manually or dynamically.
  // Given the variety (2-4, 3-8, etc.), let's hardcode some ranges or simplified options if needed,
  // but for now let's just use unique values found in gameDetails to avoid mismatch.
  const uniquePlayers = ["All", ...new Set(Object.values(gameDetails).map((d) => d.players).filter(Boolean))];

  // Hardcoded ages for now as they are added below
  const uniqueAges = ["All", "8+", "10+", "12+", "14+", "18+", "21+"];

  // Filter Logic
  const filteredItems = items.filter((item) => {
    const details = gameDetails[item.id] || {};

    // 1. Age Filter
    if (filters.age !== "All") {
      // Check if age matches exactly or falls in range?
      // For simplicity, exact match on the generic tags like "14+".
      // Or better: string includes.
      const age = details.age || "";
      if (age !== filters.age) return false;
    }

    // 2. Players Filter
    if (filters.players !== "All") {
      const p = details.players || "";
      if (p !== filters.players) return false;
    }

    // 3. Type/Category Filter
    if (filters.type !== "All") {
      if (item.category !== filters.type) return false;
    }

    return true;
  });

  return (
    <>
      <Navbar />

      <div className="px-5 md:px-12 pt-10 pb-16 relative">
        <SoftWaveBackground height="450px" className="pointer-events-none" />
        <div className="mx-auto w-full max-w-7xl px-4 md:px-10 relative z-10 mt-20 md:mt-30">
          <div className="mb-14 mt-4 text-center relative">
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
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-none">
                <span className="text-black">Game</span>{" "}
                <span className="relative inline-block text-dark-teal drop-shadow-[0_4px_8px_rgba(0,0,0,0.15)]">
                  Marketplace
                </span>
              </h1>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "80px" }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="h-2 bg-dark-teal rounded-full mt-6 shadow-md"
              />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-8 text-lg md:text-xl text-gray-700 font-medium"
            >
              Browse premium games and expand your collection
            </motion.p>
            <div className="absolute top-0 right-0">
              <FloatingCartButton />
            </div>
          </div>

          {/* Filter Bar */}
          <div className="mb-12 flex flex-col md:flex-row flex-wrap gap-6 justify-center items-center">

            <h2 className="text-2xl font-bold text-[var(--dark-teal)] mr-2 flex items-center gap-2">
              <span className="bg-[var(--orange)] w-2 h-8 rounded-full inline-block"></span>
              Select Filters
            </h2>

            <div className="flex flex-wrap gap-4 justify-center">
              {/* Type Filter */}
              <div className="relative group">
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  className="appearance-none bg-white/80 backdrop-blur-sm border-2 border-[var(--dark-teal)] text-[var(--dark-teal)] font-bold py-3 px-6 pr-12 rounded-full cursor-pointer shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-[var(--orange)]"
                >
                  {uniqueCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === "All" ? "All Types" : cat.replace(/_/g, " ").toUpperCase()}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--dark-teal)]">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              {/* Players Filter */}
              <div className="relative group">
                <select
                  value={filters.players}
                  onChange={(e) => setFilters({ ...filters, players: e.target.value })}
                  className="appearance-none bg-white/80 backdrop-blur-sm border-2 border-[var(--dark-teal)] text-[var(--dark-teal)] font-bold py-3 px-6 pr-12 rounded-full cursor-pointer shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-[var(--orange)]"
                >
                  <option value="All">All Players</option>
                  {uniquePlayers
                    .filter(p => p !== "All")
                    .map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--dark-teal)]">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              {/* Age Filter */}
              <div className="relative group hidden md:block">
                <select
                  value={filters.age}
                  onChange={(e) => setFilters({ ...filters, age: e.target.value })}
                  className="appearance-none bg-white/80 backdrop-blur-sm border-2 border-[var(--dark-teal)] text-[var(--dark-teal)] font-bold py-3 px-6 pr-12 rounded-full cursor-pointer shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-[var(--orange)]"
                >
                  <option value="All">All Ages</option>
                  {uniqueAges.filter(a => a !== "All").map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--dark-teal)]">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          {/* Games Grid - 3 cards per row with larger size */}
          <div className="mt-8">
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10"
            >
              <AnimatePresence>
                {filteredItems.map((item, index) => (
                  <motion.div
                    layout
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="relative group cursor-pointer"
                    style={{ perspective: "1200px" }}
                    onMouseEnter={() => setHoveredCard(item.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    {/* Card Container with 3D Flip */}
                    <div
                      className="relative h-[520px] transition-transform duration-700 ease-out"
                      style={{
                        transformStyle: "preserve-3d",
                        transform:
                          hoveredCard === item.id
                            ? "rotateY(180deg)"
                            : "rotateY(0deg)",
                      }}
                    >
                      {/* Front Side - Game Image & Basic Info */}
                      <div
                        className="absolute inset-0 rounded-3xl overflow-hidden shadow-xl border-2 border-white/50"
                        style={{ backfaceVisibility: "hidden" }}
                      >
                        {/* Game Image */}
                        <div className="h-3/4 overflow-hidden">
                          <img
                            src={imageById[item.id] || images[0]}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>

                        {/* Game Info */}
                        <div
                          className="h-1/4 p-6"
                          style={{ backgroundColor: "var(--bg)" }}
                        >
                          <h3
                            className="text-2xl font-bold mb-2 line-clamp-1"
                            style={{ color: "var(--dark-teal)" }}
                          >
                            {item.name}
                          </h3>
                          <div className="flex items-center justify-between">
                            <span
                              className="text-2xl font-bold"
                              style={{ color: "var(--dark-teal)" }}
                            >
                              Rs. {item.price}
                            </span>
                            <span
                              className="text-sm font-semibold px-3 py-1 rounded-full"
                              style={{
                                backgroundColor: "var(--green)",
                                color: "var(--dark-teal)",
                              }}
                            >
                              {/* Shorten category name if long */}
                              {item.category.replace("_", " ").split(" ")[0]}
                            </span>
                          </div>
                        </div>

                        {/* Hover Indicator */}
                        {/* <div
                        className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-sm font-bold shadow-md"
                        style={{
                          backgroundColor: "var(--orange)",
                          color: "var(--dark-teal)",
                        }}
                      >
                        Hover to Flip
                      </div> */}
                      </div>

                      {/* Back Side - Detailed Info (Rotated) */}
                      <div
                        className="absolute inset-0 rounded-3xl overflow-hidden shadow-xl p-8 flex flex-col justify-between hidden-backface"
                        style={{
                          backfaceVisibility: "hidden",
                          transform: "rotateY(180deg)",
                          backgroundColor: "var(--dark-teal)",
                        }}
                      >
                        {/* Decorative elements */}
                        <div
                          className="absolute top-0 right-0 w-40 h-40 rounded-full -mr-20 -mt-20 opacity-20"
                          style={{ backgroundColor: "var(--orange)" }}
                        ></div>
                        <div
                          className="absolute bottom-0 left-0 w-48 h-48 rounded-full -ml-24 -mb-24 opacity-15"
                          style={{ backgroundColor: "var(--green)" }}
                        ></div>

                        <div className="relative z-10">
                          <h4
                            className="text-3xl font-bold mb-6"
                            style={{ color: "var(--orange)" }}
                          >
                            GAME DOSSIER
                          </h4>

                          {/* Game Details */}
                          <div className="space-y-4">
                            <div>
                              <div
                                className="text-sm font-semibold mb-1 opacity-70"
                                style={{ color: "var(--bg)" }}
                              >
                                IDEAL GROUP
                              </div>
                              <div
                                className="text-2xl font-bold"
                                style={{ color: "var(--bg)" }}
                              >
                                {gameDetails[item.id]?.players || "2-6 Players"}
                              </div>
                            </div>

                            {/* Add Age here */}
                            <div>
                              <div
                                className="text-sm font-semibold mb-1 opacity-70"
                                style={{ color: "var(--bg)" }}
                              >
                                AGE GROUP
                              </div>
                              <div
                                className="text-2xl font-bold"
                                style={{ color: "var(--bg)" }}
                              >
                                {gameDetails[item.id]?.age || "8+"}
                              </div>
                            </div>

                            <div>
                              <div
                                className="text-sm font-semibold mb-1 opacity-70"
                                style={{ color: "var(--bg)" }}
                              >
                                AVERAGE SESSION
                              </div>
                              <div
                                className="text-2xl font-bold"
                                style={{ color: "var(--bg)" }}
                              >
                                {gameDetails[item.id]?.duration || "30-45m"}
                              </div>
                            </div>

                            <div>
                              <div
                                className="text-sm font-semibold mb-1 opacity-70"
                                style={{ color: "var(--bg)" }}
                              >
                                MOOD CHECK
                              </div>
                              <div
                                className="text-2xl font-bold"
                                style={{ color: "var(--orange)" }}
                              >
                                {gameDetails[item.id]?.mood || "Fun"}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Price and Actions */}
                        <div
                          className="relative z-10 space-y-4 border-t pt-6"
                          style={{ borderColor: "rgba(251, 241, 225, 0.2)" }}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div
                                className="text-3xl font-bold"
                                style={{ color: "var(--bg)" }}
                              >
                                Rs. {item.price}
                              </div>
                            </div>
                            <AddToCartButton
                              gameId={item.id}
                              className="!bg-[var(--orange)] !text-[var(--dark-teal)] hover:!opacity-90 shadow-lg font-bold"
                            />
                          </div>
                          <a
                            href={`/games/${item.id}`}
                            className="block w-full text-center px-6 py-3 rounded-full font-bold text-lg transition-all duration-300 shadow-lg hover:opacity-90"
                            style={{
                              backgroundColor: "var(--bg)",
                              color: "var(--dark-teal)",
                            }}
                          >
                            View Details
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Category Tag */}
                    <div
                      className="absolute -top-3 left-6 px-4 py-2 rounded-full text-sm font-bold shadow-lg z-10"
                      style={{
                        backgroundColor: "var(--dark-teal)",
                        color: "var(--bg)",
                      }}
                    >
                      {item.category.replace("_", " ").toUpperCase()}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
            {filteredItems.length === 0 && (
              <div className="text-center py-20">
                <h3 className="text-2xl font-bold text-[var(--dark-teal)]">No games found</h3>
                <p className="text-gray-500">Try adjusting your filters.</p>
              </div>
            )}
          </div>
        </div>
      </div >

      <Footer />
    </>
  );
}
