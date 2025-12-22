"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Users, Zap } from "lucide-react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import AddToCartButton from "@/components/AddToCartButton";

gsap.registerPlugin(ScrollTrigger);

const imageMap = {
  buzzed: "/gallery/marketplace/Buzzed – The Drinking Card Game.webp",
  "dead-mans-deck": "/gallery/marketplace/Dead Man's Deck.webp",
  "court-52": "/gallery/marketplace/Court 52 Pickleball.WEBP",
  "judge-me-guess": "/gallery/marketplace/Judge Me & Guess.webp",
  mehfil: "/gallery/marketplace/Mehfil – The Ultimate Musical Card Game.webp",
  "one-more-round": "/gallery/marketplace/One More Round.webp",
  tamasha: "/gallery/marketplace/Tamasha – The Bollywood Bid Card Game.webp",
  "the-bloody-inheritance": "/gallery/marketplace/The Bloody Inheritance.webp",
};

export default function ProductShowcase({ product, gameId }) {
  const sectionRefs = useRef([]);

  useEffect(() => {
    sectionRefs.current.forEach((section) => {
      if (!section) return;
      gsap.fromTo(
        section,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 20%",
            scrub: 0.5,
          },
        }
      );
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  if (!product) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Product not found</h1>
          <p className="text-gray-400">The game you&apos;re looking for does not exist.</p>
        </div>
      </div>
    );
  }

  // Get the base image path for the current game
  const baseImagePath = imageMap[gameId] || imageMap.buzzed;
  // Remove any extension (.webp/.WEBP/.jpg/.jpeg) so numbered variants can append cleanly
  const baseName = baseImagePath.replace(/\.[^.]+$/, "");

  // Default numbered images (1, 2, 3)
  let mainImage = baseImagePath;
  let secondaryImage = `${baseName}1.webp`;
  let tertiaryImage = `${baseName}2.webp`;
  let quaternaryImage = `${baseName}3.webp`;

  // Handle mixed extensions for Court 52 assets
  if (gameId === "court-52") {
    secondaryImage = "/gallery/marketplace/Court 52 Pickleball1.jpg";
    tertiaryImage = "/gallery/marketplace/Court 52 Pickleball2.jpg";
    quaternaryImage = "/gallery/marketplace/Court 52 Pickleball3.WEBP";
  }

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      {/* Section 1: Hero (Image Left, Content Right) */}
      <section
        ref={(el) => el && sectionRefs.current.push(el)}
        className="py-20 px-6 md:px-12"
      >
        <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left: Image */}
          <div className="relative h-96 rounded-2xl overflow-hidden group">
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition duration-500"
              priority
            />
          </div>

          {/* Right: Content */}
          <div>
            <h1 className="text-6xl md:text-7xl font-black text-gray-900 mb-4">
              {product.name}
            </h1>
            <p className="text-2xl text-gray-600 font-semibold">
              {product.category}
            </p>
            <div className="mt-4 flex items-center gap-4">
              {product.regularPrice && product.regularPrice > product.price ? (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    Rs. {product.regularPrice?.toFixed(2)}
                  </span>
                  <span className="text-3xl font-bold text-emerald-600">
                    Rs. {product.price?.toFixed(2)}
                  </span>
                  <span className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded-full font-semibold">
                    Sale
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold text-emerald-600">
                  Rs. {product.price?.toFixed(2)}
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Players: {product.numberOfPlayers || "N/A"} • Age: {product.ageGroup || "N/A"}
            </p>
            <div className="mt-8">
              <AddToCartButton gameId={gameId} />
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Overview (Content Left, Image Right) */}
      <section
        ref={(el) => el && sectionRefs.current.push(el)}
        className="py-20 px-6 md:px-12 bg-gray-50"
      >
        <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div>
            <h2 className="text-4xl font-black text-gray-900 mb-6">About This Game</h2>
            <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
              {product.description && (
                <p>{product.description}</p>
              )}
              {product.longDescription && (
                <div>
                  {product.longDescription.split('\n\n').map((para, idx) => (
                    <p key={idx} className="mb-4">
                      {para}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Image */}
          <div className="relative h-96 rounded-2xl overflow-hidden group">
            <Image
              src={secondaryImage}
              alt="Game showcase"
              fill
              className="object-cover group-hover:scale-110 transition duration-500"
            />
          </div>
        </div>
      </section>

      

      {/* Section 4: Details (Image Left, Content Right) */}
      {/* (previously Section 3) */}
      {/* Keeping numbering consistent for readability */}
      <section
        ref={(el) => el && sectionRefs.current.push(el)}
        className="py-20 px-6 md:px-12"
      >
        <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left: Image */}
          <div className="relative h-96 rounded-2xl overflow-hidden group">
            <Image
              src={tertiaryImage}
              alt="Game details"
              fill
              className="object-cover group-hover:scale-110 transition duration-500"
            />
          </div>

          {/* Right: Content */}
          <div>
            <h2 className="text-4xl font-black text-gray-900 mb-6">
              Key Features
            </h2>

            {product.keyFeatures && product.keyFeatures.length > 0 ? (
              <div className="space-y-4">
                {product.keyFeatures.map((feature, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 text-emerald-600 text-2xl">✓</div>
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">{feature.title}</p>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-white/90 border border-white/60 px-6 py-4 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                  <Users className="text-gray-900 h-6 w-6" />
                  <div>
                    <p className="text-sm text-gray-600">Players</p>
                    <p className="text-xl font-bold text-gray-900">
                      {product.numberOfPlayers || 'N/A'}
                    </p>
                  </div>
                </div>

                {product.ageGroup && (
                  <div className="flex items-center gap-4 bg-white/90 border border-white/60 px-6 py-4 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                    <Zap className="text-gray-900 h-6 w-6" />
                    <div>
                      <p className="text-sm text-gray-600">Age</p>
                      <p className="text-xl font-bold text-gray-900">
                        {product.ageGroup}
                      </p>
                    </div>
                  </div>
                )}

                {product.stockAvailable !== undefined && (
                  <div className="flex items-center gap-4 bg-white/90 border border-white/60 px-6 py-4 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                    <div>
                      <p className="text-sm text-gray-600">In Stock</p>
                      <p className="text-xl font-bold text-gray-900">
                        {product.stockAvailable} units
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section: Players & Age (moved to last content section) */}
      <section
        ref={(el) => el && sectionRefs.current.push(el)}
        className="py-20 px-6 md:px-12"
      >
        <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div>
            <h2 className="text-4xl font-black text-gray-900 mb-6">Players & Age</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="flex items-center gap-3 bg-white/90 border border-white/60 px-5 py-3 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] max-w-xs w-full">
                <Users className="text-gray-900 h-5 w-5" />
                <div>
                  <p className="text-sm text-gray-600">Players</p>
                  <p className="text-xl font-bold text-gray-900">{product.numberOfPlayers || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/90 border border-white/60 px-5 py-3 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] max-w-xs w-full">
                <Zap className="text-gray-900 h-5 w-5" />
                <div>
                  <p className="text-sm text-gray-600">Age Group</p>
                  <p className="text-xl font-bold text-gray-900">{product.ageGroup || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Image */}
          <div className="relative h-96 rounded-2xl overflow-hidden group">
            <Image
              src={quaternaryImage}
              alt="Players and Age"
              fill
              className="object-cover group-hover:scale-110 transition duration-500"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-12 bg-gray-100 border-t border-gray-200">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-black text-gray-900 mb-6">Ready to bring the fun home?</h2>
          <p className="text-xl text-gray-700 mb-8">
            Unforgettable nights start here.
          </p>
          <AddToCartButton gameId={gameId} />
        </div>
      </section>
    </div>
  );
}
