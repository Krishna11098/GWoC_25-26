"use client";

import { useEffect, useMemo, useState } from "react";
import { auth } from "@/lib/firebaseClient";
import { Trash2 } from "lucide-react";
import gsap from "gsap";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function CartPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const el = document.querySelector("#order-summary");
    if (el) {
      gsap.fromTo(el, { x: 80, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: "power3.out" });
    }
  }, []);

  async function fetchCart() {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) {
        setItems([]);
        setLoading(false);
        return;
      }
      const token = await user.getIdToken();
      const res = await fetch("/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setItems(data.items || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCart();
  }, []);

  const subtotal = useMemo(() => {
    return items.reduce((sum, it) => sum + (it.price || 0) * (it.quantity || 0), 0);
  }, [items]);

  const shipping = useMemo(() => (subtotal > 50 ? 0 : 10), [subtotal]);
  const tax = useMemo(() => subtotal * 0.1, [subtotal]);
  const total = useMemo(() => subtotal + shipping + tax, [subtotal, shipping, tax]);

  async function updateQuantity(gameId, quantity) {
    try {
      const user = auth.currentUser;
      if (!user) return alert("Please login");
      const token = await user.getIdToken();
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action: "update", gameId, quantity }),
      });
      if (!res.ok) throw new Error("Failed to update");
      await fetchCart();
    } catch (e) {
      console.error(e);
      alert(e.message);
    }
  }

  async function removeItem(gameId) {
    try {
      const user = auth.currentUser;
      if (!user) return alert("Please login");
      const token = await user.getIdToken();
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action: "remove", gameId }),
      });
      if (!res.ok) throw new Error("Failed to remove");
      await fetchCart();
    } catch (e) {
      console.error(e);
      alert(e.message);
    }
  }

  return (
    <>
      <Navbar />
      <div className="px-5 md:px-12 pt-5 pb-12">
        <div className="mx-auto w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-semibold text-gray-900">Your Cart</h1>
          {loading ? (
            <p className="mt-4 text-sm text-gray-600">Loading...</p>
          ) : items.length === 0 ? (
            <p className="mt-4 text-sm text-gray-600">Your cart is empty.</p>
          ) : (
            <div className="mt-6 space-y-4">
              {items.map((it) => {
                const imageMap = {
                  "buzzed": "/gallery/marketplace/Buzzed – The Drinking Card Game.webp",
                  "dead-mans-deck": "/gallery/marketplace/Dead Man's Deck.webp",
                  "court-52": "/gallery/marketplace/Court 52 Pickleball.WEBP",
                  "dreamers-fair": "/gallery/marketplace/Dreamer's Fair.png",
                  "judge-me-guess": "/gallery/marketplace/Judge Me & Guess.webp",
                  "mehfil": "/gallery/marketplace/Mehfil – The Ultimate Musical Card Game.webp",
                  "one-more-round": "/gallery/marketplace/One More Round.webp",
                  "tamasha": "/gallery/marketplace/Tamasha – The Bollywood Bid Card Game.webp",
                  "the-bloody-inheritance": "/gallery/marketplace/The Bloody Inheritance.webp",
                };
                const imageSrc = imageMap[it.id] || "/gallery/marketplace/Buzzed – The Drinking Card Game.webp";

                return (
                <div key={it.id} className="flex items-center gap-4 rounded-2xl border border-white/60 bg-white/90 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                  {/* Image */}
                  <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={imageSrc}
                      alt={it.title}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">{it.category}</p>
                    <h3 className="text-lg font-semibold text-gray-900">{it.title}</h3>
                    <p className="mt-1 text-sm text-gray-900">Rs. {typeof it.price === "number" ? it.price.toFixed(2) : "--"}</p>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        className="rounded-md bg-gray-100 px-2 py-1 text-sm hover:bg-gray-200 text-gray-900"
                        onClick={() => updateQuantity(it.id, Math.max(1, (it.quantity || 1) - 1))}
                      >
                        -
                      </button>
                      <span className="min-w-8 text-center">{it.quantity || 1}</span>
                      <button
                        className="rounded-md bg-gray-100 px-2 py-1 text-sm hover:bg-gray-200 text-gray-900"
                        onClick={() => updateQuantity(it.id, (it.quantity || 1) + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="inline-flex items-center gap-2 rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
                      onClick={() => removeItem(it.id)}
                    >
                      <Trash2 className="h-4 w-4" /> Remove
                    </button>
                  </div>
                </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Order Summary */}
        <aside id="order-summary" className="lg:col-span-1">
          <div className="rounded-2xl border border-white/60 bg-white/90 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
            <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">Rs. {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-gray-900">Rs. {shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (10%)</span>
                <span className="font-medium text-gray-900">Rs. {tax.toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-4 h-px bg-gray-200" />
            <div className="mt-4 flex justify-between text-base">
              <span className="text-gray-900">Total</span>
              <span className="font-semibold text-gray-900">Rs. {total.toFixed(2)}</span>
            </div>
            <button className="mt-6 w-full rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
              Checkout (Coming Soon)
            </button>
          </div>
        </aside>
        </div>
      </div>
      <Footer />
    </>
  );
}
