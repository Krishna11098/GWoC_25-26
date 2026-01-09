import { NextResponse } from "next/server";
import { db, admin } from "@/lib/firebaseAdmin";

// POST /api/contact-submissions - store contact/experience inquiry details
export async function POST(request) {
  try {
    const body = await request.json();

    const {
      fullName,
      email,
      phone = "",
      companyName = "",
      designation = "",
      category = "",
      eventTitle = "",
      eventDate = "",
      eventTime = "",
      eventDuration = "",
      venue = "",
      eventType = "",
      audienceSize = "",
      budgetRange = "",
      specialRequirements = "",
      preferredGames = "",
      themePreferences = "",
      hasVenue = "no",
      howHeard = "",
      comments = "",
    } = body || {};

    if (!fullName || !email) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const payload = {
      fullName,
      email,
      phone,
      companyName,
      designation,
      category,
      eventTitle,
      eventDate,
      eventTime,
      eventDuration,
      venue,
      eventType,
      audienceSize,
      budgetRange,
      specialRequirements,
      preferredGames,
      themePreferences,
      hasVenue,
      howHeard,
      comments,
      status: "pending",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const ref = await db.collection("contact_submissions").add(payload);

    return NextResponse.json({ success: true, id: ref.id });
  } catch (error) {
    console.error("Error saving contact submission:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to save contact submission" },
      { status: 500 }
    );
  }
}
