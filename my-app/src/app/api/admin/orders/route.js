import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { getUserFromRequest } from "@/lib/authMiddleware";

/**
 * GET /api/admin/orders
 * Fetches all orders from the orders collection
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
    // Fetch all orders from the orders collection
    const ordersSnapshot = await db.collection("orders").get();
    const allOrders = [];

    // Process each order document
    for (const orderDoc of ordersSnapshot.docs) {
      const orderData = orderDoc.data();
      
      // Parse order date with proper handling
      let orderDate = new Date().toISOString();

      if (orderData.createdAt) {
        if (typeof orderData.createdAt.toDate === "function") {
          // Firestore Timestamp
          orderDate = orderData.createdAt.toDate().toISOString();
        } else if (orderData.createdAt instanceof Date) {
          orderDate = orderData.createdAt.toISOString();
        } else if (typeof orderData.createdAt === "string") {
          orderDate = orderData.createdAt;
        } else if (typeof orderData.createdAt === "number") {
          orderDate = new Date(orderData.createdAt).toISOString();
        }
      }

      allOrders.push({
        id: orderDoc.id,
        orderId: orderData.orderId || orderDoc.id,
        paymentId: orderData.paymentId || "",
        userId: orderData.userId || "",
        userEmail: orderData.userEmail || "No email",
        username: orderData.username || orderData.userEmail?.split("@")[0] || "Unknown",
        orderDate: orderDate,
        items: orderData.items || [],
        itemCount: orderData.items?.length || 0,
        subtotal: orderData.subtotal || 0,
        shipping: orderData.shipping || 0,
        tax: orderData.tax || 0,
        coinsUsed: orderData.coinsUsed || 0,
        discount: orderData.discount || 0,
        finalAmount: orderData.finalAmount || 0,
        coinsEarned: orderData.coinsEarned || 0,
        status: orderData.status || "completed",
      });
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
