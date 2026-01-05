// /app/api/admin/experiences/[id]/route.js
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, adminNotes } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Experience ID is required" },
        { status: 400 }
      );
    }

    if (
      !status ||
      !["pending", "accepted", "rejected", "contacted"].includes(status)
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid status" },
        { status: 400 }
      );
    }

    const experienceRef = doc(db, "experiences", id);

    const updateData = {
      status,
      updatedAt: serverTimestamp(),
      isRead: true,
    };

    if (adminNotes) {
      updateData.adminNotes = adminNotes;
    }

    await updateDoc(experienceRef, updateData);

    console.log(`✅ Experience ${id} updated to status: ${status}`);

    return NextResponse.json({
      success: true,
      message: `Experience ${status} successfully`,
      id,
      status,
    });
  } catch (error) {
    console.error("❌ Error updating experience:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
