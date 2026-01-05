"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GoogleCalendarConnect from "@/components/GoogleCalendarConnect";
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
  const walletStats = useMemo(() => {
    if (!userData?.walletHistory && !userData?.wallet?.coinHistory) {
      return { earned: 0, redeemed: 0 };
    }
    const history = userData.walletHistory?.length
      ? userData.walletHistory
      : userData.wallet?.coinHistory || [];
    let earned = 0;
    let redeemed = 0;
    history.forEach((tx) => {
      const amount = typeof tx.coins === "number" ? tx.coins : tx.amount ?? 0;
      const type = tx.action || tx.type || "";
      if (type === "earn" || amount > 0) {
        earned += Math.abs(amount);
      } else if (type === "redeem" || type === "redeemed" || amount < 0) {
        redeemed += Math.abs(amount);
      }
    });
    return { earned, redeemed };
  }, [userData]);

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
        <div className="mx-auto flex max-w-6xl flex-col gap-8">
          {/* Hero */}
          <div
            className="overflow-hidden rounded-3xl border shadow-sm"
            style={{ backgroundColor: "white", borderColor: "var(--color-green)" }}
          >
            <div className="px-6 py-10 md:px-10" style={{ backgroundColor: "var(--color-font)" }}>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4 md:gap-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-bold uppercase" style={{ backgroundColor: "var(--color-orange)", color: "var(--color-font)" }}>
                    {avatarFallback}
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.15em]" style={{ color: "white" }}>
                      Profile
                    </p>
                    <h1 className="text-3xl font-bold md:text-4xl" style={{ color: "white" }}>
                      {authUser?.displayName || authUser?.email || "Guest"}
                    </h1>
                    <p style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                      {authUser?.email || "Not signed in"}
                    </p>
                  </div>
                </div>
                <div className="rounded-2xl bg-white/15 px-4 py-3 text-sm font-semibold md:px-6" style={{ color: "white" }}>
                  {authUser ? "Signed In" : "Not Signed In"}
                </div>
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
          {!loadingUser && !authUser && (
            <div
              className="rounded-2xl border p-6 text-center shadow-sm"
              style={{ backgroundColor: "var(--color-pink)", borderColor: "var(--color-orange)" }}
            >
              <p className="text-lg font-semibold text-font">
                You are not signed in.
              </p>
              <p className="mt-1 text-sm text-font">
                Log in to view your profile and activity.
              </p>
              <button
                onClick={handleGoToLogin}
                className="mt-4 rounded-lg px-4 py-2 font-semibold shadow-sm hover:opacity-90 transition-opacity"
                style={{ backgroundColor: "var(--color-font)", color: "white" }}
              >
                Go to Login
              </button>
            </div>
          )}

          <div className="grid gap-8 md:grid-cols-3">
            {/* Wallet Section */}
            <div className="md:col-span-2 space-y-4">
              <h2 className="text-xl font-bold text-font">Wallet</h2>
              {loadingData ? (
                <SkeletonCard />
              ) : (
                <div className="rounded-2xl border p-6 shadow-sm" style={{ backgroundColor: "white", borderColor: "var(--color-green)" }}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold uppercase" style={{ color: "var(--color-font)" }}>
                      Total Coins
                    </span>
                    <span className="text-3xl font-bold" style={{ color: "var(--color-font)" }}>
                      {userData?.wallet?.coins || 0}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <StatCard label="Earned" value={walletStats.earned} />
                    <StatCard label="Redeemed" value={walletStats.redeemed} />
                  </div>
                </div>
              )}

              {/* Coin History */}
              <div>
                <h3 className="text-lg font-bold text-font mb-3">
                  Recent Transactions
                </h3>
                {loadingData ? (
                  <SkeletonCard />
                ) : (userData?.walletHistory?.length ??
                    userData?.wallet?.coinHistory?.length ??
                    0) > 0 ? (
                  <div className="space-y-2">
                    {(userData.walletHistory?.length
                      ? userData.walletHistory
                      : userData.wallet?.coinHistory || []
                    )
                      .slice(0, 5)
                      .map((tx, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between rounded-xl border px-4 py-3"
                          style={{ backgroundColor: "white", borderColor: "var(--color-green)" }}
                        >
                          <div>
                            <p className="font-semibold capitalize" style={{ color: "var(--color-font)" }}>
                              {(tx.action || tx.type || "transaction").replace(
                                /_/g,
                                " "
                              )}
                            </p>
                            <p className="text-xs" style={{ color: "rgba(82, 99, 85, 0.7)" }}>
                              {parseDateSafe(
                                tx.date || tx.createdAt
                              )?.toLocaleString() || "—"}
                            </p>
                          </div>
                          <span className="font-bold" style={{ color: "var(--color-font)" }}>
                            {typeof tx.coins === "number"
                              ? tx.coins > 0
                                ? `+${tx.coins}`
                                : `${tx.coins}`
                              : tx.amount ?? ""}
                          </span>
                        </div>
                      ))}
                  </div>
                ) : (
                  <EmptyState
                    title="No transactions"
                    description="Play games and attend events to earn coins."
                  />
                )}
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
              {/* Wallet History Card with Pagination */}
              <div>
                <h3 className="text-lg font-bold text-font mb-3">
                  Wallet History
                </h3>
                {loadingData ? (
                  <SkeletonCard />
                ) : (userData?.walletHistory?.length ??
                    userData?.wallet?.coinHistory?.length ??
                    0) > 0 ? (
                  <div
                    className="rounded-2xl border p-4"
                    style={{ backgroundColor: "white", borderColor: "var(--color-green)" }}
                  >
                    {(() => {
                      const entries = (
                        userData.walletHistory?.length
                          ? userData.walletHistory
                          : userData.wallet?.coinHistory || []
                      ).map((tx) => ({
                        action: tx.action || tx.type || "transaction",
                        amount:
                          typeof tx.coins === "number"
                            ? tx.coins
                            : tx.amount ?? 0,
                        date: parseDateSafe(tx.createdAt || tx.date),
                        source: tx.source || null,
                      }));
                      const start = walletPage * PAGE_SIZE;
                      const pageItems = entries.slice(start, start + PAGE_SIZE);
                      return (
                        <>
                          <div className="space-y-2">
                            {pageItems.map((tx, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between rounded-xl border px-4 py-3"
                                style={{ backgroundColor: "white", borderColor: "var(--color-green)" }}
                              >
                                <div>
                                  <p className="font-semibold capitalize" style={{ color: "var(--color-font)" }}>
                                    {tx.action.replace(/_/g, " ")}
                                    {tx.source ? ` · ${tx.source}` : ""}
                                  </p>
                                  <p className="text-xs" style={{ color: "rgba(82, 99, 85, 0.7)" }}>
                                    {tx.date?.toLocaleString() || "—"}
                                  </p>
                                </div>
                                <span
                                  className="font-bold"
                                  style={{
                                    color:
                                      tx.amount >= 0
                                        ? "var(--color-green)"
                                        : "var(--color-orange)",
                                  }}
                                >
                                  {tx.amount > 0
                                    ? `+${tx.amount}`
                                    : `${tx.amount}`}
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <button
                              className="rounded-lg px-3 py-2 text-sm font-semibold hover:opacity-90 transition disabled:opacity-50"
                              style={{ backgroundColor: "var(--color-font)", color: "white" }}
                              onClick={() =>
                                setWalletPage((p) => Math.max(0, p - 1))
                              }
                              disabled={walletPage === 0}
                            >
                              Prev
                            </button>
                            <p className="text-sm" style={{ color: "rgba(82, 99, 85, 0.7)" }}>
                              Page {walletPage + 1} of{" "}
                              {Math.max(
                                1,
                                Math.ceil(entries.length / PAGE_SIZE)
                              )}
                            </p>
                            <button
                              className="rounded-lg px-3 py-2 text-sm font-semibold hover:opacity-90 transition disabled:opacity-50"
                              style={{ backgroundColor: "var(--color-font)", color: "white" }}
                              onClick={() =>
                                setWalletPage((p) =>
                                  p + 1 < Math.ceil(entries.length / PAGE_SIZE)
                                    ? p + 1
                                    : p
                                )
                              }
                              disabled={
                                walletPage + 1 >=
                                Math.ceil(entries.length / PAGE_SIZE)
                              }
                            >
                              Next
                            </button>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                ) : (
                  <EmptyState
                    title="No wallet history"
                    description="No wallet changes recorded yet."
                  />
                )}
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

              {/* Recent Orders */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-bold text-font">
                    Recent Orders
                  </h3>
                  {userData?.userOrders?.length > 0 && (
                    <button
                      onClick={() => router.push("/my-orders")}
                      className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                    >
                      View All →
                    </button>
                  )}
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
                        key={idx}
                        className="flex items-center justify-between rounded-xl border px-4 py-3 cursor-pointer hover:shadow-md transition-all"
                        style={{ backgroundColor: "white", borderColor: "var(--color-green)" }}
                        onClick={() => router.push("/my-orders")}
                      >
                        <div>
                          <p className="font-semibold text-font">
                            Order {order.orderId?.substring(0, 12)}...
                          </p>
                          <p className="text-xs text-font/70">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-font">
                            ₹{order.finalAmount?.toFixed(2) || "0.00"}
                          </p>
                          <span
                            className={`text-xs font-semibold capitalize`}
                            style={{
                              color: "var(--color-green)",
                            }}
                          >
                            ✓ Completed
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="No orders yet"
                    description="Visit the shop to place your first order."
                  />
                )}
              </div>
            </div>

            {/* Activity & Events */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-font">Activity</h2>
              {loadingData ? (
                <SkeletonCard />
              ) : (
                <>
                  <ActivityCard
                    icon="🕹️"
                    label="Games Played"
                    value={userData?.gamesHistory?.length || 0}
                    bgColor="var(--color-pink)"
                  />
                  <ActivityCard
                    icon="🎊"
                    label="Events Attended"
                    value={
                      userData?.userEvents?.filter((e) => e.attended)?.length ||
                      0
                    }
                    bgColor="var(--color-orange)"
                  />
                  <ActivityCard
                    icon="📖"
                    label="Workshops"
                    value={userData?.userWorkshops?.length || 0}
                    bgColor="var(--color-green)"
                  />
                  {userData?.isCommunityMember && (
                    <div
                      className="rounded-xl border p-4 text-center"
                      style={{
                        backgroundColor: "var(--color-font)",
                        borderColor: "var(--color-orange)",
                      }}
                    >
                      <svg
                        className="w-8 h-8 mx-auto mb-1"
                        fill="white"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                      <p className="font-bold" style={{ color: "white" }}>Community Member</p>
                    </div>
                  )}
                </>
              )}

              {/* Games Played History with Pagination */}
              <div
                className="rounded-2xl border p-5 shadow-sm"
                style={{ backgroundColor: "white", borderColor: "var(--color-green)" }}
              >
                <h3 className="text-lg font-bold text-font mb-3">
                  Games Played
                </h3>
                {loadingData ? (
                  <SkeletonCard />
                ) : (userData?.gamesHistory?.length ?? 0) > 0 ? (
                  (() => {
                    const entries = (userData.gamesHistory || []).map((g) => ({
                      raw: g,
                      title: g.gameName || g.title || "Game",
                      difficulty: g.difficulty || null,
                      completed: !!g.isCompleted,
                      coins: g.coinsEarned ?? 0,
                      hintsUsed: g.hintsUsed ?? 0,
                      attempts: g.attempts ?? 0,
                      date: parseDateSafe(
                        g.finishedAt || g.createdAt || g.startedAt
                      ),
                      startedAt: parseDateSafe(g.startedAt),
                      finishedAt: parseDateSafe(g.finishedAt),
                    }));
                    const start = gamesPage * PAGE_SIZE;
                    const pageItems = entries.slice(start, start + PAGE_SIZE);
                    return (
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
                              key={idx}
                              className="rounded-xl border px-4 py-3 cursor-pointer hover:opacity-90 transition"
                              style={{ backgroundColor: "white", borderColor: "var(--color-green)" }}
                              onClick={() => setSelectedGame(g)}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <p className="font-semibold truncate" style={{ color: "var(--color-font)" }}>
                                      {g.title}
                                    </p>
                                    {g.difficulty && (
                                      <Badge text={g.difficulty} tone="info" />
                                    )}
                                  </div>
                                  <p className="text-xs" style={{ color: "rgba(82, 99, 85, 0.7)" }}>
                                    {g.date?.toLocaleString() || "—"}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <span className="font-bold block" style={{ color: "var(--color-font)" }}>
                                    {g.coins > 0 ? `+${g.coins}` : `${g.coins}`}
                                  </span>
                                  <span
                                    className="text-xs font-semibold block mt-1"
                                    style={{
                                      color: g.completed
                                        ? "var(--color-green)"
                                        : "var(--color-orange)",
                                    }}
                                  >
                                    {g.completed ? "Completed" : "In Progress"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                      </>
                    )}
                  </div>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <button
                            className="rounded-lg px-3 py-2 text-sm font-semibold hover:opacity-90 transition disabled:opacity-50"
                            style={{ backgroundColor: "var(--color-font)", color: "white" }}
                            onClick={() =>
                              setGamesPage((p) => Math.max(0, p - 1))
                            }
                            disabled={gamesPage === 0}
                          >
                            Prev
                          </button>
                          <p className="text-sm text-font/70">
                            Page {gamesPage + 1} of{" "}
                            {Math.max(1, Math.ceil(entries.length / PAGE_SIZE))}
                          </p>
                          <button
                            className="rounded-lg px-3 py-2 text-sm font-semibold hover:opacity-90 transition disabled:opacity-50"
                            style={{ backgroundColor: "var(--color-font)", color: "white" }}
                            onClick={() =>
                              setGamesPage((p) =>
                                p + 1 < Math.ceil(entries.length / PAGE_SIZE)
                                  ? p + 1
                                  : p
                              )
                            }
                            disabled={
                              gamesPage + 1 >=
                              Math.ceil(entries.length / PAGE_SIZE)
                            }
                          >
                            Next
                          </button>
                        </div>
                      </>
                    );
                  })()
                ) : (
                  <EmptyState
                    title="No games yet"
                    description="Play a game to see it here."
                  />
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
              {/* Cart */}
              <div
                className="rounded-2xl border p-5 shadow-sm"
                style={{ backgroundColor: "white", borderColor: "var(--color-green)" }}
              >
                <h3 className="text-lg font-bold text-font mb-3">Cart</h3>
                {loadingData ? (
                  <SkeletonCard />
                ) : userData?.cart?.items?.length > 0 ? (
                  <div>
                    <p className="text-sm font-semibold text-font/70 mb-3">
                      {userData.cart.items.length} item(s) in cart
                    </p>
                    <button className="w-full rounded-lg px-4 py-2 font-semibold hover:opacity-90 transition-opacity" style={{ backgroundColor: "var(--color-font)", color: "white" }}>
                      View Cart
                    </button>
                  </div>
                  <div className="text-font-2">Reward Coins</div>
                </div>
              </div>

              {/* Google Calendar Integration */}
              {authUser && (
                <div className="mb-8">
                  <GoogleCalendarConnect userId={authUser.uid} />
                </div>
              )}

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
function ToggleRow({ label, description, enabled, onChange }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="font-semibold text-font">{label}</p>
        <p className="text-sm text-font/70">{description}</p>
      </div>
      <button
        type="button"
        onClick={onChange}
        className="relative h-7 w-12 rounded-full transition-colors duration-200"
        style={{
          backgroundColor: enabled ? "var(--color-green)" : "#e5e7eb",
        }}
        aria-pressed={enabled}
        aria-label={label}
      >
        <span
          className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full shadow transition-transform duration-200 ${
            enabled ? "translate-x-6" : "translate-x-1"
          }`}          style={{ backgroundColor: "white" }}        />
      </button>
    </div>
  );
}

function EmptyState({ title, description }) {
  return (
    <div
      className="rounded-xl border border-dashed p-6 text-center"
      style={{
        borderColor: "var(--color-green)",
        backgroundColor: "var(--color-pink)",
      }}
    >
      <p className="font-semibold" style={{ color: "var(--color-font)" }}>{title}</p>
      <p className="text-sm" style={{ color: "rgba(82, 99, 85, 0.7)" }}>{description}</p>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div
      className="rounded-lg border px-4 py-3 shadow-sm"
      style={{ backgroundColor: "white", borderColor: "var(--color-green)" }}
    >
      <p className="text-xs font-semibold uppercase text-font/70">{label}</p>
      <p className="mt-1 text-xl font-bold text-font">{value}</p>
    </div>
  );
}

function ActivityCard({ icon, label, value }) {
  const getIconSvg = () => {
    switch (icon) {
      case "🕹️":
        return (
          <svg
            className="w-8 h-8"
            fill="var(--color-green)"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z"></path>
          </svg>
        );
      case "🎊":
        return (
          <svg
            className="w-8 h-8"
            fill="var(--color-orange)"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clipRule="evenodd"
            ></path>
          </svg>
        );
      case "📖":
        return (
          <svg
            className="w-8 h-8"
            fill="var(--color-green)"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"></path>
          </svg>
        );
      default:
        return <span className="text-2xl">{icon}</span>;
    }
  };

  return (
    <div
      className="rounded-xl border p-4 shadow-sm"
      style={{ backgroundColor: "white", borderColor: "var(--color-green)" }}
    >
      <div className="flex items-center gap-3">
        {getIconSvg()}
        <div>
          <p className="text-xs font-semibold text-font/70 uppercase">
            {label}
          </p>
          <p className="text-2xl font-bold text-font">{value}</p>
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div
      className="rounded-xl border p-4 shadow-sm animate-pulse"
      style={{
        borderColor: "var(--color-green)",
        backgroundColor: "var(--color-pink)",
      }}
    >
      <div
        className="h-8 rounded w-1/3 mb-2"
        style={{ backgroundColor: "var(--color-green)" }}
      ></div>
      <div
        className="h-4 rounded w-full"
        style={{ backgroundColor: "var(--color-green)" }}
      ></div>
    </div>
  );
}

function Badge({ text, tone = "info" }) {
  const colors = {
    info: {
      bg: "var(--color-pink)",
      border: "var(--color-green)",
      text: "var(--color-font)",
    },
    success: {
      bg: "var(--color-green)",
      border: "var(--color-green)",
      text: "white",
    },
  };
  const c = colors[tone] || colors.info;
  return (
    <span
      className="text-[11px] font-semibold px-2 py-0.5 rounded-full border"
      style={{ backgroundColor: c.bg, borderColor: c.border, color: c.text }}
    >
      {text}
    </span>
  );
}

function GameDetailModal({ game, onClose }) {
  const fields = [
    { label: "Game", value: game.title },
    { label: "Difficulty", value: game.difficulty || "—" },
    { label: "Hints Used", value: game.hintsUsed ?? 0 },
    { label: "Attempts", value: game.attempts ?? 0 },
    { label: "Coins Earned", value: game.coins ?? 0 },
    { label: "Started", value: game.startedAt?.toLocaleString() || "—" },
    {
      label: "Finished",
      value:
        game.finishedAt?.toLocaleString() ||
        (game.completed ? "—" : "In Progress"),
    },
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div
        className="w-full max-w-lg rounded-2xl border p-6 shadow-lg"
        style={{ backgroundColor: "white", borderColor: "var(--color-green)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h4 className="text-xl font-bold text-font">Game Details</h4>
            {game.difficulty && <Badge text={game.difficulty} tone="info" />}
            <Badge
              text={game.completed ? "Completed" : "In Progress"}
              tone={game.completed ? "success" : "info"}
            />
          </div>
          <button
            className="rounded-lg px-3 py-1 text-sm font-semibold"
            style={{ backgroundColor: "white", border: "1px solid var(--color-green)", color: "var(--color-font)" }}
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {fields.map((f, i) => (
            <div
              key={i}
              className="rounded-xl border px-4 py-3"
              style={{ backgroundColor: "white", borderColor: "var(--color-green)" }}
            >
              <p className="text-xs font-semibold text-font/70 uppercase">
                {f.label}
              </p>
              <p className="text-sm font-bold text-font">{String(f.value)}</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
