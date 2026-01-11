"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingCartButton from "@/components/FloatingCartButton";
import ShopWithFilters from "@/components/ShopWithFilters";

export default function GamesPage() {
  const [products, setProducts] = useState([]);

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

      <div className="px-5 md:px-12 pt-5 pb-12 mt-32">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-10">
          <div className="mb-10 mt-2 text-center relative">
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
              <h1 className="text-5xl md:text-7xl font-winky-rough tracking-tight leading-none">
                <span className="text-black/80">Game</span>{" "}
                <span className="relative inline-block text-font drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                  Marketplace
                </span>
              </h1>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "60px" }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="h-1.5 bg-font rounded-full mt-4 shadow-sm"
              />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-6 text-sm md:text-base text-gray-600"
            >
              Browse and add games to your cart.
            </motion.p>
            <div className="absolute top-0 right-0">
              <FloatingCartButton />
            </div>
          </div>

          <ShopWithFilters
            items={items}
            imageById={imageById}
            fallbackImages={images}
          />
        </div>
      </div>

      <Footer />
    </>
  );
}
