"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Users, Zap } from "lucide-react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import AddToCartButton from "@/components/AddToCartButton";

gsap.registerPlugin(ScrollTrigger);

const products = {
  buzzed: {
    title: "Buzzed",
    subtitle: "The Ultimate Drinking Card Game",
    description:
      "The viral hit that gets you and your friends hydrated. Perfect for house parties, pregames, and low-key nights.",
    image: "/gallery/marketplace/Buzzed – The Drinking Card Game.webp",
    secondaryImage: "/gallery/marketplace/Judge Me & Guess.webp",
    boxImage: "/gallery/marketplace/Dead Man's Deck.webp",
    age: "21+",
    players: "3-20",
    price: 14.99,
    instructions: [
      "Draw a card from the deck",
      "Read the prompt aloud to the group",
      "Follow the instruction or challenge",
      "Pass to the next player and repeat",
    ],
    gameId: "buzzed",
  },
};

export default function ProductPage() {
  const product = products.buzzed;
  const sectionRefs = useRef([]);

  useEffect(() => {
    // Animate sections on scroll
    sectionRefs.current.forEach((section, idx) => {
      gsap.fromTo(
        section,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 20%",
            scrub: 0.5,
          },
        }
      );
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Section 1: Hero (Image Left, Content Right) */}
      <section
        ref={(el) => el && sectionRefs.current.push(el)}
        className="py-20 px-6 md:px-12"
      >
        <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left: Image */}
          <div className="relative h-96 rounded-2xl overflow-hidden group">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-cover group-hover:scale-110 transition duration-500"
              priority
            />
          </div>

          {/* Right: Content */}
          <div>
            <h1 className="text-6xl md:text-7xl font-black text-white mb-4">
              {product.title}
            </h1>
            <p className="text-2xl text-lime-400 font-semibold">
              {product.subtitle}
            </p>
            <div className="mt-8 flex gap-4">
              <AddToCartButton gameId={product.gameId} />
              <button className="px-6 py-3 border-2 border-lime-400 text-lime-400 rounded-full font-semibold hover:bg-lime-400 hover:text-black transition">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Story (Content Left, Image Right) */}
      <section
        ref={(el) => el && sectionRefs.current.push(el)}
        className="py-20 px-6 md:px-12 bg-gray-900/50"
      >
        <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div>
            <h2 className="text-4xl font-black text-lime-400 mb-6">
              The Story
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              {product.description}
            </p>
            <p className="text-lg text-gray-400 mt-6">
              Whether you&apos;re a seasoned party enthusiast or looking to spice up
              a casual night in, Buzzed delivers laughs, challenges, and
              unforgettable moments. Every card is designed to bring people
              together and create memories that last.
            </p>
          </div>

          {/* Right: Image */}
          <div className="relative h-96 rounded-2xl overflow-hidden group">
            <Image
              src={product.secondaryImage}
              alt="Game in action"
              fill
              className="object-cover group-hover:scale-110 transition duration-500"
            />
          </div>
        </div>
      </section>

      {/* Section 3: How to Play (Image Left, Content Right) */}
      <section
        ref={(el) => el && sectionRefs.current.push(el)}
        className="py-20 px-6 md:px-12"
      >
        <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left: Image */}
          <div className="relative h-96 rounded-2xl overflow-hidden group">
            <Image
              src={product.boxImage}
              alt="Game box"
              fill
              className="object-cover group-hover:scale-110 transition duration-500"
            />
          </div>

          {/* Right: Content */}
          <div>
            <h2 className="text-4xl font-black text-lime-400 mb-6">
              How to Play
            </h2>
            <ol className="space-y-4 mb-8">
              {product.instructions.map((instr, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <span className="text-lime-400 font-black text-2xl">
                    {idx + 1}.
                  </span>
                  <span className="text-lg text-gray-300">{instr}</span>
                </li>
              ))}
            </ol>

            {/* Quick Info */}
            <div className="mt-8 flex gap-6">
              <div className="flex items-center gap-3 bg-gray-800 px-6 py-4 rounded-xl">
                <Zap className="text-lime-400 h-6 w-6" />
                <div>
                  <p className="text-sm text-gray-400">Age</p>
                  <p className="text-xl font-bold text-white">
                    {product.age}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-800 px-6 py-4 rounded-xl">
                <Users className="text-lime-400 h-6 w-6" />
                <div>
                  <p className="text-sm text-gray-400">Players</p>
                  <p className="text-xl font-bold text-white">
                    {product.players}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-12 bg-gradient-to-r from-lime-400/10 to-transparent border-t border-lime-400/20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-black text-white mb-6">
            Ready to Get Buzzed?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of party enthusiasts and bring the fun to your next
            gathering.
          </p>
          <AddToCartButton gameId={product.gameId} />
        </div>
      </section>
    </div>
  );
}
