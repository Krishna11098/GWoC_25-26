"use client";
import { motion } from "framer-motion";

export const Tape = ({ position = "top-left", color = "rgba(255, 255, 255, 0.4)", rotate = "0deg" }) => {
  const positions = {
    "top-left": "-top-4 -left-4 rotate-[-45deg]",
    "top-right": "-top-4 -right-4 rotate-[45deg]",
    "bottom-left": "-bottom-4 -left-4 rotate-[45deg]",
    "bottom-right": "-bottom-4 -right-4 rotate-[-45deg]",
  };

  return (
    <div
      className={`absolute w-12 h-6 z-20 shadow-sm border border-black/10 transition-transform duration-300 ${positions[position]}`}
      style={{
        backgroundColor: color,
        backdropFilter: "blur(2px)",
        transform: `rotate(${rotate === "0deg" ? "" : rotate})`,
      }}
    />
  );
};

export const ScribbleUnderline = ({ color = "var(--dark-teal)" }) => (
  <svg
    className="absolute -bottom-2 left-0 w-full h-3 filter drop-shadow-sm"
    viewBox="0 0 100 10"
    preserveAspectRatio="none"
  >
    <motion.path
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: "easeInOut" }}
      d="M0,5 Q25,0 50,5 T100,5"
      fill="transparent"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const ScribbleCircle = ({ color = "var(--light-orange)" }) => (
  <svg
    className="absolute -inset-2 w-[calc(100%+16px)] h-[calc(100%+16px)] pointer-events-none"
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
  >
    <motion.path
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
      d="M50,5 A45,45 0 1,0 50,95 A45,45 0 1,0 50,5 Z"
      fill="transparent"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeDasharray="5,5"
    />
  </svg>
);

export const ScribbleText = ({ text, className = "" }) => (
  <span className={`relative inline-block caveat-script ${className}`}>
    {text}
  </span>
);
