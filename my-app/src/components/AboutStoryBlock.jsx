"use client";
import { motion } from "framer-motion";

export default function AboutStoryBlock({ title, children, bgColor }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 80, rotate: -1 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ amount: 0.4 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ rotate: 1, scale: 1.02 }}
      className="relative max-w-4xl mx-auto rounded-3xl p-10 shadow-2xl border-2 border-dark-teal"
      style={{
        backgroundColor: bgColor || "white",
      }}
    >
      {title && (
        <h3
          className="text-2xl font-bold mb-4 text-dark-teal"
        >
          {title}
        </h3>
      )}

      <p
        className="text-lg leading-relaxed text-black"
      >
        {children}
      </p>
    </motion.div>
  );
}
