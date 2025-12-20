// app/api/events/route.js
import { NextResponse } from "next/server";

// In-memory storage (for development only - will reset on server restart)
let events = [];

export async function POST(request) {
  try {
    console.log("📥 API: Received POST request to /api/events");

    // Parse the request body
    const eventData = await request.json();
    console.log("📦 Event data received:", eventData);

    // Validate required fields
    if (!eventData.title || !eventData.title.trim()) {
      console.log("❌ Validation failed: Missing title");
      return NextResponse.json(
        {
          error: "Title is required",
          receivedData: eventData,
        },
        { status: 400 }
      );
    }

    if (!eventData.date) {
      console.log("❌ Validation failed: Missing date");
      return NextResponse.json(
        {
          error: "Date is required",
          receivedData: eventData,
        },
        { status: 400 }
      );
    }

    if (!eventData.location || !eventData.location.trim()) {
      console.log("❌ Validation failed: Missing location");
      return NextResponse.json(
        {
          error: "Location is required",
          receivedData: eventData,
        },
        { status: 400 }
      );
    }

    // Create new event with ID
    const newEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...eventData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to events array
    events.push(newEvent);

    console.log("✅ Event created successfully:", newEvent);
    console.log("📊 Total events in memory:", events.length);

    return NextResponse.json(
      {
        success: true,
        message: "Event created successfully",
        event: newEvent,
        totalEvents: events.length,
      },
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("❌ Error in POST /api/events:", error);

    // Check if it's a JSON parsing error
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          error: "Invalid JSON data received",
          details: error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to create event",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    console.log("📥 API: Received GET request to /api/events");

    // Optional: Add query parameters for filtering
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const upcoming = searchParams.get("upcoming");

    let filteredEvents = [...events];

    // Filter by category if provided
    if (category) {
      filteredEvents = filteredEvents.filter(
        (event) => event.category === category
      );
    }

    // Filter upcoming events if requested
    if (upcoming === "true") {
      const now = new Date();
      filteredEvents = filteredEvents.filter(
        (event) => new Date(event.date) > now
      );
    }

    console.log(`📊 Returning ${filteredEvents.length} events`);

    return NextResponse.json(
      {
        success: true,
        events: filteredEvents,
        total: filteredEvents.length,
        totalAll: events.length,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("❌ Error in GET /api/events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    console.log("📥 API: Received DELETE request to /api/events");

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Event ID is required for deletion" },
        { status: 400 }
      );
    }

    const initialLength = events.length;
    events = events.filter((event) => event.id !== id);
    const deleted = initialLength !== events.length;

    if (deleted) {
      console.log(`✅ Event ${id} deleted successfully`);
      return NextResponse.json({
        success: true,
        message: "Event deleted successfully",
        deletedId: id,
      });
    } else {
      console.log(`⚠️ Event ${id} not found`);
      return NextResponse.json(
        {
          success: false,
          message: "Event not found",
          id: id,
        },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("❌ Error in DELETE /api/events:", error);
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}
    