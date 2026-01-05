"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * ScrollProgress - Animated scroll progress indicator at top of page
 */
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-font/50 via-font to-font/50 origin-left z-[9999]"
      style={{ scaleX }}
    />
  );
};

export default ScrollProgress;
