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
          <p
            className="relative text-[11px] uppercase tracking-[0.4em]"
            style={{ color: "var(--dark-teal)" }}
          >
            Uh huh we know you have questions!!
          </p>

          <h2
            className="relative text-3xl md:text-4xl font-extrabold tracking-tight"
            style={{ color: "var(--dark-teal)" }}
          >
            MOST ASKED…
            <span className="block">or shall we say.. MOST DOUBTED</span>
          </h2>

          {/* OFF-CENTER ACCENT */}
          <div
            className="relative mx-auto h-1 w-20 rounded-full translate-x-6"
            style={{ backgroundColor: "var(--dark-teal)" }}
          />
        </motion.div>

        {/* ================= FAQ CARD ================= */}
        <motion.div
          variants={itemVariants}
          className="
            w-full overflow-hidden rounded-2xl
            border border-white/40 bg-white backdrop-blur-md
            shadow-[0_25px_70px_rgba(0,0,0,0.25)]
            transition-transform duration-300
            hover:-translate-y-1
          "
        >
          {faqs.map((item, idx) => {
            const open = openIndex === idx;

            return (
              <div
                key={item.question}
                className="border-b border-black/10 last:border-none"
              >
                <button
                  onClick={() => setOpenIndex(open ? -1 : idx)}
                  className={`w-full flex items-start justify-between gap-4 px-7 md:px-8 py-6 text-left transition-all duration-300
                    ${open ? "font-bold underline" : "hover:bg-black/5"}
                  `}
                  style={
                    open
                      ? {
                          backgroundColor: "var(--light-orange)",
                          color: "var(--dark-teal)",
                        }
                      : { color: "var(--dark-teal)" }
                  }
                >
                  <span className="text-base md:text-lg font-semibold">
                    {item.question}
                  </span>

                  <span
                    className={`text-xl transition-transform duration-300 ${
                      open ? "rotate-180" : ""
                    }`}
                    style={{
                      color: open ? "var(--dark-teal)" : "var(--dark-teal)/60",
                    }}
                  >
                    ⌄
                  </span>
                </button>

                {/* ANSWER ANIMATION */}
                <div
                  className={`grid transition-all duration-300 ease-out ${
                    open
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div
                      className="px-7 md:px-8 pb-6 text-sm md:text-base leading-relaxed font-bold"
                      style={{
                        backgroundColor: "var(--light-orange)",
                        color: "var(--dark-teal)",
                      }}
                    >
                      {item.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </motion.section>
  );
}
