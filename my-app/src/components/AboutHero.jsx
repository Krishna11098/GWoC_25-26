"use client";
import { motion } from "framer-motion";

export default function AboutHero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      {/* Sexy gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(168, 85, 247, 0.08), rgba(236, 72, 153, 0.06), rgba(99, 102, 241, 0.05))",
        }}
      />

      {/* Floating orbs */}
      <motion.div
        className="absolute top-20 right-10 w-48 h-48 rounded-full blur-3xl opacity-15"
        style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}
        animate={{ y: [0, 40, 0], x: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 left-10 w-56 h-56 rounded-full blur-3xl opacity-10"
        style={{ background: "linear-gradient(135deg, #6366f1, #0ea5e9)" }}
        animate={{ y: [0, -40, 0], x: [0, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="max-w-4xl text-center flex flex-col justify-center pb-5 relative z-10"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          whileInView={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          className="text-7xl mb-8"
        >
          ✨
        </motion.div>

        <h1
          className="text-5xl md:text-7xl font-bold mb-6"
          style={{
            background: "linear-gradient(135deg, #a855f7, #ec4899, #f43f5e)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Our Accidentally Awesome Story
        </h1>

        <p className="text-xl" style={{ color: "var(--color-font)" }}>
          No legacies. No rulebooks.{" "}
          <motion.span
            style={{ color: "#a855f7", fontWeight: "bold" }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Just fun
          </motion.span>
          .
        </p>

        <motion.div
          className="mt-12 mx-auto w-4 h-4 rounded-full"
          style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}
          animate={{ y: [0, 15, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
      </motion.div>
    </section>
  );
}
