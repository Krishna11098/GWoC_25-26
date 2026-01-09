"use client";

import { motion } from "framer-motion";

export default function Subheading({
  text = "JoyJuncture creates playful, immersive game experiences for events, workshops, and communities — online and offline",
}) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      filter: "blur(4px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 120,
      },
    },
  };

  const words = text.split(" ");

  return (
    <section className="w-full px-8 py-24 md:px-16 md:py-24 lg:py-32">
      <div className="ml-0 lg:ml-16 max-w-4xl text-left">
        <motion.h2
          className="text-2xl md:text-4xl lg:text-5xl font-semibold leading-relaxed tracking-tight"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-50px" }}
        >
          {words.map((word, idx) => (
            <motion.span
              key={`${word}-${idx}`}
              variants={wordVariants}
              style={{ display: "inline-block", marginRight: "0.25em" }}
            >
              {word}
            </motion.span>
          ))}
        </motion.h2>
      </div>
    </section>
  );
}
