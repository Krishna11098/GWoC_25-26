import { db } from "@/lib/firebaseAdmin";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingCartButton from "@/components/FloatingCartButton";
import ShopWithFilters from "@/components/ShopWithFilters";

export const dynamic = "force-dynamic"; // ensure fresh data in dev

async function getProducts() {
  if (!db) return [];
  const snap = await db.collection("products").get();
  return snap.docs.map((d) => {
    const raw = d.data();
    const plain = {};

    Object.entries(raw).forEach(([key, value]) => {
      if (value && typeof value.toMillis === "function") {
        // Firestore Timestamp -> number (ms)
        plain[key] = value.toMillis();
      } else {
        plain[key] = value;
      }
    });

    return { id: d.id, ...plain };
  });
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
    buzzed: "/gallery/marketplace/Buzzed – The Drinking Card Game.webp",
    "court-52": "/gallery/marketplace/Court 52 Pickleball.WEBP",
    "dead-mans-deck": "/gallery/marketplace/Dead Man's Deck.webp",
    "dreamers-fair": "/gallery/marketplace/Dreamer’s Fair.WEBP",
    "judge-me-guess": "/gallery/marketplace/Judge Me & Guess.webp",
    mehfil: "/gallery/marketplace/Mehfil – The Ultimate Musical Card Game.webp",
    "one-more-round": "/gallery/marketplace/One More Round.webp",
    tamasha: "/gallery/marketplace/Tamasha – The Bollywood Bid Card Game.webp",
    "the-bloody-inheritance":
      "/gallery/marketplace/The Bloody Inheritance.webp",
  };

  // Fallback: if no Firestore products (or server creds missing), show dummy cards
  const fallback = [
    {
      id: "buzzed",
      name: "Buzzed – The Drinking Card Game",
      category: "card_game",
      price: 14.99,
    },
    {
      id: "dead-mans-deck",
      name: "Dead Man's Deck",
      category: "card_game",
      price: 19.99,
    },
    {
      id: "court-52",
      name: "Court 52 Pickleball Card Game",
      category: "card_game",
      price: 15.99,
    },
    {
      id: "dreamers-fair",
      name: "Dreamer's Fair | 36 PCS Silhouette Puzzle",
      category: "puzzle",
      price: 699.0,
    },
    {
      id: "judge-me-guess",
      name: "Judge Me & Guess",
      category: "party_game",
      price: 16.99,
    },
    {
      id: "mehfil",
      name: "Mehfil – The Ultimate Musical Card Game",
      category: "card_game",
      price: 24.99,
    },
    {
      id: "one-more-round",
      name: "One More Round",
      category: "party_game",
      price: 17.99,
    },
    {
      id: "tamasha",
      name: "Tamasha – The Bollywood Bid Card Game",
      category: "card_game",
      price: 22.99,
    },
    {
      id: "the-bloody-inheritance",
      name: "The Bloody Inheritance",
      category: "mystery_game",
      price: 29.99,
    },
  ];
  const items = products.length ? products : fallback;

  return (
    <>
      <Navbar />

      <div className="px-5 md:px-12 pt-5 pb-12 mt-32">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-10">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">
                Game Marketplace
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Browse and add games to your cart.
              </p>
            </div>
            <FloatingCartButton />
          </div>

          <ShopWithFilters
            items={items}
            imageById={imageById}
            fallbackImages={images}
          />
        </div>
      </div>

      <Footer />
    </>
  );
}
