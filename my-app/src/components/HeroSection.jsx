"use client";

import PlayfulHeading from "./PlayfulHeading";

/**
 * HeroSection - Animates out smoothly as next section enters viewport
 * @param {number} scrollProgress - Progress value (0-1) from parent/page
 */
export default function HeroSection({ scrollProgress = 0 }) {
  // Gallery images - replace with your actual image paths
  const galleryImages = [
    "/gallery/image1.png",
    "/gallery/image2.png",
    "/gallery/image3.png",
    "/gallery/image4.png",
    "/gallery/image5.png",
    "/gallery/image6.png",
  ];

  // Calculate transform values based on scroll progress
  const scale = 1 - scrollProgress * 0.1; // Scale from 1 to 0.9
  const translateY = scrollProgress * -80; // Move up 80px
  const opacity = 1 - scrollProgress * 0.3; // Fade from 1 to 0.7
  const blur = scrollProgress * 4; // Blur from 0 to 4px

  return (
    <section
      className="relative min-h-screen flex flex-col items-center pt-20 md:pt-32 mt-10"
      style={{
        transform: `scale(${scale}) translateY(${translateY}px)`,
        opacity,
        transformOrigin: "center center",
        transition: "filter 0.1s ease-out",
        willChange: "transform, opacity, filter",
      }}
    >
      {/* Mesh Background (Optional, if you want it here instead of global)
      <div className="absolute inset-0 pointer-events-none opacity-50 mesh-gradient -z-10" /> */}

      {/* Top Section - Centered Text Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-8 md:px-16 container mx-auto mt-auto">
        <div className="max-w-4xl">
          <PlayfulHeading
            text="JOY JUNCTURE"
            className="font-winky-rough text-6xl md:text-8xl lg:text-9xl font-bold mb-6 italic text-font drop-shadow-sm"
            staggerDelay={0.06}
          />
          <PlayfulHeading
            text="Play. Connect. Celebrate."
            as="p"
            className="font-winky-rough-soft text-2xl md:text-3xl font-medium leading-relaxed text-font/80 mb-12"
            staggerDelay={0.03}
          />
        </div>
      </div>

      {/* Bottom Section - Horizontal Scrolling Gallery */}
      <div className="m-auto w-full relative overflow-hidden pb-12 pt-12">
        <div className="flex animate-marquee whitespace-nowrap hover:pause-scroll">
          {[...galleryImages, ...galleryImages, ...galleryImages].map((src, index) => (
            <div
              key={index}
              className="inline-block px-4 w-[300px] md:w-[450px] shrink-0"
            >
              <div className="bg-green/10 backdrop-blur-sm p-3 rounded-[2.5rem] shadow-2xl border-2 border-green transform hover:scale-105 transition-transform duration-500">
                <img
                  src={src}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-48 md:h-72 object-cover rounded-[2rem]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
