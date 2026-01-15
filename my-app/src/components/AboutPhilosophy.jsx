"use client";
import { motion } from "framer-motion";

const items = [
  {
    title: "🤝 Connection over Competition",
    desc: "Our games are designed to bring people closer, no matter the outcome.",
    gradient: "linear-gradient(135deg, #a855f7, #7c3aed)",
    accentColor: "#a855f7",
  },
  {
    title: "✨ Quality & Creativity",
    desc: "Every illustration, card, and mechanic is crafted with care.",
    gradient: "linear-gradient(135deg, #0ea5e9, #0284c7)",
    accentColor: "#0ea5e9",
  },
  {
    title: "🎮 Fun for All",
    desc: "Whether you're 10 or 100, there's a Joy Juncture game for you.",
    gradient: "linear-gradient(135deg, #ec4899, #be123c)",
    accentColor: "#ec4899",
  },
];

export default function AboutPhilosophy() {
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      {/* Sexy gradient background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(236, 72, 153, 0.08), rgba(6, 182, 212, 0.06))",
        }}
      />

      {/* Floating orbs */}
      <motion.div
        className="absolute top-1/4 right-0 w-64 h-64 rounded-full blur-3xl opacity-15"
        style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}
        animate={{ y: [0, 60, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 left-0 w-80 h-80 rounded-full blur-3xl opacity-10"
        style={{ background: "linear-gradient(135deg, #0ea5e9, #06b6d4)" }}
        animate={{ y: [0, -60, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.h2
          className="text-4xl md:text-5xl font-bold mb-20 text-center"
          style={{
            background: "linear-gradient(135deg, #a855f7, #ec4899, #0ea5e9)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Our Philosophy
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ amount: 0.3 }}
              transition={{
                delay: i * 0.15,
                type: "spring",
                stiffness: 100,
                damping: 25,
              }}
              whileHover={{ y: -15, scale: 1.02 }}
              className="relative group"
            >
              {/* Card */}
              <div
                className="h-full rounded-3xl p-8 backdrop-blur-sm shadow-xl border-2 transition-all duration-300 overflow-hidden relative"
                style={{
                  backgroundColor: "#ffffff",
                  borderColor: `${item.accentColor}40`,
                }}
              >
                {/* Top gradient bar */}
                <motion.div
                  className="absolute top-0 left-0 h-1"
                  style={{ background: item.gradient }}
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ delay: i * 0.2 + 0.3, duration: 0.8 }}
                />

                {/* Glow effect on hover */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at center, ${item.accentColor}15, transparent)`,
                  }}
                />

                <div className="relative z-10">
                  <h3
                    className="text-2xl font-bold mb-4"
                    style={{
                      background: item.gradient,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-base leading-relaxed"
                    style={{ color: "var(--color-font)" }}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
