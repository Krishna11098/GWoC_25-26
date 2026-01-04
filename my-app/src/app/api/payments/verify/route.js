import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  increment,
  serverTimestamp,
} from "firebase/firestore";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      eventId,
      seatIds,
      userId,
      amount,
      seatsCount = 1,
    } = body;

    // VERIFY THE SIGNATURE (SECURITY CRITICAL!)
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.error("❌ Invalid payment signature!");
      return NextResponse.json(
        {
          success: false,
          error: "Invalid payment signature",
        },
        { status: 400 }
      );
    }

    console.log("✅ Payment signature verified");

    // Generate booking ID
    const bookingId = `BOOK-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 6)
      .toUpperCase()}`;

    // Create booking data
    const bookingData = {
      bookingId,
      eventId,
      userId,
      seatIds:
        seatIds ||
        Array.from({ length: seatsCount }, (_, i) => `seat-${i + 1}`),
      seatsCount,
      amount: amount || 0,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      status: "confirmed",
      paymentStatus: "paid",
      paymentMethod: "razorpay",
      bookedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      timestamp: Date.now(),
    };

    // Save booking to Firestore
    const bookingsRef = collection(db, "bookings");
    const bookingDoc = await addDoc(bookingsRef, bookingData);

    // Update event booked seats count
    const eventRef = doc(db, "events", eventId);
    await updateDoc(eventRef, {
      bookedSeats: increment(seatsCount),
      updatedAt: serverTimestamp(),
    });

    console.log("✅ Payment verified and booking created:", bookingId);

    return NextResponse.json({
      success: true,
      bookingId,
      bookingRef: bookingDoc.id,
      message: "Payment verified and booking confirmed",
      booking: bookingData,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
