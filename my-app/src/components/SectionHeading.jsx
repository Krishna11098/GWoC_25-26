"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

/**
 * SectionHeading - Enhanced heading component with eyebrow text, gradient, and decorative underline
 *
 * @param {string} eyebrow - Small caps label above heading
 * @param {string} title - Main heading text
 * @param {string} subtitle - Optional subtitle text
 * @param {boolean} gradient - Apply gradient to title (default: true)
 * @param {boolean} underline - Show decorative underline (default: true)
 * @param {string} align - Text alignment: 'left', 'center', 'right' (default: 'center')
 * @param {string} className - Additional classes
 */
const SectionHeading = ({
  eyebrow,
  title,
  subtitle,
  gradient = true,
  underline = true,
  align = "center",
  className = "",
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const alignmentClasses = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  };

  return (
    <motion.div
      ref={ref}
      className={`flex flex-col gap-4 ${alignmentClasses[align]} ${className}`}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
    >
      {/* Eyebrow text */}
      {eyebrow && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.25em] text-font/70">
            <span className="h-9 w-2 rounded-full bg-font" />
            {eyebrow}
          </span>
        </motion.div>
      )}

      {/* Main title */}
      <motion.h2
        className={`text-3xl md:text-4xl lg:text-5xl font-bold leading-tight ${
          gradient
            ? "bg-gradient-to-r from-font via-white to-font bg-clip-text text-transparent"
            : ""
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {title}
      </motion.h2>

      {/* Decorative underline */}
      {underline && (
        <motion.div
          className="h-1 w-20 rounded-full bg-gradient-to-r from-transparent via-font to-transparent"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={
            isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }
          }
          transition={{ duration: 0.8, delay: 0.3 }}
        />
      )}

      {/* Subtitle */}
      {subtitle && (
        <motion.p
          className="text-lg md:text-xl text-font/70 leading-relaxed max-w-2xl"
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
};

export default SectionHeading;
