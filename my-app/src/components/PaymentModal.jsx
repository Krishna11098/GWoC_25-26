// /components/PaymentModal.jsx
"use client";

import { useState, useEffect } from "react";
import { loadRazorpayScript, formatCurrency } from "@/utils/razorpayUtils";

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

  useEffect(() => {
    if (isOpen) {
      // Reset states when modal opens
      setLoading(false);
      setProcessingFree(false);
    }
  }, [isOpen]);

  const processFreeBooking = async () => {
    try {
      setProcessingFree(true);

      const response = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          seatIds,
          userId,
          amount: 0,
          paymentMethod: "free",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process booking");
      }

      if (data.success) {
        // Award coins for free booking
        await awardCoins(eventId, seatIds.length, userId, 0);

        onBookingComplete(data.bookingId, seatIds);
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

  const processRazorpayPayment = async () => {
    try {
      setLoading(true);

      // Get user details from auth
      const userDetails = {
        name: userName || "Customer",
        email: userEmail || "customer@example.com",
        contact: "9999999999", // Ideally get from user profile
      };

      // Load Razorpay script
      await loadRazorpayScript();

      // Create REAL Razorpay order
      const orderResponse = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalAmount * 100, // Convert to paise
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
        description: `Booking ${seatIds.length} seat${
          seatIds.length !== 1 ? "s" : ""
        } for event`,
        order_id: orderData.id, // REAL Razorpay order ID
        prefill: userDetails,
        handler: async function (response) {
          try {
            // Verify payment with signature
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
                amount: totalAmount,
                seatsCount: seatIds.length,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok || !verifyData.success) {
              throw new Error(
                verifyData.error || "Payment verification failed"
              );
            }

            // Award coins
            await awardCoins(eventId, seatIds.length, userId, totalAmount);

            onBookingComplete(verifyData.bookingId, seatIds);
            onClose();
          } catch (error) {
            console.error("Payment verification error:", error);
            alert(`Payment verification failed: ${error.message}`);
          }
        },
        prefill: userDetails,
        notes: {
          eventId,
          seats: seatIds.join(", "),
          userId,
        },
        theme: {
          color: "#3B82F6",
        },
        // Add callback URLs
        callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/verify`,
        redirect: true,
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

  // In your PaymentModal.jsx, update the awardCoins function:

  const awardCoins = async (eventId, seatsCount, userId, amountPaid = 0) => {
    try {
      const baseCoins = seatsCount * 100;
      const bonusCoins = amountPaid > 0 ? Math.floor(amountPaid / 10) : 0;
      const totalCoins = baseCoins + bonusCoins;

      console.log(
        `🪙 Attempting to award ${totalCoins} coins to user ${userId}`
      );

      const response = await fetch("/api/user/wallet/award-coins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          eventId,
          seatsCount,
          amountPaid,
          action: "event_booking",
        }),
      });

      // Check if API endpoint exists
      if (response.status === 404) {
        console.warn("⚠️ Coin award API not found, skipping coin award");
        return { success: false, error: "API not found" };
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Coin award API error:", response.status, errorText);
        return { success: false, error: `HTTP ${response.status}` };
      }

      const data = await response.json();
      console.log("✅ Coin award response:", data);

      return data;
    } catch (error) {
      console.error("Coin award network error:", error);
      // Don't throw, just log and continue
      return { success: false, error: error.message };
    }
  };

  const handlePayment = () => {
    if (totalAmount === 0) {
      processFreeBooking();
    } else {
      processRazorpayPayment();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Complete Booking</h2>
              <p className="text-blue-100 mt-1">
                {seatIds.length} seat{seatIds.length !== 1 ? "s" : ""} •{" "}
                {formatCurrency(totalAmount)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-blue-800 text-white"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Price Summary */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">
                  Seat{seatIds.length !== 1 ? "s" : ""}
                </span>
                <span className="font-medium">
                  {seatIds.length} ×{" "}
                  {formatCurrency(totalAmount / seatIds.length || 0)}
                </span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">
                    Total Amount
                  </span>
                  <span
                    className={`text-2xl font-bold ${
                      totalAmount === 0 ? "text-green-600" : "text-gray-900"
                    }`}
                  >
                    {totalAmount === 0 ? "Free" : formatCurrency(totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Coin Reward Info */}
          <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-2xl">🪙</span>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900">Earn Reward Coins</h4>
                <p className="text-sm text-gray-700 mt-1">
                  Get{" "}
                  <span className="font-bold text-amber-700">
                    {seatIds.length * 100} coins
                  </span>{" "}
                  for attending this event
                  {totalAmount > 0 && ` + bonus coins for payment`}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                {totalAmount === 0 ? (
                  <span className="text-green-600 text-xl">✓</span>
                ) : (
                  <span className="text-blue-600 text-xl">₹</span>
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">
                  {totalAmount === 0 ? "Free Booking" : "Secure Payment"}
                </p>
                <p className="text-sm text-gray-600">
                  {totalAmount === 0
                    ? "No payment required. Book instantly!"
                    : "Secured by Razorpay • Cards, UPI, NetBanking"}
                </p>
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="text-xs text-gray-500 space-y-2 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>Seats are locked for 10 minutes during booking</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-500">•</span>
              <span>Free cancellation up to 24 hours before event</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-amber-500">•</span>
              <span>Coins are credited after event completion</span>
            </div>
          </div>
        </div>

        {/* Footer */}
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
              disabled={loading || processingFree}
              className={`flex-1 px-6 py-3 rounded-lg font-bold text-white shadow-lg transition-all duration-200 ${
                totalAmount === 0
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
              ) : totalAmount === 0 ? (
                "Book Free Seats"
              ) : (
                `Pay ${formatCurrency(totalAmount)}`
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
