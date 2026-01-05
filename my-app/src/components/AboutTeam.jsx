"use client";
import { motion } from "framer-motion";

export default function AboutTeam() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h2
          className="text-4xl font-bold mb-20"
          style={{ color: "var(--color-font)" }}
        >
          Meet the Minds Behind the Madness
        </h2>

        <div className="grid md:grid-cols-2 gap-16">
          {[
            {
              name: "Khushi Poddar",
              role: "Dreamer-in-Chief",
              desc: "Turning spontaneous ideas into bold realities.",
            },
            {
              name: "Muskan Poddar",
              role: "Design Whiz",
              desc: "Making sure every game looks as good as it feels.",
            },
          ].map((person, i) => (
            <motion.div
              key={person.name}
              initial={{ opacity: 0, y: 60, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ amount: 0.4 }}
              transition={{ delay: i * 0.2, ease: "easeOut" }}
              className="p-10 rounded-2xl shadow-lg"
              style={{
                backgroundColor: "white",
                border: "1px solid var(--color-font)",
              }}
            >
              <h3
                className="text-2xl font-semibold"
                style={{ color: "var(--color-font)" }}
              >
                {person.name}
              </h3>
              <p className="mt-2" style={{ color: "var(--color-orange)" }}>
                {person.role}
              </p>
              <p className="mt-6" style={{ color: "var(--color-font)" }}>
                {person.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
