"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function GamificationTeaser() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-100px" });

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
    <motion.section
      ref={sectionRef}
      className="relative py-24 md:py-40 overflow-hidden text-[var(--font)]"
      style={{ backgroundColor: "var(--light-blue)" }}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24 items-center">
          {/* LEFT — TEXT */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-6 space-y-6 md:space-y-8"
          >
            {/* <div className="flex items-center gap-3">
              <span className="h-9 w-2 rounded-full bg-[var(--orange)]" />
              <p className="text-sm font-semibold uppercase tracking-[0.25em]">
                Gamification
              </p>
            </div> */}

            <h2
              className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight"
              style={{ color: "var(--black)" }}
            >
              Every interaction <br />
              <span style={{ color: "var(--dark-teal)" }}>
                earns you rewards
              </span>
            </h2>

            <p
              className="text-lg md:text-xl leading-relaxed"
              style={{ color: "var(--dark-teal)" }}
            >
              Attend events, participate in experiences, complete challenges,
              and watch your points turn into real rewards you can actually use.
            </p>
            <ul
              className="space-y-4 pt-2 text-base md:text-lg"
              style={{ color: "var(--dark-teal)" }}
            >
              <li className="flex items-start gap-3">
                <span style={{ color: "var(--black)" }}>●</span>
                Earn points for events, games, and workshops
              </li>
              <li className="flex items-start gap-3">
                <span style={{ color: "var(--black)" }}>●</span>
                Track everything in a single wallet
              </li>
              <li className="flex items-start gap-3">
                <span style={{ color: "var(--black)" }}>●</span>
                Redeem points for rewards & experiences
              </li>
            </ul>
          </motion.div>

          {/* RIGHT — VISUAL WALLET */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-6 relative flex justify-center"
          >
            <div
              className="relative mx-auto w-full max-w-lg rounded-3xl backdrop-blur-xl border-2 shadow-[0_30px_80px_rgba(0,0,0,0.12)] p-6 md:p-8 space-y-6 animate-float"
              style={{
                backgroundColor: "var(--bg)",
                borderColor: "var(--dark-teal)",
                color: "var(--dark-teal)",
              }}
            >
              {/* Wallet Header */}
              <div className="flex items-center justify-between">
                <p
                  className="text-sm md:text-base uppercase tracking-wider"
                  style={{ color: "var(--dark-teal)" }}
                >
                  Joy Wallet
                </p>
              </div>

              {/* Balance */}
              <div className="pt-2">
                <p
                  className="text-sm md:text-base"
                  style={{ color: "var(--dark-teal)/70" }}
                >
                  Total Points
                </p>
                <p
                  className="text-5xl md:text-6xl font-semibold tracking-tight"
                  style={{ color: "var(--dark-teal)" }}
                >
                  2,450
                </p>
              </div>

              {/* Recent Activity */}
              <div className="space-y-3 md:space-y-4 pt-2 md:pt-4">
                <WalletRow label="Event Attended" points="+250" />
                <WalletRow label="Game Night" points="+120" />
                <WalletRow label="Workshop Completed" points="+400" />
              </div>

              {/* Redeem Preview */}
              <div
                className="rounded-2xl p-4 md:p-5 border space-y-4"
                style={{
                  backgroundColor: "var(--light-orange)/20",
                  borderColor: "var(--light-orange)",
                }}
              >
                <p
                  className="text-sm md:text-base"
                  style={{ color: "var(--dark-teal)" }}
                >
                  Redeem your points for:
                </p>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  <RewardChip label="Free Event Pass" />
                  <RewardChip label="Merchandise" />
                  <RewardChip label="Exclusive Access" />
                </div>
              </div>
            </div>

            {/* Floating Earned Points */}
            <div
              className="absolute -top-4 md:-top-6 -right-2 md:-right-6 rounded-xl px-4 md:px-5 py-1.5 md:py-2 text-sm md:text-base font-medium shadow-xl animate-pulse-soft"
              style={{
                backgroundColor: "var(--dark-teal)",
                color: "var(--bg)",
              }}
            >
              +250 points earned
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

/* ---------- Subcomponents ---------- */

function WalletRow({ label, points }) {
  return (
    <div
      className="flex items-center justify-between rounded-xl px-5 py-3 border transition-transform duration-300 hover:-translate-y-0.5"
      style={{
        backgroundColor: "var(--light-orange)/15",
        borderColor: "var(--light-orange)/40",
        color: "var(--black)",
      }}
    >
      <span className="text-base">{label}</span>
      <span
        className="text-base font-medium"
        style={{ color: "var(--light-orange)" }}
      >
        {points}
      </span>
    </div>
  );
}

function RewardChip({ label }) {
  return (
    <span
      className="rounded-full px-4 py-1.5 text-sm border transition-all duration-300"
      style={{
        backgroundColor: "var(--bg)",
        borderColor: "var(--dark-teal)",
        color: "var(--dark-teal)",
      }}
    >
      {label}
    </span>
  );
}
