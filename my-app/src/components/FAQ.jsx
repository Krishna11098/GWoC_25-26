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

  return (
    <section className="px-6 py-24 md:px-10 flex justify-center">
      {/* ENTRY ANIMATION */}
      <div className="w-full max-w-4xl space-y-16 animate-fade-in">
        {/* ================= HEADER ================= */}
        <div className="relative mx-auto max-w-3xl text-center space-y-6">
          <p className="relative text-[11px] uppercase tracking-[0.4em]">
            Uh huh we know you have questions!!
          </p>

          <h2 className="relative text-3xl md:text-4xl font-extrabold tracking-tight">
            MOST ASKED…
            <span className="block">or shall we say.. MOST DOUBTED</span>
          </h2>

          {/* OFF-CENTER ACCENT */}
          <div className="relative mx-auto h-1 w-20 rounded-full bg-black translate-x-6" />
        </div>

        {/* ================= FAQ CARD ================= */}
        <div
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
                    ${
                      open
                        ? "bg-green/80 font-bold underline"
                        : "hover:bg-black/5"
                    }
                  `}
                >
                  <span className="text-base md:text-lg font-semibold">
                    {item.question}
                  </span>

                  <span
                    className={`text-xl transition-transform duration-300 ${
                      open ? "rotate-180 text-font" : "text-black/60"
                    }`}
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
                    <div className="px-7 md:px-8 pb-6 text-sm md:text-base leading-relaxed font-bold bg-green/80">
                      {item.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
