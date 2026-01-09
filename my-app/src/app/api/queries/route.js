import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import admin from "firebase-admin";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, phone, category, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message || !category) {
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

    // Create query document
    const queryRef = await db.collection("queries").add({
      name,
      email,
      phone: phone || null,
      category,
      subject,
      message,
      status: "pending",
      isRead: false,
      adminNotes: null,
      submittedAt: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log("✅ Query submitted:", {
      id: queryRef.id,
      name,
      email,
      category,
      subject,
    });

    return NextResponse.json({
      success: true,
      id: queryRef.id,
      message: "Query submitted successfully",
    });
  } catch (error) {
    console.error("Error submitting query:", error);
    return NextResponse.json(
      { error: "Failed to submit query" },
      { status: 500 }
    );
  }
}
