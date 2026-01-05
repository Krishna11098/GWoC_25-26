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
      className="relative min-h-screen grid lg:grid-cols-2 grid-cols-1"
      style={{
        transform: `scale(${scale}) translateY(${translateY}px)`,
        opacity,
        filter: `blur(${blur}px)`,
        transformOrigin: "center center",
        transition: "filter 0.1s ease-out",
        willChange: "transform, opacity, filter",
      }}
    >
      {/* Left Section - Text Content */}
      <div className="flex flex-col justify-center items-start px-8 md:px-16 lg:px-20 py-16 lg:py-0">
        <div className="max-w-xl">
          <PlayfulHeading
            text="JOY JUNCTURE"
            className="font-winky-rough text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            staggerDelay={0.05}
          />
          <PlayfulHeading
            text="Play. Connect. Celebrate "
            as="p"
            className="font-winky-rough-soft text-xl md:text-2xl font-medium leading-relaxed"
            staggerDelay={0.02}
          />
        </div>
      </div>

      {/* Right Section - Scrolling Gallery */}
      <div className="relative h-[60vh] lg:h-screen overflow-hidden">
        <div className="scroll-container h-full flex flex-col">
          {/* Duplicate images for seamless infinite scroll */}
          <div className="scroll-content animate-scroll hover:pause-scroll">
            {[...galleryImages, ...galleryImages].map((src, index) => (
              <div
                key={index}
                className="w-full h-64 lg:h-80 shrink-0 relative"
              >
                <img
                  src={src}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
