"use client";

import { useState } from "react";
import { auth } from "@/lib/firebaseClient";
import { ShoppingCart, Check } from "lucide-react";

export default function AddToCartButton({ gameId, className = "" }) {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  async function addToCart() {
    if (loading) return;
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) {
        alert("Please login to add items to your cart.");
        return;
      }
      const token = await user.getIdToken();

      const res = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: "add", gameId }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to add to cart");
      }

      // Show temporary "Added" confirmation
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (e) {
      console.error(e);
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={addToCart}
      disabled={loading}
      className={`inline-flex items-center gap-2 rounded-full ${added ? "bg-emerald-700" : "bg-emerald-600"} px-6 py-3 text-base font-semibold text-white hover:bg-emerald-500 transition disabled:opacity-60 ${className}`}
    >
      {added ? (
        <Check className="h-5 w-5" />
      ) : (
        <ShoppingCart className="h-5 w-5" />
      )}
      {loading ? "Adding..." : added ? "Added" : "Add to Cart"}
    </button>
  );
}
