import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    const bookingsRef = collection(db, "bookings");
    let q = query(bookingsRef, where("userId", "==", userId));

    if (eventId) {
      q = query(
        bookingsRef,
        where("userId", "==", userId),
        where("eventId", "==", eventId)
      );
    }

    const snapshot = await getDocs(q);
    const bookings = [];

    snapshot.forEach((doc) => {
      bookings.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return NextResponse.json({
      success: true,
      bookings,
      count: bookings.length,
    });
  } catch (error) {
    console.error("Get bookings error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
