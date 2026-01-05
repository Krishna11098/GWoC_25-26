"use client";
import { motion } from "framer-motion";

const items = [
  {
    title: "Connection over Competition",
    desc: "Our games are designed to bring people closer, no matter the outcome.",
    bgColor: "var(--color-pink)",
  },
  {
    title: "Quality & Creativity",
    desc: "Every illustration, card, and mechanic is crafted with care.",
    bgColor: "var(--color-orange)",
  },
  {
    title: "Fun for All",
    desc: "Whether you're 10 or 100, there's a Joy Juncture game for you.",
    bgColor: "var(--color-green)",
  },
];

export default function AboutPhilosophy() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h2
          className="text-4xl font-bold mb-20"
          style={{ color: "var(--color-font)" }}
        >
          Our Philosophy
        </h2>

        <div className="space-y-24">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 60, scale: 0.9, rotate: -3 }}
              whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
              viewport={{ amount: 0.3 }}
              transition={{ delay: i * 0.2, ease: "easeOut", duration: 0.5 }}
              whileHover={{ rotate: 2, scale: 1.05 }}
              className="p-8 rounded-2xl mx-auto shadow-lg"
              style={{
                backgroundColor: item.bgColor,
                border: "1px solid var(--color-font)",
              }}
            >
              <h3
                className="text-2xl font-semibold mb-4"
                style={{ color: "var(--color-font)" }}
              >
                {item.title}
              </h3>
              <p className="text-lg" style={{ color: "var(--color-font)" }}>
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
