"use client";
import { motion } from "framer-motion";
import { Tape, ScribbleText } from "./HandcraftedElements";

export default function AboutTeam() {
  return (
    <section className="py-32 px-6 bg-white relative">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl md:text-7xl mb-20 text-dark-teal">
          The Dealers of Fun
        </h2>

        <div className="grid md:grid-cols-3 gap-8 items-center relative">
          {/* Card 1: Khushi */}
          <motion.div
            initial={{ opacity: 0, y: 60, rotate: -2 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.4 }}
            transition={{ delay: 0.1, ease: "easeOut" }}
            whileHover={{ rotate: 0, scale: 1.05, zIndex: 30 }}
            className="relative p-8 rounded-2xl shadow-xl border-2 border-dark-teal bg-white h-full flex flex-col justify-center"
          >
            <Tape position="top-left" color="rgba(0, 128, 128, 0.1)" />
            <h3 className="text-3xl font-bold text-dark-teal fraunces-chunky">
              Khushi Poddar
            </h3>
            <p className="mt-4">
              <ScribbleText text="The Visionary" className="text-light-orange text-2xl" />
            </p>
            <p className="mt-6 text-black leading-relaxed">
              She turns 'What if?' into 'Let's do it.' The engine behind the
              chaos and the one who believes every bad idea is just a good idea
              waiting to happen.
            </p>
          </motion.div>

          {/* Card 2: The Portrait (Center) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 1 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative z-20 group"
          >
            <div className="bg-white p-4 rounded-xl shadow-2xl border-4 border-dark-teal transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-0">
              <img
                src="/images/about/sisters.png"
                alt="Khushi and Muskan Poddar"
                className="w-full h-auto rounded-lg grayscale group-hover:grayscale-0 transition-all duration-700"
              />
              <Tape position="top-right" color="rgba(255, 255, 255, 0.8)" rotate="15deg" />
              <ScribbleText
                text="The Duo Energy"
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-dark-teal text-xl font-bold bg-white px-2 rotate-2 shadow-sm whitespace-nowrap"
              />
            </div>
          </motion.div>

          {/* Card 3: Muskan */}
          <motion.div
            initial={{ opacity: 0, y: 60, rotate: 2 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.4 }}
            transition={{ delay: 0.3, ease: "easeOut" }}
            whileHover={{ rotate: 0, scale: 1.05, zIndex: 30 }}
            className="relative p-8 rounded-2xl shadow-xl border-2 border-dark-teal bg-white h-full flex flex-col justify-center"
          >
            <Tape position="top-right" color="rgba(0, 128, 128, 0.1)" />
            <h3 className="text-3xl font-bold text-dark-teal fraunces-chunky">
              Muskan Poddar
            </h3>
            <p className="mt-4">
              <ScribbleText text="The Architect" className="text-light-orange text-2xl" />
            </p>
            <p className="mt-6 text-black leading-relaxed">
              She turns the chaos into art. Ensuring that every game looks as
              good on your shelf as it feels on the table. The aesthetic
              guardian.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
