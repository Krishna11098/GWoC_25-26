import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import admin from "firebase-admin";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      // Personal Info
      fullName,
      email,
      phone,
      companyName,
      designation,
      // Event Details
      category,
      eventTitle,
      eventDate,
      eventTime,
      eventDuration,
      venue,
      hasVenue,
      // Requirements
      eventType,
      audienceSize,
      budgetRange,
      preferredGames,
      themePreferences,
      // Additional Info
      specialRequirements,
      howHeard,
      comments,
    } = body;

    // Validate required fields
    if (!fullName || !email || !eventTitle) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Create submission document
    const submissionRef = await db.collection("contact_submissions").add({
      // Personal Info
      fullName,
      email,
      phone: phone || null,
      companyName: companyName || null,
      designation: designation || null,
      // Event Details
      category: category || null,
      eventTitle,
      eventDate: eventDate || null,
      eventTime: eventTime || null,
      eventDuration: eventDuration || null,
      venue: venue || null,
      hasVenue: hasVenue || null,
      // Requirements
      eventType: eventType || null,
      audienceSize: audienceSize || null,
      budgetRange: budgetRange || null,
      preferredGames: preferredGames || null,
      themePreferences: themePreferences || null,
      // Additional Info
      specialRequirements: specialRequirements || null,
      howHeard: howHeard || null,
      comments: comments || null,
      // Status fields
      status: "unseen",
      isRead: false,
      adminNotes: null,
      submittedAt: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      id: submissionRef.id,
      message: "Contact form submitted successfully",
    });
  } catch (error) {
    console.error("Error submitting query:", error);
    return NextResponse.json(
      { error: "Failed to submit query" },
      { status: 500 }
    );
  }
}
