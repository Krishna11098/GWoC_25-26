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
