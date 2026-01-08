"use client";

import { useState } from "react";
import { userFetch } from "@/lib/userFetch";

export default function EventBookingModal({ event, onClose, onSuccess }) {
  const [numberOfSeats, setNumberOfSeats] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const maxSeatsPerUser = event.maxSeatsPerUser || 4;
  const availableSeats = event.totalSeats - event.bookedSeats;
  const isFreeEvent = event.price === 0;
  const coinsPerSeat = event.coinsPerSeat || event.coinsReward || 0;

  const calculateTotal = () => {
    return numberOfSeats * event.price;
  };

  const handleSeatChange = (value) => {
    const maxAllowed = Math.min(availableSeats, maxSeatsPerUser);
    if (value > maxAllowed) {
      setNumberOfSeats(maxAllowed);
      alert(`You can only book up to ${maxAllowed} seats`);
    } else if (value < 1) {
      setNumberOfSeats(1);
    } else {
      setNumberOfSeats(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const bookingData = {
        eventId: event.id,
        seats: numberOfSeats,
        totalAmount: calculateTotal(),
        coinsToEarn: coinsPerSeat * numberOfSeats,
      };

      const response = await userFetch("/api/events/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (response.ok) {
        alert(
          `✅ Booking Successful!\nSeats: ${numberOfSeats}\nCoins Earned: ${
            coinsPerSeat * numberOfSeats
          }`
        );
        onSuccess();
      } else {
        throw new Error(data.error || "Booking failed");
      }
    } catch (err) {
      setError(err.message);
      console.error("Booking error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="border-b p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Book Your Seats
              </h2>
              <p className="text-gray-600 mt-1">{event.name}</p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 hover:bg-gray-100"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {/* Event Info */}
            <div className="mb-6 space-y-3 rounded-lg bg-gray-50 p-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Price per seat:</span>
                <span className="font-bold">
                  {isFreeEvent ? "Free" : `$${event.price}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Coins per seat:</span>
                <span className="font-bold text-yellow-600">
                  +{coinsPerSeat}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Available seats:</span>
                <span className="font-bold">{availableSeats}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Max per user:</span>
                <span className="font-bold">{maxSeatsPerUser} seats</span>
              </div>
            </div>

            {/* Seat Selection */}
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-700 mb-4">
                How many seats would you like?
              </label>

              <div className="flex items-center justify-center space-x-6 mb-4">
                <button
                  type="button"
                  onClick={() => handleSeatChange(numberOfSeats - 1)}
                  disabled={numberOfSeats <= 1}
                  className="w-12 h-12 rounded-full bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-xl hover:bg-gray-200"
                >
                  -
                </button>

                <div className="text-center">
                  <div className="text-5xl font-bold text-gray-900">
                    {numberOfSeats}
                  </div>
                  <div className="text-sm text-gray-500">
                    seat{numberOfSeats !== 1 ? "s" : ""}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSeatChange(numberOfSeats + 1)}
                  disabled={
                    numberOfSeats >= Math.min(availableSeats, maxSeatsPerUser)
                  }
                  className="w-12 h-12 rounded-full bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-xl hover:bg-gray-200"
                >
                  +
                </button>
              </div>

              {/* Quick Selection */}
              <div className="flex flex-wrap gap-2 justify-center">
                {[1, 2, 4, 6].map((num) => {
                  const maxAllowed = Math.min(availableSeats, maxSeatsPerUser);
                  const isDisabled = num > maxAllowed;
                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => !isDisabled && handleSeatChange(num)}
                      disabled={isDisabled}
                      className={`px-4 py-2 rounded-lg ${
                        isDisabled
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : numberOfSeats === num
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {num} seat{num !== 1 ? "s" : ""}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Summary */}
            <div className="mb-6 rounded-lg border bg-gray-50 p-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>
                    Seats × {event.price === 0 ? "Free" : `$${event.price}`}
                  </span>
                  <span>
                    {event.price === 0 ? "Free" : `$${calculateTotal()}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Coins to earn</span>
                  <span className="text-yellow-600 font-bold">
                    +{coinsPerSeat * numberOfSeats}
                  </span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>
                      {event.price === 0 ? "Free" : `$${calculateTotal()}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 rounded-lg bg-red-50 p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  loading || numberOfSeats === 0 || availableSeats === 0
                }
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-bold"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Processing...
                  </span>
                ) : isFreeEvent ? (
                  `Book ${numberOfSeats} Seat${
                    numberOfSeats !== 1 ? "s" : ""
                  } (Free)`
                ) : (
                  `Pay $${calculateTotal()} & Book`
                )}
              </button>
            </div>

            {/* Terms */}
            <p className="mt-4 text-center text-xs text-gray-500">
              By booking, you agree to our terms and conditions. Cancellation
              policy applies.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
