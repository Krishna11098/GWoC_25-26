"use client";
import { easeOut, motion } from "framer-motion";
import { ScribbleUnderline } from "./HandcraftedElements";
import SoftWaveBackground from "./SoftWaveBackground";

export default function AboutHero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      <SoftWaveBackground height="100%" className="pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.4, once: false }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="max-w-4xl text-center flex flex-col justify-center pb-5 relative z-10"
      >
        <h1 className="text-5xl md:text-8xl mb-6 leading-tight text-dark-teal ">
          Less Small Talk.
          <br />
          More Game Nights.
        </h1>
        <p className="text-xl max-w-2xl mx-auto text-black relative">
          Joy Juncture exists to save your Friday nights. Because the real enemy
          isn't the other player—it's{" "}
          <span className="relative inline-block px-1">
            boredom.
            <ScribbleUnderline color="var(--light-orange)" />
          </span>{" "}
          <span className="caveat-script text-dark-teal font-semibold text-3xl block mt-6 rotate-[-2deg]">
            Let’s play!
          </span>
        </p>
      </motion.div>
    </section>
  );
}
