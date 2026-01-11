import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/firebaseAdmin";

export async function POST(request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData,
      userId,
    } = await request.json();

    // Verify signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // Payment is verified, process the order
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = userDoc.data();
    const currentCoins = userData.wallet?.coins || 0;
    const coinsUsed = orderData.coinsUsed || 0;
    const amountPaid = orderData.finalAmount;
    
    // Validate stock availability before processing order
    for (const item of orderData.items) {
      const productRef = db.collection("products").doc(item.id);
      const productDoc = await productRef.get();
      
      if (!productDoc.exists) {
        return NextResponse.json(
          { error: `Product ${item.title || item.id} not found` },
          { status: 400 }
        );
      }
      
      const productData = productDoc.data();
      const availableStock = productData.stockAvailable || 0;
      const requestedQuantity = item.quantity || 1;
      
      if (requestedQuantity > availableStock) {
        return NextResponse.json(
          { error: `Insufficient stock for ${item.title}. Only ${availableStock} units available.` },
          { status: 400 }
        );
      }
    }
    
    // Calculate 10% cashback
    const coinsEarned = Math.floor(amountPaid * 0.1);

    // Calculate new coin balance
    const newCoins = currentCoins - coinsUsed + coinsEarned;

    // Prepare order object
    const order = {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      userId: userId,
      userEmail: userData.email || "",
      items: orderData.items,
      subtotal: orderData.subtotal,
      shipping: orderData.shipping,
      tax: orderData.tax,
      coinsUsed: coinsUsed,
      discount: coinsUsed, // 1 coin = 1 Rs
      finalAmount: amountPaid,
      coinsEarned: coinsEarned,
      status: "completed",
      createdAt: new Date(),
    };

    // Create order document in orders collection
    await db.collection("orders").add(order);

    // Reduce product quantities
    for (const item of orderData.items) {
      const productRef = db.collection("products").doc(item.id);
      const productDoc = await productRef.get();
      
      if (productDoc.exists) {
        const productData = productDoc.data();
        const currentStock = productData.stockAvailable || 0;
        const newStock = Math.max(0, currentStock - (item.quantity || 1));
        
        await productRef.update({
          stockAvailable: newStock,
          updatedAt: new Date(),
        });
      }
    }

    // Update user document
    const updates = {
      "wallet.coins": newCoins,
      userOrders: [...(userData.userOrders || []), order],
      "cart.items": [], // Clear cart
      updatedAt: new Date(),
    };

    // Track redeemed coins if any were used
    if (coinsUsed > 0) {
      const currentRedeemed = userData.wallet?.coinsRedeemed || 0;
      updates["wallet.coinsRedeemed"] = currentRedeemed + coinsUsed;
    }

    await userRef.update(updates);

    // Add wallet history entries
    const walletHistoryRef = userRef.collection("walletHistory");

    // Deduct coins used
    if (coinsUsed > 0) {
      await walletHistoryRef.add({
        type: "debit",
        amount: coinsUsed,
        reason: "Used for order discount",
        orderId: razorpay_order_id,
        createdAt: new Date(),
      });
    }

    // Credit cashback coins
    if (coinsEarned > 0) {
      await walletHistoryRef.add({
        type: "credit",
        amount: coinsEarned,
        reason: "10% cashback on order",
        orderId: razorpay_order_id,
        createdAt: new Date(),
      });
    }

    return NextResponse.json({
      success: true,
      order,
      newCoins,
      coinsEarned,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}
