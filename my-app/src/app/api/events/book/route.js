import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  doc,
  updateDoc,
  arrayUnion,
  increment,
  serverTimestamp,
  getDoc,
  setDoc,
} from "firebase/firestore";

/**
 * API endpoint to book an event
 * POST /api/events/book
 * 
 * Request body:
 * - userId: string (required)
 * - eventId: string (required)
 * - seatsCount: number (required)
 * - amount: number (required) - total amount to pay
 * - coinsUsed: number (optional) - coins used for payment
 * - paymentId: string (optional) - Razorpay payment ID
 * - orderId: string (optional) - Razorpay order ID
 * - signature: string (optional) - Razorpay signature
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      userId,
      eventId,
      seatsCount = 1,
      amount,
      coinsUsed = 0,
      paymentId,
      orderId,
      signature,
      userEmail,
      userName,
    } = body;

    // Validate required fields
    if (!userId || !eventId || seatsCount < 1) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get user document
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      // Create user if doesn't exist
      await setDoc(userRef, {
        userId,
        email: userEmail || "",
        displayName: userName || "",
        coins: 0,
        walletHistory: [],
        userEvents: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    const userData = userDoc.exists() ? userDoc.data() : { wallet: { coins: 0 } };
    const currentCoins = userData.wallet?.coins || userData.coins || 0;

    // Validate coins if used
    if (coinsUsed > 0 && currentCoins < coinsUsed) {
      return NextResponse.json(
        {
          success: false,
          error: "Insufficient coins balance",
          currentCoins,
          requestedCoins: coinsUsed,
        },
        { status: 400 }
      );
    }

    // Get event document to fetch fixed coins reward
    const eventDocRef = doc(db, "events", eventId);
    const eventDoc = await getDoc(eventDocRef);
    
    let coinsEarned = 0;
    let eventData = {};
    if (eventDoc.exists()) {
      eventData = eventDoc.data();
      coinsEarned = eventData.coinsReward || 0;
      console.log(`Event ${eventId} offers ${coinsEarned} fixed coins`);
    } else {
      console.warn(`Event ${eventId} not found, no coins will be earned`);
    }

    // Generate booking ID
    const bookingId = `BOOK-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 6)
      .toUpperCase()}`;

    // Create user event entry
    const userEventEntry = {
      eventId,
      eventType: "event_booking",
      registeredAt: new Date().toISOString(),
      attended: false,
      coinsEarned,
      seatsBooked: seatsCount,
      amountPaid: amount,
      coinsUsed,
      bookingId,
      paymentId: paymentId || null,
      orderId: orderId || null,
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

    // Update user document
    const userUpdateData = {
      userEvents: arrayUnion(userEventEntry),
      updatedAt: serverTimestamp(),
    };

    // Update coins balance in wallet structure
    const coinsChange = coinsEarned - coinsUsed;
    if (coinsChange !== 0) {
      userUpdateData['wallet.coins'] = increment(coinsChange);
    }

    // Add wallet history entries
    if (walletUpdates.length > 0) {
      userUpdateData['wallet.coinHistory'] = arrayUnion(...walletUpdates);
    }

    await updateDoc(userRef, userUpdateData);

    // Update event document (increment booked seats)
    await updateDoc(eventDocRef, {
      bookedSeats: increment(seatsCount),
      updatedAt: serverTimestamp(),
    });

    console.log(`✅ Event booked successfully for user ${userId}`);
    console.log(`   - Booking ID: ${bookingId}`);
    console.log(`   - Seats: ${seatsCount}`);
    console.log(`   - Amount: ₹${amount}`);
    console.log(`   - Coins used: ${coinsUsed}`);
    console.log(`   - Coins earned: ${coinsEarned}`);
    console.log(`   - New coin balance: ${currentCoins + coinsChange}`);

    return NextResponse.json({
      success: true,
      bookingId,
      eventData: {
        title: eventData.title || "Event",
        description: eventData.description || "",
        location: eventData.location || "Online",
        startTime: eventData.startTime || eventData.dateTime,
        endTime: eventData.endTime,
        organizerEmail: eventData.organizerEmail,
      },
      message: "Event booked successfully",
      booking: {
        bookingId,
        eventId,
        userId,
        seatsCount,
        amount,
        coinsUsed,
        coinsEarned,
        newCoinsBalance: currentCoins + coinsChange,
      },
    });
  } catch (error) {
    console.error("Event booking error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to book event",
      },
      { status: 500 }
    );
  }
}
