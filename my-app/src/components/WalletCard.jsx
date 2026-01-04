"use client";

import { useState, useEffect } from "react";
import { formatCurrency } from "@/utils/razorpayUtils";

export default function WalletCard({ userId }) {
  const [wallet, setWallet] = useState({ coins: 0, walletHistory: [] });
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (userId && userId !== "guest") {
      loadWallet();
    } else {
      console.warn("Cannot load wallet - user is guest or userId is invalid:", userId);
      setLoading(false);
    }
  }, [userId]);

  const loadWallet = async () => {
    try {
      setLoading(true);
      
      if (!userId || userId === "guest") {
        console.warn("Skipping wallet load - invalid userId:", userId);
        setWallet({ coins: 0, walletHistory: [] });
        setLoading(false);
        return;
      }
      
      const response = await fetch(`/api/user/wallet?userId=${userId}`);
      const data = await response.json();
      console.log("Wallet API response:", data);

      if (data.success) {
        setWallet(data.wallet);
      }
    } catch (error) {
      console.error("Error loading wallet:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-12 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-xl shadow-lg overflow-hidden">
      {/* Wallet Balance */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-3xl">🪙</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Your Wallet</h3>
              <p className="text-sm text-gray-600">Available Balance</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-amber-600">
              {wallet.coins}
            </span>
            <span className="text-lg text-gray-600">coins</span>
            <span className="text-sm text-gray-500 ml-auto">
              ≈ {formatCurrency(wallet.coins)}
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowHistory(!showHistory)}
          className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {showHistory ? "Hide" : "View"} Transaction History
          <span className={`transform transition-transform ${showHistory ? "rotate-180" : ""}`}>
            ▼
          </span>
        </button>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="bg-green-100 rounded-lg p-3 text-center">
            <div className="text-green-700 font-bold text-lg">
              {wallet.walletHistory.filter((t) => t.type === "earn").length}
            </div>
            <div className="text-green-600">Earned</div>
          </div>
          <div className="bg-red-100 rounded-lg p-3 text-center">
            <div className="text-red-700 font-bold text-lg">
              {wallet.walletHistory.filter((t) => t.type === "spend").length}
            </div>
            <div className="text-red-600">Spent</div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      {showHistory && (
        <div className="border-t border-amber-200 bg-white">
          <div className="p-6">
            <h4 className="font-bold text-gray-800 mb-4">
              Transaction History
            </h4>

            {wallet.walletHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-4xl mb-2">📭</p>
                <p>No transactions yet</p>
                <p className="text-sm mt-1">
                  Book events to earn and use coins!
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {[...wallet.walletHistory]
                  .sort((a, b) => b.timestamp - a.timestamp)
                  .map((transaction, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === "earn"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {transaction.type === "earn" ? "+" : "-"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 truncate">
                          {transaction.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(transaction.createdAt)}
                        </p>
                      </div>
                      <div
                        className={`font-bold ${
                          transaction.type === "earn"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.type === "earn" ? "+" : ""}
                        {transaction.coins}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Info Footer */}
      <div className="bg-amber-100 p-4 border-t border-amber-200">
        <div className="text-xs text-amber-800 space-y-1">
          <p className="flex items-center gap-2">
            <span>💡</span>
            <span>1 coin = ₹1 for event bookings</span>
          </p>
          <p className="flex items-center gap-2">
            <span>🎁</span>
            <span>Earn 10% cashback on all payments</span>
          </p>
        </div>
      </div>
    </div>
  );
}
