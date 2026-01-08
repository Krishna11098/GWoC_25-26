"use client";

import Image from "next/image";
import "./ProofOfJoy.css";

export default function ProofOfJoy() {
  const labels = [
    { image: 1, text: "Community Events" },
    { image: 2, text: "Player Insights" },
    { image: 3, text: "Middle East" },
    { image: 4, text: "Customer Insights" },
  ];

  const getLabel = (imageNum) => labels.find((l) => l.image === imageNum)?.text || "";

  return (
    <section className="relative py-20 md:py-28 bg-darkblue">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        {/* ---------- HEADER ---------- */}
        <div className="mb-12">
          <div className="flex items-center gap-3">
            <span className="h-9 w-2 rounded-full bg-font" />
            <p className="text-sm font-bold uppercase tracking-[0.25em]">
              Proof of Joy
            </p>
          </div>
        </div>

        {/* ---------- IMAGE GRID ---------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[600px] md:h-[800px]">
          {/* Left: Single large image */}
          <div className="relative h-[400px] md:h-full overflow-hidden rounded-3xl shadow-2xl">
            <Image
              src="/gallery/image1.png"
              alt="Gallery Image 1"
              fill
              className="object-cover image-hover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            <div className="image-label">
              <span>{getLabel(1)}</span>
            </div>
          </div>

          {/* Right: Top and bottom sections */}
          <div className="flex flex-col gap-6 h-[800px] md:h-full">
            {/* Top: Single image */}
            <div className="relative h-1/2 overflow-hidden rounded-3xl shadow-2xl">
              <Image
                src="/gallery/image2.png"
                alt="Gallery Image 2"
                fill
                className="object-cover image-hover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="image-label">
                <span>{getLabel(2)}</span>
              </div>
            </div>

            {/* Bottom: Two images side by side */}
            <div className="grid grid-cols-2 gap-6 h-1/2">
              <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                <Image
                  src="/gallery/image3.png"
                  alt="Gallery Image 3"
                  fill
                  className="object-cover image-hover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="image-label">
                  <span>{getLabel(3)}</span>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                <Image
                  src="/gallery/image4.png"
                  alt="Gallery Image 4"
                  fill
                  className="object-cover image-hover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="image-label">
                  <span>{getLabel(4)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
