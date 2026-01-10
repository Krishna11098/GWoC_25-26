"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { auth } from "@/lib/firebaseClient";
import { userFetch } from "@/lib/userFetch";

export default function ProfilePage() {
  const router = useRouter();
  const [authUser, setAuthUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [walletPage, setWalletPage] = useState(0);
  const [gamesPage, setGamesPage] = useState(0);
  const [selectedGame, setSelectedGame] = useState(null);
  const PAGE_SIZE = 10;

  const parseDateSafe = (value) => {
    try {
      if (!value) return null;
      if (value instanceof Date) return value;
      if (typeof value === "string") {
        const d = new Date(value);
        return isNaN(d.getTime()) ? null : d;
      }
      if (typeof value === "number") {
        const d = new Date(value);
        return isNaN(d.getTime()) ? null : d;
      }
      if (typeof value === "object") {
        if (typeof value.toDate === "function") {
          // Firestore Timestamp
          const d = value.toDate();
          return isNaN(d.getTime()) ? null : d;
        }
        // Firestore Timestamp JSON shapes
        if (value.seconds != null || value._seconds != null) {
          const secs = value.seconds ?? value._seconds;
          const d = new Date(secs * 1000);
          return isNaN(d.getTime()) ? null : d;
        }
      }
      return null;
    } catch (_) {
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setAuthUser(firebaseUser);
      setLoadingUser(false);

      if (firebaseUser) {
        fetchUserData();
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoadingData(true);
      const profileRes = await userFetch(`/api/user/profile`);
      const profileData = await profileRes.json();

      let walletHistory = [];
      try {
        const walletRes = await userFetch(`/api/user/wallet/history`);
        if (walletRes.ok) walletHistory = await walletRes.json();
      } catch (_) {}

      let gamesHistory = [];
      try {
        const gamesRes = await userFetch(`/api/user/games/history`);
        if (gamesRes.ok) gamesHistory = await gamesRes.json();
      } catch (_) {}

      setUserData({
        ...profileData,
        walletHistory,
        gamesHistory,
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const avatarFallback = useMemo(() => {
    const displayName = authUser?.displayName || authUser?.email || "User";
    const parts = displayName.split(" ");
    if (parts.length >= 2)
      return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
    return displayName.slice(0, 2).toUpperCase();
  }, [authUser]);

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

  const handleGoToLogin = () => router.push("/login");

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background text-font px-4 py-10 md:px-8 mt-32">
        <div className="mx-auto flex max-w-6xl flex-col gap-8">
          {/* Hero */}
          <div
            className="overflow-hidden rounded-3xl border shadow-sm"
            style={{
              backgroundColor: "white",
              borderColor: "var(--color-green)",
            }}
          >
            <div
              className="px-6 py-10 md:px-10"
              style={{ backgroundColor: "var(--color-font)" }}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4 md:gap-6">
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-bold uppercase"
                    style={{
                      backgroundColor: "var(--color-orange)",
                      color: "var(--color-font)",
                    }}
                  >
                    {avatarFallback}
                  </div>
                  <div>
                    <p
                      className="text-sm font-semibold uppercase tracking-[0.15em]"
                      style={{ color: "white" }}
                    >
                      Profile
                    </p>
                    <h1
                      className="text-3xl font-bold md:text-4xl"
                      style={{ color: "white" }}
                    >
                      {authUser?.displayName || authUser?.email || "Guest"}
                    </h1>
                    <p style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                      {authUser?.email || "Not signed in"}
                    </p>
                  </div>
                </div>
                <div
                  className="rounded-2xl bg-white/15 px-4 py-3 text-sm font-semibold md:px-6"
                  style={{ color: "white" }}
                >
                  {authUser ? "Signed In" : "Not Signed In"}
                </div>
              </div>
            </div>
          </div>

          {!loadingUser && !authUser && (
            <div
              className="rounded-2xl border p-6 text-center shadow-sm"
              style={{
                backgroundColor: "var(--color-pink)",
                borderColor: "var(--color-orange)",
              }}
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
                <div
                  className="rounded-2xl border p-6 shadow-sm"
                  style={{
                    backgroundColor: "white",
                    borderColor: "var(--color-green)",
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="text-sm font-semibold uppercase"
                      style={{ color: "var(--color-font)" }}
                    >
                      Total Coins
                    </span>
                    <span
                      className="text-3xl font-bold"
                      style={{ color: "var(--color-font)" }}
                    >
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
                          style={{
                            backgroundColor: "white",
                            borderColor: "var(--color-green)",
                          }}
                        >
                          <div>
                            <p
                              className="font-semibold capitalize"
                              style={{ color: "var(--color-font)" }}
                            >
                              {(tx.action || tx.type || "transaction").replace(
                                /_/g,
                                " "
                              )}
                            </p>
                            <p
                              className="text-xs"
                              style={{ color: "rgba(82, 99, 85, 0.7)" }}
                            >
                              {parseDateSafe(
                                tx.date || tx.createdAt
                              )?.toLocaleString() || "—"}
                            </p>
                          </div>
                          <span
                            className="font-bold"
                            style={{ color: "var(--color-font)" }}
                          >
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
                    style={{
                      backgroundColor: "white",
                      borderColor: "var(--color-green)",
                    }}
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
                                style={{
                                  backgroundColor: "white",
                                  borderColor: "var(--color-green)",
                                }}
                              >
                                <div>
                                  <p
                                    className="font-semibold capitalize"
                                    style={{ color: "var(--color-font)" }}
                                  >
                                    {tx.action.replace(/_/g, " ")}
                                    {tx.source ? ` · ${tx.source}` : ""}
                                  </p>
                                  <p
                                    className="text-xs"
                                    style={{ color: "rgba(82, 99, 85, 0.7)" }}
                                  >
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
                              style={{
                                backgroundColor: "var(--color-font)",
                                color: "white",
                              }}
                              onClick={() =>
                                setWalletPage((p) => Math.max(0, p - 1))
                              }
                              disabled={walletPage === 0}
                            >
                              Prev
                            </button>
                            <p
                              className="text-sm"
                              style={{ color: "rgba(82, 99, 85, 0.7)" }}
                            >
                              Page {walletPage + 1} of{" "}
                              {Math.max(
                                1,
                                Math.ceil(entries.length / PAGE_SIZE)
                              )}
                            </p>
                            <button
                              className="rounded-lg px-3 py-2 text-sm font-semibold hover:opacity-90 transition disabled:opacity-50"
                              style={{
                                backgroundColor: "var(--color-font)",
                                color: "white",
                              }}
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

              {/* Recent Orders */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-bold text-font">Recent Orders</h3>
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
                  <SkeletonCard />
                ) : userData?.userOrders?.length > 0 ? (
                  <div className="space-y-2">
                    {userData.userOrders.slice(0, 3).map((order, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-xl border px-4 py-3 cursor-pointer hover:shadow-md transition-all"
                        style={{
                          backgroundColor: "white",
                          borderColor: "var(--color-green)",
                        }}
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

              {/* Recent Events */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-bold text-font">Recent Events</h3>
                  {userData?.userEvents?.length > 0 && (
                    <button
                      onClick={() => router.push("/my-events")}
                      className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                    >
                      View All →
                    </button>
                  )}
                </div>
                {loadingData ? (
                  <SkeletonCard />
                ) : userData?.userEvents?.length > 0 ? (
                  <div className="space-y-2">
                    {userData.userEvents.slice(0, 3).map((event, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-xl border px-4 py-3 cursor-pointer hover:shadow-md transition-all"
                        style={{
                          backgroundColor: "white",
                          borderColor: "var(--color-green)",
                        }}
                        onClick={() => router.push("/my-events")}
                      >
                        <div>
                          <p className="font-semibold text-font">
                            {event.eventName || event.name || "Event"}
                          </p>
                          <p className="text-xs text-font/70">
                            {event.eventDate
                              ? new Date(event.eventDate).toLocaleDateString()
                              : "—"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-font">
                            {event.price > 0
                              ? `₹${event.price?.toFixed(2) || "0.00"}`
                              : "Free"}
                          </p>
                          <span
                            className={`text-xs font-semibold capitalize`}
                            style={{
                              color: event.attended
                                ? "var(--color-green)"
                                : "var(--color-orange)",
                            }}
                          >
                            {event.attended ? "✓ Attended" : "Registered"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="No events yet"
                    description="Browse and register for events to attend."
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
                      <p className="font-bold" style={{ color: "white" }}>
                        Community Member
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* Games Played History with Pagination */}
              <div
                className="rounded-2xl border p-5 shadow-sm"
                style={{
                  backgroundColor: "white",
                  borderColor: "var(--color-green)",
                }}
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
                        <div className="space-y-2">
                          {pageItems.map((g, idx) => (
                            <div
                              key={idx}
                              className="rounded-xl border px-4 py-3 cursor-pointer hover:opacity-90 transition"
                              style={{
                                backgroundColor: "white",
                                borderColor: "var(--color-green)",
                              }}
                              onClick={() => setSelectedGame(g)}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <p
                                      className="font-semibold truncate"
                                      style={{ color: "var(--color-font)" }}
                                    >
                                      {g.title}
                                    </p>
                                    {g.difficulty && (
                                      <Badge text={g.difficulty} tone="info" />
                                    )}
                                  </div>
                                  <p
                                    className="text-xs"
                                    style={{ color: "rgba(82, 99, 85, 0.7)" }}
                                  >
                                    {g.date?.toLocaleString() || "—"}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <span
                                    className="font-bold block"
                                    style={{ color: "var(--color-font)" }}
                                  >
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
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <button
                            className="rounded-lg px-3 py-2 text-sm font-semibold hover:opacity-90 transition disabled:opacity-50"
                            style={{
                              backgroundColor: "var(--color-font)",
                              color: "white",
                            }}
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
                            style={{
                              backgroundColor: "var(--color-font)",
                              color: "white",
                            }}
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

              {/* Cart */}
              <div
                className="rounded-2xl border p-5 shadow-sm"
                style={{
                  backgroundColor: "white",
                  borderColor: "var(--color-green)",
                }}
              >
                <h3 className="text-lg font-bold text-font mb-3">Cart</h3>
                {loadingData ? (
                  <SkeletonCard />
                ) : userData?.cart?.items?.length > 0 ? (
                  <div>
                    <p className="text-sm font-semibold text-font/70 mb-3">
                      {userData.cart.items.length} item(s) in cart
                    </p>
                    <button
                      className="w-full rounded-lg px-4 py-2 font-semibold hover:opacity-90 transition-opacity"
                      style={{
                        backgroundColor: "var(--color-font)",
                        color: "white",
                      }}
                    >
                      View Cart
                    </button>
                  </div>
                ) : (
                  <EmptyState
                    title="Cart is empty"
                    description="Add items from the shop."
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      {selectedGame && (
        <GameDetailModal
          game={selectedGame}
          onClose={() => setSelectedGame(null)}
        />
      )}
    </>
  );
}

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
          }`}
          style={{ backgroundColor: "white" }}
        />
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
      <p className="font-semibold" style={{ color: "var(--color-font)" }}>
        {title}
      </p>
      <p className="text-sm" style={{ color: "rgba(82, 99, 85, 0.7)" }}>
        {description}
      </p>
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
            style={{
              backgroundColor: "white",
              border: "1px solid var(--color-green)",
              color: "var(--color-font)",
            }}
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
              style={{
                backgroundColor: "white",
                borderColor: "var(--color-green)",
              }}
            >
              <p className="text-xs font-semibold text-font/70 uppercase">
                {f.label}
              </p>
              <p className="text-sm font-bold text-font">{String(f.value)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
