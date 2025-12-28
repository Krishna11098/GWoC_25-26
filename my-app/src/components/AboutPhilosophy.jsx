"use client";
import { motion } from "framer-motion";

const items = [
  {
    title: "Connection over Competition",
    desc: "Our games are designed to bring people closer, no matter the outcome.",
  },
  {
    title: "Quality & Creativity",
    desc: "Every illustration, card, and mechanic is crafted with care.",
  },
  {
    title: "Fun for All",
    desc: "Whether you're 10 or 100, there's a Joy Juncture game for you.",
  },
];

export default function AboutPhilosophy() {
  return (
    <section className="py-32 px-6 bg-[#141414]">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-20">Our Philosophy</h2>

        <div className="space-y-24">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 60, scale: 0.9, rotate: -3 }}
              whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
              viewport={{ amount: 0.3 }}
              transition={{ delay: i * 0.2, ease: "easeOut", duration: 0.5 }}
              whileHover={{ rotate: 2, scale: 1.05 }}
              className="bg-[#1a1a1a] p-8 rounded-2xl border border-white/10 mx-auto"
            >
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                {item.title}
              </h3>
              <p className="text-gray-300 text-lg">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
