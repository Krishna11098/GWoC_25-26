"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Sparkles, Users, Trophy } from "lucide-react";
import CountUp from "./CountUp";

/**
 * CTASection - Call-to-Action section with stats and action buttons
 */
const CTASection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });

  const stats = [
    { icon: Users, value: 500, suffix: "+", label: "Events Hosted" },
    { icon: Sparkles, value: 10, suffix: "K+", label: "Players Engaged" },
    { icon: Trophy, value: 50, suffix: "+", label: "Games Created" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] },
    },
  };

  return (
    <section
      ref={ref}
      className="relative py-20 md:py-32 px-6 md:px-10 overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink rounded-full blur-3xl" />
      </div>

      <motion.div
        className="relative max-w-6xl mx-auto text-center"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {/* Eyebrow text */}
        <motion.div variants={itemVariants} className="mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green/30 border border-green text-sm font-semibold uppercase tracking-wider text-font">
            <Sparkles className="w-4 h-4 text-font" />
            Start Your Journey
          </span>
        </motion.div>

        {/* Main heading with gradient */}
        <motion.h2
          variants={itemVariants}
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-black"
        >
          Ready to Create <span className="text-font">Joyful Experiences</span>?
        </motion.h2>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-font/70 mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          Join thousands of players and event organizers who've discovered the
          magic of playful connections
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <motion.button
            className="group relative px-8 py-4 bg-orange text-font rounded-full font-semibold text-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(247,213,124,0.4)] hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10 flex items-center gap-2">
              Explore Games
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-pink/30 to-transparent"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.5 }}
            />
          </motion.button>

          <motion.button
            className="px-8 py-4 border-2 border-green text-font rounded-full font-semibold text-lg hover:bg-green/20 hover:border-green transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Book an Event
          </motion.button>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative"
            >
              <div className="relative p-6 rounded-2xl bg-pink/20 border border-pink backdrop-blur-sm hover:bg-pink/30 hover:border-orange transition-all duration-300">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 rounded-full bg-green/30 group-hover:bg-green/50 transition-colors">
                    <stat.icon className="w-6 h-6 text-font" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-black">
                    <CountUp
                      from={0}
                      to={stat.value}
                      separator=","
                      direction="up"
                      duration={1.5}
                      className="count-up-text"
                      once={false}
                    />
                    {stat.suffix}
                  </div>
                  <div className="text-sm md:text-base text-font/80 font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default CTASection;
