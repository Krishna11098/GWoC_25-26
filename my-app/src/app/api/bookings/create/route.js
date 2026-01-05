import { NextResponse } from "next/server";
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

    // Update event booked seats count
    const eventRef = doc(db, "events", eventId);
    await updateDoc(eventRef, {
      bookedSeats: increment(seatsCount),
      updatedAt: serverTimestamp(),
    });

    console.log("✅ Booking created:", bookingId);

    return NextResponse.json({
      success: true,
      bookingId,
      bookingRef: bookingDoc.id,
      message: "Booking confirmed successfully",
      booking: bookingData,
    });
  } catch (error) {
    console.error("Create booking error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
