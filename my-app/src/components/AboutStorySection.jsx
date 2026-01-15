"use client";
import { motion } from "framer-motion";

export default function AboutStorySection({ children, accent = false }) {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Sexy gradient background */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(168, 85, 247, 0.08), rgba(236, 72, 153, 0.06), rgba(6, 182, 212, 0.04))",
        }}
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      {accent && (
        <>
          <motion.div
            className="absolute right-0 top-1/3 w-80 h-80 rounded-full blur-3xl opacity-15"
            style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}
            animate={{ y: [0, 60, 0], x: [0, -40, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          <motion.div
            className="absolute left-0 bottom-1/3 w-96 h-96 rounded-full blur-3xl opacity-12"
            style={{ background: "linear-gradient(135deg, #0ea5e9, #06b6d4)" }}
            animate={{ y: [0, -60, 0], x: [0, 40, 0] }}
            transition={{ duration: 12, repeat: Infinity }}
          />
        </>
      )}

      <div className="relative z-10">{children}</div>
    </section>
  );
}
