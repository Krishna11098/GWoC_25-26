"use client";
import { motion } from "framer-motion";
import { ScribbleUnderline } from "./HandcraftedElements";

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
    <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden bg-white">
      {/* Animated background wash */}
      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ amount: 0.4, once: false }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute inset-0 bg-light-pink opacity-20"
      />

      {/* Content */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ amount: 0.4, once: false }}
        className="relative z-10 text-center max-w-4xl"
      >
        {/* Eyebrow */}
        <motion.p
          variants={item}
          className="text-lg font-bold mb-6 text-dark-teal caveat-script text-3xl"
        >
          Why Joy Juncture?
        </motion.p>

        {/* Subheading */}
        <motion.p
          variants={item}
          className="text-xl mb-10 text-dark-teal font-medium"
        >
          Because life is too short for boring evenings.
        </motion.p>

        {/* Main punchline */}
        <motion.h2
          initial={{ opacity: 0, y: 60, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ amount: 0.4, once: false }}
          transition={{
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1], // soft overshoot
          }}
          className="text-5xl md:text-8xl mb-10 text-dark-teal"
        >
          Ready to Start
          <br />
          the Madness?
        </motion.h2>

        {/* Supporting line */}
        <motion.p
          variants={item}
          className="text-lg md:text-xl text-black mb-16 relative inline-block px-4"
        >
          Save your Friday nights. Because the real enemy isn't the other
          player—it's{" "}
          <span className="relative">
            boredom.
            <ScribbleUnderline color="var(--dark-teal)" />
          </span>
        </motion.p>

        <motion.div variants={item}>
          <a
            href="/shop"
            className="inline-block px-12 py-5 bg-dark-teal text-white font-bold text-xl rounded-full shadow-xl hover:bg-opacity-90 transition-all transform hover:scale-105 active:scale-95"
          >
            Find Your Game
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
