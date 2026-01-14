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
  "dreamers-fair": "/gallery/marketplace/Dreamer's Fair.WEBP",
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
    const ctx = gsap.context(() => {
      // 1. General Section Animations
      sectionRefs.current.forEach((section) => {
        if (!section || section === howToSectionRef.current) return;
        gsap.fromTo(
          section,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              end: "top 20%",
              scrub: 0.5,
            },
          }
        );
      });

      // 2. How To Play - definitive gap fix
      if (howToSectionRef.current && howToStepRefs.current.length > 0) {
        const steps = howToStepRefs.current.filter(Boolean);

        // Step 1 stays visible; others start hidden
        gsap.set(steps.slice(1), { opacity: 0, y: 40 });
        gsap.set(steps[0], { opacity: 1, y: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: howToSectionRef.current,
            start: "top center", // pin as soon as section hits center to remove gap
            end: `+=${steps.length * 500}`,
            scrub: 1,
            pin: true,
            pinSpacing: true,
            invalidateOnRefresh: true,
          },
        });

        // Animate from Step 2 onward
        steps.forEach((el, i) => {
          if (i === 0) return;
          tl.to(
            el,
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power2.out",
            },
            i === 1 ? 0.1 : ">-0.2" // Step 2 starts immediately after pin
          );
        });
      }
    });

    return () => ctx.revert();
  }, [product]);

  if (!product) return null;

  const baseImagePath = imageMap[gameId] || imageMap.buzzed;
  const baseName = baseImagePath.replace(/\.[^.]+$/, "");

  let mainImage = baseImagePath;
  let secondaryImage = `${baseName}1.webp`;
  let tertiaryImage = `${baseName}2.webp`;
  let quaternaryImage = `${baseName}3.webp`;

  if (gameId === "court-52") {
    secondaryImage = "/gallery/marketplace/Court 52 Pickleball1.jpg";
    tertiaryImage = "/gallery/marketplace/Court 52 Pickleball2.jpg";
    quaternaryImage = "/gallery/marketplace/Court 52 Pickleball3.WEBP";
  }

  return (
    <div style={{ backgroundColor: "var(--bg)", color: "var(--color-font)" }} className="min-h-screen pt-24">
      {/* Hero Section */}
      <section ref={(el) => el && sectionRefs.current.push(el)} className="py-20 px-6 md:px-12">
        <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative h-96 rounded-2xl overflow-hidden group">
            <Image src={mainImage} alt={product.name} fill className="object-cover transition duration-500" priority />
          </div>
          <div>
            <h1 className="text-5xl md:text-6xl font-black mb-4">{product.name}</h1>
            <p className="text-2xl font-semibold">{product.category}</p>
            <div className="mt-4">
              <span className="text-3xl font-bold">Rs. {product.price?.toFixed(2)}</span>
            </div>
            <div className="mt-8">
              <AddToCartButton gameId={gameId} />
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section ref={(el) => el && sectionRefs.current.push(el)} className="py-20 px-6 md:px-12">
        <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-black mb-6">About This Game</h2>
            <div className="space-y-4 text-lg leading-relaxed">
              {product.longDescription?.split("\n\n").map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </div>
          <div className="relative h-96 rounded-2xl overflow-hidden group">
            <Image src={secondaryImage} alt="showcase" fill className="object-cover group-hover:scale-110 transition duration-500" />
          </div>
        </div>
      </section>

      {/* How to Play Section */}
      {product.howToPlay && (
        <section
          ref={howToSectionRef}
          className="how-to-section px-6 md:px-12"
          style={{
            backgroundColor: "var(--bg)",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            margin: 0,
            padding: "20px 0",
            position: "relative",
            overflow: "visible",
          }}
        >
          <div className="mx-auto max-w-7xl w-full">
            <div className="flex justify-center mb-12">
              <div className="px-12 py-4 clip-path-hexagon" style={{ backgroundColor: "var(--color-font)", color: "white" }}>
                <h2 className="text-4xl md:text-5xl font-black tracking-wider text-center">HOW TO PLAY</h2>
              </div>
            </div>

            <div className="relative flex flex-col lg:flex-row items-stretch justify-center gap-0 w-full">
              {product.howToPlay.map((step, idx) => (
                <div
                  key={idx}
                  ref={(el) => (howToStepRefs.current[idx] = el)}
                  className="relative flex-1 min-h-[350px] flex flex-col items-center justify-center px-8 py-12"
                  style={{
                    backgroundColor: ["var(--color-pink)", "var(--color-green)", "var(--color-orange)", "var(--color-pink)"][idx % 4],
                    clipPath: "polygon(5% 0, 95% 0, 100% 50%, 95% 100%, 5% 100%, 0 50%)",
                    opacity: idx === 0 ? 1 : 0,
                    transform: idx === 0 ? "translateY(0)" : "translateY(40px)",
                  }}
                >
                  <div className="bg-white rounded-full px-6 py-2 mb-4 shadow-lg">
                    <span className="text-base font-black" style={{ color: "var(--color-font)" }}>STEP {idx + 1}</span>
                  </div>
                  <div className="text-center max-w-xs">
                    <h3 className="text-xl font-black mb-3 uppercase text-white">{step.title}</h3>
                    <p className="text-base text-white/90 leading-snug">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-12 text-center border-t border-black/5">
        <h2 className="text-4xl font-black mb-6">Ready to bring the fun home?</h2>
        <AddToCartButton gameId={gameId} />
      </section>
    </div>
  );
}

