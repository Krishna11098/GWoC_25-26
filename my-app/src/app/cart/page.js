"use client";

import { useEffect, useMemo, useState } from "react";
import { auth, db } from "@/lib/firebaseClient";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Trash2 } from "lucide-react";
import gsap from "gsap";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";

// Load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CartPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userCoins, setUserCoins] = useState(0);
  const [coinsToUse, setCoinsToUse] = useState(0);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const el = document.querySelector("#order-summary");
    if (el) {
      gsap.fromTo(el, { x: 80, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: "power3.out" });
    }
  }, []);

  async function fetchCart(user, { showLoading = true } = {}) {
    try {
      if (showLoading) setLoading(true);
      if (!user) {
        setItems([]);
        setUserCoins(0);
        if (showLoading) setLoading(false);
        return;
      }

      // Fetch cart
      const token = await user.getIdToken();
      const res = await fetch("/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setItems(data.items || []);

      // Fetch user coins
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserCoins(userData.wallet?.coins || 0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      if (showLoading) setLoading(false);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      fetchCart(user, { showLoading: true });
    });
    return () => unsubscribe();
  }, []);

  const subtotal = useMemo(() => {
    return items.reduce((sum, it) => sum + (it.price || 0) * (it.quantity || 0), 0);
  }, [items]);

  const shipping = useMemo(() => (subtotal > 500 ? 0 : 50), [subtotal]);
  const tax = useMemo(() => subtotal * 0.18, [subtotal]); // 18% GST
  const discount = useMemo(() => coinsToUse, [coinsToUse]); // 1 coin = 1 Rs
  const total = useMemo(() => {
    const beforeDiscount = subtotal + shipping + tax;
    return Math.max(0, beforeDiscount - discount);
  }, [subtotal, shipping, tax, discount]);

  const maxCoinsUsable = useMemo(() => {
    const beforeDiscount = subtotal + shipping + tax;
    return Math.min(userCoins, beforeDiscount);
  }, [userCoins, subtotal, shipping, tax]);

  async function updateQuantity(gameId, quantity) {
    try {
      const user = auth.currentUser;
      if (!user) return alert("Please login");
      if (quantity <= 0) {
        // If quantity drops below 1, remove the item
        await removeItem(gameId);
        return;
      }
      const token = await user.getIdToken();
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action: "update", gameId, quantity }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update");
      }
      
      // Optimistic: update local state immediately
      setItems((prev) =>
        prev.map((item) => (item.id === gameId ? { ...item, quantity } : item)).filter((item) => item.quantity > 0)
      );
      // Refresh silently (no loading flicker)
      fetchCart(user, { showLoading: false });
    } catch (e) {
      console.error(e);
      alert(e.message);
      // Refresh cart to show correct quantities
      fetchCart(user, { showLoading: false });
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
      // Optimistic remove
      setItems((prev) => prev.filter((item) => item.id !== gameId));
      // Refresh silently
      fetchCart(user, { showLoading: false });
    } catch (e) {
      console.error(e);
      alert(e.message);
    }
  }

  async function handleCheckout() {
    if (!currentUser) {
      alert("Please login to place order");
      return;
    }

    if (items.length === 0) {
      alert("Your cart is empty");
      return;
    }

    setProcessingPayment(true);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert("Failed to load payment gateway. Please try again.");
        setProcessingPayment(false);
        return;
      }

      // Create Razorpay order
      const orderRes = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total }),
      });

      if (!orderRes.ok) throw new Error("Failed to create order");

      const orderData = await orderRes.json();

      // Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_RxunWa1YW8gqZw",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Joy Juncture",
        description: "Order Payment",
        order_id: orderData.orderId,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId: currentUser.uid,
                orderData: {
                  items,
                  subtotal,
                  shipping,
                  tax,
                  coinsUsed: coinsToUse,
                  finalAmount: total,
                },
              }),
            });

            if (!verifyRes.ok) throw new Error("Payment verification failed");

            const result = await verifyRes.json();
            
            alert(
              `Order placed successfully! 🎉\n` +
              `Coins used: ${coinsToUse}\n` +
              `Coins earned: ${result.coinsEarned}\n` +
              `New coin balance: ${result.newCoins}`
            );

            // Refresh cart and user coins
            fetchCart(currentUser, { showLoading: true });
            setCoinsToUse(0);
          } catch (error) {
            console.error("Payment verification error:", error);
            alert("Payment verification failed. Please contact support.");
          } finally {
            setProcessingPayment(false);
          }
        },
        prefill: {
          email: currentUser.email,
        },
        theme: {
          color: "#000000",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", function (response) {
        alert("Payment failed. Please try again.");
        setProcessingPayment(false);
      });
      razorpay.open();
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to process checkout. Please try again.");
      setProcessingPayment(false);
    }
  }

  return (
    <>
      <Navbar />
      <div className="px-5 md:px-12 pt-24 md:pt-32 pb-12">
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
                  "dreamers-fair": "/gallery/marketplace/Dreamer’s Fair.WEBP",
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
                        onClick={() => {
                          const nextQty = (it.quantity || 1) - 1;
                          updateQuantity(it.id, nextQty);
                        }}
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
            
            {/* Coins Section */}
            {currentUser && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-yellow-900">
                    💰 Available Coins
                  </span>
                  <span className="text-sm font-bold text-yellow-700">
                    {userCoins}
                  </span>
                </div>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    min="0"
                    max={maxCoinsUsable}
                    value={coinsToUse}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      setCoinsToUse(Math.min(value, maxCoinsUsable));
                    }}
                    className="flex-1 px-3 py-2 border border-yellow-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 outline-none"
                    placeholder="Use coins"
                  />
                  <button
                    onClick={() => setCoinsToUse(maxCoinsUsable)}
                    className="px-3 py-2 bg-yellow-600 text-white text-xs rounded-lg hover:bg-yellow-700 font-medium"
                  >
                    Use Max
                  </button>
                </div>
                <p className="text-xs text-yellow-700 mt-1">
                  1 coin = ₹1 off (Max: {maxCoinsUsable} coins)
                </p>
              </div>
            )}

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-gray-900">
                  {shipping === 0 ? "FREE" : `₹${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (GST 18%)</span>
                <span className="font-medium text-gray-900">₹{tax.toFixed(2)}</span>
              </div>
              {coinsToUse > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Coins Discount</span>
                  <span className="font-medium">-₹{discount.toFixed(2)}</span>
                </div>
              )}
            </div>
            <div className="mt-4 h-px bg-gray-200" />
            <div className="mt-4 flex justify-between text-base">
              <span className="text-gray-900 font-semibold">Total</span>
              <span className="font-bold text-gray-900">₹{total.toFixed(2)}</span>
            </div>
            
            {/* Cashback Info */}
            {total > 0 && (
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-700">
                🎁 Earn {Math.floor(total * 0.1)} coins (10% cashback) on this order!
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={processingPayment || items.length === 0}
              className="mt-6 w-full rounded-full bg-gray-900 px-4 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {processingPayment
                ? "Processing..."
                : items.length === 0
                ? "Cart is Empty"
                : `Checkout - ₹${total.toFixed(2)}`}
            </button>
          </div>
        </aside>
        </div>
      </div>
      <Footer />
    </>
  );
}

