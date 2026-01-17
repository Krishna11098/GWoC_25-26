"use client";
import { motion } from "framer-motion";
import { Tape, ScribbleText, ScribbleUnderline, ScribbleCircle } from "./HandcraftedElements";

export default function AboutOrigin() {
  return (
    <section className="py-32 px-6 max-w-7xl mx-auto overflow-visible">
      <div className="relative flex flex-col items-center">
        
        {/* Box 1: The Spark of Genius */}
        <motion.div
          initial={{ opacity: 0, x: -100, rotate: -2 }}
          whileInView={{ opacity: 1, x: -40, rotate: -2 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative max-w-xl self-start bg-light-pink p-12 rounded-lg shadow-xl border-2 border-dark-teal z-10 md:mb-[-40px]"
        >
          <Tape position="top-left" rotate="-40deg" color="rgba(255, 230, 230, 0.6)" />
          <Tape position="bottom-right" rotate="-10deg" color="rgba(255, 230, 230, 0.6)" />
          
          <h2 className="text-4xl md:text-5xl mb-8 leading-tight text-dark-teal">
            Not Another Garage <br /> Startup Story.
          </h2>
          <div className="space-y-6 text-lg text-black leading-relaxed">
            <p>
              No dramatic epiphany. No business plan written on a napkin. Just
              two sisters who realized that arguing over rules and laughing at
              bad strategies was better than any "real" job.
            </p>
            <p className="relative inline-block">
              Joy Juncture wasn't planned—it was{" "}
              <ScribbleText text="played" className="text-dark-teal font-bold text-2xl" /> into existence.
              <ScribbleUnderline />
            </p>
          </div>
        </motion.div>

        {/* Box 2: The Wrong Family Business */}
        <motion.div
          initial={{ opacity: 0, x: 100, rotate: 2 }}
          whileInView={{ opacity: 1, x: 40, rotate: 2 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="relative max-w-xl self-end bg-light-orange p-12 rounded-lg shadow-xl border-2 border-dark-teal z-20 md:mt-[-40px]"
        >
          <Tape position="top-right" rotate="35deg" color="rgba(255, 245, 230, 0.6)" />
          <Tape position="bottom-left" rotate="15deg" color="rgba(255, 245, 230, 0.6)" />

          <h2 className="text-4xl md:text-5xl mb-8 leading-tight text-dark-teal">
            The Wrong <br /> Family Business.
          </h2>
          <div className="space-y-6 text-lg text-black leading-relaxed">
            <p>
              We come from a world of textiles and electricals (boring, we know).
              But amidst the <span className="relative px-2">confusion<ScribbleCircle color="var(--dark-teal)" /></span>, we found our clarity: life is too short
              for polite small talk.
            </p>
            <p className="font-semibold text-dark-teal">
              We traded the family business roadmap for creativity, transforming
              our <ScribbleText text="chaotic" className="text-light-orange bg-dark-teal px-2 rounded -rotate-2 text-white" /> energy into your next favorite memory.
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
