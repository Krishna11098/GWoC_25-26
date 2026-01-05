"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { auth } from "@/lib/firebaseClient";
import { userFetch } from "@/lib/userFetch";

export default function MyOrdersPage() {
  const router = useRouter();
  const [authUser, setAuthUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        router.push("/login");
        return;
      }
      setAuthUser(firebaseUser);
      fetchOrders();
    });

    return () => unsubscribe();
  }, [router]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await userFetch(`/api/user/profile`);
      const data = await res.json();
      setOrders(data.userOrders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateValue) => {
    try {
      if (!dateValue) return "N/A";
      let date;
      if (typeof dateValue === "string") {
        date = new Date(dateValue);
      } else if (typeof dateValue === "number") {
        date = new Date(dateValue);
      } else if (dateValue instanceof Date) {
        date = dateValue;
      } else if (dateValue.seconds) {
        date = new Date(dateValue.seconds * 1000);
      } else {
        return "N/A";
      }
      return date.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (_) {
      return "N/A";
    }
  };

  if (!authUser) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-32 pb-12 px-4 md:px-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="text-blue-600 hover:text-blue-800 font-medium mb-4 flex items-center gap-2"
            >
              ← Back
            </button>
            <h1 className="text-4xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-600 mt-2">
              Track and manage all your purchases
            </p>
          </div>

          {/* Orders List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 mt-4">Loading your orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No orders yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start shopping to place your first order!
              </p>
              <button
                onClick={() => router.push("/games")}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-transparent">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Order ID</p>
                        <p className="text-lg font-bold text-gray-900 font-mono">
                          {order.orderId?.substring(0, 12) || "N/A"}...
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 mb-1">Order Date</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 mb-1">Status</p>
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                          ✓ Completed
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6 border-b border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-4">
                      Items Ordered
                    </h4>
                    <div className="space-y-3">
                      {order.items && order.items.length > 0 ? (
                        order.items.map((item, itemIdx) => (
                          <div
                            key={itemIdx}
                            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                          >
                            <div>
                              <p className="font-medium text-gray-900">
                                {item.title || item.name || "Product"}
                              </p>
                              <p className="text-sm text-gray-600">
                                Qty: {item.quantity}
                              </p>
                            </div>
                            <p className="font-semibold text-gray-900">
                              ₹{(item.price * (item.quantity || 1)).toFixed(2)}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-600">No items in order</p>
                      )}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">
                      Order Summary
                    </h4>
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>₹{order.subtotal?.toFixed(2) || "0.00"}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Shipping</span>
                        <span>
                          {order.shipping === 0 ? "FREE" : `₹${order.shipping?.toFixed(2) || "0.00"}`}
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Tax (GST)</span>
                        <span>₹{order.tax?.toFixed(2) || "0.00"}</span>
                      </div>

                      {order.coinsUsed > 0 && (
                        <div className="flex justify-between text-green-600 font-medium">
                          <span>💰 Coins Used</span>
                          <span>-₹{order.coinsUsed?.toFixed(2) || "0.00"}</span>
                        </div>
                      )}

                      <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-900">
                        <span>Total Amount Paid</span>
                        <span>₹{order.finalAmount?.toFixed(2) || "0.00"}</span>
                      </div>
                    </div>

                    {/* Cashback Info */}
                    {order.coinsEarned > 0 && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm font-semibold text-green-800">
                          🎁 Earned {order.coinsEarned} coins as cashback!
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Payment Details */}
                  <div className="p-6 bg-gray-50 border-t border-gray-200 text-sm">
                    <p className="text-gray-600">
                      <span className="font-semibold">Payment ID:</span>{" "}
                      <span className="font-mono text-xs">
                        {order.paymentId?.substring(0, 20) || "N/A"}...
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
