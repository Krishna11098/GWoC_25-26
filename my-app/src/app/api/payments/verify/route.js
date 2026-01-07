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
  getDoc,
  arrayUnion,
  Timestamp,
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
      coinsUsed = 0,
      userEmail,
      userName,
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

    // Get event document to fetch coins per seat
    const eventRef = doc(db, "events", eventId);
    const eventDoc = await getDoc(eventRef);
    
    let coinsEarned = 0;
    let eventData = {};
    if (eventDoc.exists()) {
      eventData = eventDoc.data();
      const coinsPerSeat = eventData.coinsPerSeat || eventData.coinsReward || 0;
      coinsEarned = coinsPerSeat * seatsCount;
      console.log(`Event ${eventId} offers ${coinsPerSeat} coins per seat, total: ${coinsEarned} coins for ${seatsCount} seats`);
    } else {
      console.warn(`Event ${eventId} not found, no coins will be earned`);
    }

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
      amount: amount / 100, // Convert paise to rupees
      coinsUsed,
      coinsEarned,
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

    // Get user details for bookedUsers entry
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.exists() ? userDoc.data() : { name: "Unknown" };
    const username = userData.name || userData.displayName || userName || "Unknown User";

    // Update event booked seats count AND add to bookedUsers array
    await updateDoc(eventRef, {
      bookedSeats: increment(seatsCount),
      bookedUsers: arrayUnion({
        userId,
        username,
        seatsBooked: seatsCount,
        paymentDate: Timestamp.now(),
        amount: amount / 100,
        bookingId,
      }),
      updatedAt: serverTimestamp(),
    });

    // Update user's userEvents and wallet (userRef already defined above)
    
    // Create user event entry
    const userEventEntry = {
      eventId,
      eventType: "event_booking",
      registeredAt: new Date().toISOString(),
      attended: false,
      coinsEarned,
      seatsBooked: seatsCount,
      amountPaid: amount / 100,
      coinsUsed,
      bookingId,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      timestamp: Date.now(),
    };

    // Prepare wallet updates
    const walletUpdates = [];
    
    // If coins were used, deduct them
    if (coinsUsed > 0) {
      walletUpdates.push({
        action: "REDEEMED",
        coins: -coinsUsed,
        type: "spend",
        description: `Used ${coinsUsed} coins for event booking`,
        eventId,
        bookingId,
        createdAt: new Date().toISOString(),
        timestamp: Date.now(),
      });
    }

    // Add earned coins
    if (coinsEarned > 0) {
      walletUpdates.push({
        action: "EVENT_ATTENDED",
        coins: coinsEarned,
        type: "earn",
        description: `Earned ${coinsEarned} coins from event booking`,
        eventId,
        bookingId,
        createdAt: new Date().toISOString(),
        timestamp: Date.now(),
      });
    }

    // Calculate coins change
    const coinsChange = coinsEarned - coinsUsed;

    if (userDoc.exists()) {
      // Update existing user
      const userUpdateData = {
        userEvents: arrayUnion(userEventEntry),
        updatedAt: serverTimestamp(),
      };

      // Update coins balance in wallet structure
      if (coinsChange !== 0) {
        userUpdateData['wallet.coins'] = increment(coinsChange);
      }

      // Add wallet history entries
      if (walletUpdates.length > 0) {
        userUpdateData['wallet.coinHistory'] = arrayUnion(...walletUpdates);
      }

      await updateDoc(userRef, userUpdateData);
    }

    console.log("✅ Payment verified and booking created:", bookingId);
    console.log(`   - Coins used: ${coinsUsed}`);
    console.log(`   - Coins earned: ${coinsEarned}`);

    return NextResponse.json({
      success: true,
      bookingId,
      bookingRef: bookingDoc.id,
      coinsEarned,
      coinsUsed,
      eventData: {
        title: eventData.title || "Event",
        description: eventData.description || "",
        location: eventData.location || "Online",
        startTime: eventData.startTime || eventData.dateTime,
        endTime: eventData.endTime,
        organizerEmail: eventData.organizerEmail,
      },
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
