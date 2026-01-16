"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { motion, useInView } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { auth } from "@/lib/firebaseClient";
import { userFetch } from "@/lib/userFetch";
import {
  Gamepad2,
  PartyPopper,
  BookOpen,
  Wallet,
  TrendingUp,
  TrendingDown,
  Clock,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Calendar,
  ShoppingBag,
  Trophy,
  Star,
  ArrowRight,
  X
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-50px" });
  const [authUser, setAuthUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [walletPage, setWalletPage] = useState(0);
  const [gamesPage, setGamesPage] = useState(0);
  const [selectedGame, setSelectedGame] = useState(null);
  const [activeTab, setActiveTab] = useState("wallet");
  const PAGE_SIZE = 10;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] },
    },
  };

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
      } catch (_) { }

      let gamesHistory = [];
      try {
        const gamesRes = await userFetch(`/api/user/games/history`);
        if (gamesRes.ok) gamesHistory = await gamesRes.json();
      } catch (_) { }

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
    if (!userData?.walletHistory && !userData?.wallet?.coinHistory && !userData?.wallet) {
      return { earned: 0, redeemed: 0 };
    }

    // First, try to use the coinsRedeemed field from wallet for accuracy
    let redeemed = userData?.wallet?.coinsRedeemed || 0;

    // Calculate earned from history
    const history = userData.walletHistory?.length
      ? userData.walletHistory
      : userData.wallet?.coinHistory || [];
    let earned = 0;

    // If coinsRedeemed is not set in wallet, calculate from history as fallback
    if (redeemed === 0 && history.length > 0) {
      history.forEach((tx) => {
        const amount = typeof tx.coins === "number" ? tx.coins : tx.amount ?? 0;
        const type = tx.action || tx.type || "";
        if (type === "earn" || amount > 0) {
          earned += Math.abs(amount);
        } else if (type === "redeem" || type === "redeemed" || type === "spend" || amount < 0) {
          redeemed += Math.abs(amount);
        }
      });
    } else {
      // Calculate earned from history
      history.forEach((tx) => {
        const amount = typeof tx.coins === "number" ? tx.coins : tx.amount ?? 0;
        const type = tx.action || tx.type || "";
        if (type === "earn" || amount > 0) {
          earned += Math.abs(amount);
        }
      });
    }

    return { earned, redeemed };
  }, [userData]);

  const handleGoToLogin = () => router.push("/login");

  return (
    <>
      <Navbar />
      <main
        ref={ref}
        className="min-h-screen px-4 py-10 md:px-8 pt-32 md:pt-40 relative overflow-hidden"
        style={{ backgroundColor: "var(--bg)" }}
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-20 right-1/4 w-[500px] h-[500px] rounded-full blur-3xl opacity-30"
            style={{ backgroundColor: "var(--light-orange)" }}
          />
          <div
            className="absolute bottom-40 left-1/4 w-[400px] h-[400px] rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: "var(--light-blue)" }}
          />
          <div
            className="absolute top-1/2 right-10 w-[300px] h-[300px] rounded-full blur-3xl opacity-25"
            style={{ backgroundColor: "var(--light-pink)" }}
          />
        </div>

        <motion.div
          className="mx-auto flex max-w-6xl flex-col gap-8 relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Hero Profile Card */}
          <motion.div
            variants={itemVariants}
            className="overflow-hidden rounded-3xl shadow-xl relative"
            style={{
              background: "linear-gradient(135deg, var(--dark-teal) 0%, #1a2f3d 100%)",
            }}
          >
            {/* Decorative shapes */}
            <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <circle cx="100" cy="100" r="80" fill="var(--light-orange)" />
              </svg>
            </div>
            <div className="absolute bottom-0 left-0 w-48 h-48 opacity-10">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <circle cx="100" cy="100" r="60" fill="var(--light-blue)" />
              </svg>
            </div>

            <div className="px-8 py-12 md:px-12 relative z-10">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-5 md:gap-8">
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    className="flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-2xl text-3xl md:text-4xl font-bold uppercase shadow-lg"
                    style={{
                      background: "linear-gradient(135deg, var(--light-orange) 0%, #e8854a 100%)",
                      color: "white",
                    }}
                  >
                    {avatarFallback}
                  </motion.div>
                  <div>
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2"
                      style={{
                        backgroundColor: "rgba(165, 197, 242, 0.2)",
                        color: "var(--light-blue)",
                      }}
                    >
                      <Sparkles className="w-3 h-3" />
                      Your Profile
                    </motion.span>
                    <h1
                      className="text-3xl md:text-4xl lg:text-5xl font-bold"
                      style={{ color: "white" }}
                    >
                      {authUser?.displayName || authUser?.email?.split('@')[0] || "Guest"}
                    </h1>
                    <p className="mt-1 text-base md:text-lg" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                      {authUser?.email || "Not signed in"}
                    </p>
                  </div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-3 rounded-2xl px-6 py-4 backdrop-blur-sm"
                  style={{
                    backgroundColor: authUser ? "rgba(165, 197, 242, 0.15)" : "rgba(252, 150, 92, 0.15)",
                    border: authUser ? "1px solid rgba(165, 197, 242, 0.3)" : "1px solid rgba(252, 150, 92, 0.3)"
                  }}
                >
                  <div
                    className="w-3 h-3 rounded-full animate-pulse"
                    style={{ backgroundColor: authUser ? "#4ade80" : "var(--light-orange)" }}
                  />
                  <span className="text-sm font-semibold" style={{ color: "white" }}>
                    {authUser ? "Online" : "Not Signed In"}
                  </span>
                </motion.div>
              </div>

              {/* Quick Stats Row */}
              {authUser && !loadingData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                  <QuickStat
                    icon={<Wallet className="w-5 h-5" />}
                    label="Total Coins"
                    value={userData?.wallet?.coins || 0}
                    color="var(--light-orange)"
                  />
                  <QuickStat
                    icon={<Gamepad2 className="w-5 h-5" />}
                    label="Games Played"
                    value={userData?.gamesHistory?.length || 0}
                    color="var(--light-blue)"
                  />
                  <QuickStat
                    icon={<PartyPopper className="w-5 h-5" />}
                    label="Events"
                    value={userData?.userEvents?.filter((e) => e.attended)?.length || 0}
                    color="var(--light-pink)"
                  />
                  <QuickStat
                    icon={<ShoppingBag className="w-5 h-5" />}
                    label="Orders"
                    value={userData?.userOrders?.length || 0}
                    color="var(--green)"
                  />
                </motion.div>
              )}
            </div>
          </motion.div>

          {!loadingUser && !authUser && (
            <motion.div
              variants={itemVariants}
              className="rounded-3xl p-8 text-center shadow-lg relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, var(--light-orange) 0%, #e8854a 100%)",
              }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="40" fill="white" />
                </svg>
              </div>
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-white opacity-80" />
              <p className="text-xl font-bold text-white mb-2">
                You&apos;re not signed in
              </p>
              <p className="text-white/80 mb-6">
                Log in to view your profile, track your games, and manage your wallet.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGoToLogin}
                className="inline-flex items-center gap-2 rounded-full px-8 py-3 font-semibold shadow-lg transition-all"
                style={{ backgroundColor: "var(--dark-teal)", color: "white" }}
              >
                Go to Login
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          )}

          {/* Tab Navigation */}
          {authUser && (
            <motion.div variants={itemVariants} className="flex gap-2 flex-wrap">
              {[
                { id: "wallet", label: "Wallet", icon: <Wallet className="w-4 h-4" /> },
                { id: "games", label: "Games", icon: <Gamepad2 className="w-4 h-4" /> },
                { id: "events", label: "Events", icon: <Calendar className="w-4 h-4" /> },
                { id: "orders", label: "Orders", icon: <ShoppingBag className="w-4 h-4" /> },
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-sm transition-all"
                  style={{
                    backgroundColor: activeTab === tab.id ? "var(--dark-teal)" : "white",
                    color: activeTab === tab.id ? "white" : "var(--dark-teal)",
                    boxShadow: activeTab === tab.id ? "0 4px 15px rgba(44, 66, 88, 0.3)" : "0 2px 8px rgba(0,0,0,0.08)",
                  }}
                >
                  {tab.icon}
                  {tab.label}
                </motion.button>
              ))}
            </motion.div>
          )}

          <div className="grid gap-8 md:grid-cols-3">
            {/* Wallet Section */}
            <div className="md:col-span-2 space-y-6">
              {(activeTab === "wallet" || !authUser) && (
                <motion.div
                  key="wallet-tab"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2" style={{ color: "var(--dark-teal)" }}>
                      <Wallet className="w-6 h-6" style={{ color: "var(--light-orange)" }} />
                      Wallet Overview
                    </h2>
                    {loadingData ? (
                      <SkeletonCard />
                    ) : (
                      <motion.div
                        whileHover={{ y: -2 }}
                        className="rounded-3xl p-6 shadow-lg relative overflow-hidden"
                        style={{
                          background: "linear-gradient(135deg, white 0%, #fafafa 100%)",
                          border: "1px solid rgba(203, 216, 172, 0.5)",
                        }}
                      >
                        {/* Decorative element */}
                        <div className="absolute top-0 right-0 w-40 h-40 opacity-10">
                          <svg viewBox="0 0 100 100" className="w-full h-full">
                            <circle cx="70" cy="30" r="50" fill="var(--light-orange)" />
                          </svg>
                        </div>

                        <div className="flex items-center justify-between mb-6 relative z-10">
                          <div className="flex items-center gap-3">
                            <div
                              className="p-3 rounded-2xl"
                              style={{ backgroundColor: "rgba(252, 150, 92, 0.15)" }}
                            >
                              <Wallet className="w-6 h-6" style={{ color: "var(--light-orange)" }} />
                            </div>
                            <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--dark-teal)" }}>
                              Available Balance
                            </span>
                          </div>
                          <motion.span
                            key={userData?.wallet?.coins}
                            initial={{ scale: 1.2, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-4xl md:text-5xl font-bold"
                            style={{ color: "var(--dark-teal)" }}
                          >
                            {userData?.wallet?.coins || 0}
                            <span className="text-lg ml-1 opacity-60">coins</span>
                          </motion.span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <StatCard
                            label="Total Earned"
                            value={walletStats.earned}
                            icon={<TrendingUp className="w-4 h-4" />}
                            color="var(--green)"
                            positive
                          />
                          <StatCard
                            label="Total Redeemed"
                            value={walletStats.redeemed}
                            icon={<TrendingDown className="w-4 h-4" />}
                            color="var(--light-orange)"
                          />
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => router.push("/spin-the-wheel")}
                          className="w-full mt-6 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white shadow-lg transition-all relative overflow-hidden group"
                          style={{
                            background: "linear-gradient(135deg, var(--light-orange) 0%, #e8854a 100%)",
                          }}
                        >
                          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                          <Sparkles className="w-5 h-5 animate-pulse" />
                          <span>Earn More Coins!</span>
                          <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full ml-1">Spin & Win</span>
                        </motion.button>
                      </motion.div>
                    )}
                  </div>

                  {/* Recent Transactions */}
                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: "var(--dark-teal)" }}>
                      <Clock className="w-5 h-5" style={{ color: "var(--light-blue)" }} />
                      Recent Transactions
                    </h3>
                    {loadingData ? (
                      <SkeletonCard />
                    ) : (userData?.walletHistory?.length ??
                      userData?.wallet?.coinHistory?.length ??
                      0) > 0 ? (
                      <div className="space-y-3">
                        {(userData.walletHistory?.length
                          ? userData.walletHistory
                          : userData.wallet?.coinHistory || []
                        )
                          .slice(0, 5)
                          .map((tx, idx) => (
                            <TransactionCard key={idx} tx={tx} parseDateSafe={parseDateSafe} />
                          ))}
                      </div>
                    ) : (
                      <EmptyState
                        icon={<Wallet className="w-10 h-10" />}
                        title="No transactions yet"
                        description="Play games and attend events to earn coins."
                      />
                    )}
                  </div>

                  {/* Wallet History with Pagination */}
                  <div>
                    <h3 className="text-xl font-bold mb-4" style={{ color: "var(--dark-teal)" }}>
                      Wallet History
                    </h3>
                    {loadingData ? (
                      <SkeletonCard />
                    ) : (userData?.walletHistory?.length ??
                      userData?.wallet?.coinHistory?.length ??
                      0) > 0 ? (
                      <div
                        className="rounded-3xl p-5 shadow-lg"
                        style={{
                          backgroundColor: "white",
                          border: "1px solid rgba(203, 216, 172, 0.5)",
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
                              <div className="space-y-3">
                                {pageItems.map((tx, idx) => (
                                  <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="flex items-center justify-between rounded-2xl px-4 py-3 transition-all hover:shadow-md"
                                    style={{
                                      backgroundColor: "rgba(251, 241, 225, 0.5)",
                                      border: "1px solid rgba(203, 216, 172, 0.3)",
                                    }}
                                  >
                                    <div className="flex items-center gap-3">
                                      <div
                                        className="p-2 rounded-xl"
                                        style={{
                                          backgroundColor: tx.amount >= 0
                                            ? "rgba(203, 216, 172, 0.3)"
                                            : "rgba(252, 150, 92, 0.2)"
                                        }}
                                      >
                                        {tx.amount >= 0 ? (
                                          <TrendingUp className="w-4 h-4" style={{ color: "var(--dark-teal)" }} />
                                        ) : (
                                          <TrendingDown className="w-4 h-4" style={{ color: "var(--light-orange)" }} />
                                        )}
                                      </div>
                                      <div>
                                        <p className="font-semibold capitalize" style={{ color: "var(--dark-teal)" }}>
                                          {tx.action.replace(/_/g, " ")}
                                          {tx.source ? ` · ${tx.source}` : ""}
                                        </p>
                                        <p className="text-xs" style={{ color: "var(--font)" }}>
                                          {tx.date?.toLocaleString() || "—"}
                                        </p>
                                      </div>
                                    </div>
                                    <span
                                      className="font-bold text-lg"
                                      style={{
                                        color: tx.amount >= 0 ? "var(--dark-teal)" : "var(--light-orange)",
                                      }}
                                    >
                                      {tx.amount > 0 ? `+${tx.amount}` : `${tx.amount}`}
                                    </span>
                                  </motion.div>
                                ))}
                              </div>
                              <div className="flex items-center justify-between mt-6 pt-4 border-t" style={{ borderColor: "rgba(203, 216, 172, 0.3)" }}>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition disabled:opacity-40"
                                  style={{
                                    backgroundColor: "var(--dark-teal)",
                                    color: "white",
                                  }}
                                  onClick={() => setWalletPage((p) => Math.max(0, p - 1))}
                                  disabled={walletPage === 0}
                                >
                                  <ChevronLeft className="w-4 h-4" />
                                  Previous
                                </motion.button>
                                <p className="text-sm font-medium" style={{ color: "var(--font)" }}>
                                  Page {walletPage + 1} of {Math.max(1, Math.ceil(entries.length / PAGE_SIZE))}
                                </p>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition disabled:opacity-40"
                                  style={{
                                    backgroundColor: "var(--dark-teal)",
                                    color: "white",
                                  }}
                                  onClick={() =>
                                    setWalletPage((p) =>
                                      p + 1 < Math.ceil(entries.length / PAGE_SIZE) ? p + 1 : p
                                    )
                                  }
                                  disabled={walletPage + 1 >= Math.ceil(entries.length / PAGE_SIZE)}
                                >
                                  Next
                                  <ChevronRight className="w-4 h-4" />
                                </motion.button>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    ) : (
                      <EmptyState
                        icon={<Clock className="w-10 h-10" />}
                        title="No wallet history"
                        description="No wallet changes recorded yet."
                      />
                    )}
                  </div>
                </motion.div>
              )}

              {/* Orders Tab Content */}
              {activeTab === "orders" && (
                <motion.div
                  key="orders-tab"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold flex items-center gap-2" style={{ color: "var(--dark-teal)" }}>
                      <ShoppingBag className="w-5 h-5" style={{ color: "var(--light-orange)" }} />
                      Your Orders
                    </h3>
                    {userData?.userOrders?.length > 0 && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => router.push("/my-orders")}
                        className="flex items-center gap-1 text-sm font-semibold px-4 py-2 rounded-full transition-all"
                        style={{
                          backgroundColor: "rgba(252, 150, 92, 0.15)",
                          color: "var(--dark-teal)"
                        }}
                      >
                        View All
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    )}
                  </div>
                  {loadingData ? (
                    <SkeletonCard />
                  ) : userData?.userOrders?.length > 0 ? (
                    <div className="space-y-3">
                      {userData.userOrders.slice(0, 5).map((order, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          whileHover={{ scale: 1.01, y: -2 }}
                          className="flex items-center justify-between rounded-2xl px-5 py-4 cursor-pointer shadow-sm hover:shadow-lg transition-all"
                          style={{
                            backgroundColor: "white",
                            border: "1px solid rgba(203, 216, 172, 0.5)",
                          }}
                          onClick={() => router.push("/my-orders")}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className="p-3 rounded-xl"
                              style={{ backgroundColor: "rgba(252, 150, 92, 0.15)" }}
                            >
                              <ShoppingBag className="w-5 h-5" style={{ color: "var(--light-orange)" }} />
                            </div>
                            <div>
                              <p className="font-semibold" style={{ color: "var(--dark-teal)" }}>
                                Order #{order.orderId?.substring(0, 8)}...
                              </p>
                              <p className="text-xs" style={{ color: "var(--font)" }}>
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg" style={{ color: "var(--dark-teal)" }}>
                              ₹{order.finalAmount?.toFixed(2) || "0.00"}
                            </p>
                            <span
                              className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full"
                              style={{
                                backgroundColor: "rgba(203, 216, 172, 0.3)",
                                color: "var(--dark-teal)",
                              }}
                            >
                              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--green)" }} />
                              Completed
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      icon={<ShoppingBag className="w-10 h-10" />}
                      title="No orders yet"
                      description="Visit the shop to place your first order."
                    />
                  )}
                </motion.div>
              )}

              {/* Events Tab Content */}
              {activeTab === "events" && (
                <motion.div
                  key="events-tab"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold flex items-center gap-2" style={{ color: "var(--dark-teal)" }}>
                      <Calendar className="w-5 h-5" style={{ color: "var(--light-blue)" }} />
                      Your Events
                    </h3>
                    {userData?.userEvents?.length > 0 && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        onClick={() => router.push("/my-events")}
                        className="flex items-center gap-1 text-sm font-semibold px-4 py-2 rounded-full transition-all"
                        style={{
                          backgroundColor: "rgba(165, 197, 242, 0.2)",
                          color: "var(--dark-teal)"
                        }}
                      >
                        View All
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    )}
                  </div>
                  {loadingData ? (
                    <SkeletonCard />
                  ) : userData?.userEvents?.length > 0 ? (
                    <div className="space-y-3">
                      {userData.userEvents.slice(0, 5).map((event, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          whileHover={{ scale: 1.01, y: -2 }}
                          className="flex items-center justify-between rounded-2xl px-5 py-4 cursor-pointer shadow-sm hover:shadow-lg transition-all"
                          style={{
                            backgroundColor: "white",
                            border: "1px solid rgba(165, 197, 242, 0.5)",
                          }}
                          onClick={() => router.push("/my-events")}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className="p-3 rounded-xl"
                              style={{ backgroundColor: "rgba(165, 197, 242, 0.2)" }}
                            >
                              <PartyPopper className="w-5 h-5" style={{ color: "var(--dark-teal)" }} />
                            </div>
                            <div>
                              <p className="font-semibold" style={{ color: "var(--dark-teal)" }}>
                                {event.eventName || event.name || "Event"}
                              </p>
                              <p className="text-xs" style={{ color: "var(--font)" }}>
                                {event.eventDate
                                  ? new Date(event.eventDate).toLocaleDateString()
                                  : "—"}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg" style={{ color: "var(--dark-teal)" }}>
                              {event.price > 0 ? `₹${event.price?.toFixed(2) || "0.00"}` : "Free"}
                            </p>
                            <span
                              className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full"
                              style={{
                                backgroundColor: event.attended
                                  ? "rgba(203, 216, 172, 0.3)"
                                  : "rgba(252, 150, 92, 0.2)",
                                color: "var(--dark-teal)",
                              }}
                            >
                              <span
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: event.attended ? "var(--green)" : "var(--light-orange)" }}
                              />
                              {event.attended ? "Attended" : "Registered"}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      icon={<Calendar className="w-10 h-10" />}
                      title="No events yet"
                      description="Browse and register for events to attend."
                    />
                  )}
                </motion.div>
              )}

              {/* Games Tab Content */}
              {activeTab === "games" && (
                <motion.div
                  key="games-tab"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: "var(--dark-teal)" }}>
                    <Gamepad2 className="w-5 h-5" style={{ color: "var(--light-pink)" }} />
                    Games History
                  </h3>
                  {loadingData ? (
                    <SkeletonCard />
                  ) : (userData?.gamesHistory?.length ?? 0) > 0 ? (
                    <div
                      className="rounded-3xl p-5 shadow-lg"
                      style={{
                        backgroundColor: "white",
                        border: "1px solid rgba(243, 204, 231, 0.5)",
                      }}
                    >
                      {(() => {
                        const entries = (userData.gamesHistory || []).map((g) => ({
                          raw: g,
                          title: g.gameName || g.title || "Game",
                          difficulty: g.difficulty || null,
                          completed: !!g.isCompleted,
                          coins: g.coinsEarned ?? 0,
                          hintsUsed: g.hintsUsed ?? 0,
                          attempts: g.attempts ?? 0,
                          date: parseDateSafe(g.finishedAt || g.createdAt || g.startedAt),
                          startedAt: parseDateSafe(g.startedAt),
                          finishedAt: parseDateSafe(g.finishedAt),
                        }));
                        const start = gamesPage * PAGE_SIZE;
                        const pageItems = entries.slice(start, start + PAGE_SIZE);
                        return (
                          <>
                            <div className="space-y-3">
                              {pageItems.map((g, idx) => (
                                <motion.div
                                  key={idx}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: idx * 0.05 }}
                                  whileHover={{ scale: 1.01, y: -2 }}
                                  className="rounded-2xl px-5 py-4 cursor-pointer transition-all hover:shadow-md"
                                  style={{
                                    backgroundColor: "rgba(251, 241, 225, 0.5)",
                                    border: "1px solid rgba(243, 204, 231, 0.4)",
                                  }}
                                  onClick={() => setSelectedGame(g)}
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-4">
                                      <div
                                        className="p-3 rounded-xl"
                                        style={{ backgroundColor: "rgba(243, 204, 231, 0.3)" }}
                                      >
                                        <Gamepad2 className="w-5 h-5" style={{ color: "var(--dark-teal)" }} />
                                      </div>
                                      <div className="min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <p className="font-semibold" style={{ color: "var(--dark-teal)" }}>
                                            {g.title}
                                          </p>
                                          {g.difficulty && <Badge text={g.difficulty} tone="info" />}
                                        </div>
                                        <p className="text-xs mt-1" style={{ color: "var(--font)" }}>
                                          {g.date?.toLocaleString() || "—"}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <span className="font-bold text-lg block" style={{ color: "var(--dark-teal)" }}>
                                        {g.coins > 0 ? `+${g.coins}` : `${g.coins}`}
                                      </span>
                                      <Badge
                                        text={g.completed ? "Completed" : "Ended"}
                                        tone={g.completed ? "success" : "warning"}
                                      />
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                            <div className="flex items-center justify-between mt-6 pt-4 border-t" style={{ borderColor: "rgba(243, 204, 231, 0.3)" }}>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition disabled:opacity-40"
                                style={{
                                  backgroundColor: "var(--dark-teal)",
                                  color: "white",
                                }}
                                onClick={() => setGamesPage((p) => Math.max(0, p - 1))}
                                disabled={gamesPage === 0}
                              >
                                <ChevronLeft className="w-4 h-4" />
                                Previous
                              </motion.button>
                              <p className="text-sm font-medium" style={{ color: "var(--font)" }}>
                                Page {gamesPage + 1} of {Math.max(1, Math.ceil(entries.length / PAGE_SIZE))}
                              </p>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition disabled:opacity-40"
                                style={{
                                  backgroundColor: "var(--dark-teal)",
                                  color: "white",
                                }}
                                onClick={() =>
                                  setGamesPage((p) =>
                                    p + 1 < Math.ceil(entries.length / PAGE_SIZE) ? p + 1 : p
                                  )
                                }
                                disabled={gamesPage + 1 >= Math.ceil(entries.length / PAGE_SIZE)}
                              >
                                Next
                                <ChevronRight className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  ) : (
                    <EmptyState
                      icon={<Gamepad2 className="w-10 h-10" />}
                      title="No games played yet"
                      description="Play a game to see it here."
                    />
                  )}
                </motion.div>
              )}
            </div>

            {/* Activity Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="space-y-5"
            >
              <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: "var(--dark-teal)" }}>
                <Trophy className="w-5 h-5" style={{ color: "var(--light-orange)" }} />
                Activity Summary
              </h2>
              {loadingData ? (
                <SkeletonCard />
              ) : (
                <>
                  <ActivityCard
                    icon={<Gamepad2 className="w-6 h-6" />}
                    label="Games Played"
                    value={userData?.gamesHistory?.length || 0}
                    bgColor="rgba(243, 204, 231, 0.3)"
                    iconColor="var(--dark-teal)"
                  />
                  <ActivityCard
                    icon={<PartyPopper className="w-6 h-6" />}
                    label="Events Attended"
                    value={userData?.userEvents?.filter((e) => e.attended)?.length || 0}
                    bgColor="rgba(165, 197, 242, 0.3)"
                    iconColor="var(--dark-teal)"
                  />
                  <ActivityCard
                    icon={<BookOpen className="w-6 h-6" />}
                    label="Workshops"
                    value={userData?.userWorkshops?.length || 0}
                    bgColor="rgba(203, 216, 172, 0.3)"
                    iconColor="var(--dark-teal)"
                  />
                  {userData?.isCommunityMember && (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="rounded-2xl p-5 text-center relative overflow-hidden"
                      style={{
                        background: "linear-gradient(135deg, var(--dark-teal) 0%, #1a2f3d 100%)",
                      }}
                    >
                      <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          <circle cx="70" cy="30" r="40" fill="var(--light-orange)" />
                        </svg>
                      </div>
                      <Star className="w-10 h-10 mx-auto mb-2" style={{ color: "var(--light-orange)" }} />
                      <p className="font-bold text-lg" style={{ color: "white" }}>
                        Community Member
                      </p>
                      <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.7)" }}>
                        You&apos;re part of the JoyJuncture family!
                      </p>
                    </motion.div>
                  )}
                </>
              )}

              {/* Quick Actions */}
              <div
                className="rounded-2xl p-5 mt-6"
                style={{
                  backgroundColor: "white",
                  border: "1px solid rgba(203, 216, 172, 0.5)",
                }}
              >
                <h3 className="font-bold mb-4" style={{ color: "var(--dark-teal)" }}>
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push("/games")}
                    className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all"
                    style={{
                      backgroundColor: "rgba(243, 204, 231, 0.2)",
                      border: "1px solid rgba(243, 204, 231, 0.4)",
                    }}
                  >
                    <Gamepad2 className="w-5 h-5" style={{ color: "var(--dark-teal)" }} />
                    <span className="font-semibold text-sm" style={{ color: "var(--dark-teal)" }}>
                      Play Games
                    </span>
                    <ArrowRight className="w-4 h-4 ml-auto" style={{ color: "var(--font)" }} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push("/events")}
                    className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all"
                    style={{
                      backgroundColor: "rgba(165, 197, 242, 0.2)",
                      border: "1px solid rgba(165, 197, 242, 0.4)",
                    }}
                  >
                    <Calendar className="w-5 h-5" style={{ color: "var(--dark-teal)" }} />
                    <span className="font-semibold text-sm" style={{ color: "var(--dark-teal)" }}>
                      Browse Events
                    </span>
                    <ArrowRight className="w-4 h-4 ml-auto" style={{ color: "var(--font)" }} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push("/shop")}
                    className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all"
                    style={{
                      backgroundColor: "rgba(252, 150, 92, 0.15)",
                      border: "1px solid rgba(252, 150, 92, 0.3)",
                    }}
                  >
                    <ShoppingBag className="w-5 h-5" style={{ color: "var(--dark-teal)" }} />
                    <span className="font-semibold text-sm" style={{ color: "var(--dark-teal)" }}>
                      Visit Shop
                    </span>
                    <ArrowRight className="w-4 h-4 ml-auto" style={{ color: "var(--font)" }} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
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
        <p className="font-semibold" style={{ color: "var(--dark-teal)" }}>{label}</p>
        <p className="text-sm" style={{ color: "var(--font)" }}>{description}</p>
      </div>
      <button
        type="button"
        onClick={onChange}
        className="relative h-7 w-12 rounded-full transition-colors duration-200"
        style={{
          backgroundColor: enabled ? "var(--dark-teal)" : "#e5e7eb",
        }}
        aria-pressed={enabled}
        aria-label={label}
      >
        <span
          className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full shadow transition-transform duration-200 ${enabled ? "translate-x-6" : "translate-x-1"
            }`}
          style={{ backgroundColor: "white" }}
        />
      </button>
    </div>
  );
}

function QuickStat({ icon, label, value, color }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="rounded-xl px-4 py-3 backdrop-blur-sm"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        border: "1px solid rgba(255, 255, 255, 0.15)"
      }}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}30` }}>
          <div style={{ color }}>{icon}</div>
        </div>
        <div>
          <p className="text-2xl font-bold" style={{ color: "white" }}>{value}</p>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>{label}</p>
        </div>
      </div>
    </motion.div>
  );
}

