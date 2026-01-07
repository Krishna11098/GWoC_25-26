import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

/**
 * GET /api/events/[id]/bookings
 * Fetch all bookings for a specific event from bookedUsers array
 */
export async function GET(req, { params }) {
  try {
    // Properly handle async params in Next.js 13+
    const resolvedParams = await Promise.resolve(params);
    const eventId = resolvedParams.id;

    if (!eventId) {
      return NextResponse.json(
        { success: false, error: "Event ID is required" },
        { status: 400 }
      );
    }

    console.log(`Fetching bookings for event: ${eventId}`);

    // Get event document with bookedUsers
    const eventRef = doc(db, "events", eventId);
    const eventDoc = await getDoc(eventRef);

    if (!eventDoc.exists()) {
      return NextResponse.json(
        { success: false, error: "Event not found" },
        { status: 404 }
      );
    }

    const eventData = eventDoc.data();
    
    // Use bookedUsers array from event document
    const bookedUsers = eventData.bookedUsers || [];
    
    // Also support legacy bookings array for backward compatibility
    const legacyBookings = eventData.bookings || [];

    // Convert bookedUsers to booking format for display
    const bookings = bookedUsers.map((user, index) => {
      // Handle Firestore Timestamp objects
      let paymentDate = user.paymentDate;
      if (paymentDate && typeof paymentDate.toDate === "function") {
        paymentDate = paymentDate.toDate();
      } else if (paymentDate) {
        paymentDate = new Date(paymentDate);
      }

      return {
        id: index,
        bookingId: user.bookingId || `LEGACY-${index}`,
        userName: user.username || user.userId,
        userEmail: user.email || "N/A",
        userId: user.userId,
        seatsBooked: user.seatsBooked || 0,
        amountPaid: user.amount || 0,
        coinsUsed: user.coinsUsed || 0,
        bookedAt: paymentDate || new Date(),
        status: "confirmed",
      };
    });

    // Calculate statistics from bookedUsers
    const totalBookings = bookedUsers.length;
    const totalSeatsBooked = bookedUsers.reduce(
      (sum, user) => sum + (user.seatsBooked || 0),
      0
    );
    const totalAmountCollected = bookedUsers.reduce(
      (sum, user) => sum + (user.amount || 0),
      0
    );

    return NextResponse.json(
      {
        success: true,
        eventId,
        eventName: eventData.name || eventData.title,
        bookings,
        bookedUsers, // Include raw bookedUsers data as well
        statistics: {
          totalBookings,
          totalSeatsBooked,
          totalAmountCollected,
          averageSeatsPerBooking:
            totalBookings > 0 ? (totalSeatsBooked / totalBookings).toFixed(2) : 0,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error fetching bookings for event:`, error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch bookings",
      },
      { status: 500 }
    );
  }
}
