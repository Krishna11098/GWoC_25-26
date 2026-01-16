"use client";
import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 40, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function AboutEnd() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
      {/* Animated background wash */}
      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ amount: 0.4 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute inset-0"
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
          className="text-lg font-medium mb-6 text-dark-teal"
        >
          Why Joy Juncture?
        </motion.p>

        {/* Subheading */}
        <motion.p variants={item} className="text-xl mb-10 text-dark-teal">
          Because life is too short for boring evenings.
        </motion.p>

        {/* Main punchline */}
        <motion.h2
          initial={{ opacity: 0, y: 60, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ amount: 0.4 }}
          transition={{
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1], // soft overshoot
          }}
          className="text-5xl md:text-7xl font-extrabold leading-tight mb-10 text-dark-teal"
        >
          Less Small Talk.
          <br />
          More Game Nights.
        </motion.h2>

        {/* Supporting line */}
        <motion.p variants={item} className="text-lg md:text-xl text-black">
          Joy Juncture exists because boredom is the real enemy.
        </motion.p>
      </motion.div>
    </section>
  );
}
