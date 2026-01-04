"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

/**
 * AnimatedHeading Component
 *
 * A reusable heading component with smooth scroll-triggered animations.
 * Each word animates upward with fade-in effect, staggered for premium feel.
 *
 * @param {string} text - The heading text to animate
 * @param {string} className - Additional Tailwind classes for styling
 * @param {'word' | 'letter'} animateBy - Animate by word or letter (default: 'word')
 * @param {number} staggerDelay - Delay between each animated unit in seconds (default: 0.08)
 * @param {number} duration - Animation duration for each unit in seconds (default: 0.6)
 * @param {number} yOffset - Vertical offset for initial position in pixels (default: 50)
 * @param {boolean} once - Whether animation should trigger only once (default: false)
 * @param {string} as - HTML tag to render (default: 'h1')
 */
const AnimatedHeading = ({
  text,
  className = "",
  animateBy = "word",
  staggerDelay = 0.08,
  duration = 0.6,
  yOffset = 50,
  once = false,
  as = "h1",
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once,
    margin: "-100px",
    amount: 0.3,
  });

  // Split text into words or letters
  const splitText = () => {
    if (animateBy === "letter") {
      return text.split("").map((char, index) => ({
        content: char === " " ? "\u00A0" : char,
        index,
      }));
    }

    // Split by words, preserving spaces
    return text.split(" ").map((word, index) => ({
      content: word,
      index,
    }));
  };

  const units = splitText();

  // Animation variants for container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
      },
    },
  };

  // Animation variants for each text unit (word/letter)
  const unitVariants = {
    hidden: {
      opacity: 0,
      y: yOffset,
      rotateX: -10,
      filter: "blur(4px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      filter: "blur(0px)",
      transition: {
        duration,
        ease: [0.25, 0.4, 0.25, 1], // Custom cubic-bezier for smooth easing
        opacity: { duration: duration * 0.8 },
        filter: { duration: duration * 0.7 },
      },
    },
  };

  // Dynamically render the heading tag
  const MotionComponent = motion[as];

  return (
    <MotionComponent
      ref={ref}
      className={`overflow-hidden ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      style={{ perspective: "1000px" }}
    >
      {units.map((unit, idx) => (
        <motion.span
          key={idx}
          variants={unitVariants}
          className={`inline-block ${
            animateBy === "word" && idx !== units.length - 1
              ? "mr-[0.25em]"
              : ""
          }`}
          style={{
            transformOrigin: "bottom center",
            willChange: "transform, opacity, filter",
          }}
        >
          {unit.content}
        </motion.span>
      ))}
    </MotionComponent>
  );
};

export default AnimatedHeading;
