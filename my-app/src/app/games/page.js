"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingCartButton from "@/components/FloatingCartButton";
import ShopWithFilters from "@/components/ShopWithFilters";
import AddToCartButton from "@/components/AddToCartButton";

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
    "dreamers-fair": "/gallery/marketplace/Dreamer's Fair.WEBP",
    "judge-me-guess": "/gallery/marketplace/Judge Me & Guess.webp",
    mehfil: "/gallery/marketplace/Mehfil – The Ultimate Musical Card Game.webp",
    "one-more-round": "/gallery/marketplace/One More Round.webp",
    tamasha: "/gallery/marketplace/Tamasha – The Bollywood Bid Card Game.webp",
    "the-bloody-inheritance": "/gallery/marketplace/The Bloody Inheritance.webp",
  };

  // Game details for backside info (similar to the screenshot)
  const gameDetails = {
    "court-52": {
      players: "2-4 Players",
      duration: "30-45m",
      mood: "Fun",
    },
    buzzed: {
      players: "3-8 Players",
      duration: "30-60m",
      mood: "Party",
    },
    "dead-mans-deck": {
      players: "2-6 Players",
      duration: "20-40m",
      mood: "Mystery",
    },
    "dreamers-fair": {
      players: "1-4 Players",
      duration: "45-60m",
      mood: "Relaxing",
    },
    "judge-me-guess": {
      players: "4-10 Players",
      duration: "15-30m",
      mood: "Social",
    },
    mehfil: {
      players: "3-8 Players",
      duration: "30-45m",
      mood: "Musical",
    },
    "one-more-round": {
      players: "4-12 Players",
      duration: "20-40m",
      mood: "Party",
    },
    tamasha: {
      players: "3-7 Players",
      duration: "40-60m",
      mood: "Bollywood",
    },
    "the-bloody-inheritance": {
      players: "3-6 Players",
      duration: "60-90m",
      mood: "Thriller",
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

  return (
    <>
      <Navbar />

      <div className="px-5 md:px-12 pt-10 pb-16 mt-32 md:mt-36">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-10">
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
              <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-none">
                <span className="text-black/90">Game</span>{" "}
                <span className="relative inline-block text-purple-700 drop-shadow-[0_4px_8px_rgba(0,0,0,0.15)]">
                  Marketplace
                </span>
              </h1>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "80px" }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="h-2 bg-purple-600 rounded-full mt-6 shadow-md"
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

          {/* Games Grid - 3 cards per row with larger size */}
          <div className="mt-16">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10"
            >
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
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
                      transform: hoveredCard === item.id ? "rotateY(180deg)" : "rotateY(0deg)"
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
                            style={{ backgroundColor: "var(--green)", color: "var(--dark-teal)" }}
                          >
                            {item.category.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      {/* Hover Indicator */}
                      <div 
                        className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-sm font-bold shadow-md"
                        style={{ backgroundColor: "var(--orange)", color: "var(--dark-teal)" }}
                      >
                        Hover to Flip
                      </div>
                    </div>

                    {/* Back Side - Detailed Info (Rotated) */}
                    <div 
                      className="absolute inset-0 rounded-3xl overflow-hidden shadow-xl p-8 flex flex-col justify-between"
                      style={{ 
                        backfaceVisibility: "hidden", 
                        transform: "rotateY(180deg)",
                        backgroundColor: "var(--dark-teal)"
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
                        <div className="space-y-5">
                          <div>
                            <div className="text-sm font-semibold mb-1 opacity-70" style={{ color: "var(--bg)" }}>IDEAL GROUP</div>
                            <div className="text-2xl font-bold" style={{ color: "var(--bg)" }}>
                              {gameDetails[item.id]?.players || "2-6 Players"}
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-sm font-semibold mb-1 opacity-70" style={{ color: "var(--bg)" }}>AVERAGE SESSION</div>
                            <div className="text-2xl font-bold" style={{ color: "var(--bg)" }}>
                              {gameDetails[item.id]?.duration || "30-45m"}
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-sm font-semibold mb-1 opacity-70" style={{ color: "var(--bg)" }}>MOOD CHECK</div>
                            <div className="text-2xl font-bold" style={{ color: "var(--orange)" }}>
                              {gameDetails[item.id]?.mood || "Fun"}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Price and Actions */}
                      <div className="relative z-10 space-y-4 border-t pt-6" style={{ borderColor: "rgba(251, 241, 225, 0.2)" }}>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-3xl font-bold" style={{ color: "var(--bg)" }}>
                              Rs. {item.price}
                            </div>
                          </div>
                          <AddToCartButton gameId={item.id} className="!bg-[var(--orange)] !text-[var(--dark-teal)] hover:!opacity-90 shadow-lg font-bold" />
                        </div>
                        <a
                          href={`/games/${item.id}`}
                          className="block w-full text-center px-6 py-3 rounded-full font-bold text-lg transition-all duration-300 shadow-lg hover:opacity-90"
                          style={{ backgroundColor: "var(--bg)", color: "var(--dark-teal)" }}
                        >
                          View Details
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Category Tag */}
                  <div 
                    className="absolute -top-3 left-6 px-4 py-2 rounded-full text-sm font-bold shadow-lg z-10"
                    style={{ backgroundColor: "var(--dark-teal)", color: "var(--bg)" }}
                  >
                    {item.category.replace('_', ' ').toUpperCase()}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}