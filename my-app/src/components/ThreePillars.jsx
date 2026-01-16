"use client";
import React, { useLayoutEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SoftWaveBackground from "./SoftWaveBackground";

const cardsData = [
  {
    id: 1,
    title: "Play at Home",
    color: "bg-[#FA9660]",
    bgPos: "0% 50%",
    image: "/pillars/home.png",
  },
  {
    id: 2,
    title: "Play Together",
    color: "bg-[#A5C5F2]",
    bgPos: "33.3% 50%",
    image: "/pillars/together.png",
  },
  {
    id: 3,
    title: "Play for Occasions",
    color: "bg-[#FF9FC8]",
    bgPos: "66.6% 50%",
    image: "/pillars/occasions.png",
  },
  {
    id: 4,
    title: "Play and Earn",
    color: "bg-[#f7d57c]",
    bgPos: "100% 50%",
    image: "/pillars/earn.png",
  },
];

// const stickyBg =
//   'url(\'data:image/svg+xml;utf8,<svg width="1440" height="939" viewBox="0 0 1440 639" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1435.72 65.3239C1490.83 78.3125 999.107 -31.8236 818.424 27.8566C682.841 72.6399 857.152 148.702 724.727 194.711C572.621 247.557 301.843 140.912 185.973 204.702C97.1739 253.589 287.001 300.744 220.421 354.071C167.666 396.325 9.60393 435.001 -19.3317 435.001H-40" stroke="%23F7D57C" stroke-width="20" stroke-linecap="round" stroke-opacity="0.8"/><path d="M1891.72 259.324C1946.83 272.313 1455.11 162.176 1274.42 221.857C1138.84 266.64 1313.15 342.702 1180.73 388.711C1028.62 441.557 757.843 334.912 641.973 398.702C553.174 447.589 743.001 494.744 676.421 548.071C623.666 590.325 459.164 617.594 315 627.001C188.461 635.257 -9 605.501 -9 605.501" stroke="%23F5CFC2" stroke-width="20" stroke-linecap="round" stroke-opacity="0.8"/><path d="M1619.72 160.324C1674.83 173.313 1183.11 63.1764 1002.42 122.857C866.841 167.64 1041.15 243.702 908.727 289.711C756.621 342.557 485.843 235.912 369.973 299.702C281.174 348.589 471.001 395.744 404.421 449.071C351.666 491.325 262.637 517.061 164.668 530.001C98.2049 538.779 -7 530.001 -7 530.001" stroke="%23CBD8AC" stroke-width="20" stroke-linecap="round" stroke-opacity="0.8"/></svg>\')';

export default function ThreePillars() {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  // Horizontal target positions (row of 4) — increased spacing to avoid overlap
  const desktopGridPositions = [
    { x: -510, y: 0 },
    { x: -170, y: 0 },
    { x: 170, y: 0 },
    { x: 510, y: 0 },
  ];

  const mobileGridPositions = [
    { x: -82, y: -115 }, // Top Left
    { x: 82, y: -115 }, // Top Right
    { x: -82, y: 115 }, // Bottom Left
    { x: 82, y: 115 }, // Bottom Right
  ];

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: "(min-width: 768px)",
        isMobile: "(max-width: 767px)",
      },
      (context) => {
        const { isDesktop, isMobile } = context.conditions;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: isDesktop ? "+=1200" : "+=800",
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Initial stacked state
        gsap.set(cardsRef.current, {
          x: 0,
          y: (i) => i * 12,
          scale: isDesktop ? 0.9 : 0.75,
          rotationY: 0,
          zIndex: (i) => cardsData.length - i,
        });

        // Animate cards from stacked to grid/row and grow
        tl.to(cardsRef.current, {
          x: (i) =>
            isDesktop ? desktopGridPositions[i].x : mobileGridPositions[i].x,
          y: (i) =>
            isDesktop ? desktopGridPositions[i].y : mobileGridPositions[i].y,
          scale: isDesktop ? 1 : 0.82,
          duration: 1.2,
          ease: "power2.out",
          stagger: 0.05,
        })
          // Flip cards
          .to(
            cardsRef.current,
            {
              rotationY: 180,
              duration: 0.9,
              stagger: 0.08,
              ease: "back.out(1.1)",
            },
            ">-0.1"
          );

        return () => {
          // Cleanup handled by mm.revert()
        };
      }
    );

    // Background alignment logic (remains independent of matchMedia for simplicity)
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

    return () => {
      mm.revert();
      window.removeEventListener("resize", updateBgPosition);
    };
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
      <SoftWaveBackground height="400px" className="pointer-events-none" />
      <div className="mb-8 z-10 text-center">
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
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-winky-rough tracking-tight leading-none">
            <span style={{ color: "var(--black)" }}>Choose your</span>{" "}
            <span
              className="relative inline-block drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
              style={{ color: "var(--dark-teal)" }}
            >
              playstyle
            </span>
          </h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "60px" }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="h-1.5 rounded-full mt-4 shadow-sm"
            style={{ backgroundColor: "var(--dark-teal)" }}
          />
        </motion.div>
      </div>

      <div
        className="relative w-full max-w-4xl h-[520px] md:h-[560px] px-4"
        style={{ perspective: "1000px" }}
      >
        {cardsData.map((card, i) => (
          <div
            key={card.id}
            ref={(el) => (cardsRef.current[i] = el)}
            className="absolute inset-0 w-full h-full"
            style={{
              transformStyle: "preserve-3d",
              WebkitTransformStyle: "preserve-3d",
            }}
          >
            {/* FRONT */}
            <div
              className="absolute left-1/2 top-1/2 w-[180px] md:w-[320px] h-[260px] md:h-[420px] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-font/10 shadow-xl overflow-hidden bg-[length:800px_300px] md:bg-[length:1300px_480px]"
              style={{
                backgroundImage: `url('/gallery/image1.png')`,
                backgroundPosition: card.bgPos,
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(0deg)",
              }}
            />

            {/* BACK */}
            <div
              className={`absolute left-1/2 top-1/2 w-[180px] md:w-[320px] h-[260px] md:h-[420px] -translate-x-1/2 -translate-y-1/2 rounded-3xl flex flex-col border-4 border-white shadow-2xl ${card.color} overflow-hidden`}
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              {/* Image occupies rest of space */}
              <div className="flex-1 overflow-hidden">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text at bottom */}
              <div className="p-4 md:p-6 text-center relative bg-inherit">
                <h3 className="text-black text-xl md:text-2xl lg:text-3xl font-winky-rough leading-tight drop-shadow-sm">
                  {card.title}
                </h3>
                <div className="mt-2 h-1 w-12 bg-font/20 mx-auto rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
