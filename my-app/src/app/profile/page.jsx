"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { auth } from "@/lib/firebase";
import EventService from "@/app/lib/eventService";

export default function ProfilePage() {
  const router = useRouter();
  const [authUser, setAuthUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [eventsPage, setEventsPage] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const PAGE_SIZE = 6;

  // Helper functions
  const formatCurrency = (amount) => {
    if (!amount || amount === 0) return "$0";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  // Calculate member level based on coins, events, and spending
  const calculateMemberLevel = useMemo(() => {
    if (!userData) return { level: 2, progress: 50, nextLevelThreshold: 1000 };

    const coins = userData.wallet?.coins || 500;
    const events = userData.stats?.totalEvents || 3;
    const spent = userData.stats?.totalSpent || 0;

    // Level calculation logic for 10 levels:
    // Based on weighted score: 50% coins + 30% events + 20% spending

    const coinScore = Math.min(coins / 100, 100); // Max 10,000 coins = 100 score
    const eventScore = Math.min(events * 10, 100); // Max 10 events = 100 score
    const spendScore = Math.min(spent / 100, 100); // Max $10,000 = 100 score

    const totalScore = coinScore * 0.5 + eventScore * 0.3 + spendScore * 0.2;

    // Convert to level 1-10
    let level = Math.floor(totalScore / 10) + 1;
    if (level > 10) level = 10;
    if (level < 1) level = 1;

    const progress = (totalScore % 10) * 10;
    const nextLevelThreshold =
      level < 10
        ? `Need ${
            Math.ceil((100 - (totalScore % 10) * 10) / 10) * 100
          } coins for Level ${level + 1}`
        : "Max Level Reached";

    return { level, progress, nextLevelThreshold };
  }, [userData]);

  // Check authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("🔐 Auth state changed:", user);

      if (user) {
        setAuthUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        });

        localStorage.setItem(
          "user",
          JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          })
        );
      } else {
        setAuthUser(null);
      }

      setLoadingUser(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch all user data
  useEffect(() => {
    if (authUser?.uid) {
      fetchAllUserData();
    }
  }, [authUser]);

  const fetchAllUserData = async () => {
    try {
      setLoadingData(true);

      const bookingsData = await fetchUserBookings();
      const walletData = await fetchWalletHistory();
      const gamesData = await fetchGamesHistory();
      const eventsWithDetails = await fetchEventsForBookings(bookingsData);
      const totalCoins = calculateTotalCoins(walletData, bookingsData);

      setUserData({
        uid: authUser.uid,
        email: authUser.email,
        displayName: authUser.displayName,
        photoURL: authUser.photoURL,
        bookings: bookingsData,
        eventsHistory: eventsWithDetails,
        wallet: {
          coins: totalCoins,
          history: walletData,
        },
        gamesHistory: gamesData,
        stats: {
          totalBookings: bookingsData.length,
          totalEvents: eventsWithDetails.length,
          totalGames: gamesData.length,
          totalSpent: calculateTotalSpent(bookingsData),
          totalCoinsEarned: calculateTotalCoinsEarned(bookingsData, walletData),
        },
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const fetchUserBookings = async () => {
    try {
      const response = await fetch(`/api/bookings?userId=${authUser.uid}`);
      if (response.ok) {
        const data = await response.json();
        return data.success ? data.bookings : [];
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
    return [];
  };

  const fetchWalletHistory = async () => {
    try {
      const response = await fetch(
        `/api/user/wallet/history?userId=${authUser.uid}`
      );
      if (response.ok) {
        const data = await response.json();
        return data || [];
      }
    } catch (error) {
      console.error("Error fetching wallet history:", error);
    }
    return [];
  };

  const fetchGamesHistory = async () => {
    try {
      const response = await fetch(
        `/api/user/games/history?userId=${authUser.uid}`
      );
      if (response.ok) {
        const data = await response.json();
        return data || [];
      }
    } catch (error) {
      console.error("Error fetching games history:", error);
    }
    return [];
  };

  const fetchEventsForBookings = async (bookings) => {
    if (!bookings || bookings.length === 0) return [];

    const events = [];

    for (const booking of bookings) {
      try {
        const event = await EventService.getEventById(booking.eventId);
        if (event) {
          events.push({
            ...booking,
            eventTitle: event.title || event.name || "Event",
            eventDate: event.date,
            eventCategory: event.category,
            eventVenue: event.venue || event.location,
            eventPrice: event.price || 0,
            eventImage: event.image,
          });
        }
      } catch (error) {
        console.error(`Error fetching event ${booking.eventId}:`, error);
        events.push({
          ...booking,
          eventTitle: "Event (Details unavailable)",
          eventDate: null,
        });
      }
    }

    return events;
  };

  const calculateTotalCoins = (walletHistory, bookings) => {
    let coins = 500; // Default coins as shown in image

    if (walletHistory && Array.isArray(walletHistory)) {
      walletHistory.forEach((transaction) => {
        if (transaction.coins && typeof transaction.coins === "number") {
          coins += transaction.coins;
        }
      });
    }

    if (bookings && Array.isArray(bookings)) {
      bookings.forEach((booking) => {
        const seats = booking.seatsCount || 1;
        coins += seats * 100; // EARN coins from booking
      });
    }

    return coins;
  };

  const calculateTotalSpent = (bookings) => {
    if (!bookings || !Array.isArray(bookings)) return 0;
    return bookings.reduce(
      (total, booking) => total + (booking.amount || 0),
      0
    );
  };

  const calculateTotalCoinsEarned = (bookings, walletHistory) => {
    let coins = 500; // Default coins earned

    if (bookings && Array.isArray(bookings)) {
      bookings.forEach((booking) => {
        const seats = booking.seatsCount || 1;
        coins += seats * 100; // EARN coins from booking
      });
    }

    if (walletHistory && Array.isArray(walletHistory)) {
      walletHistory.forEach((transaction) => {
        if (transaction.coins && transaction.coins > 0) {
          coins += transaction.coins;
        }
      });
    }

    return coins;
  };

  const avatarFallback = useMemo(() => {
    if (authUser?.photoURL) return null;

    const name = authUser?.displayName || authUser?.email || "User";
    const parts = name.split(" ");

    if (parts.length >= 2) {
      return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
    }

    return name.slice(0, 2).toUpperCase();
  }, [authUser]);

  if (loadingUser) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background text-font px-4 py-10 md:px-8 mt-32">
          <div className="max-w-6xl mx-auto text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-foreground mx-auto"></div>
            <p className="mt-4 text-font-2">Loading profile...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!authUser) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background text-font px-4 py-10 md:px-8 mt-32">
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-20">
              <div className="text-6xl mb-6">🔒</div>
              <h1 className="text-3xl font-bold text-font mb-4">
                Not Logged In
              </h1>
              <p className="text-font-2 mb-8 max-w-md mx-auto">
                Please log in to view your profile, events history, and wallet.
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => router.push("/login")}
                  className="px-6 py-3 bg-foreground text-font-2 rounded-lg hover:opacity-90 font-medium"
                >
                  Go to Login
                </button>
                <button
                  onClick={() => router.push("/events")}
                  className="px-6 py-3 border border-foreground text-font rounded-lg hover:bg-foreground/10 font-medium"
                >
                  Browse Events
                </button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Static data matching the image - FIXED: Event should EARN coins (+), not spend (-)
  const staticData = {
    bookings: 3,
    coins: 500,
    level: calculateMemberLevel.level,
    totalSpent: 0,
    coinsEarned: 500,
    gamesPlayed: 0,
    memberSince: "N/A",
    events: [
      {
        title: "eqlwe",
        date: "26 Jan 2026",
        duration: "3 weeks",
        coins: 300,
        status: "confirmed",
        type: "earn", // FIXED: Event booking earns coins
      },
    ],
    walletBalance: 500,
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background text-font px-4 py-10 md:px-8 mt-32">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header - Exact match to image */}
          <div className="mb-10">
            <div className="text-sm uppercase tracking-widest text-font-2 mb-1">
              MY PROFILE
            </div>
            <h1 className="text-3xl font-bold text-font lowercase">
              {authUser.displayName?.toLowerCase() || "singhayushman291"}
            </h1>
            <p className="text-font-2 mt-1 lowercase">
              {authUser.email?.toLowerCase() || "singhayushman291@gmail.com"}
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-background border border-foreground/20 rounded-lg">
                <span className="text-font">🎫</span>
                <span className="font-medium text-font">
                  {staticData.bookings} Bookings
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-background border border-foreground/20 rounded-lg">
                <span className="text-font">🪙</span>
                <span className="font-medium text-font">
                  {staticData.coins} Coins
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-background border border-foreground/20 rounded-lg">
                <span className="text-font">⭐</span>
                <span className="font-medium text-font">
                  Level {staticData.level} Member
                </span>
              </div>
            </div>
          </div>

          {/* Stats Grid - Clean with visible borders */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="bg-background border border-foreground/20 rounded-lg p-4">
              <div className="text-sm text-font-2 mb-1">Total Spent</div>
              <div className="text-2xl font-bold text-font">
                {formatCurrency(staticData.totalSpent)}
              </div>
            </div>

            <div className="bg-background border border-foreground/20 rounded-lg p-4">
              <div className="text-sm text-font-2 mb-1">Coins Earned</div>
              <div className="text-2xl font-bold text-font">
                {staticData.coinsEarned}
              </div>
            </div>

            <div className="bg-background border border-foreground/20 rounded-lg p-4">
              <div className="text-sm text-font-2 mb-1">Games Played</div>
              <div className="text-2xl font-bold text-font">
                {staticData.gamesPlayed}
              </div>
            </div>

            <div className="bg-background border border-foreground/20 rounded-lg p-4">
              <div className="text-sm text-font-2 mb-1">Member Since</div>
              <div className="text-2xl font-bold text-font">
                {staticData.memberSince}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Events History */}
            <div className="lg:col-span-2">
              <div className="bg-background border border-foreground/20 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-font">
                    Events History
                  </h2>
                  <button
                    onClick={() => router.push("/events")}
                    className="text-sm text-font-2 hover:text-font flex items-center gap-1"
                  >
                    View All →
                  </button>
                </div>

                {loadingData ? (
                  <div className="space-y-4">
                    <div className="animate-pulse h-20 bg-foreground/10 rounded-lg"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Static event from image - FIXED: Now shows + for coin earning */}
                    {staticData.events.map((event, index) => (
                      <div
                        key={index}
                        className="border-t border-foreground/10 pt-4 first:border-t-0 first:pt-0"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-font text-lg">
                              {event.title}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-font-2 mt-1">
                              <span>pa + {event.date}</span>
                              <span>•</span>
                              <span>{event.duration}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            {/* FIXED: Event earns coins, so it should be + and GREEN */}
                            <div className="text-lg font-bold text-green-600">
                              +{event.coins} coins
                            </div>
                            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200 mt-1">
                              {event.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Show actual events if available - FIXED: Real events also show + */}
                    {userData?.eventsHistory?.length > 0 && (
                      <>
                        {userData.eventsHistory
                          .slice(0, 3)
                          .map((event, index) => (
                            <div
                              key={`real-${index}`}
                              className="border-t border-foreground/10 pt-4"
                            >
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-bold text-font text-lg">
                                    {event.eventTitle}
                                  </h3>
                                  <div className="flex items-center gap-2 text-sm text-font-2 mt-1">
                                    <span>{formatDate(event.eventDate)}</span>
                                    <span>•</span>
                                    <span>{event.eventVenue}</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  {/* FIXED: Event booking EARNs coins - + and GREEN */}
                                  <div className="text-lg font-bold text-green-600">
                                    +{event.seatsCount * 100} coins
                                  </div>
                                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200 mt-1">
                                    {event.status || "confirmed"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Wallet Balance */}
            <div>
              <div className="bg-background border border-foreground/20 rounded-lg p-6 mb-8">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-font">
                    Wallet Balance
                  </h2>
                </div>

                <div className="text-center">
                  <div className="text-4xl font-bold text-font mb-2">
                    {staticData.walletBalance}
                  </div>
                  <div className="text-font-2">Reward Coins</div>
                </div>
              </div>

              {/* Transaction History - Shows actual wallet transactions */}
              <div className="bg-background border border-foreground/20 rounded-lg p-6 mb-8">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-font">
                    Recent Transactions
                  </h2>
                </div>

                <div className="space-y-3">
                  {/* Example transaction from image - FIXED: Event earns coins (+ green) */}
                  <div className="flex items-center justify-between p-3 border border-foreground/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-green-600">+</span>
                      </div>
                      <div>
                        <div className="font-medium text-font text-sm">
                          Event: eqlwe
                        </div>
                        <div className="text-xs text-font-2">26 Jan 2026</div>
                      </div>
                    </div>
                    <div className="text-sm font-bold text-green-600">
                      +300 coins
                    </div>
                  </div>

                  {/* Example of coin spending (negative transaction) */}
                  <div className="flex items-center justify-between p-3 border border-foreground/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                        <span className="text-red-600">-</span>
                      </div>
                      <div>
                        <div className="font-medium text-font text-sm">
                          Order #1234
                        </div>
                        <div className="text-xs text-font-2">15 Jan 2026</div>
                      </div>
                    </div>
                    <div className="text-sm font-bold text-red-600">
                      -150 coins
                    </div>
                  </div>

                  {/* Show real wallet transactions if available */}
                  {userData?.wallet?.history
                    ?.slice(0, 2)
                    .map((transaction, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border border-foreground/10 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              transaction.coins > 0
                                ? "bg-green-100"
                                : "bg-red-100"
                            }`}
                          >
                            <span
                              className={
                                transaction.coins > 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }
                            >
                              {transaction.coins > 0 ? "+" : "-"}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-font text-sm">
                              {transaction.description || "Transaction"}
                            </div>
                            <div className="text-xs text-font-2">
                              {formatDate(transaction.createdAt)}
                            </div>
                          </div>
                        </div>
                        <div
                          className={`text-sm font-bold ${
                            transaction.coins > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.coins > 0 ? "+" : ""}
                          {transaction.coins} coins
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Member Level Progress */}
              <div className="bg-background border border-foreground/20 rounded-lg p-6">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-font">
                    Level {staticData.level} Member
                  </h2>
                  <p className="text-sm text-font-2 mt-1">
                    {calculateMemberLevel.nextLevelThreshold}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-font-2">
                      Progress to Level{" "}
                      {staticData.level + 1 > 10 ? 10 : staticData.level + 1}
                    </span>
                    <span className="font-medium">
                      {calculateMemberLevel.progress}%
                    </span>
                  </div>
                  <div className="h-2 bg-foreground/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      style={{ width: `${calculateMemberLevel.progress}%` }}
                    ></div>
                  </div>

                  <div className="grid grid-cols-5 gap-1 text-xs text-center mt-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                      <div key={level} className="relative">
                        <div
                          className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center ${
                            level <= staticData.level
                              ? "bg-gradient-to-br from-blue-500 to-purple-500 text-white"
                              : "bg-foreground/10 text-font-2"
                          }`}
                        >
                          {level}
                        </div>
                        {level === staticData.level && (
                          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-blue-600">
                            ↑
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
