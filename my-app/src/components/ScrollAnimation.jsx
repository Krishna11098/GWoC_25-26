"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollAnimation() {
  const pathRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    const path = pathRef.current;
    const container = containerRef.current;

    if (!path || !container) return () => {};

    const pathLength = path.getTotalLength();
    path.style.strokeDasharray = pathLength;
    path.style.strokeDashoffset = pathLength;

    gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top center",
        end: "bottom bottom",
        scrub: 1,
        markers: false,
        onUpdate: (self) => {
          const drawLength = pathLength * (1 - self.progress);
          path.style.strokeDashoffset = drawLength;
        },
      },
    });

    const handleResize = () => {
      const newPathLength = path.getTotalLength();
      path.style.strokeDasharray = newPathLength;
      path.style.strokeDashoffset = newPathLength;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      gsap.killTweensOf(path);
    };
  }, []);

  return (
    <section className="relative w-full px-8 md:px-16 py-16 md:py-32 bg-(--color-background-2)">
      {/* SVG Background Container - Fixed */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden z-0"
        style={{
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <svg
          viewBox="0 0 330 809"
          fill="none"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        >
          <path
            ref={pathRef}
            d="M294.852 35.0003C294.852 35.0003 45.8518 42.0003 45.8518 184C45.8519 336.633 325.137 355.544 275.852 500C246.852 585 -38.1482 756 52.8518 524C143.852 292 265.852 774 265.852 774"
            stroke="#E37434"
            strokeWidth="70"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transition: "stroke-dashoffset 0.1s ease-out",
              willChange: "stroke-dashoffset",
            }}
          />
        </svg>
      </div>

      {/* Content Container - Trigger for scroll animation */}
      <div
        className="relative z-10 max-w-6xl mx-auto flex flex-col gap-40"
        ref={containerRef}
      >
        <div className="flex flex-col gap-6 justify-center">
          <div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900">
              Choose your play-style
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            <div className="w-full ">
              <div className="w-full px-8 py-12 text-center bg-(--color-foreground) rounded-2xl flex items-center justify-center min-h-[200px]">
                <h3 className="text-xl md:text-2xl font-semibold text-gray-900">
                  Play at Home
                </h3>
              </div>
            </div>
            <div className="w-full">
              <div className="w-full px-8 py-12 text-center bg-(--color-foreground) rounded-2xl flex items-center justify-center min-h-[200px]">
                <h3 className="text-xl md:text-2xl font-semibold text-gray-900">
                  Play Together (Live)
                </h3>
              </div>
            </div>
            <div className="w-full">
              <div className="w-full px-8 py-12 text-center bg-(--color-foreground) rounded-2xl flex items-center justify-center min-h-[200px]">
                <h3 className="text-xl md:text-2xl font-semibold text-gray-900">
                  Play for Occasions
                </h3>
              </div>
            </div>
            <div className="w-full">
              <div className="w-full px-8 py-12 text-center bg-(--color-foreground) rounded-2xl flex items-center justify-center min-h-[200px]">
                <h3 className="text-xl md:text-2xl font-semibold text-gray-900">
                  Play and Earn Points
                </h3>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-center gap-8 text-gray-900">
          <div className="flex-1 flex flex-col justify-center">
            <div className="px-8 py-12 text-center lg:text-left bg-theme rounded-2xl flex flex-col gap-4">
              <h2 className="text-2xl md:text-3xl font-bold">
                What's happening now
              </h2>
              <p className="text-base md:text-lg leading-relaxed">
                Currently happening and comming next event updates .
              </p>
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <div className="px-8 py-12 bg-theme rounded-2xl flex flex-col gap-4">
              <h3 className="text-xl md:text-2xl font-semibold">
                Dynamic content
              </h3>
              <div className="w-full">
                <Image
                  src="/img2.jpg"
                  alt="Illustration 2"
                  width={800}
                  height={600}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-center gap-8 text-gray-900">
          <div className="flex-1 flex flex-col justify-center">
            <div className="w-full">
              <Image
                src="/img3.jpg"
                alt="Illustration 3"
                width={800}
                height={600}
                className="w-full h-auto"
              />
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <div className="px-8 py-12 text-center lg:text-left bg-theme rounded-2xl flex flex-col gap-4">
              <h2 className="text-2xl md:text-3xl font-bold">
                Built for increasing information demands
              </h2>
              <p className="text-base md:text-lg leading-relaxed">
                Whether it is files, notes, or incoming messages, the app sorts
                and prioritizes items automatically. It prevents clutter and
                helps maintain clarity during busy periods.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
