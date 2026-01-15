"use client";
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

const faqs = [
  {
    question: "Why the name “Joy Juncture”?",
    answer:
      "Because we believe joy isn’t just an emotion… it’s a place where people come together. And we’re here to create the perfect juncture for all your fun-filled memories.",
  },
  {
    question: "Do you host game nights or events?",
    answer:
      "Oh, we live for it! Check out our Events & Community section or follow us on Gram to join the fun.",
  },
  {
    question: "Can I play these games with strangers?",
    answer:
      "Absolutely! Nothing breaks the ice faster than a well-timed dare or a hilariously bad bluff.",
  },
  {
    question: "How long do your games take?",
    answer:
      "Anywhere from quick laughs to epic showdowns. Depends how often you argue about rules.",
  },
  {
    question: "What if I don’t like one of your games?",
    answer:
      "Ouch. But don’t worry — we’ll make it right. Your joy comes first.",
  },
  {
    question: "Can I gift your games?",
    answer:
      "Yes! Perfect for birthdays, weddings, or random Tuesday surprises.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(-1);
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
      className="px-6 py-24 md:px-10 flex justify-center"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <div className="w-full max-w-4xl space-y-16">
        {/* ================= HEADER ================= */}
        <motion.div
          variants={itemVariants}
          className="relative mx-auto max-w-3xl text-center space-y-6"
        >
          <motion.p
            className="relative text-[11px] uppercase tracking-[0.4em] font-bold"
            style={{ color: "var(--color-font)" }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Uh huh we know you have questions!!
          </motion.p>

          <motion.h2
            className="relative text-3xl md:text-5xl font-black tracking-tight"
            style={{ color: "var(--color-font)" }}
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            MOST ASKED…
            <motion.span
              className="block text-2xl md:text-3xl mt-2"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              or shall we say.. MOST DOUBTED
            </motion.span>
          </motion.h2>

          {/* Accent bar */}
          <motion.div
            className="relative mx-auto h-1.5 w-24 rounded-full translate-x-6"
            style={{ background: "var(--color-green)" }}
            animate={{ width: [80, 110, 80], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </motion.div>

        {/* ================= FAQ CARD ================= */}
        <motion.div
          variants={itemVariants}
          className="
            w-full overflow-hidden rounded-3xl
            border-2 bg-white
            shadow-lg
            transition-all duration-300
            hover:shadow-2xl hover:-translate-y-2
          "
          style={{
            borderColor: "var(--color-green)",
            position: "relative",
          }}
        >
          {/* Shimmer overlay effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(203, 216, 172, 0.3), transparent)",
              width: "30%",
            }}
            animate={{ x: ["-100%", "500%"] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          {faqs.map((item, idx) => {
            const open = openIndex === idx;

            return (
              <div
                key={item.question}
                className="border-b border-black/10 last:border-none"
              >
                <button
                  onClick={() => setOpenIndex(open ? -1 : idx)}
                  className={`w-full flex items-start justify-between gap-4 px-7 md:px-8 py-5 text-left transition-all duration-300 relative group ${
                    open ? "bg-green/20" : "hover:bg-green/5"
                  }`}
                >
                  {/* Animated left bar */}
                  <motion.div
                    className="absolute left-0 top-0 bottom-0 w-1.5"
                    style={{ background: "var(--color-green)" }}
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={{ scaleY: open ? 1 : 0, opacity: open ? 1 : 0.5 }}
                    transition={{
                      duration: 0.4,
                      type: "spring",
                      stiffness: 80,
                    }}
                  />

                  {/* Animated top bar when open */}
                  <motion.div
                    className="absolute top-0 left-0 right-0 h-0.5"
                    style={{ background: "var(--color-green)" }}
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: open ? 1 : 0, opacity: open ? 1 : 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  />

                  <span
                    className="text-base md:text-lg font-semibold"
                    style={{ color: "var(--color-font)" }}
                  >
                    {item.question}
                  </span>

                  <motion.span
                    className="text-lg shrink-0"
                    style={{
                      color: open ? "var(--color-green)" : "var(--color-font)",
                    }}
                    animate={{ rotate: open ? 180 : 0, scale: open ? 1.2 : 1 }}
                    transition={{
                      duration: 0.3,
                      type: "spring",
                      stiffness: 200,
                    }}
                  >
                    ⌄
                  </motion.span>
                </button>

                {/* ANSWER ANIMATION */}
                <motion.div
                  className={`grid transition-all duration-300 ease-out ${
                    open
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <motion.div
                    className="overflow-hidden"
                    initial={{ y: -20, opacity: 0 }}
                    animate={
                      open ? { y: 0, opacity: 1 } : { y: -20, opacity: 0 }
                    }
                    transition={{
                      duration: 0.5,
                      type: "spring",
                      stiffness: 120,
                      damping: 20,
                    }}
                  >
                    <div
                      className="px-7 md:px-8 py-6 text-sm md:text-base leading-relaxed border-l-4 relative"
                      style={{
                        color: "var(--color-font)",
                        backgroundColor: "rgba(203, 216, 172, 0.12)",
                        borderLeftColor: "var(--color-green)",
                      }}
                    >
                      {/* Gradient shimmer on answer */}
                      <motion.div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background:
                            "linear-gradient(90deg, rgba(255,255,255,0), rgba(203, 216, 172, 0.2), rgba(255,255,255,0))",
                          width: "40%",
                        }}
                        animate={{ x: ["-100%", "300%"] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                      <span className="relative z-10">{item.answer}</span>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </motion.section>
  );
}
