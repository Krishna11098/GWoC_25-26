"use client";
import { motion } from "framer-motion";
import { Users, Sparkles, Smile } from "lucide-react";
import { Tape, ScribbleCircle } from "./HandcraftedElements";

const items = [
  {
    title: "Connection First, Scoreboard Second",
    desc: "Winning is fun, but the stories you tell after the game are forever. We design experiences that turn strangers into friends and friends into family.",
    icon: <Users className="w-10 h-10 text-dark-teal" />,
    bgColor: "var(--light-pink)",
    tapePos: "top-left",
  },
  {
    title: "Obsessively Crafted",
    desc: "From the weight of the cards to the wit in the illustrations—we don’t do 'good enough.' Every game is a piece of art meant to be handled.",
    icon: <Sparkles className="w-10 h-10 text-dark-teal" />,
    bgColor: "var(--light-orange)",
    tapePos: "top-right",
  },
  {
    title: "Ageless Fun",
    desc: "Fun shouldn’t have an expiration date. Whether you’re 10 or 100, if you can laugh, you can play.",
    icon: <Smile className="w-10 h-10 text-dark-teal" />,
    bgColor: "var(--light-blue)",
    tapePos: "bottom-left",
  },
];

export default function AboutPhilosophy() {
  return (
    <section className="py-32 px-6 bg-bg relative overflow-hidden">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl md:text-7xl mb-20 text-dark-teal">
          The Joy Manifesto
        </h2>

        <div className="grid md:grid-cols-3 gap-12">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40, rotate: i % 2 === 0 ? -1 : 1 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, ease: "easeOut", duration: 0.5 }}
              whileHover={{ rotate: 0, scale: 1.02 }}
              className="relative p-10 rounded-xl flex flex-col items-center text-center shadow-lg border-2 border-dark-teal"
              style={{ backgroundColor: item.bgColor }}
            >
              <Tape position={item.tapePos} color="rgba(255, 255, 255, 0.5)" />
              <div className="relative mb-6 p-4 bg-white rounded-2xl shadow-inner">
                {item.icon}
                {i === 1 && <ScribbleCircle color="var(--dark-teal)" />}
              </div>
              <h3 className="text-xl font-bold mb-4 text-dark-teal">
                {item.title}
              </h3>
              <p className="text-black leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
