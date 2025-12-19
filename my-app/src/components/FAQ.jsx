"use client";

import { useState } from "react";

const faqs = [
  {
    question: "Why the name “Joy Juncture”?",
    answer:
      "Because we believe joy isn’t just an emotion… it’s a place where people come together. And we’re here to create the perfect juncture for all your fun-filled memories.",
  },
  {
    question: "Do you host game nights or events?",
    answer:
      "Oh, we live for it! Check out our Events & Community section or follow us on Gram to join the fun. We bring the games, you bring the squad.",
  },
  {
    question: "Can I play these games with strangers?",
    answer:
      "Absolutely! Nothing breaks the ice faster than a well-timed dare or a hilariously bad bluff. Warning: You may leave as besties or frenemies.",
  },
  {
    question: "How long do your games take?",
    answer:
      "Anywhere from quick laughs to epic showdowns. It depends on how often you pause to argue about the rules or fetch more pizza.",
  },
  {
    question: "What if I don’t like one of your games?",
    answer:
      "First of all, ouch. Second, we’re here to make it right. Drop us a message, and we’ll work some magic. Refunds (jk), swaps, or even a handwritten apology from one of our designers… your joy is our priority!",
  },
  {
    question: "Can I gift your games?",
    answer:
      "Absolutely! Our games come with built-in “wow” factors that make them perfect for birthdays, weddings, or random Tuesday surprises!!",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (idx) => {
    setOpenIndex((prev) => (prev === idx ? -1 : idx));
  };

  return (
    <section className="relative isolate overflow-hidden bg-[#14171c] px-6 py-20 md:px-10 md:py-24 flex justify-center">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="mx-auto h-full max-w-5xl rounded-3xl bg-gradient-to-b from-white/3 to-white/0" />
      </div>

      <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center space-y-12 text-center">
        <div className="space-y-3">
          <p className="text-[11px] uppercase tracking-[0.35em] text-gray-400">
            Uh huh we know you have questions!!
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-50">
            MOST ASKED… or shall we say.. MOST DOUBTED
          </h2>
        </div>

        <div className="w-full divide-y divide-gray-800/80 overflow-hidden rounded-2xl border border-gray-800/70 bg-[#1b1f26] shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
          {faqs.map((item, idx) => {
            const open = openIndex === idx;
            return (
              <div key={item.question}>
                <button
                  className="w-full px-7 md:px-8 py-5 md:py-6 flex items-start justify-between gap-4 text-left hover:bg-white/3 transition-colors duration-200"
                  onClick={() => toggle(idx)}
                >
                  <span className="text-base md:text-lg font-semibold text-gray-50">
                    {item.question}
                  </span>
                  <span
                    className={`text-gray-400 text-lg leading-none transition-transform duration-200 ${
                      open ? "rotate-180" : ""
                    }`}
                    aria-hidden
                  >
                    ⌄
                  </span>
                </button>
                {open && (
                  <div className="px-7 md:px-8 pb-6 text-sm md:text-base leading-relaxed text-gray-200">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
