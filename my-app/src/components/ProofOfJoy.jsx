"use client";

import Image from "next/image";

export default function ProofOfJoy() {
  return (
    <section className="relative bg-background py-20 md:py-28 text-font">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        {/* ---------- HEADER ---------- */}
        <div className="mb-12">
          <div className="flex items-center gap-3">
            <span className="h-9 w-2 rounded-full bg-foreground" />
            <p className="text-sm font-bold uppercase tracking-[0.25em]">
              Proof of Joy
            </p>
          </div>
        </div>

        {/* ---------- IMAGE GRID ---------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[800px]">
          {/* Left: Single large image */}
          <div className="relative overflow-hidden rounded-3xl shadow-2xl">
            <Image
              src="/gallery/image1.png"
              alt="Gallery Image 1"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Right: Top and bottom sections */}
          <div className="flex flex-col gap-6">
            {/* Top: Single image */}
            <div className="relative overflow-hidden rounded-3xl shadow-2xl h-1/2">
              <Image
                src="/gallery/image2.png"
                alt="Gallery Image 2"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Bottom: Two images side by side */}
            <div className="grid grid-cols-2 gap-6 h-1/2">
              <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                <Image
                  src="/gallery/image3.png"
                  alt="Gallery Image 3"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
              <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                <Image
                  src="/gallery/image4.png"
                  alt="Gallery Image 4"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
