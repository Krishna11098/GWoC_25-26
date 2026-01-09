import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { getUserFromRequest } from "@/lib/authMiddleware";
import admin from "firebase-admin";

/**
 * PATCH /api/admin/contact-form/[id] - Update submission status and admin notes
 */
export async function PATCH(req, { params }) {
  try {
    // Handle async params in Next.js 16
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams?.id;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Submission ID is required" },
        { status: 400 }
      );
    }

    const { status, adminNotes } = await req.json();

    const user = await getUserFromRequest(req);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "admin")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    if (!["unseen", "contacted", "accepted", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const docRef = db.collection("contact_submissions").doc(id);

    // Check if document exists
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return NextResponse.json(
        { success: false, error: "Submission not found" },
        { status: 404 }
      );
    }

    await docRef.update({
      status,
      adminNotes: adminNotes || null,
      isRead: true,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      message: "Submission updated successfully",
      status,
    });
  } catch (err) {
    console.error("PATCH error:", err);
    console.error("Error details:", {
      message: err.message,
      code: err.code,
      stack: err.stack,
    });
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Update failed",
        details:
          process.env.NODE_ENV === "development" ? err.message : undefined,
      },
      { status: 500 }
    );
  }
}