function TransactionCard({ tx, parseDateSafe }) {
  const amount = typeof tx.coins === "number" ? tx.coins : tx.amount ?? 0;
  const isPositive = amount > 0;

  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -2 }}
      className="flex items-center justify-between rounded-2xl px-5 py-4 shadow-sm transition-all hover:shadow-md"
      style={{
        backgroundColor: "white",
        border: "1px solid rgba(203, 216, 172, 0.5)",
      }}
    >
      <div className="flex items-center gap-4">
        <div
          className="p-3 rounded-xl"
          style={{
            backgroundColor: isPositive
              ? "rgba(203, 216, 172, 0.3)"
              : "rgba(252, 150, 92, 0.2)"
          }}
        >
          {isPositive ? (
            <TrendingUp className="w-5 h-5" style={{ color: "var(--dark-teal)" }} />
          ) : (
            <TrendingDown className="w-5 h-5" style={{ color: "var(--light-orange)" }} />
          )}
        </div>
        <div>
          <p className="font-semibold capitalize" style={{ color: "var(--dark-teal)" }}>
            {(tx.action || tx.type || "transaction").replace(/_/g, " ")}
          </p>
          <p className="text-xs" style={{ color: "var(--font)" }}>
            {parseDateSafe(tx.date || tx.createdAt)?.toLocaleString() || "—"}
          </p>
        </div>
      </div>
      <span
        className="font-bold text-lg"
        style={{ color: isPositive ? "var(--dark-teal)" : "var(--light-orange)" }}
      >
        {amount > 0 ? `+${amount}` : `${amount}`}
      </span>
    </motion.div>
  );
}

