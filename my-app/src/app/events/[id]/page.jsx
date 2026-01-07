"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase"; // Update with your correct firebase path
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PaymentModal from "@/components/PaymentModal";
import EventService from "@/app/lib/eventService";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [selectedSeatsCount, setSelectedSeatsCount] = useState(1);
  const [showPayment, setShowPayment] = useState(false);
  const [userBookings, setUserBookings] = useState([]);
  const [availableSeats, setAvailableSeats] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [authLoading, setAuthLoading] = useState(true);

  // Check authentication status - FIXED
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("🔐 Auth state changed:", user);

      if (user) {
        // User is signed in
        setUserId(user.uid);
        setUserEmail(user.email || "");
        setUserName(user.displayName || user.email?.split("@")[0] || "User");

        // Also store in localStorage for backup
        localStorage.setItem(
          "user",
          JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
          })
        );
      } else {
        // User is signed out
        setUserId("guest");
        setUserEmail("");
        setUserName("");

        // Check if user data exists in localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            if (userData.uid && userData.uid !== "guest") {
              console.log(
                "Found user in localStorage, redirecting to refresh auth"
              );
              // Force a page reload to trigger auth
              window.location.reload();
              return;
            }
          } catch (e) {
            console.error("Error parsing stored user:", e);
          }
        }
      }

      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Load event data
  useEffect(() => {
    if (params.id) {
      loadEvent();
    }
  }, [params.id]);

  // Load user bookings and update available seats
  useEffect(() => {
    if (event?.id && userId && userId !== "guest") {
      loadUserBookings();
    }
    if (event) {
      calculateAvailableSeats();
    }
  }, [event, userId]);

  // Update total amount when seats count changes
  useEffect(() => {
    if (event) {
      const pricePerSeat = event.price || event.pricePerSeat || 0;
      setTotalAmount(selectedSeatsCount * pricePerSeat);
    }
  }, [selectedSeatsCount, event]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      setError("");
      console.log("📥 Loading event:", params.id);

      const eventData = await EventService.getEventById(params.id);
      console.log("✅ Event loaded:", eventData);

      if (!eventData) {
        throw new Error("Event not found");
      }

      // Check if event is active
      if (eventData.active === false) {
        throw new Error("This event is no longer available");
      }

      setEvent(eventData);
    } catch (error) {
      console.error("❌ Failed to load event:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadUserBookings = async () => {
    try {
      // Check if user is authenticated
      if (!userId || userId === "guest") {
        setUserBookings([]);
        return;
      }
      const response = await fetch(
        `/api/bookings?eventId=${params.id}&userId=${userId}`
      );
      if (response.status === 404) {
        console.warn("⚠️ Bookings API not found, showing empty bookings");
        setUserBookings([]);
        return;
      }
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.bookings) {
          setUserBookings(data.bookings);
        }
      }
    } catch (error) {
      console.error("Error loading user bookings:", error);
    }
  };

  const calculateAvailableSeats = () => {
    if (!event) return;

    const totalSeats = event.totalSeats || 50;
    const bookedSeats = event.bookedSeats || 0;
    const available = Math.max(0, totalSeats - bookedSeats);
    setAvailableSeats(available);

    // Adjust selected seats if exceeds available
    if (selectedSeatsCount > available) {
      setSelectedSeatsCount(Math.max(1, available));
    }

    // Also adjust if exceeds max per user
    const maxPerUser = event.maxSeatsPerUser || 4;
    if (selectedSeatsCount > maxPerUser) {
      setSelectedSeatsCount(maxPerUser);
    }
  };

  const handleSeatCountChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    const maxPerUser = event?.maxSeatsPerUser || 4;
    const maxAvailable = Math.min(availableSeats, maxPerUser);

    if (value < 1) {
      setSelectedSeatsCount(1);
    } else if (value > maxAvailable) {
      setSelectedSeatsCount(maxAvailable);
    } else {
      setSelectedSeatsCount(value);
    }
  };

  const incrementSeats = () => {
    const maxPerUser = event?.maxSeatsPerUser || 4;
    const maxAvailable = Math.min(availableSeats, maxPerUser);

    if (selectedSeatsCount < maxAvailable) {
      setSelectedSeatsCount((prev) => prev + 1);
    }
  };

  const decrementSeats = () => {
    if (selectedSeatsCount > 1) {
      setSelectedSeatsCount((prev) => prev - 1);
    }
  };

  const handleBookingComplete = async (bookingId, seatsCount) => {
    console.log(`✅ Booking confirmed! ID: ${bookingId}, Seats: ${seatsCount}`);
    console.log(`📊 Event data:`, event);
    console.log(`🪙 coinsPerSeat:`, event?.coinsPerSeat, event?.coinsReward);
    
    setShowPayment(false);

    // Calculate coins earned using the actual coinsPerSeat value
    // Ensure both values are numbers
    const coinsPerSeat = Number(event?.coinsPerSeat || event?.coinsReward || 0);
    const seatsCountNum = Number(seatsCount) || selectedSeatsCount || 1;
    const coinsEarned = coinsPerSeat * seatsCountNum;

    console.log(`💰 Coins calculation: ${coinsPerSeat} * ${seatsCountNum} = ${coinsEarned}`);

    // Show success message
    const message =
      totalAmount === 0
        ? `✅ Free Booking Successful!\nBooking ID: ${bookingId}\nSeats: ${seatsCountNum}\nCoins earned: ${coinsEarned}`
        : `✅ Payment Successful!\nBooking ID: ${bookingId}\nSeats: ${seatsCountNum}\nAmount: ₹${totalAmount}\nCoins earned: ${coinsEarned}`;

    alert(message);

    // Reload event to update seat count
    loadEvent();
    loadUserBookings();

    // Redirect to profile after 2 seconds
    setTimeout(() => {
      router.push("/profile");
    }, 2000);
  };

  // FIXED: Proper login check
  const requireLogin = () => {
    console.log("🔍 Checking login status:", {
      userId,
      authLoading,
      userEmail,
      isGuest: userId === "guest",
    });

    if (authLoading) {
      alert("Please wait while we check your login status...");
      return false;
    }

    if (userId === "guest" || !userId) {
      if (confirm("You need to login to book seats. Go to login page?")) {
        router.push("/login");
      }
      return false;
    }

    return true;
  };

  const handleBookNow = () => {
    console.log("🎫 Book now clicked, user status:", {
      userId,
      userEmail,
      userName,
      isAuthenticated: userId !== "guest",
      authLoading,
    });
    
    console.log("🔍 Will pass to PaymentModal:", {
      userId: userId,
      userEmail: userEmail,
      userName: userName,
    });

    // Check authentication
    if (!requireLogin()) {
      console.log("❌ User not authenticated, stopping booking");
      return;
    }

    if (availableSeats === 0) {
      alert("Sorry, no seats available!");
      return;
    }

    if (selectedSeatsCount > availableSeats) {
      alert(`Only ${availableSeats} seats available!`);
      return;
    }

    console.log("✅ User authenticated, proceeding to payment");
    setShowPayment(true);
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <>
        <Navbar />
        <div className="max-w-7xl mx-auto p-6 mt-32">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Checking authentication...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="max-w-7xl mx-auto p-6 mt-32">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-64 bg-gray-200 rounded"></div>
                <div className="h-96 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-6">
                <div className="h-48 bg-gray-200 rounded"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !event) {
    return (
      <>
        <Navbar />
        <div className="max-w-7xl mx-auto p-6 mt-32 text-center">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-2xl font-bold mb-2">Event Not Found</h1>
          <p className="text-gray-600 mb-6">
            {error ||
              "The event you're looking for doesn't exist or has been removed."}
          </p>
          <button
            onClick={() => router.push("/events")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Browse Events
          </button>
        </div>
        <Footer />
      </>
    );
  }

  const pricePerSeat = event.price || event.pricePerSeat || 0;
  const maxSeatsPerUser = event.maxSeatsPerUser || 4;

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto p-4 md:p-6 mt-32">
        {/* Debug Info - Show user status */}
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  userId !== "guest" ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <span className="text-sm font-medium">
                {userId !== "guest"
                  ? `Logged in as: ${userName}`
                  : "Not logged in"}
              </span>
            </div>
            {userId !== "guest" && (
              <button
                onClick={() => console.log("User ID:", userId)}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Debug
              </button>
            )}
          </div>
        </div>

        {/* Event Header */}
        <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    event.category === "workshop"
                      ? "bg-blue-100 text-blue-700"
                      : event.category === "seminar"
                      ? "bg-purple-100 text-purple-700"
                      : event.category === "conference"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {event.category || "Event"}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    event.eventType === "online"
                      ? "bg-green-100 text-green-700"
                      : event.eventType === "hybrid"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {event.eventType || "In-Person"}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-700">
                  {pricePerSeat === 0 ? "Free" : `₹${pricePerSeat} per seat`}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                {event.title || event.name || "Untitled Event"}
              </h1>

              <p className="text-gray-600 text-lg mb-6">{event.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 text-xl">📅</span>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Date</div>
                    <div className="font-semibold text-gray-900">
                      {new Date(event.date).toLocaleDateString("en-IN", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 text-xl">⏰</span>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Time</div>
                    <div className="font-semibold text-gray-900">
                      {event.startTime || event.eventStartTime || "TBD"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 text-xl">📍</span>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Venue</div>
                    <div className="font-semibold text-gray-900">
                      {event.venue || event.location || "Venue TBD"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <span className="text-amber-600 text-xl">👥</span>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Host</div>
                    <div className="font-semibold text-gray-900">
                      {event.organizer || event.host || "Event Host"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Event Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Description */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About This Event
              </h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-line mb-6">
                  {event.fullDescription ||
                    event.description ||
                    "No detailed description available."}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="space-y-4">
                    <h3 className="font-bold text-gray-900 text-lg">
                      Event Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">
                          {event.duration || 120} minutes
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Seats:</span>
                        <span className="font-medium">
                          {event.totalSeats || 50}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Max per person:</span>
                        <span className="font-medium">
                          {maxSeatsPerUser} seats
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-bold text-gray-900 text-lg">
                      Contact Info
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">📧</span>
                        <span>{event.contactEmail || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">📞</span>
                        <span>{event.contactPhone || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* User's Previous Bookings */}
            {userBookings.length > 0 && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-purple-600 text-xl">✓</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-purple-900">
                      Your Bookings
                    </h3>
                    <p className="text-purple-700">
                      You have {userBookings.length} booking
                      {userBookings.length !== 1 ? "s" : ""} for this event
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {userBookings.map((booking, index) => (
                    <div
                      key={index}
                      className="bg-white/80 rounded-xl p-4 border border-purple-100"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-gray-900">
                            Booking #{booking.bookingId || booking.id}
                          </div>
                          <div className="text-sm text-gray-600">
                            {booking.seatsCount || 1} seat
                            {booking.seatsCount !== 1 ? "s" : ""} • ₹
                            {booking.amount || 0} •{" "}
                            {new Date(booking.bookedAt).toLocaleDateString()}
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            booking.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : booking.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {booking.status || "confirmed"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Event Stats */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Event Statistics
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-3xl font-bold text-blue-700">
                    {availableSeats}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Available Seats
                  </div>
                </div>

                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-3xl font-bold text-green-700">
                    {event.bookedSeats || 0}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Booked Seats</div>
                </div>

                <div className="text-center p-4 bg-purple-50 rounded-xl">
                  <div className="text-3xl font-bold text-purple-700">
                    {event.totalSeats || 50}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Total Seats</div>
                </div>

                <div className="text-center p-4 bg-amber-50 rounded-xl">
                  <div className="text-3xl font-bold text-amber-700">
                    {maxSeatsPerUser}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Max Per User</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Booking Progress</span>
                  <span>
                    {Math.round(
                      ((event.bookedSeats || 0) / (event.totalSeats || 50)) *
                        100
                    )}
                    %
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        ((event.bookedSeats || 0) / (event.totalSeats || 50)) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Booking Section */}
          <div className="space-y-6">
            {/* Booking Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-100 sticky top-32">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {pricePerSeat === 0 ? "Free" : `₹${pricePerSeat}`}
                </div>
                <div className="text-gray-600">per seat</div>
              </div>

              {/* User Info */}
              {userId !== "guest" && (
                <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-sm">👤</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-green-800">
                        Booking as:
                      </div>
                      <div className="text-sm text-green-700">{userName}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Seat Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Number of Seats
                </label>

                <div className="flex items-center justify-center gap-4 mb-4">
                  <button
                    onClick={decrementSeats}
                    disabled={selectedSeatsCount <= 1}
                    className="w-12 h-12 flex items-center justify-center bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-xl font-bold"
                  >
                    -
                  </button>

                  <div className="flex flex-col items-center">
                    <input
                      type="number"
                      min="1"
                      max={Math.min(availableSeats, maxSeatsPerUser)}
                      value={selectedSeatsCount}
                      onChange={handleSeatCountChange}
                      className="w-20 h-12 text-center text-2xl font-bold border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      Max: {Math.min(availableSeats, maxSeatsPerUser)} seats
                    </div>
                  </div>

                  <button
                    onClick={incrementSeats}
                    disabled={
                      selectedSeatsCount >=
                      Math.min(availableSeats, maxSeatsPerUser)
                    }
                    className="w-12 h-12 flex items-center justify-center bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-xl font-bold"
                  >
                    +
                  </button>
                </div>

                <div className="text-center text-sm text-gray-600">
                  {availableSeats} seats available • Max {maxSeatsPerUser} per
                  person
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>
                    {selectedSeatsCount} seat
                    {selectedSeatsCount !== 1 ? "s" : ""} × ₹{pricePerSeat}
                  </span>
                  <span>₹{selectedSeatsCount * pricePerSeat}</span>
                </div>

                <div className="pt-3 border-t">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount</span>
                    <span
                      className={
                        totalAmount === 0 ? "text-green-600" : "text-gray-900"
                      }
                    >
                      {totalAmount === 0 ? "Free" : `₹${totalAmount}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Coin Reward */}
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-xl text-white">🪙</span>
                  </div>
                  <div>
                    <div className="font-bold text-amber-800">
                      Earn Reward Coins
                    </div>
                    <div className="text-sm text-amber-700">
                      Get {selectedSeatsCount * (event?.coinsPerSeat || event?.coinsReward || 0)} coins for attending
                    </div>
                  </div>
                </div>
              </div>

              {/* Book Button */}
              <button
                onClick={handleBookNow}
                disabled={
                  availableSeats === 0 ||
                  selectedSeatsCount === 0 ||
                  authLoading
                }
                className={`w-full py-4 rounded-xl font-bold text-white text-lg shadow-lg transition-all duration-200 ${
                  availableSeats === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : totalAmount === 0
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                } ${authLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {availableSeats === 0
                  ? "Sold Out"
                  : totalAmount === 0
                  ? `Book ${selectedSeatsCount} Free Seat${
                      selectedSeatsCount !== 1 ? "s" : ""
                    }`
                  : `Book Now - ₹${totalAmount}`}
              </button>

              {/* Login Prompt */}
              {userId === "guest" && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    <button
                      onClick={() => router.push("/login")}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Login
                    </button>{" "}
                    to book seats
                  </p>
                </div>
              )}

              {/* Quick Info */}
              <div className="mt-6 pt-6 border-t text-xs text-gray-500 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Free cancellation 24 hours before</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-500">✓</span>
                  <span>Instant confirmation</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-500">✓</span>
                  <span>Coins credited after event</span>
                </div>
              </div>
            </div>

            {/* Support Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Need Help?
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() =>
                    window.open(
                      `mailto:${event.contactEmail || "support@example.com"}`,
                      "_blank"
                    )
                  }
                  className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600">📧</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      Email Support
                    </div>
                    <div className="text-sm text-gray-600">
                      {event.contactEmail || "support@example.com"}
                    </div>
                  </div>
                </button>

                <button
                  onClick={() =>
                    window.open(
                      `tel:${event.contactPhone || "+911234567890"}`,
                      "_blank"
                    )
                  }
                  className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-green-600">📞</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      Call Support
                    </div>
                    <div className="text-sm text-gray-600">
                      {event.contactPhone || "+91 12345 67890"}
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Share Event */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Share This Event
              </h3>
              <div className="flex gap-3">
                <button
                  onClick={() =>
                    window.open(
                      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                        `Check out this event: ${event.title}`
                      )}&url=${window.location.href}`,
                      "_blank"
                    )
                  }
                  className="flex-1 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2"
                >
                  <span>𝕏</span>
                  <span className="font-medium">Twitter</span>
                </button>
                <button
                  onClick={() =>
                    window.open(
                      `https://wa.me/?text=${encodeURIComponent(
                        `Check out this event: ${event.title} - ${window.location.href}`
                      )}`,
                      "_blank"
                    )
                  }
                  className="flex-1 p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center justify-center gap-2"
                >
                  <span>💬</span>
                  <span className="font-medium">WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        eventId={event.id}
        seatIds={Array.from(
          { length: selectedSeatsCount },
          (_, i) => `seat-${i + 1}`
        )}
        userId={userId}
        userEmail={userEmail}
        userName={userName}
        totalAmount={totalAmount}
        seatsCount={selectedSeatsCount}
        onBookingComplete={handleBookingComplete}
      />
    </>
  );
}
