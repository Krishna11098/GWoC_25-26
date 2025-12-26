"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function FadeInSection({ children, yOffset = 50 }) {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "start 70%"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [yOffset, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.div ref={ref} style={{ y, opacity }} className="w-full">
      {children}
    </motion.div>
  );
}
