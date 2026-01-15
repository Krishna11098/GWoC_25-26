"use client";
import { motion } from "framer-motion";

export default function AboutStoryBlock({
  title,
  children,
  bgColor,
  position = "left",
}) {
  const isLeft = position === "left";

  return (
    <div className="relative mb-20">
      {/* Timeline line */}
      <div
        className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full top-0 bottom-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(168, 85, 247, 0.6), rgba(236, 72, 153, 0.3))",
        }}
      />

      {/* Timeline dot */}
      <motion.div
        className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full top-0 -mt-3 z-20"
        style={{
          background: "linear-gradient(135deg, #a855f7, #ec4899)",
          boxShadow: "0 0 30px rgba(168, 85, 247, 0.8)",
        }}
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
      />

      {/* Box on left or right */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -50 : 50, y: 20 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ amount: 0.3 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        whileHover={{
          y: -10,
          boxShadow: "0 20px 40px rgba(168, 85, 247, 0.2)",
        }}
        className={`max-w-2xl ${
          isLeft ? "mr-auto pr-12 md:pr-20" : "ml-auto pl-12 md:pl-20"
        } md:w-1/2 relative group`}
      >
        <div
          className="rounded-2xl p-8 md:p-10 backdrop-blur-sm border-2 shadow-xl transition-all duration-300"
          style={{
            backgroundColor: "#ffffff",
            borderColor: isLeft
              ? "rgba(168, 85, 247, 0.4)"
              : "rgba(236, 72, 153, 0.4)",
          }}
        >
          {/* Gradient accent bar */}
          <motion.div
            className="absolute top-0 left-0 h-1 rounded-full"
            style={{
              background: isLeft
                ? "linear-gradient(90deg, #a855f7, #7c3aed)"
                : "linear-gradient(90deg, #ec4899, #be123c)",
            }}
            initial={{ width: 0 }}
            whileInView={{ width: "100px" }}
            transition={{ delay: 0.3, duration: 0.6 }}
          />

          {title && (
            <motion.h3
              className="text-2xl font-bold mb-4"
              style={{
                background: isLeft
                  ? "linear-gradient(135deg, #a855f7, #7c3aed)"
                  : "linear-gradient(135deg, #ec4899, #be123c)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {title}
            </motion.h3>
          )}

          <motion.p
            className="text-base md:text-lg leading-relaxed"
            style={{ color: "var(--color-font)" }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {children}
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
