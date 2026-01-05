"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

/**
 * SectionDivider Component
 *
 * A modern, animated divider to separate sections with smooth animations.
 * Offers multiple preset styles for different design needs.
 *
 * @param {'line' | 'gradient' | 'dots' | 'wave' | 'sparkle'} variant - Divider style (default: 'gradient')
 * @param {string} className - Additional Tailwind classes
 * @param {boolean} animate - Enable scroll-triggered animation (default: true)
 * @param {string} color - Custom color (Tailwind class or hex)
 */
const SectionDivider = ({
  variant = "gradient",
  className = "",
  animate = true,
  color = "bg-gradient-to-r from-transparent via-font to-transparent",
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  // Line variant - Simple horizontal line with gradient
  if (variant === "line") {
    return (
      <motion.div
        ref={ref}
        className={`w-full py-12 md:py-16 ${className}`}
        initial={animate ? { opacity: 0 } : false}
        animate={animate && isInView ? { opacity: 1 } : false}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className={`h-px w-full ${color}`}
          initial={animate ? { scaleX: 0 } : false}
          animate={animate && isInView ? { scaleX: 1 } : false}
          transition={{ duration: 1.2, ease: [0.25, 0.4, 0.25, 1] }}
        />
      </motion.div>
    );
  }

  // Gradient variant - Thick gradient bar with glow effect
  if (variant === "gradient") {
    return (
      <motion.div
        ref={ref}
        className={`w-full py-12 md:py-20 flex justify-center items-center ${className}`}
        initial={animate ? { opacity: 0, y: 20 } : false}
        animate={animate && isInView ? { opacity: 1, y: 0 } : false}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="relative w-3/4 md:w-1/2 h-1 rounded-full overflow-hidden"
          initial={animate ? { scaleX: 0 } : false}
          animate={animate && isInView ? { scaleX: 1 } : false}
          transition={{ duration: 1.2, ease: [0.25, 0.4, 0.25, 1], delay: 0.2 }}
        >
          <div className={`absolute inset-0 ${color}`} />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            initial={{ x: "-100%" }}
            animate={isInView ? { x: "200%" } : {}}
            transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    );
  }

  // Dots variant - Animated dot pattern
  if (variant === "dots") {
    return (
      <motion.div
        ref={ref}
        className={`w-full py-12 md:py-16 flex justify-center items-center gap-3 ${className}`}
        initial={animate ? { opacity: 0 } : false}
        animate={animate && isInView ? { opacity: 1 } : false}
        transition={{ duration: 0.8 }}
      >
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-font/60"
            initial={animate ? { scale: 0, opacity: 0 } : false}
            animate={animate && isInView ? { scale: 1, opacity: 1 } : false}
            transition={{
              duration: 0.5,
              delay: i * 0.1,
              ease: [0.25, 0.4, 0.25, 1],
            }}
          />
        ))}
      </motion.div>
    );
  }

  // Wave variant - SVG wave pattern
  if (variant === "wave") {
    return (
      <motion.div
        ref={ref}
        className={`w-full py-12 md:py-16 ${className}`}
        initial={animate ? { opacity: 0 } : false}
        animate={animate && isInView ? { opacity: 1 } : false}
        transition={{ duration: 0.8 }}
      >
        <motion.svg
          viewBox="0 0 1200 60"
          className="w-full h-8 md:h-12"
          initial={animate ? { pathLength: 0 } : false}
          animate={animate && isInView ? { pathLength: 1 } : false}
        >
          <motion.path
            d="M0,30 Q150,10 300,30 T600,30 T900,30 T1200,30"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-font/40"
            initial={animate ? { pathLength: 0, opacity: 0 } : false}
            animate={
              animate && isInView ? { pathLength: 1, opacity: 1 } : false
            }
            transition={{ duration: 1.5, ease: [0.25, 0.4, 0.25, 1] }}
          />
        </motion.svg>
      </motion.div>
    );
  }

  // Sparkle variant - Decorative with icon in center
  if (variant === "sparkle") {
    return (
      <motion.div
        ref={ref}
        className={`w-full py-12 md:py-20 flex items-center justify-center ${className}`}
        initial={animate ? { opacity: 0 } : false}
        animate={animate && isInView ? { opacity: 1 } : false}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center w-full max-w-md gap-4">
          <motion.div
            className={`flex-1 h-px ${color}`}
            initial={animate ? { scaleX: 0 } : false}
            animate={animate && isInView ? { scaleX: 1 } : false}
            transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
            style={{ transformOrigin: "right" }}
          />
          <motion.div
            className="w-2 h-2 rotate-45 bg-font/60"
            initial={animate ? { scale: 0, rotate: 0 } : false}
            animate={animate && isInView ? { scale: 1, rotate: 45 } : false}
            transition={{ duration: 0.6, delay: 0.4 }}
          />
          <motion.div
            className={`flex-1 h-px ${color}`}
            initial={animate ? { scaleX: 0 } : false}
            animate={animate && isInView ? { scaleX: 1 } : false}
            transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
            style={{ transformOrigin: "left" }}
          />
        </div>
      </motion.div>
    );
  }

  return null;
};

export default SectionDivider;
