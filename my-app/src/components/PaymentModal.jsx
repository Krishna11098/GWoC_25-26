// /components/PaymentModal.jsx
"use client";

import { useState, useEffect } from "react";
import { loadRazorpayScript, formatCurrency } from "@/utils/razorpayUtils";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function PaymentModal({
  isOpen,
  onClose,
  eventId,
  seatIds,
  userId,
  userEmail,
  userName,
  totalAmount,
  seatsCount,
  onBookingComplete,
}) {
  const [loading, setLoading] = useState(false);
  const [processingFree, setProcessingFree] = useState(false);
  const [userCoins, setUserCoins] = useState(0);
  const [coinsToUse, setCoinsToUse] = useState(0);
  const [loadingCoins, setLoadingCoins] = useState(true);

  useEffect(() => {
    if (isOpen && userId && userId !== "guest") {
      // Reset states when modal opens
      setLoading(false);
      setProcessingFree(false);
      setCoinsToUse(0);
      loadUserCoins();
    } else if (isOpen && (!userId || userId === "guest")) {
      console.warn("Cannot load coins - user is guest or userId is invalid:", userId);
      setUserCoins(0);
      setLoadingCoins(false);
    }
  }, [isOpen, userId]);

  const loadUserCoins = async () => {
    try {
      setLoadingCoins(true);
      
      if (!userId || userId === "guest") {
        console.warn("❌ Skipping coins load - invalid userId:", userId);
        setUserCoins(0);
        setLoadingCoins(false);
        return;
      }
      
      console.log("🔍 Loading coins for userId:", userId);
      console.log("🔍 Using Firestore path: users/" + userId);
      
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      
      console.log("📄 Document exists:", userDoc.exists());
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log("📦 Full user data:", userData);
        // Coins can be in wallet.coins OR coins field (check both)
        const coins = userData.wallet?.coins || userData.coins || 0;
        console.log("✅ User coins loaded:", coins, "from document ID:", userDoc.id);
        setUserCoins(coins);
      } else {
        console.error("❌ User document NOT FOUND in Firestore!");
        console.error("❌ Tried document ID:", userId);
        console.error("❌ Collection: users");
        console.error("💡 Make sure the user document exists in Firestore with ID:", userId);
        
        // Try to fetch wallet directly via API as fallback
        console.log("🔄 Trying API fallback...");
        try {
          const response = await fetch(`/api/user/wallet?userId=${userId}`);
          const data = await response.json();
          console.log("📡 API response:", data);
          
          if (data.success && data.wallet) {
            console.log("✅ Got coins from API:", data.wallet.coins);
            setUserCoins(data.wallet.coins || 0);
          } else {
            setUserCoins(0);
          }
        } catch (apiError) {
          console.error("❌ API fallback also failed:", apiError);
          setUserCoins(0);
        }
      }
    } catch (error) {
      console.error("❌ Error loading user coins:", error);
      console.error("Error details:", error.message);
      setUserCoins(0);
    } finally {
      setLoadingCoins(false);
    }
  };

  const maxCoinsUsable = Math.min(userCoins, totalAmount);
  const finalAmount = totalAmount - coinsToUse;

  const handleCoinsChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    if (value < 0) {
      setCoinsToUse(0);
    } else if (value > maxCoinsUsable) {
      setCoinsToUse(maxCoinsUsable);
    } else {
      setCoinsToUse(value);
    }
  };

  const syncToGoogleCalendar = async (bookingId, eventData) => {
    try {
      console.log("📅 Attempting to sync booking to Google Calendar...");
      
      const syncResponse = await fetch("/api/calendar/sync-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          eventId,
          bookingId,
          eventData: {
            title: eventData.title || "Event Booking",
            description: eventData.description || "",
            location: eventData.location || "Online",
            startTime: eventData.startTime || eventData.dateTime,
            endTime: eventData.endTime || new Date(new Date(eventData.dateTime).getTime() + 60 * 60 * 1000),
            organizerEmail: eventData.organizerEmail,
          },
        }),
      });

      const syncData = await syncResponse.json();
      
      if (syncData.synced) {
        console.log("✅ Event synced to Google Calendar:", syncData.meetLink);
      } else {
        console.log("ℹ️ Calendar sync skipped:", syncData.message);
      }
    } catch (error) {
      console.error("⚠️ Calendar sync failed (non-blocking):", error);
    }
  };

  const processFreeBooking = async () => {
    try {
      setProcessingFree(true);

      const response = await fetch("/api/events/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          seatIds,
          userId,
          seatsCount: seatIds.length,
          amount: 0,
          coinsUsed: 0,
          userEmail,
          userName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process booking");
      }

      if (data.success) {
        // Sync to Google Calendar (non-blocking)
        if (data.eventData) {
          syncToGoogleCalendar(data.bookingId, data.eventData);
        }
        
        onBookingComplete(data.bookingId, seatsCount);
        onClose();
      } else {
        throw new Error(data.error || "Booking failed");
      }
    } catch (error) {
      console.error("Free booking error:", error);
      alert(`Booking failed: ${error.message}`);
    } finally {
      setProcessingFree(false);
    }
  };

  const processFullCoinsPayment = async () => {
    try {
      setProcessingFree(true);

      const response = await fetch("/api/events/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          seatIds,
          userId,
          seatsCount: seatIds.length,
          amount: totalAmount,
          coinsUsed: coinsToUse,
          userEmail,
          userName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process booking");
      }

      if (data.success) {
        onBookingComplete(data.bookingId, seatsCount);
        onClose();
      } else {
        throw new Error(data.error || "Booking failed");
      }
    } catch (error) {
      console.error("Coins booking error:", error);
      alert(`Booking failed: ${error.message}`);
    } finally {
      setProcessingFree(false);
    }
  };

  const processRazorpayPayment = async () => {
    try {
      setLoading(true);

      const userDetails = {
        name: userName || "Customer",
        email: userEmail || "customer@example.com",
        contact: "9999999999",
      };

      await loadRazorpayScript();

      const orderResponse = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalAmount * 100,
          currency: "INR",
          eventId,
          seatIds,
          userId,
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderData.error || "Failed to create order");
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Event Booking System",
        description: `Booking ${seatIds.length} seat${seatIds.length !== 1 ? "s" : ""} for event`,
        order_id: orderData.id,
        prefill: userDetails,
        handler: async function (response) {
          try {
            const verifyResponse = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                eventId,
                seatIds,
                userId,
                amount: finalAmount * 100,
                seatsCount: seatIds.length,
                coinsUsed: coinsToUse,
                userEmail,
                userName,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok || !verifyData.success) {
              throw new Error(verifyData.error || "Payment verification failed");
            }

            // Sync to Google Calendar (non-blocking)
            if (verifyData.eventData) {
              syncToGoogleCalendar(verifyData.bookingId, verifyData.eventData);
            }

            onBookingComplete(verifyData.bookingId, seatsCount);
            onClose();
          } catch (error) {
            console.error("Payment verification error:", error);
            alert(`Payment verification failed: ${error.message}`);
          }
        },
        notes: {
          eventId,
          seats: seatIds.join(", "),
          userId,
          coinsUsed: coinsToUse,
        },
        theme: {
          color: "#3B82F6",
        },
        modal: {
          ondismiss: function () {
            console.log("Payment modal dismissed");
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);
        alert(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });

      razorpay.open();
    } catch (error) {
      console.error("Payment processing error:", error);
      alert(`Payment failed: ${error.message}`);
      setLoading(false);
    }
  };

  const handlePayment = () => {
    if (totalAmount === 0) {
      processFreeBooking();
    } else if (finalAmount === 0) {
      processFullCoinsPayment();
    } else {
      processRazorpayPayment();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 scale-100">
        <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Complete Booking</h2>
              <p className="text-blue-100 mt-1">
                {seatIds.length} seat{seatIds.length !== 1 ? "s" : ""} • {formatCurrency(totalAmount)}
              </p>
            </div>
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-blue-800 text-white">
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {totalAmount > 0 && (
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🪙</span>
                  <div>
                    <h4 className="font-bold text-gray-900">Your Coins</h4>
                    <p className="text-sm text-gray-600">
                      {loadingCoins ? "Loading..." : `${userCoins} available`}
                    </p>
                  </div>
                </div>
              </div>
              
              {userCoins > 0 && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Use coins (1 coin = ₹1)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={coinsToUse}
                      onChange={handleCoinsChange}
                      min="0"
                      max={maxCoinsUsable}
                      className="flex-1 px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="0"
                    />
                    <button
                      onClick={() => setCoinsToUse(maxCoinsUsable)}
                      className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 font-medium"
                    >
                      Use Max
                    </button>
                  </div>
                  <p className="text-xs text-gray-600">Max usable: {maxCoinsUsable} coins</p>
                </div>
              )}
            </div>
          )}

          <div className="bg-gray-50 rounded-xl p-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Seat{seatIds.length !== 1 ? "s" : ""}</span>
                <span className="font-medium">
                  {seatIds.length} × {formatCurrency(totalAmount / seatIds.length || 0)}
                </span>
              </div>
              
              {coinsToUse > 0 && (
                <>
                  <div className="flex justify-between items-center text-amber-600">
                    <span className="flex items-center gap-1">
                      <span>🪙</span> Coins Used
                    </span>
                    <span className="font-medium">- ₹{coinsToUse}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-200"></div>
                </>
              )}
              
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Amount to Pay</span>
                  <span className={`text-2xl font-bold ${finalAmount === 0 ? "text-green-600" : "text-gray-900"}`}>
                    {finalAmount === 0 ? "Free" : formatCurrency(finalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Removed automatic 10% coins - using fixed event coins instead */}

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                {finalAmount === 0 ? (
                  <span className="text-green-600 text-xl">✓</span>
                ) : (
                  <span className="text-blue-600 text-xl">₹</span>
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">
                  {finalAmount === 0 ? (coinsToUse > 0 ? "Paid with Coins" : "Free Booking") : "Secure Payment"}
                </p>
                <p className="text-sm text-gray-600">
                  {finalAmount === 0
                    ? coinsToUse > 0 ? "Full payment completed with your coins" : "No payment required. Book instantly!"
                    : "Secured by Razorpay • Cards, UPI, NetBanking"}
                </p>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-500 space-y-2 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>Wallet history will be updated after booking</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500">•</span>
              <span>Earn event coins after successful booking</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-amber-500">•</span>
              <span>Coins are credited immediately after payment</span>
            </div>
          </div>
        </div>

        <div className="p-6 border-t bg-gray-50">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading || processingFree}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              disabled={loading || processingFree || loadingCoins}
              className={`flex-1 px-6 py-3 rounded-lg font-bold text-white shadow-lg transition-all duration-200 ${
                finalAmount === 0
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </span>
              ) : processingFree ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Booking...
                </span>
              ) : finalAmount === 0 ? (
                coinsToUse > 0 ? "Confirm Booking" : "Book Free Seats"
              ) : (
                `Pay ${formatCurrency(finalAmount)}`
              )}
            </button>
          </div>
          <p className="text-center text-xs text-gray-500 mt-4">
            Your payment is secured with 256-bit SSL encryption
          </p>
        </div>
      </div>
    </div>
  );
}
