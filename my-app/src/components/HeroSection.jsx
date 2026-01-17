"use client";

import { Poppins, Baloo_2, Londrina_Sketch } from "next/font/google";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Gallery images
  const galleryImages = [
    "/gallery/image1.png",
    "/gallery/image2.png",
    "/gallery/image3.png",
    "/gallery/image4.png",
    "/gallery/image5.png",
    "/gallery/image6.png",
  ];

  // Rotate images every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

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
      className="relative w-full h-screen flex flex-col"
      style={{
        backgroundColor: "var(--bg)",
        transform: `scale(${scale})`,
        opacity,
        transformOrigin: "center center",
        transition: "filter 0.1s ease-out",
        willChange: "transform, opacity",
      }}
    >
      {/* Main Content - Left and Right Sections */}
      <div className="container mx-auto px-8 md:px-16 pt-20 md:pt-1 pb-1 flex-1 flex items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center w-full">
          {/* LEFT SECTION - Text Content */}
          <div className="flex flex-col gap-8 md:gap-12">
            {/* Joy Juncture */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1
                className={`text-7xl md:text-7xl lg:text-8xl font-black ${londrinaSketch.className}`}
                style={{
                  color: "var(--dark-teal)",
                  fontSize: "clamp(2.9rem, 11vw, 9rem)",
                  fontWeight: 900,
                }}
              >
                JOY JUNCTURE
              </h1>
            </motion.div>

            {/* Subheading */}
            <motion.div
              className="max-w-2xl"
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

          {/* RIGHT SECTION - Images */}
          <div className="relative h-[400px] md:h-[500px]">
            {/* Background Image - Tilted */}
            <motion.div
              initial={{ opacity: 0, rotate: -5, scale: 0.9 }}
              animate={{ opacity: 1, rotate: -5, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="absolute top-0 left-0 w-[280px] md:w-[350px] h-[300px] md:h-[400px] backdrop-blur-sm p-3 md:p-4 rounded-[2rem] md:rounded-[3rem] shadow-2xl border-4"
              style={{
                transform: "rotate(-5deg)",
                borderColor: "var(--dark-teal)",
              }}
              style={{ transform: "rotate(-5deg)" }}
              key={`bg-${currentImageIndex}`}
            >
              <motion.img
                key={`bg-img-${currentImageIndex}`}
                src={galleryImages[currentImageIndex]}
                alt="Gallery Background"
                className="w-full h-full object-cover rounded-[1.5rem] md:rounded-[2.5rem]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              />
            </motion.div>

            {/* Foreground Image - Overlapped and Tilted */}
            <motion.div
              initial={{ opacity: 0, rotate: 5, scale: 0.9 }}
              animate={{ opacity: 1, rotate: 5, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute bottom-8 right-0 w-[280px] md:w-[350px] h-[300px] md:h-[400px] backdrop-blur-sm p-3 md:p-4 rounded-[2rem] md:rounded-[3rem] shadow-2xl border-4"
              style={{
                transform: "rotate(5deg)",
                zIndex: 10,
                borderColor: "var(--dark-teal)",
              }}
              style={{ transform: "rotate(5deg)", zIndex: 10 }}
              key={`fg-${(currentImageIndex + 1) % galleryImages.length}`}
            >
              <motion.img
                key={`fg-img-${(currentImageIndex + 1) % galleryImages.length}`}
                src={
                  galleryImages[(currentImageIndex + 1) % galleryImages.length]
                }
                alt="Gallery Foreground"
                className="w-full h-full object-cover rounded-[1.5rem] md:rounded-[2.5rem]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Marquee at Bottom */}
      <div className="w-full mt-auto bg-light-blue py-6 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="text-2xl md:text-5xl font-bold px-8"
              style={{ color: "var(--dark-teal)" }}
            >
              Play. Connect. Celebrate.
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
