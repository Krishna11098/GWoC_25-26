"use client";

import { Poppins, Baloo_2, Londrina_Sketch } from "next/font/google";
import Image from "next/image";
import { motion } from "framer-motion";

import PlayfulHeading from "./PlayfulHeading";
import { Weight } from "lucide-react";

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const londrinaSketch = Londrina_Sketch({
  subsets: ["latin"],
  weight: ["400"],
});

export default function HeroSection({ scrollProgress = 0 }) {
  const scale = 1 - scrollProgress * 0.1;
  const opacity = 1 - scrollProgress * 0.3;

  // Gallery images
  const galleryImages = [
    "/gallery/image1.png",
    "/gallery/image2.png",
    "/gallery/image3.png",
    "/gallery/image4.png",
    "/gallery/image5.png",
    "/gallery/image6.png",
  ];

  const subheadingText =
    "JoyJuncture creates playful, immersive game experiences for events, workshops, and communities";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      filter: "blur(4px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 120,
      },
    },
  };

  const words = subheadingText.split(" ");

  return (
    <section
      className="relative w-full py-12 md:py-20"
      style={{
        backgroundColor: "var(--bg)",
        transform: `scale(${scale})`,
        opacity,
        transformOrigin: "center center",
        transition: "filter 0.1s ease-out",
        willChange: "transform, opacity",
      }}
    >
      {/* Top Section - Vertical Layout */}
      <div className="container mx-auto px-8 md:px-16 py-8 md:py-12">
        <div className="flex flex-col gap-8 md:gap-12 my-10 items-center text-center">
          {/* Joy Juncture */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1
              className={`text-6xl md:text-7xl lg:text-8xl font-black ${londrinaSketch.className}`}
              style={{
                color: "var(--dark-teal)",
                fontSize: "clamp(3rem, 12vw, 9rem)",
                fontWeight: 900,
              }}
            >
              JOY JUNCTURE
            </h1>
          </motion.div>

          {/* Subheading */}
          <motion.div
            className="max-w-3xl"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <h2
              className="text-lg md:text-2xl lg:text-3xl font-semibold leading-relaxed tracking-tight"
              style={{ color: "var(--dark-teal)" }}
            >
              {words.map((word, idx) => (
                <motion.span
                  key={`${word}-${idx}`}
                  variants={wordVariants}
                  style={{ display: "inline-block", marginRight: "0.25em" }}
                >
                  {word}
                </motion.span>
              ))}
            </h2>
          </motion.div>
        </div>

        {/* Call to Action */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-12 md:mt-16 flex gap-4 md:gap-6 flex-wrap"
        >
          <button
            className="px-8 md:px-10 py-3 md:py-4 font-bold text-white rounded-lg transition-all hover:scale-105 text-base md:text-lg"
            style={{ backgroundColor: "var(--light-orange)" }}
          >
            Explore Games
          </button>
          <button
            className="px-8 md:px-10 py-3 md:py-4 font-bold rounded-lg transition-all hover:scale-105 text-base md:text-lg border-2"
            style={{
              borderColor: "var(--dark-teal)",
              color: "var(--dark-teal)",
            }}
          >
            Book Event
          </button>
        </motion.div> */}
      </div>

      {/* Bottom Section - Gallery Images */}
      <div className="w-full relative overflow-hidden pb-12 md:pb-16 ">
        <div className="flex animate-marquee whitespace-nowrap hover:pause-scroll">
          {[...galleryImages, ...galleryImages, ...galleryImages].map(
            (src, index) => (
              <div
                key={index}
                className="inline-block px-3 md:px-4 w-[240px] md:w-[450px] shrink-0"
              >
                <div className="bg-orange/10 backdrop-blur-sm p-2 md:p-3 rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl border-2 border-orange transform hover:scale-105 transition-transform duration-500">
                  <img
                    src={src}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-40 md:h-72 object-cover rounded-[1.2rem] md:rounded-[2rem]"
                  />
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
