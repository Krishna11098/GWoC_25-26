"use client";

import ScrollStack, { ScrollStackItem } from "./Scrollstack";

const stats = [
  {
    value: "55+",
    description:
      "Our network spans over 55 countries, giving you local insight with global consistency.",
    accent: "from-blue-500/90 to-blue-500/60",
  },
  {
    value: "300+",
    description:
      "We’ve successfully delivered more than 300 research projects around the world — and counting.",
    accent: "from-emerald-500/90 to-emerald-500/60",
  },
  {
    value: "40+",
    description:
      "From global brands to growing startups, more than 40 clients have partnered with us.",
    accent: "from-rose-500/90 to-rose-500/60",
  },
];

export default function ProofOfJoy() {
  return (
    <section className="relative bg-gradient-to-b from-[#f7f5ef] to-white py-20 md:py-28">
      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 md:px-10">
        
        {/* ---------- HEADER ---------- */}
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-3">
            <span className="h-9 w-2 rounded-full bg-[#E46B1B]" />
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-600">
              Proof of Joy
            </p>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
            A few numbers behind the insights we deliver
          </h2>

          <p className="text-lg md:text-xl leading-relaxed text-gray-700">
            These numbers are more than milestones. They represent the strength
            of our connections, the consistency of our work, and the real-world
            impact we help create.
          </p>
        </div>

        {/* ---------- SCROLL STACK ---------- */}
        <ScrollStack
          className="h-[80vh] md:h-[90vh]"
          itemDistance={96}          // pixel-aligned
          itemStackDistance={32}     // pixel-aligned
          itemScale={0}              // ❌ NO scale scrubbing
          baseScale={1}              // ❌ NO base scaling
          rotationAmount={0}
          blurAmount={0}
          stackPosition="35%"
          scaleEndPosition="20%"
          useWindowScroll={true}
        >
          {stats.map((item, i) => (
            <ScrollStackItem
              key={item.value}
              itemClassName="border-0 bg-transparent shadow-none"
            >
              <div
                className="
                  relative flex h-full min-h-[18rem]
                  flex-col justify-between
                  overflow-hidden
                  rounded-3xl
                  border border-white/60
                  bg-white/90
                  px-8 py-10
                  shadow-[0_18px_40px_rgba(0,0,0,0.08)]
                  backdrop-blur-sm
                  will-change-transform
                "
              >
                {/* Accent gradient */}
                <div
                  className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${item.accent}`}
                />

                {/* Content */}
                <div className="space-y-3">
                  <p className="text-5xl md:text-6xl font-semibold text-gray-900">
                    {item.value}
                  </p>
                  <p className="text-base md:text-lg leading-relaxed text-gray-700 pr-6">
                    {item.description}
                  </p>
                </div>

                {/* Footer pill */}
                <div className="mt-6 inline-flex items-center gap-2 self-start rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
                  <span className="h-2 w-2 rounded-full bg-[#E46B1B]" />
                  Featured story {i + 1}
                </div>
              </div>
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </div>
    </section>
  );
}