function EmptyState({ icon, title, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-8 text-center relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(251, 241, 225, 0.8) 0%, rgba(203, 216, 172, 0.2) 100%)",
        border: "2px dashed rgba(203, 216, 172, 0.5)",
      }}
    >
      <div
        className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
        style={{ backgroundColor: "rgba(203, 216, 172, 0.3)" }}
      >
        <div style={{ color: "var(--font)" }}>{icon}</div>
      </div>
      <p className="font-bold text-lg" style={{ color: "var(--dark-teal)" }}>
        {title}
      </p>
      <p className="text-sm mt-1" style={{ color: "var(--font)" }}>
        {description}
      </p>
    </motion.div>
  );
}

function StatCard({ label, value, icon, color, positive }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="rounded-2xl px-5 py-4 shadow-sm"
      style={{
        backgroundColor: "rgba(251, 241, 225, 0.5)",
        border: `1px solid ${color}50`,
      }}
    >
      <div className="flex items-center gap-3 mb-2">
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: `${color}30` }}
        >
          <div style={{ color: "var(--dark-teal)" }}>{icon}</div>
        </div>
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--font)" }}>
          {label}
        </p>
      </div>
      <p className="text-2xl font-bold" style={{ color: "var(--dark-teal)" }}>
        {positive && value > 0 ? "+" : ""}{value}
      </p>
    </motion.div>
  );
}

