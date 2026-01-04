// /app/api/payments/create-order/route.js
import { NextResponse } from "next/server";

// Check if Razorpay is available
let Razorpay;
try {
  Razorpay = require("razorpay");
} catch (error) {
  console.warn("Razorpay package not installed. Using demo mode.");
}

// Initialize Razorpay only if package is available
const razorpay = Razorpay
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : null;

export async function POST(request) {
  try {
    const body = await request.json();
    const { amount, currency = "INR", eventId, seatIds, userId } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid amount" },
        { status: 400 }
      );
    }

    console.log("🔄 Creating order with:", {
      amount,
      currency,
      eventId,
      seatIds,
      userId,
    });

    // DEMO MODE: If Razorpay not configured, return demo order
    if (!razorpay) {
      console.log("⚠️ Using DEMO mode - Razorpay not configured");

      const demoOrderId = `demo_order_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      return NextResponse.json({
        success: true,
        id: demoOrderId,
        amount: Math.round(amount),
        currency,
        receipt: `receipt_${Date.now()}`,
        notes: {
          eventId,
          seats: seatIds?.join(",") || "",
          userId,
        },
        demo: true, // Flag to indicate demo mode
      });
    }

    // REAL MODE: Create actual Razorpay order
    try {
      const order = await razorpay.orders.create({
        amount: Math.round(amount), // in paise
        currency: currency,
        receipt: `receipt_${Date.now()}`,
        notes: {
          eventId,
          seatIds: seatIds?.join(",") || "",
          userId,
        },
        // Important callback URLs
        callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/verify`,
        callback_method: "get",
        redirect: true,
      });

      console.log("✅ Razorpay order created successfully:", {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
      });

      return NextResponse.json({
        success: true,
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        notes: order.notes,
      });
    } catch (razorpayError) {
      console.error("❌ Razorpay API error:", razorpayError);

      // Fallback to demo mode if Razorpay fails
      console.log("🔄 Falling back to demo mode due to Razorpay error");

      const demoOrderId = `fallback_order_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      return NextResponse.json({
        success: true,
        id: demoOrderId,
        amount: Math.round(amount),
        currency,
        receipt: `receipt_${Date.now()}`,
        notes: {
          eventId,
          seats: seatIds?.join(",") || "",
          userId,
        },
        demo: true,
        warning: "Razorpay failed, using demo order",
      });
    }
  } catch (error) {
    console.error("❌ Order creation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: "Check server logs for more information",
      },
      { status: 500 }
    );
  }
}
