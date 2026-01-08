"use client";

import { motion } from "framer-motion";
import { useRef } from "react";

/**
 * PlayfulHeading - Bouncy, playful heading animation with elastic effects
 * Perfect for joyful, game-focused brands
 *
 * @param {string} text - The heading text
 * @param {string} className - Tailwind classes
 * @param {string} as - HTML tag (default: 'h1')
 * @param {number} staggerDelay - Delay between letters (default: 0.03)
 * @param {boolean} drawStroke - Enable stroke drawing animation (default: false)
 */
const PlayfulHeading = ({
  text,
  className = "",
  as = "h1",
  staggerDelay = 0.03,
  drawStroke = false,
}) => {
  const ref = useRef(null);

  // Split text into individual letters
  const letters = Array.from(text);

  // Container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  // Jumping letter variants
  const letterVariants = {
    hidden: {
      opacity: 0,
      y: 60, // Start from below
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 10,
        stiffness: 150,
        mass: 0.8,
      },
    },
  };

  // Stroke drawing animation variants
  const strokeVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 2.5,
        ease: "easeInOut",
      },
    },
  };

  const MotionComponent = motion[as];

  // If drawStroke is enabled, render as SVG
  if (drawStroke) {
    return (
      <svg
        ref={ref}
        viewBox="0 0 1400 300"
        className={`w-full ${className}`}
        style={{ overflow: "visible" }}
      >
        <defs>
          <style>
            {`
              @keyframes drawText {
                from {
                  stroke-dashoffset: 1500;
                }
                to {
                  stroke-dashoffset: 0;
                }
              }
              .draw-text {
                stroke-dasharray: 1500;
                animation: drawText 2.5s ease-in-out forwards;
              }
            `}
          </style>
        </defs>
        <text
          x="0"
          y="220"
          className="draw-text font-monsieur-la-doulaise"
          fontSize="240"
          fontWeight="400"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {text}
        </text>
      </svg>
    );
  }

  // Default letter-by-letter animation
  return (
    <MotionComponent
      ref={ref}
      className={`overflow-visible inline-block ${className}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      {letters.map((letter, idx) => (
        <motion.span
          key={`${letter}-${idx}`}
          variants={letterVariants}
          className="inline-block cursor-grab active:cursor-grabbing"
          style={{ willChange: "transform" }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </MotionComponent>
  );
};

export default PlayfulHeading;