function ActivityCard({ icon, label, value, bgColor, iconColor }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className="rounded-2xl p-5 shadow-sm transition-all"
      style={{
        backgroundColor: "white",
        border: "1px solid rgba(203, 216, 172, 0.5)",
      }}
    >
      <div className="flex items-center gap-4">
        <div
          className="p-3 rounded-xl"
          style={{ backgroundColor: bgColor }}
        >
          <div style={{ color: iconColor }}>{icon}</div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--font)" }}>
            {label}
          </p>
          <p className="text-2xl font-bold" style={{ color: "var(--dark-teal)" }}>{value}</p>
        </div>
      </div>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div
      className="rounded-2xl p-5 shadow-sm animate-pulse"
      style={{
        backgroundColor: "white",
        border: "1px solid rgba(203, 216, 172, 0.5)",
      }}
    >
      <div
        className="h-8 rounded-xl w-1/3 mb-3"
        style={{ backgroundColor: "rgba(203, 216, 172, 0.4)" }}
      />
      <div
        className="h-4 rounded-lg w-full mb-2"
        style={{ backgroundColor: "rgba(203, 216, 172, 0.3)" }}
      />
      <div
        className="h-4 rounded-lg w-2/3"
        style={{ backgroundColor: "rgba(203, 216, 172, 0.2)" }}
      />
    </div>
  );
}

