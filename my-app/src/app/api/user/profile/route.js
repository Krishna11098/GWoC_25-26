import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { getUserFromRequest } from "@/lib/authMiddleware";

/**
 * GET /api/user/profile
 */
export async function GET(req) {
  const user = await getUserFromRequest(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userRef = db.collection("users").doc(user.uid);
  const userSnap = await userRef.get();

  if (!userSnap.exists) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // 🔐 DO NOT expose sensitive fields blindly
  const data = userSnap.data();

  // Convert Firestore Timestamps to ISO strings for proper serialization
  const serializeOrders = (orders) => {
    return orders.map((order) => ({
      ...order,
      createdAt: order.createdAt?.toDate
        ? order.createdAt.toDate().toISOString()
        : order.createdAt instanceof Date
        ? order.createdAt.toISOString()
        : order.createdAt || new Date().toISOString(),
    }));
  };

  // Enrich userEvents with actual event data from Firestore
  const enrichedUserEvents = await Promise.all(
    (data.userEvents || []).map(async (userEvent) => {
      try {
        if (!userEvent.eventId) {
          return userEvent;
        }

        const eventRef = db.collection("events").doc(userEvent.eventId);
        const eventSnap = await eventRef.get();

        if (!eventSnap.exists) {
          console.warn(`Event ${userEvent.eventId} not found in Firestore`);
          return userEvent;
        }

        const eventData = eventSnap.data();

        // Convert Firestore Timestamp to ISO string for date field
        let dateValue = eventData.date;
        if (eventData.date && typeof eventData.date.toDate === "function") {
          dateValue = eventData.date.toDate().toISOString();
        } else if (eventData.date && eventData.date.seconds) {
          dateValue = new Date(eventData.date.seconds * 1000).toISOString();
        } else if (typeof eventData.date === "string") {
          dateValue = eventData.date;
        }

        // Parse event date and determine if attended based on date comparison
        let eventDateParsed = null;
        try {
          if (typeof dateValue === "string") {
            eventDateParsed = new Date(dateValue);
          } else if (dateValue instanceof Date) {
            eventDateParsed = dateValue;
          }
        } catch (e) {
          console.error(
            `Error parsing date for event ${userEvent.eventId}:`,
            e
          );
        }

        // Determine if event should be marked as attended based on date logic
        const now = new Date();
        const isEventPassed =
          eventDateParsed && eventDateParsed < now ? true : false;
        const attendedStatus =
          userEvent.attended !== undefined ? userEvent.attended : isEventPassed;

        console.log(`Event ${userEvent.eventId}:`, {
          eventDate: dateValue,
          parsedDate: eventDateParsed,
          isEventPassed,
          attendedStatus,
        });

        // Merge event details with user event entry
        return {
          ...userEvent,
          attended: attendedStatus,
          // Event details with properly serialized dates
          title: eventData.title || eventData.name || "Event",
          name: eventData.name || eventData.title || "Event",
          eventName:
            eventData.eventName || eventData.name || eventData.title || "Event",
          description: eventData.description || eventData.desc,
          price: eventData.price || eventData.pricePerSeat || 0,
          pricePerSeat: eventData.pricePerSeat || eventData.price || 0,
          date: dateValue,
          eventDate: dateValue,
          location: eventData.location || eventData.venue,
          venue: eventData.venue || eventData.location,
          duration: eventData.duration,
          capacity: eventData.capacity || eventData.totalSeats,
          totalSeats: eventData.totalSeats || eventData.capacity,
          organizer: eventData.organizer,
          speaker: eventData.speaker,
          category: eventData.category || eventData.type,
          certification: eventData.certification,
          image: eventData.image || eventData.imageUrl,
        };
      } catch (error) {
        console.error(`Error enriching event ${userEvent.eventId}:`, error);
        return userEvent;
      }
    })
  );

  return NextResponse.json({
    uid: user.uid,
    username: data.username ?? null,
    role: data.role,
    wallet: data.wallet,
    onlineGamesPlayed: data.onlineGamesPlayed ?? 0,
    userOrders: serializeOrders(data.userOrders ?? []),
    userEvents: enrichedUserEvents,
    userWorkshops: data.userWorkshops ?? [],
    cart: data.cart ?? { items: [] },
    isCommunityMember: data.isCommunityMember ?? false,
    updatedAt: data.updatedAt,
  });
}
