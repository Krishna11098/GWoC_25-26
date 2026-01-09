"use client";
import { easeOut, motion } from "framer-motion";

export default function AboutHero() {
  return (
    <section className="min-h-screen flex items-center justify-center text-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="max-w-4xl"
      >
        <h1
          className="text-5xl md:text-7xl font-bold mb-6"
        >
          Our{" "}
          <span style={{color: "var(--color-font)"}}>
            Accidentally Awesome
          </span>{" "}
          Story
        </h1>
        <p className="text-xl">
          No legacies. No rulebooks.{" "}
          <span style={{ color: "var(--color-font" }}>Just fun</span>.
        </p>
      </motion.div>
    </section>
  );
}