function Badge({ text, tone = "info" }) {
  const colors = {
    info: {
      bg: "rgba(165, 197, 242, 0.2)",
      border: "rgba(165, 197, 242, 0.4)",
      text: "var(--dark-teal)",
    },
    success: {
      bg: "rgba(203, 216, 172, 0.3)",
      border: "rgba(203, 216, 172, 0.5)",
      text: "var(--dark-teal)",
    },
    warning: {
      bg: "rgba(252, 150, 92, 0.2)",
      border: "rgba(252, 150, 92, 0.4)",
      text: "var(--dark-teal)",
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
    { label: "Game", value: game.title, icon: <Gamepad2 className="w-4 h-4" /> },
    { label: "Difficulty", value: game.difficulty || "—", icon: <Trophy className="w-4 h-4" /> },
    { label: "Hints Used", value: game.hintsUsed ?? 0, icon: <Sparkles className="w-4 h-4" /> },
    { label: "Attempts", value: game.attempts ?? 0, icon: <TrendingUp className="w-4 h-4" /> },
    { label: "Coins Earned", value: game.coins ?? 0, icon: <Wallet className="w-4 h-4" /> },
    { label: "Started", value: game.startedAt?.toLocaleString() || "—", icon: <Clock className="w-4 h-4" /> },
    { label: "Finished", value: game.finishedAt?.toLocaleString() || (game.completed ? "—" : "Ended"), icon: <Clock className="w-4 h-4" /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(1, 18, 28, 0.7)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="w-full max-w-lg rounded-3xl p-6 shadow-2xl relative overflow-hidden"
        style={{
          backgroundColor: "white",
          border: "1px solid rgba(203, 216, 172, 0.5)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative element */}
        <div className="absolute top-0 right-0 w-40 h-40 opacity-10">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="70" cy="30" r="50" fill="var(--light-pink)" />
          </svg>
        </div>

        <div className="flex items-start justify-between mb-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div
                className="p-2 rounded-xl"
                style={{ backgroundColor: "rgba(243, 204, 231, 0.3)" }}
              >
                <Gamepad2 className="w-5 h-5" style={{ color: "var(--dark-teal)" }} />
              </div>
              <h4 className="text-2xl font-bold" style={{ color: "var(--dark-teal)" }}>
                Game Details
              </h4>
            </div>
            <div className="flex items-center gap-2 mt-2">
              {game.difficulty && <Badge text={game.difficulty} tone="info" />}
              <Badge
                text={game.completed ? "Completed" : "Ended"}
                tone={game.completed ? "success" : "warning"}
              />
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full transition-all"
            style={{
              backgroundColor: "rgba(203, 216, 172, 0.3)",
            }}
            onClick={onClose}
          >
            <X className="w-5 h-5" style={{ color: "var(--dark-teal)" }} />
          </motion.button>
        </div>

        <div className="grid grid-cols-2 gap-3 relative z-10">
          {fields.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl px-4 py-3"
              style={{
                backgroundColor: "rgba(251, 241, 225, 0.5)",
                border: "1px solid rgba(203, 216, 172, 0.3)",
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <div style={{ color: "var(--font)" }}>{f.icon}</div>
                <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--font)" }}>
                  {f.label}
                </p>
              </div>
              <p className="text-sm font-bold" style={{ color: "var(--dark-teal)" }}>
                {String(f.value)}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-6 py-3 rounded-full font-semibold text-white transition-all"
          style={{ backgroundColor: "var(--dark-teal)" }}
          onClick={onClose}
        >
          Close
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
