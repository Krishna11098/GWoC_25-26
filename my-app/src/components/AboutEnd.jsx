"use client";
import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function AboutEnd() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden py-32">
      {/* Sexy gradient background */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(168, 85, 247, 0.08), rgba(236, 72, 153, 0.06), rgba(6, 182, 212, 0.04))",
        }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      {/* Floating orbs */}
      <motion.div
        className="absolute top-1/4 left-0 w-80 h-80 rounded-full blur-3xl opacity-15"
        style={{ background: "linear-gradient(135deg, #a855f7, #7c3aed)" }}
        animate={{ y: [0, 80, 0], x: [0, 40, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 right-0 w-96 h-96 rounded-full blur-3xl opacity-12"
        style={{ background: "linear-gradient(135deg, #ec4899, #be123c)" }}
        animate={{ y: [0, -80, 0], x: [0, -40, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      {/* Content */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ amount: 0.4 }}
        className="relative z-10 text-center max-w-4xl"
      >
        {/* Eyebrow */}
        <motion.p
          variants={item}
          className="text-lg font-medium mb-6"
          style={{ color: "var(--color-font)" }}
        >
          Why Joy Juncture?
        </motion.p>

        {/* Subheading */}
        <motion.p
          variants={item}
          className="text-xl mb-10"
          style={{ color: "var(--color-font)" }}
        >
          Because life is too short for boring evenings.
        </motion.p>

        {/* Main punchline */}
        <motion.h2
          initial={{ opacity: 0, y: 60, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ amount: 0.4 }}
          transition={{
            duration: 0.8,
            type: "spring",
            stiffness: 80,
            damping: 20,
          }}
          className="text-5xl md:text-7xl font-extrabold leading-tight mb-10"
          style={{
            background: "linear-gradient(135deg, #a855f7, #ec4899, #f43f5e)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Less Small Talk.
          <br />
          More Game Nights.
        </motion.h2>

        {/* Supporting line */}
        <motion.p
          variants={item}
          className="text-lg md:text-xl mb-12"
          style={{ color: "var(--color-font)" }}
        >
          Joy Juncture exists because boredom is the real enemy.
        </motion.p>

        {/* Pulsing dot */}
        <motion.div
          className="mx-auto w-4 h-4 rounded-full"
          style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}
          animate={{ y: [0, 15, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
      </motion.div>
    </section>
  );
}
