"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const IntroSequence = () => {
  const [stage, setStage] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 1200), // black slides left
      setTimeout(() => setStage(2), 2300), // show text
      setTimeout(() => setStage(3), 3800), // black slides back
      setTimeout(() => setStage(4), 5000), // final welcome
      setTimeout(() => {
        // Navigate to homepage after intro completes
        router.push("/home");
      }, 5900), // 5000 + 900 (welcome animation duration)
    ];

    return () => timers.forEach(clearTimeout);
  }, [router]);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-white font-sans">
      {/* BLACK SLIDING PANEL */}
      <AnimatePresence>
        {stage < 4 && (
          <motion.div
            key="black-panel"
            initial={{ x: "0%" }}
            animate={{
              x:
                stage === 0
                  ? "0%"
                  : stage === 1
                  ? "-100%"
                  : stage === 3
                  ? "0%"
                  : "-100%",
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
            className="absolute inset-0 bg-black z-20"
          />
        )}
      </AnimatePresence>

      {/* WHITE BACKGROUND */}
      <div className="absolute inset-0 bg-[#f2f2f2]" />

      {/* TEXT CONTENT */}
      <AnimatePresence>
        {stage >= 2 && stage < 4 && (
          <motion.div
            key="text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 flex h-full flex-col justify-center pl-12 md:pl-24"
          >
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-medium text-black"
            >
              Board & Card Games
            </motion.p>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl font-medium text-black"
            >
              Live Game Nights
            </motion.p>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-4xl md:text-6xl font-medium text-black"
            >
              Workshops
            </motion.p>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-4xl md:text-6xl font-medium text-black"
            >
              Custom Experience
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FINAL WELCOME */}
      <AnimatePresence>
        {stage === 4 && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-30 flex items-center justify-center bg-black"
          >
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-white text-5xl md:text-7xl font-medium"
            >
              Welcome.
            </motion.h1>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IntroSequence;
