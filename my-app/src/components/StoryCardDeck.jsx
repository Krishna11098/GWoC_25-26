"use client";

import { useEffect, useRef, useState } from "react";

export default function StoryCardDeck({ cards }) {
  const containerRef = useRef(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const containerTop = container.offsetTop;
      const windowHeight = window.innerHeight;
      const cardHeight = windowHeight;
      
      // Calculate which card should be active based on scroll position
      const relativeScroll = Math.max(0, scrollTop - containerTop);
      const cardIndex = Math.floor(relativeScroll / cardHeight);
      const clampedIndex = Math.max(0, Math.min(cardIndex, cards.length - 1));
      
      setActiveCardIndex(clampedIndex);
      
      // Calculate progress within current card for flip animation
      const cardProgress = (relativeScroll % cardHeight) / cardHeight;
      setScrollProgress(Math.max(0, Math.min(1, cardProgress)));
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [cards.length]);

  return (
    <div 
      ref={containerRef}
      className="relative pt-40 parallax-container"
      style={{ 
        // Add an extra viewport of height so the last card can finish animating without bouncing back up
        height: `${(cards.length + 1) * 100}vh`,
        willChange: 'transform'
      }}
    >
      <div className="sticky top-1/2 -translate-y-1/2 h-[70vh] flex items-center justify-center perspective-1000" style={{ willChange: 'transform' }}>
        <div className="relative w-full max-w-6xl h-full">
          {cards.map((card, index) => {
            const isActive = index === activeCardIndex;
            const isPassed = index < activeCardIndex;
            const isFuture = index > activeCardIndex;
            
            // Calculate transform for stacking effect
            const zIndex = cards.length - Math.abs(index - activeCardIndex);
            const translateY = isPassed 
              ? -100 
              : isFuture 
              ? (index - activeCardIndex) * 8 
              : 0;
            
            const scale = isPassed 
              ? 0.9 
              : isFuture 
              ? 1 - (index - activeCardIndex) * 0.05 
              : 1;
            
            const opacity = isPassed 
              ? 0 
              : isFuture 
              ? 0.3 + (1 / (index - activeCardIndex + 1)) * 0.7 
              : 1;

            // Flip animation for active card
            const rotateX = isActive ? scrollProgress * 10 : 0;

            return (
              <div
                key={index}
                className="absolute inset-0 transition-all duration-500 ease-out"
                style={{
                  zIndex,
                  transform: `translateY(${translateY}px) scale(${scale}) rotateX(${rotateX}deg)`,
                  opacity,
                  transformStyle: "preserve-3d",
                  willChange: 'transform, opacity',
                }}
              >
                <div className="w-full h-full bg-white rounded-3xl shadow-2xl overflow-auto p-8 md:p-12 border border-slate-200">
                  {card.content}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
