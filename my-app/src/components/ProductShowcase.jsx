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
    // Use correct extension and character for Dreamer's Fair asset
    // File present in /public/gallery/marketplace/Dreamer’s Fair.WEBP
    "dreamers-fair": "/gallery/marketplace/Dreamer’s Fair.WEBP",
  "judge-me-guess": "/gallery/marketplace/Judge Me & Guess.webp",
  mehfil: "/gallery/marketplace/Mehfil – The Ultimate Musical Card Game.webp",
  "one-more-round": "/gallery/marketplace/One More Round.webp",
  tamasha: "/gallery/marketplace/Tamasha – The Bollywood Bid Card Game.webp",
  "the-bloody-inheritance": "/gallery/marketplace/The Bloody Inheritance.webp",
};

export default function ProductShowcase({ product, gameId }) {
  const sectionRefs = useRef([]);
  const howToSectionRef = useRef(null);
  const howToStepRefs = useRef([]);

  useEffect(() => {
    // Animate general sections on scroll
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

    // Sequential arrow reveal for How to Play steps
    if (howToSectionRef.current && howToStepRefs.current.length > 0) {
      const steps = howToStepRefs.current.filter(Boolean);

      // Initial state: all hidden
      gsap.set(steps, { opacity: 0, y: 20 });

      // Give extra scroll runway so the final (4th) step can finish animating without the page snapping upward
      const pinDuration = (steps.length + 1) * 350; // 4 steps -> 1750px of scroll

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: howToSectionRef.current,
          // Pin the section when its center hits the viewport center
          // so it stays vertically centered while animating steps
          start: "center center",
          end: `+=${pinDuration}`,
          scrub: 1,
          pin: true,
        },
      });

      steps.forEach((el, i) => {
        tl.to(el, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, i === 0 ? 0 : "+=0.6");
      });
    }

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
    <div className="bg-white text-gray-900 min-h-screen pt-24">
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

      {/* Section: How to Play (with horizontal arrow/chevron steps) */}
      {product.howToPlay && product.howToPlay.length > 0 && (
        <section ref={howToSectionRef} className="py-20 px-6 md:px-12 bg-gray-50 overflow-hidden">
          <div className="mx-auto max-w-7xl">
            {/* Title Badge */}
            <div className="flex justify-center mb-12">
              <div className="bg-gray-900 text-white px-12 py-4 clip-path-hexagon relative">
                <h2 className="text-4xl md:text-5xl font-black tracking-wider">
                  HOW TO PLAY
                </h2>
              </div>
            </div>

            {/* Horizontal Arrow Steps */}
            <div className="relative flex flex-col lg:flex-row items-stretch justify-center gap-0">
              {product.howToPlay.map((step, idx) => {
                const colors = [
                  'bg-purple-200', // Step 1
                  'bg-teal-400',   // Step 2
                  'bg-cyan-300',   // Step 3
                  'bg-purple-300', // Step 4
                ];
                
                return (
                  <div
                    key={idx}
                    ref={(el) => (howToStepRefs.current[idx] = el)}
                    className={`
                      relative flex-1 min-h-[400px] lg:min-h-[320px] flex flex-col items-center justify-center px-8 py-12
                      ${colors[idx % colors.length]}
                      transition-all duration-700
                    `}
                    style={{ 
                      willChange: 'opacity, transform',
                      // Both sides pointed chevron (><) for all steps
                      clipPath: 'polygon(5% 0, 95% 0, 100% 50%, 95% 100%, 5% 100%, 0 50%)'
                    }}
                  >
                    {/* Step Badge */}
                    <div className="bg-white rounded-full px-6 py-2 mb-4 shadow-lg">
                      <span className="text-base md:text-lg font-black text-gray-900 tracking-wide">
                        STEP {idx + 1}
                      </span>
                    </div>

                    {/* Step Content */}
                    <div className="text-center max-w-xs">
                      <h3 className="text-xl md:text-2xl font-black text-white mb-3 uppercase leading-tight">
                        {step.title}
                      </h3>
                      <p className="text-base md:text-lg text-white/90 leading-snug">
                        {step.description}
                      </p>
                    </div>

                    {/* Decorative dots (optional) */}
                    <div className="absolute top-4 left-4 flex gap-1">
                      <div className="w-2 h-2 bg-black/20 rounded-full"></div>
                      <div className="w-2 h-2 bg-black/20 rounded-full"></div>
                      <div className="w-2 h-2 bg-black/20 rounded-full"></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bonus Section removed as requested */}
          </div>

          {/* clip-path-hexagon class moved to global CSS to avoid styled-jsx hydration mismatches */}
        </section>
      )}

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
