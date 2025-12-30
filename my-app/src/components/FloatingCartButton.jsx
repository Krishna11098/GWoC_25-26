"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebaseClient";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FloatingCartButton() {
  const [itemCount, setItemCount] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDropping, setIsDropping] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchCount() {
      try {
        const user = auth.currentUser;
        if (!user) return;
        const token = await user.getIdToken();
        const res = await fetch("/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          const total = (data.items || []).reduce(
            (sum, it) => sum + (it.quantity || 0),
            0
          );
          setItemCount(total);
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchCount();
    const interval = setInterval(fetchCount, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragOver(false);
    let gameId = null;
    try {
      const json = e.dataTransfer.getData("application/json");
      if (json) {
        const parsed = JSON.parse(json);
        gameId = parsed.gameId || parsed.id;
      }
      if (!gameId) {
        gameId = e.dataTransfer.getData("text/plain");
      }
    } catch (err) {
      console.error(err);
    }

    if (!gameId) return;

    try {
      const user = auth.currentUser;
      if (!user) {
        alert("Please login to add items to cart");
        return;
      }
      const token = await user.getIdToken();
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: "update", gameId, quantity: 1 }),
      });
      if (!res.ok) throw new Error("Failed to add to cart");
      setItemCount((c) => c + 1);
      setIsDropping(true);
      setTimeout(() => setIsDropping(false), 500);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to add to cart");
    }
  };

  return (
    <button
      onClick={() => router.push("/cart")}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      style={{
        backgroundColor: isDragOver ? "var(--color-font)" : "var(--color-font)",
      }}
      className={`fixed right-6 md:right-10 top-1/2 -translate-y-1/2 z-50 flex items-center gap-3 rounded-full px-5 md:px-6 py-3 text-base font-semibold text-bg shadow-xl transition hover:opacity-90
        ${isDragOver ? "scale-105 ring-4 ring-font/90" : ""}
        ${isDropping ? "animate-[pulse_0.5s_ease-out]" : ""}`}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
        <ShoppingCart className="h-6 w-6" />
      </div>
      {/* <span className="hidden sm:inline">Cart</span> */}
      {itemCount > 0 && (
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-xs font-bold">
          {itemCount}
        </span>
      )}
    </button>
  );
}
