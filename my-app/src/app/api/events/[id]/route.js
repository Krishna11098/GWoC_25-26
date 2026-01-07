import { NextResponse } from "next/server";
import EventService from "@/app/lib/eventService";

/**
 * GET /api/events/[id]
 * Fetch a specific event by ID with all bookings
 */
export async function GET(req, { params }) {
  try {
    // In Next.js 13+, params might be a promise
    const resolvedParams = await Promise.resolve(params);
    const eventId = resolvedParams.id;

    if (!eventId) {
      return NextResponse.json(
        { success: false, error: "Event ID is required" },
        { status: 400 }
      );
    }

    console.log(`Fetching event: ${eventId}`);
    const event = await EventService.getEventById(eventId);

    return NextResponse.json(
      {
        success: true,
        event,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error fetching event:`, error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch event",
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/events/[id]
 * Update an event
 */
export async function PUT(req, { params }) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const eventId = resolvedParams.id;
    const body = await req.json();

    if (!eventId) {
      return NextResponse.json(
        { success: false, error: "Event ID is required" },
        { status: 400 }
      );
    }

    console.log(`Updating event: ${eventId}`, body);
    await EventService.updateEvent(eventId, body);

    return NextResponse.json(
      {
        success: true,
        message: "Event updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error updating event:`, error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to update event",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/events/[id]
 * Delete an event
 */
export async function DELETE(req, { params }) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const eventId = resolvedParams.id;

    if (!eventId) {
      return NextResponse.json(
        { success: false, error: "Event ID is required" },
        { status: 400 }
      );
    }

    console.log(`Deleting event: ${eventId}`);
    await EventService.deleteEvent(eventId);

    return NextResponse.json(
      {
        success: true,
        message: "Event deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error deleting event:`, error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to delete event",
      },
      { status: 500 }
    );
  }
}
