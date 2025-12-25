import { db } from "@/lib/firebaseAdmin";
import AddToCartButton from "@/components/AddToCartButton";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingCartButton from "@/components/FloatingCartButton";
import Image from "next/image";

export const dynamic = "force-dynamic"; // ensure fresh data in dev

async function getProducts() {
  if (!db) return [];
  const snap = await db.collection("products").get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export default async function GamesPage() {
  const products = await getProducts();
  const images = [
    "/gallery/marketplace/Buzzed – The Drinking Card Game.webp",
    "/gallery/marketplace/Court 52 Pickleball.WEBP",
    "/gallery/marketplace/Dead Man's Deck.webp",
    "/gallery/marketplace/Dreamer’s Fair.WEBP",
    "/gallery/marketplace/Judge Me & Guess.webp",
    "/gallery/marketplace/Mehfil – The Ultimate Musical Card Game.webp",
    "/gallery/marketplace/One More Round.webp",
    "/gallery/marketplace/Tamasha – The Bollywood Bid Card Game.webp",
    "/gallery/marketplace/The Bloody Inheritance.webp",
  ];

  const imageById = {
    "buzzed": "/gallery/marketplace/Buzzed – The Drinking Card Game.webp",
    "court-52": "/gallery/marketplace/Court 52 Pickleball.WEBP",
    "dead-mans-deck": "/gallery/marketplace/Dead Man's Deck.webp",
    "dreamers-fair": "/gallery/marketplace/Dreamer’s Fair.WEBP",
    "judge-me-guess": "/gallery/marketplace/Judge Me & Guess.webp",
    "mehfil": "/gallery/marketplace/Mehfil – The Ultimate Musical Card Game.webp",
    "one-more-round": "/gallery/marketplace/One More Round.webp",
    "tamasha": "/gallery/marketplace/Tamasha – The Bollywood Bid Card Game.webp",
    "the-bloody-inheritance": "/gallery/marketplace/The Bloody Inheritance.webp",
  };

  // Fallback: if no Firestore products (or server creds missing), show dummy cards
  const fallback = [
    { id: "buzzed", name: "Buzzed – The Drinking Card Game", category: "card_game", price: 14.99 },
    { id: "dead-mans-deck", name: "Dead Man's Deck", category: "card_game", price: 19.99 },
    { id: "court-52", name: "Court 52 Pickleball Card Game", category: "card_game", price: 15.99 },
    { id: "dreamers-fair", name: "Dreamer's Fair | 36 PCS Silhouette Puzzle", category: "puzzle", price: 699.0 },
    { id: "judge-me-guess", name: "Judge Me & Guess", category: "party_game", price: 16.99 },
    { id: "mehfil", name: "Mehfil – The Ultimate Musical Card Game", category: "card_game", price: 24.99 },
    { id: "one-more-round", name: "One More Round", category: "party_game", price: 17.99 },
    { id: "tamasha", name: "Tamasha – The Bollywood Bid Card Game", category: "card_game", price: 22.99 },
    { id: "the-bloody-inheritance", name: "The Bloody Inheritance", category: "mystery_game", price: 29.99 },
  ];
  const items = products.length ? products : fallback;

  return (
    <>
      <Navbar />
      <div className="px-5 md:px-12 pt-5 pb-12">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-10">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">Game Marketplace</h1>
              <p className="mt-2 text-sm text-gray-600">Browse and add games to your cart.</p>
            </div>
            <FloatingCartButton />
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((p, idx) => (
              <div
                key={p.id}
                className="rounded-2xl border border-white/60 bg-white/90 shadow-[0_10px_30px_rgba(0,0,0,0.08)] overflow-hidden"
              >
                {/* Image */}
                <div className="relative w-full h-48 bg-gray-100">
                  <Image
                    src={imageById[p.id] || images[idx % images.length]}
                    alt={(p.name || p.title || "Game") + " cover"}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                    className="object-cover"
                    priority={idx < 3}
                  />
                </div>

                <div className="p-5 flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{p.name || p.title || "Untitled"}</h3>
                    <p className="mt-1 text-xs text-gray-500">{p.category || "Unknown"}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-gray-900 px-3 py-1 text-base text-white font-semibold">
                    Rs. {typeof p.price === "number" ? p.price.toFixed(2) : "--"}
                  </span>
                </div>

                <div className="px-5 pb-5 flex items-center justify-between">
                  <a
                    href={`/games/${p.id}`}
                    className="rounded-full px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100"
                  >
                    View Details
                  </a>
                  <AddToCartButton gameId={p.id} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
