// Example: How to integrate the wallet and payment system into your profile page

"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import WalletCard from "@/components/WalletCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ProfilePage() {
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [userEvents, setUserEvents] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        setUserEmail(user.email || "");
        setUserName(user.displayName || user.email?.split("@")[0] || "User");
        loadUserEvents(user.uid);
      } else {
        setUserId(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loadUserEvents = async (uid) => {
    try {
      const response = await fetch(`/api/user/events?userId=${uid}`);
      if (response.ok) {
        const data = await response.json();
        setUserEvents(data.events || []);
      }
    } catch (error) {
      console.error("Error loading events:", error);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!userId) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Please Login</h2>
            <a href="/login" className="text-blue-600 hover:underline">
              Go to Login
            </a>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 mt-20">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">Account Information</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600">Name</label>
                  <p className="font-medium">{userName}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Email</label>
                  <p className="font-medium">{userEmail}</p>
                </div>
              </div>
            </div>

            {/* User Events */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">My Bookings</h2>
              {userEvents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-4xl mb-2">📅</p>
                  <p>No bookings yet</p>
                  <a
                    href="/events"
                    className="text-blue-600 hover:underline mt-2 inline-block"
                  >
                    Browse Events
                  </a>
                </div>
              ) : (
                <div className="space-y-3">
                  {userEvents.map((event, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{event.eventId}</h3>
                          <p className="text-sm text-gray-600">
                            {event.seatsBooked} seat(s) • ₹{event.amountPaid}
                          </p>
                          {event.coinsUsed > 0 && (
                            <p className="text-sm text-amber-600">
                              🪙 Used {event.coinsUsed} coins
                            </p>
                          )}
                          {event.coinsEarned > 0 && (
                            <p className="text-sm text-green-600">
                              🎁 Earned {event.coinsEarned} coins
                            </p>
                          )}
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            event.attended
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {event.attended ? "Attended" : "Upcoming"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Wallet Sidebar */}
          <div>
            <WalletCard userId={userId} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
