"use client";
import { motion } from "framer-motion";

export default function AboutStoryBlock({ title, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 80, rotate: -1 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ amount: 0.4 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ rotate: 1, scale: 1.02 }}
      className="relative max-w-4xl mx-auto bg-background-2 border border-white/10 rounded-3xl p-10 shadow-2xl"
    >
  
      {title && (
        <h3 className="text-2xl font-bold text-foreground mb-4">
          {title}
        </h3>
      )}

      <p className="text-gray-300 text-lg leading-relaxed">
        {children}
      </p>
    </motion.div>
  );
}
