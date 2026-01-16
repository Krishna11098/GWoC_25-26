"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import AddToCartButton from "@/components/AddToCartButton";

export default function GameGrid({
  items,
  imageById = {},
  fallbackImages = [],
}) {
  const [flipped, setFlipped] = useState({});

  const toggleFlip = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleDragStart = (e, gameId, imgSrc) => {
    try {
      e.dataTransfer.setData(
        "application/json",
        JSON.stringify({ gameId, quantity: 1 })
      );
      e.dataTransfer.setData("text/plain", gameId);

      // Clone the actual card image element to ensure it's already loaded
      if (
        typeof document !== "undefined" &&
        typeof e.dataTransfer.setDragImage === "function"
      ) {
        const container = document.createElement("div");
        container.style.width = "120px";
        container.style.height = "120px";
        container.style.borderRadius = "12px";
        container.style.overflow = "hidden";
        container.style.boxShadow = "0 8px 20px rgba(0,0,0,0.4)";
        container.style.position = "absolute";
        container.style.top = "-9999px";
        container.style.left = "-9999px";
        container.style.backgroundColor = "white";
        container.style.border = "3px solid #10b981";

        // Find the actual image element from the card being dragged
        const sourceImg = e.currentTarget.querySelector("img");
        if (sourceImg) {
          const dragImg = sourceImg.cloneNode(true);
          dragImg.style.width = "100%";
          dragImg.style.height = "100%";
          dragImg.style.objectFit = "cover";
          dragImg.style.display = "block";

          container.appendChild(dragImg);
        }

        document.body.appendChild(container);

        e.dataTransfer.setDragImage(container, 60, 60);

        setTimeout(() => {
          if (document.body.contains(container)) {
            document.body.removeChild(container);
          }
        }, 0);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-2">
      {items.map((p, idx) => {
        const isFlipped = flipped[p.id];
        return (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-50px" }}
            transition={{
              duration: 0.5,
              ease: [0.25, 0.4, 0.25, 1],
              delay: idx * 0.05,
            }}
            draggable
            onDragStart={(e) =>
              handleDragStart(
                e,
                p.id,
                imageById[p.id] ||
                  fallbackImages[idx % fallbackImages.length] ||
                  fallbackImages[0]
              )
            }
            className="h-96 cursor-grab active:cursor-grabbing group relative"
            title="Drag to Cart"
            style={{ perspective: "1000px" }}
          >
            {/* Flip Container */}
            <motion.div
              className="relative w-full h-full"
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Front Side */}
              <div
                className="absolute w-full h-full rounded-3xl border-2 border-white/70 bg-gradient-to-br from-white/95 to-white/85 shadow-[0_15px_40px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] hover:border-white"
                style={{ backfaceVisibility: "hidden" }}
                onClick={() => toggleFlip(p.id)}
              >
                {/* Image */}
                <div className="relative w-full h-56 bg-gray-100 overflow-hidden">
                  <Image
                    src={
                      imageById[p.id] ||
                      fallbackImages[idx % fallbackImages.length] ||
                      fallbackImages[0]
                    }
                    alt={(p.name || p.title || "Game") + " cover"}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    priority={idx < 3}
                  />
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 leading-tight">
                      {p.name || p.title || "Untitled"}
                    </h3>
                    <p className="mt-2 text-sm font-semibold text-gray-600">
                      {p.category || "Game"}
                    </p>
                  </div>

                  <div className="mt-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-700">Price</span>
                      <span
                        className="rounded-full px-4 py-2 text-lg font-bold"
                        style={{
                          backgroundColor: "var(--color-font)",
                          color: "white",
                        }}
                      >
                        Rs. {typeof p.price === "number" ? p.price.toFixed(2) : "--"}
                      </span>
                    </div>

                    <div className="pt-3 flex items-center justify-between gap-3">
                      <a
                        href={`/games/${p.id}`}
                        className="flex-1 text-center rounded-full px-4 py-3 text-sm font-bold text-gray-900 hover:bg-gray-200 bg-gray-100 border-2 border-gray-300 transition-all duration-200 hover:border-gray-400"
                      >
                        View Details
                      </a>
                      <AddToCartButton gameId={p.id} />
                    </div>

                    {/* Hover hint */}
                    <p className="text-xs text-gray-500 text-center mt-2 group-hover:text-gray-700 transition-colors">
                      Click to flip →
                    </p>
                  </div>
                </div>
              </div>

              {/* Back Side */}
              <div
                className="absolute w-full h-full rounded-3xl border-2 border-white/70 bg-gradient-to-br from-purple-600 to-purple-700 shadow-[0_15px_40px_rgba(0,0,0,0.12)] p-6 flex flex-col justify-between text-white overflow-hidden"
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                onClick={() => toggleFlip(p.id)}
              >
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/20 rounded-full -ml-20 -mb-20"></div>

                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-4">
                    {p.name || p.title || "Untitled"}
                  </h3>
                  <div className="space-y-3">
                    {p.numberOfPlayers && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                          👥
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-purple-100">
                            Players
                          </p>
                          <p className="text-base font-bold">
                            {p.numberOfPlayers}
                          </p>
                        </div>
                      </div>
                    )}
                    {p.duration && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                          ⏱️
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-purple-100">
                            Duration
                          </p>
                          <p className="text-base font-bold">{p.duration}</p>
                        </div>
                      </div>
                    )}
                    {p.difficulty && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                          🎯
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-purple-100">
                            Difficulty
                          </p>
                          <p className="text-base font-bold capitalize">
                            {p.difficulty}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="relative z-10 space-y-2">
                  <button
                    onClick={() => {
                      toggleFlip(p.id);
                    }}
                    className="w-full rounded-full px-4 py-3 bg-white text-purple-600 font-bold text-base hover:bg-purple-50 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    ← Back to View
                  </button>
                  <p className="text-xs text-purple-200 text-center">
                    Click card or flip button
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
