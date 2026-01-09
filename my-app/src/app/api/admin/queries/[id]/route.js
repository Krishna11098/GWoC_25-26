import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";
import { getUserFromRequest } from "@/lib/authMiddleware";
import admin from "firebase-admin";

/**
 * PATCH /api/admin/queries/[id] - Update query status and admin notes
 */
export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    const { status, adminNotes } = await req.json();

    const user = await getUserFromRequest(req);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "admin")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    if (!["pending", "responded", "closed"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const docRef = db.collection("queries").doc(id);

    await docRef.update({
      status,
      adminNotes: adminNotes || null,
      isRead: true,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true, status });
  } catch (err) {
    console.error("PATCH error:", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
