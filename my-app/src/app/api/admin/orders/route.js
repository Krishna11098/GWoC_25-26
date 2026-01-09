import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { getUserFromRequest } from "@/lib/authMiddleware";

/**
 * GET /api/admin/orders
 * Fetches all orders from all users
 */
export async function GET(req) {
  const user = await getUserFromRequest(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if user is admin
  if (user.role !== "admin") {
    return NextResponse.json(
      { error: "Forbidden - Admin access required" },
      { status: 403 }
    );
  }

  try {
    // Fetch all users
    const usersSnapshot = await db.collection("users").get();
    const allOrders = [];

    // Iterate through all users and collect their orders
    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      const username = userData.username || userData.email || "Unknown";

      // Get orders for this user
      if (userData.userOrders && Array.isArray(userData.userOrders)) {
        userData.userOrders.forEach((order, orderIndex) => {
          // Parse order date with proper handling
          let orderDate = new Date().toISOString();

          if (order.createdAt) {
            if (typeof order.createdAt.toDate === "function") {
              // Firestore Timestamp
              orderDate = order.createdAt.toDate().toISOString();
            } else if (order.createdAt instanceof Date) {
              orderDate = order.createdAt.toISOString();
            } else if (typeof order.createdAt === "string") {
              orderDate = order.createdAt;
            } else if (typeof order.createdAt === "number") {
              orderDate = new Date(order.createdAt).toISOString();
            }
          }

          // Generate unique orderId: use bookingId, id, or combination of userId and index
          const orderId =
            order.bookingId || order.id || `${userDoc.id}-order-${orderIndex}`;

          allOrders.push({
            orderId: orderId,
            userId: userDoc.id,
            username: username,
            email: userData.email || "No email",
            orderDate: orderDate,
            price: order.totalPrice || order.price || 0,
            itemCount: order.items?.length || 1,
            items: order.items || [],
            status: order.status || "completed",
            paymentMethod: order.paymentMethod || "unknown",
          });
        });
      }
    }

    // Sort by order date (newest first)
    allOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

    return NextResponse.json({
      success: true,
      total: allOrders.length,
      orders: allOrders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders", details: error.message },
      { status: 500 }
    );
  }
}
