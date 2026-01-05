// /app/api/experiences/submit/route.js
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function POST(request) {
  try {
    const body = await request.json();

    // Required fields validation
    if (
      !body.fullName ||
      !body.email ||
      !body.phone ||
      !body.category ||
      !body.eventTitle
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Prepare experience data
    const experienceData = {
      ...body,
      status: "pending", // Default status
      submittedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isRead: false,
    };

    // Save to Firestore
    const experiencesRef = collection(db, "experiences");
    const docRef = await addDoc(experiencesRef, experienceData);

    console.log("✅ Experience form submitted:", {
      id: docRef.id,
      name: body.fullName,
      category: body.category,
      eventTitle: body.eventTitle,
    });

    return NextResponse.json({
      success: true,
      message: "Experience request submitted successfully",
      id: docRef.id,
    });
  } catch (error) {
    console.error("❌ Experience submission error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
