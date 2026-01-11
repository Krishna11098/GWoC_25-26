"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import AddToCartButton from "@/components/AddToCartButton";

export default function GameGrid({
  items,
  imageById = {},
  fallbackImages = [],
}) {
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
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((p, idx) => (
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
          className="rounded-2xl border border-white/60 bg-white/90 shadow-[0_10px_30px_rgba(0,0,0,0.08)] overflow-hidden cursor-grab active:cursor-grabbing flex flex-col group relative"
          title="Drag to Cart"
        >
          {/* Image */}
          <div className="relative w-full h-56 sm:h-48 lg:h-56 bg-gray-100">
            <Image
              src={
                imageById[p.id] ||
                fallbackImages[idx % fallbackImages.length] ||
                fallbackImages[0]
              }
              alt={(p.name || p.title || "Game") + " cover"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
              className="object-cover"
              priority={idx < 3}
            />
          </div>

          <div className="p-5 flex flex-col flex-1">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {p.name || p.title || "Untitled"}
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  {p.category || "Unknown"}
                </p>
              </div>
              <span
                className="inline-flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-1 text-base font-semibold"
                style={{ backgroundColor: "var(--color-font)", color: "white" }}
              >
                Rs. {typeof p.price === "number" ? p.price.toFixed(2) : "--"}
              </span>
            </div>

            <div className="mt-auto pt-4 flex items-center justify-between gap-3">
              <a
                href={`/games/${p.id}`}
                className="flex-1 text-center rounded-full px-4 py-2 sm:py-3 text-sm sm:text-base font-medium text-gray-900 hover:bg-gray-100 border border-gray-300"
              >
                View Details
              </a>
              <AddToCartButton gameId={p.id} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
