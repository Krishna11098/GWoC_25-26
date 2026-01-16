"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Sparkles } from "lucide-react";
import "./ProofOfJoy.css";

export default function ProofOfJoy() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] },
    },
  };

  const labels = [
    { image: 1, text: "Games" },
    { image: 2, text: "Events" },
    { image: 3, text: "Corporate Experiences" },
    { image: 4, text: "Workshops" },
  ];

  // Function to get label text based on image number

  const getLabel = (imageNum) =>
    labels.find((l) => l.image === imageNum)?.text || "";

  return (
    <motion.section
      ref={sectionRef}
      className="relative py-20 md:py-28"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <motion.div
          variants={itemVariants}
          className="mb-20 text-center relative"
        >
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
            <h2 className="text-5xl md:text-7xl font-winky-rough tracking-tight leading-none">
              <span style={{ color: "var(--dark-teal)" }}>Proof of</span>{" "}
              <span
                className="relative inline-block drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
                style={{ color: "var(--light-orange)" }}
              >
                Joy
                <motion.span
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                    opacity: [0.8, 1, 0.8],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-4 -right-8"
                  style={{ color: "var(--light-orange)" }}
                >
                  <Sparkles size={32} fill="currentColor" />
                </motion.span>
                <motion.span
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                  className="absolute -bottom-2 -left-6 text-font/60 scale-75 blur-[1px]"
                >
                  <Sparkles size={20} fill="currentColor" />
                </motion.span>
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
        </motion.div>

        {/* ---------- IMAGE GRID ---------- */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[600px] md:h-[800px]"
        >
          {/* Left: Single large image */}
          <div className="relative h-[400px] md:h-full overflow-hidden rounded-3xl shadow-2xl image-hover-wrapper">
            <Image
              src="/gallery/image1.png"
              alt="Gallery Image 1"
              fill
              className="object-cover image-hover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            <div className="image-label">
              <span>{getLabel(1)}</span>
            </div>
          </div>

          {/* Right: Top and bottom sections */}
          <div className="flex flex-col gap-6 h-[800px] md:h-full">
            {/* Top: Single image */}
            <div className="relative h-1/2 overflow-hidden rounded-3xl shadow-2xl image-hover-wrapper">
              <Image
                src="/gallery/image2.png"
                alt="Gallery Image 2"
                fill
                className="object-cover image-hover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="image-label">
                <span>{getLabel(2)}</span>
              </div>
            </div>

            {/* Bottom: Two images side by side */}
            <div className="grid grid-cols-2 gap-6 h-1/2">
              <div className="relative overflow-hidden rounded-3xl shadow-2xl image-hover-wrapper">
                <Image
                  src="/gallery/image3.png"
                  alt="Gallery Image 3"
                  fill
                  className="object-cover image-hover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="image-label">
                  <span>{getLabel(3)}</span>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-3xl shadow-2xl image-hover-wrapper">
                <Image
                  src="/gallery/image4.png"
                  alt="Gallery Image 4"
                  fill
                  className="object-cover image-hover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="image-label">
                  <span>{getLabel(4)}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
