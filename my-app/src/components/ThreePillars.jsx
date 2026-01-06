"use client";
import React, { useLayoutEffect, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";



const cardsData = [
  {
    id: 1,
    title: "Play at Home",
    color: "bg-[#cbd8ac]",
    bgPos: "0% 50%",
  },
  {
    id: 2,
    title: "Play Together",
    color: "bg-[#f7d57c]",
    bgPos: "33.3% 50%",
  },
  {
    id: 3,
    title: "Play for Occasions",
    color: "bg-[#f5cfc2]",
    bgPos: "66.6% 50%",
  },
  {
    id: 4,
    title: "Play and Earn Points",
    color: "bg-[#d1d1d1]",
    bgPos: "100% 50%",
  },
];

// const stickyBg =
//   'url(\'data:image/svg+xml;utf8,<svg width="1440" height="939" viewBox="0 0 1440 639" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1435.72 65.3239C1490.83 78.3125 999.107 -31.8236 818.424 27.8566C682.841 72.6399 857.152 148.702 724.727 194.711C572.621 247.557 301.843 140.912 185.973 204.702C97.1739 253.589 287.001 300.744 220.421 354.071C167.666 396.325 9.60393 435.001 -19.3317 435.001H-40" stroke="%23F7D57C" stroke-width="20" stroke-linecap="round" stroke-opacity="0.8"/><path d="M1891.72 259.324C1946.83 272.313 1455.11 162.176 1274.42 221.857C1138.84 266.64 1313.15 342.702 1180.73 388.711C1028.62 441.557 757.843 334.912 641.973 398.702C553.174 447.589 743.001 494.744 676.421 548.071C623.666 590.325 459.164 617.594 315 627.001C188.461 635.257 -9 605.501 -9 605.501" stroke="%23F5CFC2" stroke-width="20" stroke-linecap="round" stroke-opacity="0.8"/><path d="M1619.72 160.324C1674.83 173.313 1183.11 63.1764 1002.42 122.857C866.841 167.64 1041.15 243.702 908.727 289.711C756.621 342.557 485.843 235.912 369.973 299.702C281.174 348.589 471.001 395.744 404.421 449.071C351.666 491.325 262.637 517.061 164.668 530.001C98.2049 538.779 -7 530.001 -7 530.001" stroke="%23CBD8AC" stroke-width="20" stroke-linecap="round" stroke-opacity="0.8"/></svg>\')';

export default function ThreePillars() {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Background alignment logic
      const updateBgPosition = () => {
        if (!containerRef.current) return;
        const offsetTop = containerRef.current.offsetTop;
        gsap.set(containerRef.current, {
          backgroundPositionY: -offsetTop,
          backgroundPositionX: "center",
        });
      };

      updateBgPosition();
      window.addEventListener("resize", updateBgPosition);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=1500", // Slightly shorter for better feel
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // 1. Initial Horizontal Spread
      tl.to(cardsRef.current, {
        x: (i) => (i - 1.5) * 340,
        duration: 1,
        ease: "power2.inOut",
      });

      // 2. The 3D Flip
      tl.to(
        cardsRef.current,
        {
          rotationY: 180,
          duration: 1,
          stagger: 0.1,
          ease: "back.out(1.2)", // More "premium" feel
        },
        "-=0.5"
      );

      // Refresh to capture initial layout
      ScrollTrigger.refresh();

      return () => {
        window.removeEventListener("resize", updateBgPosition);
      };
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-screen w-full flex flex-col items-center justify-center overflow-hidden relative bg-sticky"
    //   style={{
    //     backgroundImage: stickyBg,
    //     backgroundRepeat: "repeat-y",
    //     backgroundSize: "100% auto",
    //     backgroundColor: "var(--bg)",
    //   }}
    >
      <h2 className="text-font text-4xl md:text-5xl font-winky-rough mb-20 z-10 text-center px-4 max-w-2xl">
        Choose your playstyle
      </h2>

      <div className="relative w-[300px] h-[450px] perspective-1000">
        {cardsData.map((card, i) => (
          <div
            key={card.id}
            ref={(el) => (cardsRef.current[i] = el)}
            className="absolute inset-0 w-full h-full preserve-3d"
          >
            {/* FRONT */}
            <div
              className="absolute inset-0 backface-hidden rounded-3xl border border-font/10 shadow-xl overflow-hidden"
              style={{
                backgroundImage: `url('/gallery/image1.png')`,
                backgroundSize: "1200px 450px",
                backgroundPosition: card.bgPos,
              }}
            />

            {/* BACK */}
            <div
              className={`absolute inset-0 backface-hidden rotate-y-180 rounded-3xl flex flex-col justify-end p-8 ${card.color} border border-font/20 shadow-2xl`}
            >
              <span className="text-font/50 text-sm mb-2 font-mono">
                (0{card.id})
              </span>
              <h3 className="text-font text-2xl font-winky-rough leading-tight">
                {card.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
