"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebaseClient";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FloatingCartButton() {
  const [itemCount, setItemCount] = useState(0);
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
          const total = (data.items || []).reduce((sum, it) => sum + (it.quantity || 0), 0);
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

  return (
    <button
      onClick={() => router.push("/cart")}
      className="fixed bottom-8 right-8 z-50 flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-base font-semibold text-white shadow-lg hover:bg-emerald-500 transition"
    >
      <ShoppingCart className="h-6 w-6" />
      {itemCount > 0 && (
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold">
          {itemCount}
        </span>
      )}
      Cart
    </button>
  );
}
