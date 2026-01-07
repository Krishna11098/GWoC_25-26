import { NextResponse } from "next/server";
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
      eventId,
      seatIds,
      userId,
      amount = 0,
      paymentMethod = "free",
      seatsCount = 1,
    } = body;

    if (!eventId || !userId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
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
      amount,
      paymentMethod,
      status: "confirmed",
      paymentStatus: amount > 0 ? "paid" : "free",
      bookedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    };

    // Save booking to Firestore
    const bookingsRef = collection(db, "bookings");
    const bookingDoc = await addDoc(bookingsRef, bookingData);

    // Get user details for the event record
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.exists() ? userSnap.data() : { name: "Unknown" };
    const username = userData.name || userData.displayName || "Unknown User";

    // Get event details to calculate coin rewards
    const eventRef = doc(db, "events", eventId);
    const eventSnap = await getDoc(eventRef);
    
    if (!eventSnap.exists()) {
      throw new Error("Event not found");
    }
    
    const eventData = eventSnap.data();
    const coinsPerSeat = eventData.coinsPerSeat || 0;
    const coinsReward = coinsPerSeat * seatsCount;

    // Update event: booked seats count AND add to bookedUsers array
    await updateDoc(eventRef, {
      bookedSeats: increment(seatsCount),
      bookedUsers: arrayUnion({
        userId,
        username,
        seatsBooked: seatsCount,
        paymentDate: Timestamp.now(),
        amount: amount,
        bookingId: bookingId,
      }),
      updatedAt: serverTimestamp(),
    });

    // Add coin reward to user wallet
    if (coinsReward > 0) {
      const coinHistory = {
        action: "event_attended", // or "event_booked" depending on your preference
        coins: coinsReward,
        referenceId: bookingId,
        eventId: eventId,
        eventName: eventData.name || eventData.title || "Unknown Event",
        date: Timestamp.now(),
      };

      await updateDoc(userRef, {
        "wallet.coins": increment(coinsReward),
        "wallet.coinHistory": arrayUnion(coinHistory),
        updatedAt: serverTimestamp(),
      });

      console.log(
        `✅ Added ${coinsReward} coins to user ${userId} for booking ${bookingId}`
      );
    }

    console.log("✅ Booking created:", bookingId);

    return NextResponse.json({
      success: true,
      bookingId,
      bookingRef: bookingDoc.id,
      message: "Booking confirmed successfully",
      booking: bookingData,
      coinsRewarded: coinsReward,
    });
  } catch (error) {
    console.error("Create booking error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
