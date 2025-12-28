"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function ParallaxSection({ children, speed = 0.5 }) {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 7%", "end 0%"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -150 * speed]);
  const scale = useTransform(scrollYProgress, [0, 0.6], [1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0.5]);

  return (
    <motion.div ref={ref} style={{ y, scale, opacity }} className="w-full">
      {children}
    </motion.div>
  );
}
