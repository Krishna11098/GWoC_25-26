import { NextResponse } from "next/server";
import { db, admin } from "@/lib/firebaseAdmin";

// POST /api/queries - store a general query/contact message
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone = "", category = "general", subject, message } = body || {};

    // Validate required fields
    if (!name || !email || !subject || !message || !category) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    const payload = {
      name,
      email,
      phone: phone || null,
      category,
      subject,
      message,
      status: "pending",
      isRead: false,
      submittedAt: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const ref = await db.collection("queries").add(payload);

    return NextResponse.json({ success: true, id: ref.id, message: "Query submitted successfully" });
  } catch (error) {
    console.error("Error saving query:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to save query" },
      { status: 500 }
    );
  }
}
