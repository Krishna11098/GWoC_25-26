"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { auth } from "@/lib/firebaseClient";

export default function ProfilePage() {
  const router = useRouter();
  const [authUser, setAuthUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setAuthUser(firebaseUser);
      setLoadingUser(false);

      if (firebaseUser) {
        fetchUserData(firebaseUser.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (uid) => {
    try {
      setLoadingData(true);
      const response = await fetch(`/api/user/${uid}`);
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      }
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

  const handleGoToLogin = () => router.push("/login");

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 py-10 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-8">
          {/* Hero */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 px-6 py-10 text-white md:px-10">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4 md:gap-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-2xl font-bold uppercase">
                    {avatarFallback}
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.15em] text-white/80">
                      Profile
                    </p>
                    <h1 className="text-3xl font-bold md:text-4xl">
                      {authUser?.displayName || authUser?.email || "Guest"}
                    </h1>
                    <p className="text-white/80">
                      {authUser?.email || "Not signed in"}
                    </p>
                  </div>
                </div>
                <div className="rounded-2xl bg-white/15 px-4 py-3 text-sm font-semibold text-white md:px-6">
                  {authUser ? "Signed In" : "Not Signed In"}
                </div>
              </div>
            </div>
          </div>

          {!loadingUser && !authUser && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
              <p className="text-lg font-semibold text-slate-900">
                You are not signed in.
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Log in to view your profile and activity.
              </p>
              <button
                onClick={handleGoToLogin}
                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white font-semibold shadow-sm hover:bg-blue-700 transition-colors"
              >
                Go to Login
              </button>
            </div>
          )}

          <div className="grid gap-8 md:grid-cols-3">
            {/* Wallet Section */}
            <div className="md:col-span-2 space-y-4">
              <h2 className="text-xl font-bold text-slate-900">Wallet</h2>
              {loadingData ? (
                <SkeletonCard />
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold uppercase text-slate-600">
                      Total Coins
                    </span>
                    <span className="text-3xl font-bold text-indigo-600">
                      {userData?.wallet?.coins || 0}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <StatCard
                      label="Redeemed"
                      value={userData?.wallet?.coinsRedeemed || 0}
                    />
                    <StatCard
                      label="Games Played"
                      value={userData?.onlineGamesPlayed || 0}
                    />
                  </div>
                </div>
              )}

              {/* Coin History */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  Recent Transactions
                </h3>
                {loadingData ? (
                  <SkeletonCard />
                ) : userData?.wallet?.coinHistory?.length > 0 ? (
                  <div className="space-y-2">
                    {userData.wallet.coinHistory.slice(0, 5).map((tx, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3"
                      >
                        <div>
                          <p className="font-semibold text-slate-900 capitalize">
                            {tx.action?.replace(/_/g, " ")}
                          </p>
                          <p className="text-xs text-slate-500">
                            {new Date(tx.date).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="font-bold text-indigo-600">
                          +{tx.coins}
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

              {/* Recent Orders */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  Recent Orders
                </h3>
                {loadingData ? (
                  <SkeletonCard />
                ) : userData?.userOrders?.length > 0 ? (
                  <div className="space-y-2">
                    {userData.userOrders.slice(0, 3).map((order, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3"
                      >
                        <div>
                          <p className="font-semibold text-slate-900">
                            Order {order.orderId}
                          </p>
                          <p className="text-xs text-slate-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-900">
                            ${order.totalAmount}
                          </p>
                          <span
                            className={`text-xs font-semibold capitalize ${
                              order.paymentStatus === "paid"
                                ? "text-emerald-600"
                                : "text-amber-600"
                            }`}
                          >
                            {order.paymentStatus}
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
              <h2 className="text-lg font-bold text-slate-900">Activity</h2>
              {loadingData ? (
                <SkeletonCard />
              ) : (
                <>
                  <ActivityCard
                    icon="🎮"
                    label="Games Played"
                    value={userData?.onlineGamesPlayed || 0}
                  />
                  <ActivityCard
                    icon="🎉"
                    label="Events Attended"
                    value={
                      userData?.userEvents?.filter((e) => e.attended)?.length ||
                      0
                    }
                  />
                  <ActivityCard
                    icon="📚"
                    label="Workshops"
                    value={userData?.userWorkshops?.length || 0}
                  />
                  {userData?.isCommunityMember && (
                    <div className="rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 border border-purple-200 p-4 text-center">
                      <p className="text-2xl mb-1">🏆</p>
                      <p className="font-bold text-slate-900">
                        Community Member
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* Cart */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-3">Cart</h3>
                {loadingData ? (
                  <SkeletonCard />
                ) : userData?.cart?.items?.length > 0 ? (
                  <div>
                    <p className="text-sm font-semibold text-slate-600 mb-3">
                      {userData.cart.items.length} item(s) in cart
                    </p>
                    <button className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700 transition-colors">
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
    </>
  );
}

function ToggleRow({ label, description, enabled, onChange }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="font-semibold text-slate-900">{label}</p>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
      <button
        type="button"
        onClick={onChange}
        className={`relative h-7 w-12 rounded-full transition-colors duration-200 ${
          enabled ? "bg-blue-600" : "bg-slate-300"
        }`}
        aria-pressed={enabled}
        aria-label={label}
      >
        <span
          className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-white shadow transition-transform duration-200 ${
            enabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

function EmptyState({ title, description }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center">
      <p className="font-semibold text-slate-900">{title}</p>
      <p className="text-sm text-slate-600">{description}</p>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function ActivityCard({ icon, label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase">
            {label}
          </p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-100 p-4 shadow-sm animate-pulse">
      <div className="h-8 bg-slate-300 rounded w-1/3 mb-2"></div>
      <div className="h-4 bg-slate-300 rounded w-full"></div>
    </div>
  );
}
