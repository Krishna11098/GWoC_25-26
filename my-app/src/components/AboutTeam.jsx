"use client";
import { motion } from "framer-motion";

export default function AboutTeam() {
  const teamMembers = [
    {
      name: "Khushi Poddar",
      role: "Dreamer-in-Chief",
      desc: "Turning spontaneous ideas into bold realities.",
      emoji: "💭",
      gradient: "linear-gradient(135deg, #a855f7, #7c3aed)",
      color: "#a855f7",
    },
    {
      name: "Muskan Poddar",
      role: "Design Whiz",
      desc: "Making sure every game looks as good as it feels.",
      emoji: "🎨",
      gradient: "linear-gradient(135deg, #ec4899, #be123c)",
      color: "#ec4899",
    },
  ];

  return (
    <section className="py-32 px-6 relative overflow-hidden">
      {/* Sexy gradient background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(236, 72, 153, 0.08))",
        }}
      />

      {/* Floating orbs */}
      <motion.div
        className="absolute top-1/3 right-0 w-72 h-72 rounded-full blur-3xl opacity-15"
        style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}
        animate={{ y: [0, 50, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.h2
          className="text-4xl md:text-5xl font-bold mb-20"
          style={{
            background: "linear-gradient(135deg, #a855f7, #ec4899)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Meet the Minds Behind the Madness
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-12">
          {teamMembers.map((person, i) => (
            <motion.div
              key={person.name}
              initial={{ opacity: 0, y: 60, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ amount: 0.4 }}
              transition={{
                delay: i * 0.2,
                type: "spring",
                stiffness: 100,
                damping: 25,
              }}
              whileHover={{ y: -15 }}
              className="relative group"
            >
              <div
                className="p-10 rounded-3xl shadow-xl border-2 backdrop-blur-sm transition-all duration-300"
                style={{
                  backgroundColor: "#ffffff",
                  borderColor: `${person.color}40`,
                }}
              >
                {/* Top bar */}
                <motion.div
                  className="absolute top-0 left-0 h-1"
                  style={{ background: person.gradient }}
                  initial={{ width: 0 }}
                  whileInView={{ width: "80px" }}
                  transition={{ delay: i * 0.2 + 0.3, duration: 0.6 }}
                />

                {/* Glow on hover */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl"
                  style={{
                    background: `radial-gradient(circle at center, ${person.color}10, transparent)`,
                  }}
                />

                <div className="relative z-10">
                  <motion.div
                    className="text-5xl mb-6"
                    animate={{ rotate: [-5, 5, -5], y: [0, -8, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    {person.emoji}
                  </motion.div>

                  <h3
                    className="text-2xl font-bold mb-3"
                    style={{ color: "var(--color-font)" }}
                  >
                    {person.name}
                  </h3>

                  <motion.p
                    className="font-semibold mb-6 text-lg"
                    style={{
                      background: person.gradient,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: i * 0.2 + 0.2, duration: 0.5 }}
                  >
                    {person.role}
                  </motion.p>

                  <p style={{ color: "var(--color-font)" }}>{person.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
