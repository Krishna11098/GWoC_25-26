import { NextResponse } from "next/server";
import EventService from "@/app/lib/eventService";

export async function GET(req) {
  try {
    console.log("GET /api/events - Fetching all events");

    const events = await EventService.getAllEvents();

    return NextResponse.json(
      {
        success: true,
        events: events || [],
        count: events.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in GET /api/events:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch events",
      },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    console.log("POST /api/events - Creating new event");

    const eventData = await req.json();

    console.log("Event data received:", eventData);

    // Validate required fields
    if (!eventData.name && !eventData.title) {
      return NextResponse.json(
        {
          success: false,
          error: "Event name is required",
        },
        { status: 400 }
      );
    }

    if (!eventData.date) {
      return NextResponse.json(
        {
          success: false,
          error: "Event date is required",
        },
        { status: 400 }
      );
    }

    if (!eventData.venue) {
      return NextResponse.json(
        {
          success: false,
          error: "Event venue is required",
        },
        { status: 400 }
      );
    }

    // Normalize field names (admin uses 'name', service uses 'title')
    const normalizedData = {
      ...eventData,
      title: eventData.title || eventData.name,
    };

    // Create event using EventService
    const eventId = await EventService.createEvent(normalizedData);

    return NextResponse.json(
      {
        success: true,
        message: "Event created successfully",
        eventId: eventId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/events:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create event",
      },
      { status: 500 }
    );
  }
}
