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
 */
const PlayfulHeading = ({
  text,
  className = "",
  as = "h1",
  staggerDelay = 0.03,
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
        staggerChildren: 0.08, // Slower stagger for distinct jumps
        delayChildren: 0.2,
      },
    },
  };

  // Jumping letter variants
  const letterVariants = {
    hidden: {
      opacity: 0,
      y: 60, // Start from below
      scale: 0.5,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 10, // Low damping = high bounce
        stiffness: 150, // Springiness
        mass: 0.8,
      },
    },
  };

  // Fun hover effect for each letter
  const letterHover = {
    scale: 1.3,
    rotate: [0, -10, 10, -10, 0],
    y: -8,
    color: "#f7d57c", // Accent color (optional, can be removed if not needed)
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  };

  const MotionComponent = motion[as];

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
          whileHover={letterHover}
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
